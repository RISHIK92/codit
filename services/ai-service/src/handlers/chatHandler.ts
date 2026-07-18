import * as grpc from "@grpc/grpc-js";
import { randomUUID } from "crypto";
import {
  AiServiceServer,
  ChatRequest,
  ChatResponse,
} from "../generated/ai";
import {
  getUserProfile,
  getFileContent,
  listProjectFilePaths,
} from "../clients/contextClients";
import {
  getChatProvider,
  ChatTurn,
  ToolDefinition,
  ChatCompletionResult,
} from "../providers";
import { getImportGraph } from "../graph/graphCache";
import { createLogger } from "../../../shared/src/index";

const logger = createLogger("ai-service");

const MAX_TOOL_ROUNDS = 4;
const MAX_FILE_FETCHES = 6;
const FILE_CONTENT_CHAR_LIMIT = 4000;

type ChatStream = grpc.ServerWritableStream<ChatRequest, ChatResponse>;

const TOOLS: ToolDefinition[] = [
  {
    name: "list_files",
    description:
      "List every file path in the current project. Use this to find a file when you don't know its exact path.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "read_file",
    description:
      "Read the contents of a specific file in the project, by path. Use this when you need to see code beyond the active file to answer the user's question.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Path of the file to read, e.g. /src/App.tsx",
        },
      },
      required: ["filePath"],
    },
  },
  {
    name: "get_imports",
    description:
      "List the project files that a given file imports. Use this before read_file when you need to trace where a piece of code comes from, instead of guessing paths.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Path of the file whose imports you want, e.g. /src/App.tsx",
        },
      },
      required: ["filePath"],
    },
  },
  {
    name: "get_importers",
    description:
      "List the project files that import a given file. Use this to find every place a component, function, or module is used — e.g. to understand blast radius before suggesting a change, or to find a call site for debugging.",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Path of the file whose importers you want, e.g. /src/components/Button.tsx",
        },
      },
      required: ["filePath"],
    },
  },
];

