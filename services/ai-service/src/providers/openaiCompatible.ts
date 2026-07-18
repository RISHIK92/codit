// ─── Shared request logic for OpenAI-compatible chat-completions APIs ────────
// Groq, OpenAI, and most other providers expose the same request/response
// shape, so a single fetch helper backs every ChatProvider implementation.

import type { ChatCompletionResult, ChatTurn, ToolDefinition } from "./types";

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

async function rawChatCompletion(opts: {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: ChatTurn[];
  tools?: ToolDefinition[];
  maxTokens?: number;
}) {
  return fetch(opts.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
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
    }),
  });
}

function isToolUseFailure(body: string): boolean {
  try {
    return JSON.parse(body)?.error?.code === "tool_use_failed";
  } catch {
    return false;
  }
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

  let res = await rawChatCompletion({ ...opts, apiKey: opts.apiKey });

  if (!res.ok) {
    const body = await res.text();

    // A malformed tool-call generation is a model quirk, not a real failure —
    // retry once with tools disabled so the turn degrades to a plain-text
    // answer instead of surfacing a raw 400 to the user.
    if (res.status === 400 && opts.tools?.length && isToolUseFailure(body)) {
      console.warn(
        `${opts.providerName}: malformed tool call, retrying without tools`,
      );
      res = await rawChatCompletion({
        ...opts,
        apiKey: opts.apiKey,
        tools: undefined,
      });
      if (!res.ok) {
        const retryBody = await res.text();
        throw new Error(
          `${opts.providerName} API error ${res.status}: ${retryBody}`,
        );
      }
    } else {
      throw new Error(`${opts.providerName} API error ${res.status}: ${body}`);
    }
  }

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
  };

  const message = data.choices[0]?.message;
  return {
    content: message?.content ?? null,
    toolCalls: message?.tool_calls?.map((tc) => ({
      id: tc.id,
      name: tc.function.name,
      arguments: tc.function.arguments,
    })),
  };
}
