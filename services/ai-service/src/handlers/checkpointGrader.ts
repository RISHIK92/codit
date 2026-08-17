/**
 * Explain-it-back checkpoints — the only grader here whose subject is the
 * person rather than the code.
 *
 * Everything else in Codit can, in principle, be satisfied by code that works.
 * A review checks the artifact. Knowledge checks are authored in advance and
 * can be pattern-matched. This one asks the user to say, in their own words,
 * why the thing they already built behaves the way it does — and the code
 * already exists and already works, so reproducing it demonstrates nothing.
 *
 * That makes one rule non-negotiable: **pasted code is an automatic fail.**
 * Not partial credit, not "shows some understanding". The entire question is
 * whether they can explain without the code doing the explaining for them, and
 * an exception here would quietly reopen the gap the product exists to close.
 */
import { getChatProvider } from "../providers";
import { listProjectFilesWithContent } from "../clients/contextClients";

const CONTEXT_CHAR_BUDGET = 10_000;

export interface CheckpointGrade {
  passed: boolean;
  feedback: string;
  missingConcepts: string[];
}

/** Long verbatim runs of the user's own files, or obvious code syntax, mean
 * they're showing rather than explaining. Detected before the model is asked,
 * so a lenient grader can't overrule it. */
function looksLikeCode(answer: string): boolean {
  if (answer.includes("```")) return true;

  const codeSignals = [
    /<\/?[a-z][a-z0-9-]*\s*[^>]*>/i, // html tags
    /\bfunction\s+\w+\s*\(/,
    /=>\s*[{(]/,
    /\b(const|let|var)\s+\w+\s*=/,
    /\{[^}]*:[^}]*;[^}]*\}/, // css-ish declaration blocks
    /^\s*(import|export)\s+/m,
  ];
  const hits = codeSignals.filter((re) => re.test(answer)).length;
  if (hits >= 2) return true;

  // A single strong signal plus very little prose around it is still a paste.
  const words = answer.split(/\s+/).filter(Boolean).length;
  return hits >= 1 && words < 25;
}

const QUESTION_PROMPT = [
  "You are setting one 'explain it back' question for a learner inside a learn-by-doing platform.",
  "",
  "You are given the files they actually wrote for a phase they have already completed.",
  "Ask ONE question about why their own code behaves the way it does — grounded in what is",
  "specifically in front of you, not the topic in the abstract.",
  "",
  "Good: 'Your nav links jump to the right section when clicked. What makes that work?'",
  "Bad:  'What is an anchor link?' (generic, answerable without ever having built anything)",
  "",
  "The question must be answerable in a few sentences of plain prose, with no code.",
  "Do not ask them to write, modify or output any code.",
  "Reply with the question itself and nothing else. No preamble, no quotes, no markdown.",
].join("\n");

const GRADE_PROMPT = [
  "You are judging whether a learner understands something they built, from their explanation of it.",
  "",
  "You are NOT judging writing quality, spelling, grammar, jargon, or length. A short, plain,",
  "slightly clumsy answer that shows the person genuinely knows why their code works is a PASS.",
  "A polished answer that restates what the code does without explaining why is a FAIL.",
  "",
  "Pass when the explanation shows they know the mechanism — what causes what, and why.",
  "Fail when it only describes appearance or behaviour ('it makes the page look right'),",
  "repeats the question back, is vague enough to apply to any project, or contains code",
  "instead of explanation.",
  "",
  "Be fair. This is a comprehension check, not an exam, and the goal is to catch people who",
  "shipped something they don't understand — not to catch people who explain informally.",
  "",
  "Respond with one JSON object and nothing else:",
  '{"passed": true|false, "feedback": "two sentences, addressed to the learner", "missing_concepts": ["..."]}',
  "",
  "HARD RULE: never include code, markup or code fences in the feedback. If something is missing,",
  "name the concept in prose so they can go and look it up. Never supply the answer.",
].join("\n");

function extractJson(text: string): any | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(candidate.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export async function generateCheckpoint(params: {
  userEmail: string;
  projectId: string;
  phaseTitle: string;
  concepts: string[];
}): Promise<string> {
  const files = await listProjectFilesWithContent(params.projectId, params.userEmail);
  let budget = CONTEXT_CHAR_BUDGET;
  const context = files
    .map((f) => {
      if (budget <= 0) return "";
      const block = `--- ${f.filePath} ---\n${f.content.slice(0, Math.min(3000, budget))}\n`;
      budget -= block.length;
      return block;
    })
    .filter(Boolean)
    .join("\n");

  const provider = getChatProvider();
  const result = await provider.getChatCompletion([
    { role: "system", content: QUESTION_PROMPT },
    {
      role: "user",
      content: [
        `Phase: ${params.phaseTitle}`,
        params.concepts.length ? `Concepts taught: ${params.concepts.join(", ")}` : "",
        "",
        "Their files:",
        context || "(no files)",
      ]
        .filter(Boolean)
        .join("\n"),
    },
  ]);

  const question = (result.content ?? "").trim().replace(/^["']|["']$/g, "");
  // A generic fallback is better than blocking the checkpoint entirely, but it
  // is deliberately still about their own work.
  return (
    question ||
    `In your own words, how does the code you wrote for "${params.phaseTitle}" actually work?`
  );
}

export async function gradeExplanation(params: {
  question: string;
  answer: string;
  phaseTitle: string;
  concepts: string[];
}): Promise<CheckpointGrade> {
  const answer = params.answer.trim();

  if (answer.length < 40) {
    return {
      passed: false,
      feedback:
        "That's too short to show what you understand. Explain in a few sentences why it works, not just what it does.",
      missingConcepts: [],
    };
  }

  if (looksLikeCode(answer)) {
    return {
      passed: false,
      feedback:
        "This is code rather than an explanation. The code already works — what's being checked is whether you can say why, in your own words, without it.",
      missingConcepts: [],
    };
  }

  try {
    const provider = getChatProvider();
    const result = await provider.getChatCompletion([
      { role: "system", content: GRADE_PROMPT },
      {
        role: "user",
        content: [
          `Phase: ${params.phaseTitle}`,
          params.concepts.length ? `Concepts this phase taught: ${params.concepts.join(", ")}` : "",
          `Question asked: ${params.question}`,
          `Their explanation: ${answer}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ]);

    const parsed = extractJson(result.content ?? "");
    if (!parsed || typeof parsed.passed !== "boolean") {
      // Fail open on grader breakage, not closed: this checkpoint is optional
      // progress, and telling someone their understanding is inadequate because
      // a JSON parse failed would be both wrong and discouraging.
      return {
        passed: false,
        feedback: "That couldn't be graded just now — try submitting it again.",
        missingConcepts: [],
      };
    }

    const feedback =
      typeof parsed.feedback === "string" && parsed.feedback.trim()
        ? parsed.feedback.trim().replace(/```[\s\S]*?```/g, "").trim()
        : parsed.passed
          ? "That shows you understand it."
          : "That doesn't quite show the mechanism yet.";

    return {
      passed: parsed.passed,
      feedback,
      missingConcepts: Array.isArray(parsed.missing_concepts)
        ? parsed.missing_concepts.filter((c: unknown) => typeof c === "string").slice(0, 5)
        : [],
    };
  } catch (err: any) {
    console.error("GradeExplanation failed:", err?.message ?? err);
    return {
      passed: false,
      feedback: "That couldn't be graded just now — try submitting it again.",
      missingConcepts: [],
    };
  }
}