/** Mutable per-request counters threaded through tool execution. */
interface RequestMetrics {
  fetches: number;
  networkMs: number;
  llmCalls: number;
  llmMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

function newMetrics(): RequestMetrics {
  return {
    fetches: 0,
    networkMs: 0,
    llmCalls: 0,
    llmMs: 0,
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  };
}

async function timed<T>(
  metrics: RequestMetrics,
  fn: () => Promise<T>,
): Promise<T> {
  const start = Date.now();
  const result = await fn();
  metrics.networkMs += Date.now() - start;
  return result;
}

function getRequestId(call: ChatStream): string {
  const value = call.metadata.get("x-request-id")[0];
  return typeof value === "string" && value ? value : randomUUID();
}

async function runTool(
  name: string,
  rawArgs: string,
  projectId: string,
  userEmail: string,
  metrics: RequestMetrics,
): Promise<string> {
  if (name === "list_files") {
    const paths = await timed(metrics, () =>
      listProjectFilePaths(projectId, userEmail),
    );
    return paths.length ? paths.join("\n") : "(no files found)";
  }

  if (name === "read_file") {
    if (metrics.fetches >= MAX_FILE_FETCHES) {
      return "Too many files requested this turn — answer with what you already have.";
    }
    let filePath = "";
    try {
      filePath = JSON.parse(rawArgs)?.filePath ?? "";
    } catch {
      return "Invalid arguments for read_file.";
    }
    if (!filePath) return "filePath is required.";
    const content = await timed(metrics, () =>
      getFileContent(projectId, userEmail, filePath),
    );
    if (content === null) return `File not found: ${filePath}`;
    metrics.fetches += 1;
    return content.slice(0, FILE_CONTENT_CHAR_LIMIT);
  }

  if (name === "get_imports" || name === "get_importers") {
    let filePath = "";
    try {
      filePath = JSON.parse(rawArgs)?.filePath ?? "";
    } catch {
      return `Invalid arguments for ${name}.`;
    }
    if (!filePath) return "filePath is required.";

    const graph = await timed(metrics, () =>
      getImportGraph(projectId, userEmail),
    );
    const result =
      name === "get_imports"
        ? graph.imports.get(filePath)
        : graph.importers.get(filePath);

    if (result === undefined) {
      return `No graph data for ${filePath} — check the path is correct (use list_files if unsure).`;
    }
    return result.length
      ? result.join("\n")
      : name === "get_imports"
        ? "This file has no project-local imports."
        : "No other project file imports this one.";
  }

  return `Unknown tool: ${name}`;
}

/**
 * Wraps a streaming provider call, forwarding every text delta straight to
 * the gRPC stream as it arrives, and folding duration/token usage into
 * `metrics`. Tool-call rounds naturally produce no content deltas (the model
 * emits tool_calls, not content), so this one path covers both — only the
 * round where the model actually answers ends up streaming anything.
 */
async function callLlmStreaming(
  call: ChatStream,
  metrics: RequestMetrics,
  fn: (onDelta: (text: string) => void) => Promise<ChatCompletionResult>,
) {
  const result = await fn((text) => call.write({ reply: text }));
  metrics.llmCalls += 1;
  metrics.llmMs += result.durationMs;
  if (result.usage) {
    metrics.promptTokens += result.usage.promptTokens;
    metrics.completionTokens += result.usage.completionTokens;
    metrics.totalTokens += result.usage.totalTokens;
  }
  return result;
}

export const aiServiceHandler: AiServiceServer = {
  chat: async (call: ChatStream) => {
    const requestId = getRequestId(call);
    const requestStart = Date.now();
    const metrics = newMetrics();
    const { userEmail, projectId, activeFilePath, message, history, mode } =
      call.request;

    const logSummary = (extra: Record<string, unknown> = {}) => {
      logger.info({
        requestId,
        mode: mode || "chat",
        projectId,
        userEmail,
        totalMs: Date.now() - requestStart,
        llmCalls: metrics.llmCalls,
        llmMs: metrics.llmMs,
        networkMs: metrics.networkMs,
        promptTokens: metrics.promptTokens,
        completionTokens: metrics.completionTokens,
        totalTokens: metrics.totalTokens,
        ...extra,
      }, "ai_chat_request");
    };

    try {
      // ── "explain" mode: tier-1 function explainer — cheap, fast, no extra
      // context fetching. The client already hands us the exact line the
      // word came from in `message`, so there's no user-service/file-service
      // round trip and no agentic loop, just one direct streaming call.
      if (mode === "explain") {
        const explainSystemPrompt = [
          "You are a concise coding tutor inside a learn-by-doing IDE called Codit.",
          "Explain the term or code the user is asking about, based only on the line of code given in their message.",
          "Answer in ONE short, crisp sentence — under 20 words. No preamble, no restating the question, no follow-up offers. Just the meaning.",
        ].join("\n");

        const provider = getChatProvider();
        await callLlmStreaming(call, metrics, (onDelta) =>
          provider.getChatCompletionStream(
            [
              { role: "system", content: explainSystemPrompt },
              { role: "user", content: message },
            ],
            onDelta,
            undefined,
            60,
          ),
        );
        call.end();
        logSummary();
        return;
      }

      const [profile, fileContent] = await Promise.all([
        timed(metrics, () => getUserProfile(userEmail)),
        timed(metrics, () => getFileContent(projectId, userEmail, activeFilePath)),
      ]);

      const contextLines = [
        profile ? `User skill level: ${profile.skillLevel}` : "",
        activeFilePath
          ? `Active file: ${activeFilePath}\n\`\`\`\n${(fileContent ?? "").slice(0, FILE_CONTENT_CHAR_LIMIT)}\n\`\`\``
          : "",
      ].filter(Boolean);

      const systemPrompt = [
        "You are a concise coding assistant inside a learn-by-doing IDE called Codit. Help the user with their code and learning.",
        contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
        "The active file above may not be enough to answer the question. If you need to trace where code comes from or is used, prefer get_imports/get_importers over guessing paths — they tell you exactly which files are related. Use list_files only when you don't know a file's path at all, and read_file once you know which file you actually need. Only fetch files that are actually relevant.",
        "Keep answers short, practical, and use markdown code blocks where relevant.",
      ].join("\n");

      const messages: ChatTurn[] = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })),
        { role: "user", content: message },
      ];

      const provider = getChatProvider();

      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const result = await callLlmStreaming(call, metrics, (onDelta) =>
          provider.getChatCompletionStream(messages, onDelta, TOOLS),
        );

        if (!result.toolCalls?.length) break;

        messages.push({
          role: "assistant",
          content: result.content,
          toolCalls: result.toolCalls,
        });

        for (const tc of result.toolCalls) {
          const toolResult = await runTool(
            tc.name,
            tc.arguments,
            projectId,
            userEmail,
            metrics,
          );
          messages.push({
            role: "tool",
            content: toolResult,
            toolCallId: tc.id,
          });
        }

        if (round === MAX_TOOL_ROUNDS - 1) {
          // Out of rounds — force a final answer with whatever context was gathered.
          await callLlmStreaming(call, metrics, (onDelta) =>
            provider.getChatCompletionStream(messages, onDelta),
          );
        }
      }

      call.end();
      logSummary();
    } catch (err: any) {
      logSummary({ error: err.message });
      call.emit("error", { code: grpc.status.INTERNAL, message: err.message });
    }
  },
};
