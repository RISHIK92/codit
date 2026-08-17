import * as grpc from "@grpc/grpc-js";
import {
  AiServiceServer,
  ChatRequest,
  ChatResponse,
  GradeAnswerRequest,
  GradeAnswerResponse,
  GradeCriteriaRequest,
  GradeCriteriaResponse,
} from "../generated/ai";
import { gradeCriteria } from "./criterionGrader";
import {
  getUserProfile,
  getFileContent,
  listProjectFilePaths,
  getSnapshotFilePaths,
  getSnapshotFileContent,
} from "../clients/contextClients";
import { getChatProvider, ChatTurn, ToolDefinition } from "../providers";

const MAX_TOOL_ROUNDS = 4;
const MAX_FILE_FETCHES = 6;
const FILE_CONTENT_CHAR_LIMIT = 4000;

/** Groq/Llama sometimes skips real tool-calling and instead writes its
 * intent out in plain English — "I'll list the files to see what's
 * there", or literally the bare tool name — rather than actually calling
 * list_files/read_file. Catches that so it's never mistaken for an answer. */
function looksLikeToolStall(content: string): boolean {
  return (
    /\b(list_files|read_file)\b/i.test(content) ||
    /^(i need to|i('ll| will)|let's|to (understand|answer|proceed|know)|first,? i)/i.test(
      content.trim(),
    )
  );
}

const STALL_FALLBACK_REPLY =
  "I wasn't able to check the project's files just now — try asking again.";

const TOOLS: ToolDefinition[] = [
  {
    name: "list_files",
    description:
      "List every file path in the current project. Use this to find a file when you don't know its exact path.",
    parameters: { type: "object", properties: {}, required: [] },
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
  snapshotPhaseNumber: number,
): Promise<string> {
  const isSnapshot = snapshotPhaseNumber > 0;

  if (name === "list_files") {
    const paths = isSnapshot
      ? await getSnapshotFilePaths(projectId, userEmail, snapshotPhaseNumber)
      : await listProjectFilePaths(projectId, userEmail);
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
    const content = isSnapshot
      ? await getSnapshotFileContent(
          projectId,
          userEmail,
          snapshotPhaseNumber,
          filePath,
        )
      : await getFileContent(projectId, userEmail, filePath);
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
        snapshotPhaseNumber,
      } = call.request;
      const isSnapshot = snapshotPhaseNumber > 0;

      const [profile, fileContent] = await Promise.all([
        getUserProfile(userEmail),
        isSnapshot
          ? getSnapshotFileContent(
              projectId,
              userEmail,
              snapshotPhaseNumber,
              activeFilePath,
            )
          : getFileContent(projectId, userEmail, activeFilePath),
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
      // Deliberately hard rules, not a soft preference — a general "don't
      // give away the answer" instruction gets ignored/rationalized by the
      // model the moment a code block would be the "helpful" thing to do.
      // Banning fenced code blocks outright, with no exception clause for
      // the model to talk itself into, is what actually changes the output.
      const NO_GHOSTWRITING = [
        "HARD RULE: Do not use markdown code fences (```) in this reply, for any reason. Not even a one-liner. Not even to 'illustrate syntax'. No exceptions.",
        "You are not allowed to write the fix. Say what's wrong, name the concept, name the property/function/API involved in prose — but the user writes every character of the actual change themselves.",
        "Bad (never do this): \"add a <link> tag: ```<link rel=stylesheet href=style.css>```\". Good: \"link style.css in the <head> using a <link> tag with rel and href attributes.\"",
      ].join(" ");

      // The model has a habit of narrating its own plan as if that were the
      // answer — "to understand X we should check file Y, so let's read it"
      // — instead of just calling the tool and answering with what it found.
      // That's not a helpful intermediate step, it's a non-answer.
      const NO_NARRATING = [
        "HARD RULE: If you don't already have enough information in the context above to answer, you MUST call list_files/read_file right now, in this turn — investigating is mandatory, not optional, and it is entirely your job, never the user's.",
        "Never respond by describing your plan (\"to understand X, we should look at Y\", \"let's read the file to see...\") instead of acting on it — that's a wasted turn.",
        "Never tell the user to go look at, check, open, or read a file themselves so they can tell you what's in it — you have read_file for exactly that; use it instead of asking them to be your eyes.",
        "A reply is only acceptable if it either (a) contains a tool call, or (b) is a real, specific answer grounded in files you've actually read. A reply that only states intent, or redirects the investigation back to the user, is never acceptable.",
      ].join(" ");

      const isReview = mode === "review";
      const systemPrompt = isReview
        ? [
            "You are grading a phase submission inside a learn-by-doing IDE called Codit. The user's message states the phase goal.",
            "Use list_files and read_file to inspect their actual project files — not just the active file — before judging. Don't take the user's word for it.",
            "Be specific about what's missing or wrong if the goal isn't met — this is a learning tool, the point is to catch gaps, not rubber-stamp submissions.",
            NO_GHOSTWRITING,
            NO_NARRATING,
            "End your reply with exactly one verdict line, alone on its own line, in exactly this form: `VERDICT: MET` or `VERDICT: NOT MET`. Nothing after it.",
            contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
          ].join("\n")
        : [
            "You are a concise coding assistant inside a learn-by-doing IDE called Codit. Help the user with their code and learning.",
            NO_GHOSTWRITING,
            NO_NARRATING,
            isSnapshot
              ? `The user is viewing a read-only, frozen snapshot of phase ${snapshotPhaseNumber} as it was submitted — not the live project. list_files and read_file return that phase's files, not what exists now. Don't suggest edits as if they can make them here; this view can't be changed.`
              : "",
            contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
            "The active file above may not be enough to answer the question. If you need to see other files in the project, use the list_files and read_file tools rather than guessing. Only fetch files that are actually relevant.",
            "Keep answers short and practical.",
          ]
            .filter(Boolean)
            .join("\n");

      const messages: ChatTurn[] = [
        { role: "system", content: systemPrompt },
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
      // Bounds the stall-nudge below to a single attempt — each
      // getChatCompletion call already internally retries once on a
      // malformed tool call (see openaiCompatible.ts), so letting this
      // fire on every remaining round risks compounding into several slow
      // round-trips for one reply.
      let stallRetried = false;

      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const result = await provider.getChatCompletion(messages, TOOLS);

        if (!result.toolCalls?.length) {
          const content = result.content ?? "";
          const stalled = looksLikeToolStall(content);
          // Nudge it to actually act instead, once — bounded so this can't
          // compound into several slow round-trips for one reply (each
          // getChatCompletion call already internally retries once on a
          // malformed tool call; see openaiCompatible.ts).
          if (stalled && !stallRetried && round < MAX_TOOL_ROUNDS - 1) {
            stallRetried = true;
            messages.push({ role: "assistant", content });
            messages.push({
              role: "user",
              content:
                "That wasn't an answer — you described a plan or referenced a tool by name instead of calling it. Call list_files or read_file now as a real tool call, or if you already have enough information, answer directly with no mention of what you're about to do.",
            });
            continue;
          }
          // Still stalling after the nudge (or no rounds left to nudge with)
          // — this is a model/API reliability issue, not something more
          // prompt text fixes. Never let the raw stall reach the user.
          reply = stalled ? STALL_FALLBACK_REPLY : content;
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
            snapshotPhaseNumber,
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

  gradeCriteria: async (
    call: grpc.ServerUnaryCall<GradeCriteriaRequest, GradeCriteriaResponse>,
    callback: grpc.sendUnaryData<GradeCriteriaResponse>,
  ) => {
    try {
      const { userEmail, projectId, phaseTitle, phaseGoal, criteria } =
        call.request;

      const outcomes = await gradeCriteria({
        userEmail,
        projectId,
        phaseTitle,
        phaseGoal,
        criteria: criteria.map((c) => ({ id: c.id, text: c.text, kind: c.kind })),
      });

      callback(null, {
        verdicts: outcomes.map((o) => ({
          criterionId: o.criterionId,
          passed: o.passed,
          evidencePath: o.evidencePath,
          evidenceLines: o.evidenceLines,
          evidenceQuote: o.evidenceQuote,
          reasoning: o.reasoning,
          ungraded: o.ungraded,
        })),
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      });
    } catch (err: any) {
      console.error("GradeCriteria failed:", err?.message ?? err);
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },
};
