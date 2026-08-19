import * as grpc from "@grpc/grpc-js";
import {
  AiServiceServer,
  ChatRequest,
  ChatResponse,
  GradeAnswerRequest,
  GradeAnswerResponse,
  GradeCriteriaRequest,
  GradeCriteriaResponse,
  GenerateCheckpointRequest,
  GenerateCheckpointResponse,
  GradeExplanationRequest,
  GradeExplanationResponse,
} from "../generated/ai";
import { gradeCriteria } from "./criterionGrader";
import { generateCheckpoint, gradeExplanation } from "./checkpointGrader";
import {
  getUserProfile,
  getFileContent,
  listProjectFilePaths,
  getSnapshotFilePaths,
  getSnapshotFileContent,
} from "../clients/contextClients";
import { getChatProvider, ChatTurn, ToolDefinition } from "../providers";
import {
  buildProjectMap,
  getNeighbourSlice,
  renderNeighbourSlice,
  WEBCONTAINER_CONSTRAINTS,
} from "../context/tierContext";

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

/** Compact form of the no-ghostwriting rule for tiers with a short prompt
 * budget. Same absolute prohibition — the tier is cheaper, the rule is not. */
const NO_GHOSTWRITING_SHORT =
  "HARD RULE: never use markdown code fences and never write the fix. Name the concept or the API in prose; the user types every character themselves.";

const STALL_FALLBACK_REPLY =
  "I wasn't able to check the project's files just now — try asking again.";

/**
 * Server-side backstop for the no-ghostwriting rule.
 *
 * The prompt tells the model never to use a fenced code block, in absolute
 * terms. It usually holds — but tested under direct pressure ("give me the
 * fix"), the model rationalized around its own hard rule: it announced
 * "you can type it yourself" and then pasted a working code block to copy
 * anyway. That is not a hypothetical; it happened on the very first
 * adversarial prompt tried against this handler. A rule enforced only by
 * prompt text has no floor — the model can always talk itself past it the
 * moment refusing feels unhelpful in the moment.
 *
 * This is that floor. Every reply from every conversational tier is checked
 * before it reaches the client; a fenced block means the rule was violated
 * regardless of why, so the whole reply is replaced rather than surgically
 * edited — prose written to introduce a code block ("here's a snippet you
 * can paste") reads as broken once the code is removed anyway, and a full,
 * predictable refusal is safer than a half-redacted answer.
 */
