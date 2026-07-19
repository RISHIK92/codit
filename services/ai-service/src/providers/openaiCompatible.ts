// ─── Shared request logic for OpenAI-compatible chat-completions APIs ────────
// Groq, OpenAI, and most other providers expose the same request/response
// shape, so a single fetch helper backs every ChatProvider implementation.

import type {
  ChatCompletionResult,
  ChatTurn,
  ToolCall,
  ToolDefinition,
  TokenUsage,
} from "./types";

// ─── Leaked tool-call text recovery ───────────────────────────────────────
// Llama models served by Groq occasionally skip the structured `tool_calls`
// field entirely and instead emit their native pythonic tool-call syntax
// (`<function=name>{...}</function>`) as plain text inside `content`. Left
// alone, that raw tag leaks straight into the user-facing chat. Since it's a
// well-formed, parseable signal, we recover it into a real ToolCall instead
// of silently displaying it or dropping it.
const LEAKED_TAG_OPEN = "<function=";
// The separator between the function name and its JSON args varies by model
// — `<function=name>{...}`, `<function=name {...}` (no `>`), and for
// no-argument tools like list_files, no args block at all:
// `<function=name></function>`. The lazy `[^<]*?` plus optional args group
// tolerates all three instead of requiring one specific shape.
const LEAKED_TAG_RE =
  /<function=([a-zA-Z_][\w]*)[^<]*?(\{[\s\S]*?\})?\s*<\/function>/g;

function extractLeakedToolCalls(text: string): {
  cleanedContent: string;
  toolCalls: ToolCall[];
} {
  const toolCalls: ToolCall[] = [];
  let n = 0;
  const cleanedContent = text.replace(LEAKED_TAG_RE, (_match, name, args) => {
    toolCalls.push({ id: `leaked-${n++}`, name, arguments: args ?? "{}" });
    return "";
  });
  return { cleanedContent, toolCalls };
}

/** Longest suffix of `s` that is itself a prefix of `LEAKED_TAG_OPEN` — i.e. text that might still grow into the opening tag as more chunks arrive. */
function partialTagPrefixLength(s: string): number {
  const max = Math.min(s.length, LEAKED_TAG_OPEN.length - 1);
  for (let len = max; len > 0; len--) {
    if (s.slice(-len) === LEAKED_TAG_OPEN.slice(0, len)) return len;
  }
  return 0;
}

function toWireMessage(turn: ChatTurn) {
  if (turn.role === "tool") {
    return {
      role: "tool",
      tool_call_id: turn.toolCallId,
      content: turn.content ?? "",
    };
  }
  if (turn.role === "assistant" && turn.toolCalls?.length) {
    return {
      role: "assistant",
      content: turn.content,
      tool_calls: turn.toolCalls.map((tc) => ({
        id: tc.id,
        type: "function" as const,
        function: { name: tc.name, arguments: tc.arguments },
      })),
    };
  }
  return { role: turn.role, content: turn.content ?? "" };
}

function toWireTools(tools: ToolDefinition[] | undefined) {
  if (!tools?.length) return undefined;
  return tools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

function toWireBody(opts: {
  model: string;
  messages: ChatTurn[];
  tools?: ToolDefinition[];
  maxTokens?: number;
  stream?: boolean;
}) {
  return {
    model: opts.model,
    messages: opts.messages.map(toWireMessage),
    ...(opts.tools?.length
      ? {
          tools: toWireTools(opts.tools),
          tool_choice: "auto",
          // Llama models on Groq occasionally mangle multi-tool-call turns —
          // the tool name comes back with the JSON args concatenated into
          // it, which Groq's validator then rejects as an unknown tool.
          // Forcing one call at a time avoids the failure mode entirely.
          parallel_tool_calls: false,
        }
      : {}),
    ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
    ...(opts.stream ? { stream: true, stream_options: { include_usage: true } } : {}),
  };
}

async function rawChatCompletion(opts: {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: ChatTurn[];
  tools?: ToolDefinition[];
  maxTokens?: number;
  stream?: boolean;
}) {
  return fetch(opts.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify(toWireBody(opts)),
  });
}

function isToolUseFailure(body: string): boolean {
  try {
    return JSON.parse(body)?.error?.code === "tool_use_failed";
  } catch {
    return false;
  }
}

/**
 * Issues the request, retrying once with tools disabled if Groq rejects a
 * malformed tool-call generation. Shared by both the buffered and streaming
 * paths — this validation happens before any streaming begins either way.
 */
async function requestWithToolFailureRetry(opts: {
  baseUrl: string;
  apiKey: string;
  model: string;
  providerName: string;
  messages: ChatTurn[];
  tools?: ToolDefinition[];
  maxTokens?: number;
  stream?: boolean;
}): Promise<Response> {
  let res = await rawChatCompletion(opts);

  if (res.ok) return res;

  const body = await res.text();

  // A malformed tool-call generation is a model quirk, not a real failure —
  // retry once with tools disabled so the turn degrades to a plain-text
  // answer instead of surfacing a raw 400 to the user.
  if (res.status === 400 && opts.tools?.length && isToolUseFailure(body)) {
    console.warn(
      `${opts.providerName}: malformed tool call, retrying without tools`,
    );
    res = await rawChatCompletion({ ...opts, tools: undefined });
    if (!res.ok) {
      const retryBody = await res.text();
      throw new Error(
        `${opts.providerName} API error ${res.status}: ${retryBody}`,
      );
    }
    return res;
  }

  throw new Error(`${opts.providerName} API error ${res.status}: ${body}`);
}

