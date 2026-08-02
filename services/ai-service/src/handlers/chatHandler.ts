import * as grpc from "@grpc/grpc-js";
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
} from "../clients/contextClients";
import { getChatProvider, ChatTurn, ToolDefinition } from "../providers";

const MAX_TOOL_ROUNDS = 4;
const MAX_FILE_FETCHES = 6;
const FILE_CONTENT_CHAR_LIMIT = 4000;

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
];

async function runTool(
  name: string,
  rawArgs: string,
  projectId: string,
  userEmail: string,
  fetchCount: { n: number },
): Promise<string> {
  if (name === "list_files") {
    const paths = await listProjectFilePaths(projectId, userEmail);
    return paths.length ? paths.join("\n") : "(no files found)";
  }

  if (name === "read_file") {
    if (fetchCount.n >= MAX_FILE_FETCHES) {
      return "Too many files requested this turn — answer with what you already have.";
    }
    let filePath = "";
    try {
      filePath = JSON.parse(rawArgs)?.filePath ?? "";
    } catch {
      return "Invalid arguments for read_file.";
    }
    if (!filePath) return "filePath is required.";
    const content = await getFileContent(projectId, userEmail, filePath);
    if (content === null) return `File not found: ${filePath}`;
    fetchCount.n += 1;
    return content.slice(0, FILE_CONTENT_CHAR_LIMIT);
  }

  return `Unknown tool: ${name}`;
}

function buildContextLines(
  profile: { skillLevel: string } | null,
  currentTask: string,
  activeFilePath: string,
  fileContent: string | null,
): string[] {
  return [
    profile ? `User skill level: ${profile.skillLevel}` : "",
    currentTask ? `Current task: ${currentTask}` : "",
    activeFilePath
      ? `Active file: ${activeFilePath}\n\`\`\`\n${(fileContent ?? "").slice(0, FILE_CONTENT_CHAR_LIMIT)}\n\`\`\``
      : "",
  ].filter(Boolean);
}

export const aiServiceHandler: AiServiceServer = {
  chat: async (call: grpc.ServerWritableStream<ChatRequest, ChatResponse>) => {
    try {
      const {
        userEmail,
        projectId,
        activeFilePath,
        message,
        history,
        mode,
        currentTask,
      } = call.request;

      const [profile, fileContent] = await Promise.all([
        getUserProfile(userEmail),
        getFileContent(projectId, userEmail, activeFilePath),
      ]);

      const contextLines = buildContextLines(
        profile,
        currentTask,
        activeFilePath,
        fileContent,
      );

      const provider = getChatProvider();

      // "explain" — cheap Option+Click popup. Single shot, no tool-calling
      // loop, scoped to the active file already in context.
      if (mode === "explain") {
        const systemPrompt = [
          "You are a concise coding assistant inside a learn-by-doing IDE called Codit.",
          "Explain the requested code briefly and clearly — a couple of sentences, plain language, no follow-up questions.",
          contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
        ].join("\n");

        const result = await provider.getChatCompletion([
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ]);

        call.write({ reply: result.content ?? "" });
        call.end();
        return;
      }

      // "review" — grading a phase submission. The client's UI treats the
      // reply as a verdict: it only advances the phase (and snapshots it)
      // if the reply contains the literal line "VERDICT: MET" — so that
      // line has to be a real instruction to the model, not left implicit.
      const isReview = mode === "review";
      const systemPrompt = isReview
        ? [
            "You are grading a phase submission inside a learn-by-doing IDE called Codit. The user's message states the phase goal.",
            "Use list_files and read_file to inspect their actual project files — not just the active file — before judging. Don't take the user's word for it.",
            "Be specific about what's missing or wrong if the goal isn't met — this is a learning tool, the point is to catch gaps, not rubber-stamp submissions.",
            "End your reply with exactly one verdict line, alone on its own line, in exactly this form: `VERDICT: MET` or `VERDICT: NOT MET`. Nothing after it.",
            contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
          ].join("\n")
        : [
            "You are a concise coding assistant inside a learn-by-doing IDE called Codit. Help the user with their code and learning.",
            contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
            "The active file above may not be enough to answer the question. If you need to see other files in the project, use the list_files and read_file tools rather than guessing. Only fetch files that are actually relevant.",
            "Keep answers short, practical, and use markdown code blocks where relevant.",
          ].join("\n");

      const messages: ChatTurn[] = [
        { role: "system", content: systemPrompt },
        // A review is a fresh evaluation of the current submission — prior
        // unrelated chat turns are noise here, not useful context (the
        // client already sends an empty history for this mode; skipping
        // it here too in case a caller doesn't).
        ...(isReview
          ? []
          : history.map((h) => ({
              role: h.role as "user" | "assistant",
              content: h.content,
            }))),
        { role: "user", content: message },
      ];

      const fetchCount = { n: 0 };
      let reply = "";

      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const result = await provider.getChatCompletion(messages, TOOLS);

        if (!result.toolCalls?.length) {
          reply = result.content ?? "";
          break;
        }

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
            fetchCount,
          );
          messages.push({
            role: "tool",
            content: toolResult,
            toolCallId: tc.id,
          });
        }

        if (round === MAX_TOOL_ROUNDS - 1) {
          // Out of rounds — force a final answer with whatever context was gathered.
          const final = await provider.getChatCompletion(messages);
          reply = final.content ?? "";
        }
      }

      call.write({ reply });
      call.end();
    } catch (err: any) {
      call.destroy(
        Object.assign(new Error(err.message), { code: grpc.status.INTERNAL }),
      );
    }
  },

  // Used by user-service for code_completion/debug knowledge checks, where
  // exact string matching is too brittle (different variable names, or an
  // answer that states only the crucial change rather than reproducing the
  // whole snippet, should still count as correct). user-service already
  // falls back to exact-match if this call fails, so errors here degrade
  // grading rather than breaking the submission.
  gradeAnswer: async (
    call: grpc.ServerUnaryCall<GradeAnswerRequest, GradeAnswerResponse>,
    callback: grpc.sendUnaryData<GradeAnswerResponse>,
  ) => {
    try {
      const { question, correctAnswer, explanation, questionType, userAnswer } =
        call.request;

      const systemPrompt = [
        "You are grading a short-answer coding question inside a learn-by-doing IDE.",
        `Question type: ${questionType}.`,
        "The user's answer doesn't need to match the reference answer word-for-word — different variable names, or an answer that states only the crucial change rather than reproducing the whole snippet, should still be marked correct if it shows the same understanding.",
        "Respond with exactly one word: YES if the user's answer is correct or equivalent, NO if it is not. Nothing else.",
      ].join("\n");

      const userPrompt = [
        `Question: ${question}`,
        `Reference answer: ${correctAnswer}`,
        explanation ? `Why the reference answer is correct: ${explanation}` : "",
        `User's answer: ${userAnswer}`,
      ]
        .filter(Boolean)
        .join("\n");

      const provider = getChatProvider();
      const result = await provider.getChatCompletion([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      const verdict = (result.content ?? "").trim().toUpperCase();
      callback(null, { isCorrect: verdict.startsWith("YES") });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },
};
