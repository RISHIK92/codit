import * as grpc from "@grpc/grpc-js";
import { randomUUID } from "crypto";
import {
  AiServiceServer,
  ChatRequest,
  ChatResponse,
  GradeAnswerRequest,
  GradeAnswerResponse,
} from "../generated/ai";
import {
  getUserProfile,
  getFileContent,
  listProjectFilePaths,
  listProjectFilesWithContent,
} from "../clients/contextClients";
import {
  getChatProvider,
  ChatTurn,
  ToolDefinition,
  ChatCompletionResult,
} from "../providers";
import { getImportGraph } from "../graph/graphCache";
import { buildProjectSymbolSummary } from "../graph/symbolExtractor";
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
    const {
      userEmail,
      projectId,
      activeFilePath,
      message,
      history,
      mode,
      currentTask,
    } = call.request;

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

      // ── "review" mode: phase-submission review, triggered by the Submit
      // button once all knowledge checks are answered. Context is a
      // statically-parsed structural summary (exports + imports per file,
      // via symbolExtractor) rather than raw file contents — cheaper, and
      // keeps the model from drowning in code it doesn't need to quote back.
      if (mode === "review") {
        const files = await timed(metrics, () =>
          listProjectFilesWithContent(projectId, userEmail),
        );
        const codeSummary =
          buildProjectSymbolSummary(files) || "(no files in project yet)";

        const reviewSystemPrompt = [
          "You are a senior code reviewer evaluating a student's submission for one phase of a project in the Codit learn-by-doing IDE.",
          currentTask ? `\nContext:\n${currentTask}` : "",
          "\nBelow is a structural summary of the project's code, extracted by static analysis — each file's exported functions/components/types and its local imports — not the raw file contents.",
          `\n${codeSummary}`,
          "\nJudge whether the code satisfies the phase goal stated in the context above. Reference actual file, function, and component names from the summary — don't invent details the summary doesn't support, and don't assume something exists just because the goal implies it should.",
          "\nIf the summary doesn't give you clear, direct evidence for a specific part of the goal (e.g. you can see a rule targets .card but can't tell from the layout properties whether it's actually centered), that is NOT_MET, not MET — never give the benefit of the doubt. MET requires the summary to positively confirm every concrete part of the goal, not merely fail to contradict it. If you find yourself writing 'it's difficult to confirm' or similar in your feedback, your verdict must be NOT_MET.",
          "\nYour response MUST start with exactly one of these two lines, then a blank line, then 2-4 sentences of specific feedback:",
          "VERDICT: MET",
          "VERDICT: NOT_MET",
        ].join("\n");

        const provider = getChatProvider();
        await callLlmStreaming(call, metrics, (onDelta) =>
          provider.getChatCompletionStream(
            [
              { role: "system", content: reviewSystemPrompt },
              {
                role: "user",
                content: message || "Review my current code against the phase goal.",
              },
            ],
            onDelta,
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
        currentTask ? `Current context: ${currentTask}` : "",
        activeFilePath
          ? `Active file: ${activeFilePath}\n\`\`\`\n${(fileContent ?? "").slice(0, FILE_CONTENT_CHAR_LIMIT)}\n\`\`\``
          : "",
      ].filter(Boolean);

      const systemPrompt = [
        "You are a coding tutor inside a learn-by-doing IDE called Codit. Your job is to help the user build the skill, not to do the work for them — a complete solution handed over is a missed learning rep, even if it technically answers the question.",
        contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
        "If the active file's content above is enough to answer the question, just answer from it — don't call any tool. get_imports/get_importers only matter when you specifically need to trace where code comes from or is used elsewhere in the project (e.g. \"where else is this used\", \"what does this import\"); they tell you nothing about whether the code in front of you is correct or well-written, so don't reach for them to answer a question about the current file's own content. Use list_files only when you don't know a file's path at all, and read_file once you know which file you actually need. Only fetch files that are actually relevant.",
        "Never state or imply that a specific file exists (e.g. \"check your CSS file\", \"in your styles.css\") unless you've actually confirmed it in this conversation — via the active file above, or a list_files/get_imports/read_file result. Early-phase projects often don't have the file a typical project would have yet. If you're not sure a file exists, check first or say you're not sure — don't assert it as fact.",
        "\nA critical distinction before anything else: is the code being asked about the CURRENT PHASE'S actual deliverable (check the phase goal in Context above), or something illustrative/generic?",
        "- Illustrative example (a different scenario than their real task, or a syntax/API demo): totally fine to show a code snippet, anytime, unprompted even.",
        "- The phase's actual deliverable (e.g. their real quiz question markup, their real component, the exact structure the goal describes): do NOT hand over complete, ready-to-paste code for it — even if the question is phrased as \"how should X look\" / \"what should this look like\" / \"how do I structure Y\" rather than an explicit code request. That phrasing is still asking for their actual homework. Instead: explain the structure/pattern in prose, and if a code snippet genuinely helps, use a DIFFERENT example (different tag names, different content) so they still have to adapt and write their own — never their literal content (e.g. don't write their actual question text or option labels).",
        "- The only exception: the user explicitly and unambiguously asks you to write it for them (\"just give me the code\", \"write the full file for me\", \"I give up, show me the answer\") — then it's fine to give the real thing, since they asked for it directly.",
        "\nHow to respond, based on what the user is actually asking:",
        "- Definition/\"what is X\" questions (\"what is <fieldset>\", \"what does async mean\"): just explain the concept directly and concisely. This is general knowledge, not something that requires looking at their project — don't call list_files/read_file/get_imports for these unless the user explicitly asks how X is used in their own code.",
        "- Feedback/review questions about their own code (\"is my usage of X good here\", \"does this look right\", \"review this\"): judge the active file's content already in Context above and answer directly — no tool call needed unless the feedback genuinely depends on how the code is used elsewhere (e.g. \"is this reusable enough\" might warrant get_importers; \"is this semantically correct HTML\" does not).",
        "- Planning/direction questions (\"what should I build next\", \"how should I approach this\"): do NOT write the implementation. Name the next concrete step, explain the concept in a sentence or two, and point at the relevant pattern already in their project if one exists (use get_imports/read_file to find it) — then ask a guiding question or stop and let them write it.",
        "- Debugging/stuck questions (\"why is this broken\", \"I tried X and it didn't work\"): point at the likely cause and give a small targeted hint or snippet — not a full rewrite of the file or component.",
        "Match scaffolding depth to the user's skill level from Context above: more guiding questions and smaller hints for beginners, terser and more direct for advanced users.",
        "Keep answers short.",
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

  gradeAnswer: async (
    call: grpc.ServerUnaryCall<GradeAnswerRequest, GradeAnswerResponse>,
    callback: grpc.sendUnaryData<GradeAnswerResponse>,
  ) => {
    const { question, correctAnswer, explanation, questionType, userAnswer } =
      call.request;
    const start = Date.now();
    try {
      const gradingSystemPrompt = [
        "You are grading a student's free-text answer to a short coding knowledge-check question.",
        "Judge whether the student's answer captures the correct fix or concept — it does NOT need to match the reference answer word-for-word. A different valid phrasing, different variable/property names, or an answer that states only the crucial change (while the reference shows more surrounding code for context) should be graded correct if it demonstrates the same understanding as the reference.",
        "Only grade incorrect if the student's answer is actually wrong, missing the key change, or contradicts the reference — not for superficial differences in formatting or wording.",
        `\nQuestion type: ${questionType}`,
        `Question:\n${question}`,
        `Reference answer:\n${correctAnswer}`,
        explanation ? `Reference explanation:\n${explanation}` : "",
        `\nStudent's answer:\n${userAnswer}`,
        "\nRespond with exactly one word, nothing else: CORRECT or INCORRECT.",
      ]
        .filter(Boolean)
        .join("\n");

      const provider = getChatProvider();
      const result = await provider.getChatCompletion(
        [{ role: "system", content: gradingSystemPrompt }],
        undefined,
        10,
      );

      const isCorrect = /^\s*correct\b/i.test(result.content ?? "");

      logger.info(
        {
          questionType,
          isCorrect,
          totalMs: Date.now() - start,
          llmMs: result.durationMs,
        },
        "ai_grade_answer",
      );

      callback(null, { isCorrect });
    } catch (err: any) {
      logger.error({ error: err.message }, "ai_grade_answer_failed");
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },
};