export async function chatCompletion(opts: {
  baseUrl: string;
  apiKey: string | undefined;
  model: string;
  providerName: string;
  messages: ChatTurn[];
  tools?: ToolDefinition[];
  maxTokens?: number;
}): Promise<ChatCompletionResult> {
  if (!opts.apiKey) {
    throw new Error(
      `${opts.providerName} is selected as the AI provider but its API key is not configured`,
    );
  }

  const callStart = Date.now();
  const res = await requestWithToolFailureRetry({
    ...opts,
    apiKey: opts.apiKey,
  });

  const data = (await res.json()) as {
    choices: {
      message: {
        content: string | null;
        tool_calls?: {
          id: string;
          function: { name: string; arguments: string };
        }[];
      };
    }[];
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };

  const message = data.choices[0]?.message;
  const structuredToolCalls = message?.tool_calls?.map((tc) => ({
    id: tc.id,
    name: tc.function.name,
    arguments: tc.function.arguments,
  })) ?? [];
  const { cleanedContent, toolCalls: leakedToolCalls } =
    extractLeakedToolCalls(message?.content ?? "");
  const toolCalls = [...structuredToolCalls, ...leakedToolCalls];

  return {
    content: cleanedContent.trim() || null,
    toolCalls: toolCalls.length ? toolCalls : undefined,
    usage: data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : undefined,
    // Includes any internal retry — this is the real wall-clock cost of the call.
    durationMs: Date.now() - callStart,
  };
}

interface StreamChunk {
  choices?: {
    delta?: {
      content?: string;
      tool_calls?: {
        index: number;
        id?: string;
        function?: { name?: string; arguments?: string };
      }[];
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function chatCompletionStream(
  opts: {
    baseUrl: string;
    apiKey: string | undefined;
    model: string;
    providerName: string;
    messages: ChatTurn[];
    tools?: ToolDefinition[];
    maxTokens?: number;
  },
  onDelta: (text: string) => void,
): Promise<ChatCompletionResult> {
  if (!opts.apiKey) {
    throw new Error(
      `${opts.providerName} is selected as the AI provider but its API key is not configured`,
    );
  }

  const callStart = Date.now();
  const res = await requestWithToolFailureRetry({
    ...opts,
    apiKey: opts.apiKey,
    stream: true,
  });

  if (!res.body) {
    throw new Error(
      `${opts.providerName} returned no response body for a streaming request`,
    );
  }

  let content = "";
  const toolCallsByIndex = new Map<
    number,
    { id: string; name: string; arguments: string }
  >();
  const leakedToolCalls: ToolCall[] = [];
  let usage: TokenUsage | undefined;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // Holds content that might be (the start of) a leaked `<function=...>`
  // tag until it's either confirmed a tool call (extracted, never shown to
  // the user) or ruled out (flushed as normal text).
  let pendingContent = "";
  let leakedToolCallCount = 0;

  const flushContent = (text: string) => {
    if (!text) return;
    content += text;
    onDelta(text);
  };

  const handleContentDelta = (text: string) => {
    pendingContent += text;

    for (;;) {
      LEAKED_TAG_RE.lastIndex = 0;
      const match = LEAKED_TAG_RE.exec(pendingContent);
      if (!match) break;
      flushContent(pendingContent.slice(0, match.index));
      leakedToolCalls.push({
        id: `leaked-${leakedToolCallCount++}`,
        name: match[1],
        arguments: match[2] ?? "{}",
      });
      pendingContent = pendingContent.slice(match.index + match[0].length);
    }

    const openIdx = pendingContent.indexOf(LEAKED_TAG_OPEN);
    if (openIdx !== -1) {
      // Mid-tag, closing "</function>" not seen yet — hold from here on.
      flushContent(pendingContent.slice(0, openIdx));
      pendingContent = pendingContent.slice(openIdx);
      return;
    }

    const holdLen = partialTagPrefixLength(pendingContent);
    flushContent(pendingContent.slice(0, pendingContent.length - holdLen));
    pendingContent = pendingContent.slice(pendingContent.length - holdLen);
  };

  const processLine = (line: string) => {
    if (!line.startsWith("data:")) return;
    const dataStr = line.slice(5).trim();
    if (!dataStr || dataStr === "[DONE]") return;

    let chunk: StreamChunk;
    try {
      chunk = JSON.parse(dataStr);
    } catch {
      return;
    }

    if (chunk.usage) {
      usage = {
        promptTokens: chunk.usage.prompt_tokens,
        completionTokens: chunk.usage.completion_tokens,
        totalTokens: chunk.usage.total_tokens,
      };
    }

    const delta = chunk.choices?.[0]?.delta;
    if (!delta) return;

    if (delta.content) {
      handleContentDelta(delta.content);
    }

    if (delta.tool_calls) {
      for (const tc of delta.tool_calls) {
        const existing = toolCallsByIndex.get(tc.index) ?? {
          id: "",
          name: "",
          arguments: "",
        };
        if (tc.id) existing.id = tc.id;
        if (tc.function?.name) existing.name = tc.function.name;
        if (tc.function?.arguments) existing.arguments += tc.function.arguments;
        toolCallsByIndex.set(tc.index, existing);
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx: number;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      processLine(buffer.slice(0, newlineIdx).trim());
      buffer = buffer.slice(newlineIdx + 1);
    }
  }
  if (buffer.trim()) processLine(buffer.trim());
  // Whatever's still held back never closed into a full tag — best effort,
  // surface it as normal text rather than silently dropping it.
  flushContent(pendingContent);

  const toolCalls = [...toolCallsByIndex.values(), ...leakedToolCalls];
  return {
    content: content || null,
    toolCalls: toolCalls.length ? toolCalls : undefined,
    usage,
    durationMs: Date.now() - callStart,
  };
}