// Signals that a line is genuinely code rather than prose that happens to
// mention code. Matched line-by-line rather than with one block regex so a
// stylesheet-shaped reply is caught even when nothing forces it onto fewer
// lines.
const CODE_LINE_PATTERNS = [
  /^\s*[\w.#][\w.#-]*(,\s*[\w.#][\w.#-]*)*\s*\{\s*$/, // "selector {" / "a, b {"
  /^\s*[a-zA-Z-]+\s*:\s*[^;]+;\s*$/, // "property: value;"
  /^\s*\}\s*$/, // closing brace
  /^\s*(const|let|var|function|export|import|class)\s+[\w${]/, // JS declarations
  /^\s*<\/?[a-zA-Z][\w-]*(\s[^>]*)?>\s*$/, // a standalone HTML tag on its own line
];

/**
 * Whether a reply is a large, deliberate code payload — the thing the
 * ghostwriting rule exists to stop — as opposed to a sentence that mentions a
 * property or tag name in passing.
 *
 * Checking for literal ``` fences alone is not enough: tested live, pushed
 * with "just give me the actual code, I don't want an explanation", the model
 * complied with the LETTER of "never use a markdown code fence" by dropping
 * the fence and pasting the same ready-to-use stylesheet as plain lines
 * instead — full comments, full selectors, nothing left for the user to
 * write. That is a content violation wearing a formatting loophole, so the
 * check has to look at what the lines actually are, not how they're
 * decorated. Mirrors the intent of looksLikeCode in checkpointGrader.ts,
 * which solves the same problem in the other direction (a student's answer).
 */
function containsGhostwrittenCode(text: string): boolean {
  const lines = text.split("\n");
  const codeLines = lines.filter((l) => CODE_LINE_PATTERNS.some((re) => re.test(l)));
  // A couple of incidental matches ("api: value" read from a config file
  // discussed in prose, one HTML tag named in passing) shouldn't trip this;
  // a real pasted block clears this bar by a wide margin.
  return codeLines.length >= 4;
}

function enforceNoGhostwriting(text: string): string {
  if (!text.includes("```") && !containsGhostwrittenCode(text)) return text;
  console.warn(
    "[no-ghostwriting] model emitted a code payload despite the prompt rule; reply replaced",
  );
  return "I can see what's wrong, but I'm not going to paste the fix — that's the one thing I won't do here. Tell me which part you want explained (the concept, the property, the API) and I'll walk you through it so you write it yourself.";
}

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

        call.write({ reply: enforceNoGhostwriting(result.content ?? "") });
        call.end();
        return;
      }

      // "suggest" — tier 2. Fired when the user looks stuck, not when they
      // asked a question, which changes what a good answer is: it has to be
      // short, easy to ignore, and never presume to know what they intended.
      // Context is a thin slice — the active file plus its dependency
      // neighbours — because the cost of a full project map isn't justified
      // for an interruption the user didn't request. Single shot, no tools:
      // a nudge that takes four tool rounds to produce has arrived too late.
      if (mode === "suggest") {
        const slice = await getNeighbourSlice(projectId, userEmail, activeFilePath);
        const neighbours = renderNeighbourSlice(slice);

        const systemPrompt = [
          "You are a coding mentor inside a learn-by-doing IDE called Codit. The user has not asked you anything — they appear to be stuck, and you are offering one unprompted nudge.",
          "Because they didn't ask, the bar is high: say one genuinely useful thing in two sentences or fewer, or say nothing of substance at all.",
          "Point at what to look at or what concept applies. Do not restate what their code does — they wrote it.",
          NO_GHOSTWRITING_SHORT,
          "If nothing about the code suggests a specific problem, reply with exactly: NO_SUGGESTION",
          contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
          neighbours ? `\nRelated files:\n${neighbours}` : "",
        ]
          .filter(Boolean)
          .join("\n");

        const result = await provider.getChatCompletion([
          { role: "system", content: systemPrompt },
          { role: "user", content: message || "What should I be looking at?" },
        ]);

        const reply = (result.content ?? "").trim();
        // The model is given an explicit way to decline, because a suggester
        // that always has something to say becomes noise and gets muted.
        call.write({
          reply: reply === "NO_SUGGESTION" ? "" : enforceNoGhostwriting(reply),
        });
        call.end();
        return;
      }

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

      // ── Tier 3: the full assistant ─────────────────────────────────────────
      //
      // The expensive tier, and the only one that gets a project map. Handing
      // it a structural summary of every file up front replaces the old opening
      // move of calling list_files, receiving a flat list of paths, and then
      // guessing which one to read — navigation that consumed tool rounds
      // before any thinking could start. The tools remain for fetching actual
      // contents; the map just means it knows where to point them.
      //
      // Snapshots are excluded: the map describes the live project, and
      // offering it while the user is reading frozen history would describe
      // files that aren't the ones on screen.
      const [projectMap, slice] = isSnapshot
        ? ["", null]
        : await Promise.all([
            buildProjectMap(projectId, userEmail),
            getNeighbourSlice(projectId, userEmail, activeFilePath),
          ]);
      const neighbours = slice ? renderNeighbourSlice(slice) : "";

      const systemPrompt = [
        "You are a concise coding assistant inside a learn-by-doing IDE called Codit. Help the user with their code and learning.",
        NO_GHOSTWRITING,
        NO_NARRATING,
        isSnapshot
          ? `The user is viewing a read-only, frozen snapshot of phase ${snapshotPhaseNumber} as it was submitted — not the live project. list_files and read_file return that phase's files, not what exists now. Don't suggest edits as if they can make them here; this view can't be changed.`
          : WEBCONTAINER_CONSTRAINTS,
        contextLines.length ? `\nContext:\n${contextLines.join("\n")}` : "",
        projectMap
          ? `\nProject structure (what each file exports/imports and how it's shaped — not its full contents):\n${projectMap}`
          : "",
        neighbours ? `\nFiles related to the active file:\n${neighbours}` : "",
        projectMap
          ? "The map above tells you which file to look at. Use read_file to fetch the ones you actually need — don't guess at paths, and don't re-list files the map already shows."
          : "If you need to see other files in the project, use the list_files and read_file tools rather than guessing. Only fetch files that are actually relevant.",
        "Keep answers short and practical.",
      ]
        .filter(Boolean)
        .join("\n");

      const messages: ChatTurn[] = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })),
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

      call.write({ reply: enforceNoGhostwriting(reply) });
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

  generateCheckpoint: async (
    call: grpc.ServerUnaryCall<GenerateCheckpointRequest, GenerateCheckpointResponse>,
    callback: grpc.sendUnaryData<GenerateCheckpointResponse>,
  ) => {
    try {
      const { userEmail, projectId, phaseTitle, concepts } = call.request;
      const question = await generateCheckpoint({
        userEmail,
        projectId,
        phaseTitle,
        concepts: concepts ?? [],
      });
      callback(null, { question });
    } catch (err: any) {
      console.error("GenerateCheckpoint failed:", err?.message ?? err);
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  gradeExplanation: async (
    call: grpc.ServerUnaryCall<GradeExplanationRequest, GradeExplanationResponse>,
    callback: grpc.sendUnaryData<GradeExplanationResponse>,
  ) => {
    try {
      const { question, answer, phaseTitle, concepts } = call.request;
      const grade = await gradeExplanation({
        question,
        answer,
        phaseTitle,
        concepts: concepts ?? [],
      });
      callback(null, {
        passed: grade.passed,
        feedback: grade.feedback,
        missingConcepts: grade.missingConcepts,
      });
    } catch (err: any) {
      console.error("GradeExplanation failed:", err?.message ?? err);
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },
};
