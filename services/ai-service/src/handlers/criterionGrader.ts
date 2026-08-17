/**
 * Per-criterion grading with mandatory evidence.
 *
 * One criterion, one call. This is the central anti-false-pass mechanism, and
 * the reason is worth stating plainly: a model asked "does this submission meet
 * the goal?" is being asked to be agreeable, and it obliges. Asked instead
 * "is this one specific thing true, and if so quote the line where it's true",
 * it has to either locate the evidence or say it can't. Agreeableness stops
 * being sufficient.
 *
 * Consequences of that design, all deliberate:
 *   - A pass with no quote is not a pass. Enforced here, and again by the caller.
 *   - A quote that isn't actually in the submitted files is not a pass. Models
 *     paraphrase, and a paraphrased "quote" means it reconstructed what ought to
 *     be there rather than reading what is.
 *   - A criterion that can't be graded is reported as ungraded, never as failed.
 *     Telling a user their work is wrong when the grader broke is worse than
 *     telling them to retry.
 */
import { getChatProvider } from "../providers";
import { listProjectFilesWithContent } from "../clients/contextClients";

/** Total project content included per grading call. Beginner WebContainer
 * projects sit far under this; the cap exists so a large project degrades by
 * truncating rather than by failing the request outright. */
const CONTEXT_CHAR_BUDGET = 24_000;
const PER_FILE_CHAR_LIMIT = 6_000;
/** Criteria graded concurrently. Each call resends the file context, so N
 * criteria cost roughly N times the tokens — which bursts straight through a
 * low tokens-per-minute quota. Serial by default; raise it where the provider
 * tier allows. */
const GRADING_CONCURRENCY = Number(process.env.GRADING_CONCURRENCY ?? "1");
/**
 * "batch" (default) or "per-criterion".
 *
 * Batch is the default on measured evidence, not preference. Scored against the
 * same ground-truth fixtures over 14 trials, both modes produced 0% false
 * passes, 0% false fails and exact criterion attribution — while batch halved
 * the median review from 18.3s to 9.3s, because the file context is sent once
 * instead of once per criterion and the tokens-per-minute ceiling stops being
 * the bottleneck.
 *
 * Per-criterion remains available and is the more conservative choice: it grades
 * each criterion in genuine isolation, with no chance of the model anchoring
 * across a set. If the fixture set is ever extended to harder projects and batch
 * regresses there, this is the switch back.
 */
const GRADING_MODE = process.env.GRADING_MODE ?? "batch";

export interface CriterionInput {
  id: string;
  text: string;
  kind: string;
}

export interface CriterionOutcome {
  criterionId: string;
  passed: boolean;
  evidencePath: string;
  evidenceLines: string;
  evidenceQuote: string;
  reasoning: string;
  ungraded: boolean;
}

interface FileEntry {
  path: string;
  content: string;
}

function buildFileContext(files: FileEntry[]): string {
  const parts: string[] = [];
  let budget = CONTEXT_CHAR_BUDGET;

  for (const f of files) {
    if (budget <= 0) break;
    const body = f.content.slice(0, Math.min(PER_FILE_CHAR_LIMIT, budget));
    // Line numbers are supplied so the model can cite a range without counting
    // newlines itself, which it does badly.
    const numbered = body
      .split("\n")
      .map((line, i) => `${String(i + 1).padStart(4, " ")}| ${line}`)
      .join("\n");
    const block = `--- ${f.path} ---\n${numbered}\n`;
    parts.push(block);
    budget -= block.length;
  }

  return parts.join("\n");
}

const SYSTEM_PROMPT = [
  "You are grading ONE specific criterion of a coding exercise, inside a learn-by-doing platform.",
  "",
  "You are given the learner's complete submitted files, with line numbers, and one criterion.",
  "Decide only whether THAT ONE criterion is satisfied. Ignore everything else about the code:",
  "not style, not other criteria, not what a later phase will cover, not what you would have done.",
  "",
  "To pass a criterion you MUST quote the exact line or lines from the submitted files that make it true.",
  "Copy the text verbatim from the file content given to you — do not retype it from memory, do not",
  "reformat it, do not write what it should say. If you cannot find such a line, the criterion is not met.",
  "",
  "Be strict but fair. The criterion is the whole standard: do not require more than it asks,",
  "and do not accept less. Code that only appears inside a comment does not count as doing the thing.",
  "",
  "Respond with a single JSON object and nothing else, in exactly this shape:",
  '{"passed": true|false, "evidence_path": "path/to/file", "evidence_lines": "12-15", "evidence_quote": "the exact copied text", "reasoning": "one sentence"}',
  "",
  'When passed is false, use "" for evidence_path, evidence_lines and evidence_quote, and make the',
  "reasoning say specifically what is missing or wrong — the learner reads it.",
  "Never include markdown code fences anywhere in the JSON. Never write the fix.",
].join("\n");

function extractJson(text: string): any | null {
  const trimmed = text.trim();
  // Models wrap JSON in fences despite instructions; tolerate it rather than
  // discarding an otherwise valid verdict.
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

/** Collapses whitespace so a quote that differs only in indentation still
 * verifies — models normalise leading spaces almost every time. */
function canonical(s: string): string {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

/** The file context is presented with "  12| " line-number gutters, and models
 * often copy them into the quote. Strip them before matching, or every quote
 * fails verification for a formatting artefact we introduced ourselves. */
function stripGutters(s: string): string {
  return s.replace(/^\s*\d+\s*\|\s?/gm, "");
}

/**
 * A quote the model produced but that doesn't appear in the files means it
 * described what should be there rather than reading what is. That is the exact
 * shape of a confident false pass, so it's rejected.
 *
 * Verified segment by segment rather than as one contiguous string. Plenty of
 * criteria are satisfied by several separate places in a file — "the page uses
 * header, main, section and footer" is evidenced by four elements that are not
 * adjacent — and demanding one unbroken match rejected correct submissions.
 * That was measured: it produced a 100% false-fail rate on the audit's known-
 * good fixtures while the model was behaving perfectly well.
 *
 * The anti-hallucination property survives, because EVERY segment must exist.
 * Invented evidence still fails; assembled-from-real-parts evidence passes.
 */
function quoteAppearsInFiles(quote: string, files: FileEntry[]): boolean {
  const haystacks = files.map((f) => canonical(f.content));

  const segments = stripGutters(quote)
    .split(/\n|\.\.\.|…/)
    .map(canonical)
    // Fragments this short ("</p>", "}") match almost anything, so they carry
    // no evidential weight either way — ignore rather than credit them.
    .filter((s) => s.length >= 4);

  if (segments.length === 0) {
    const whole = canonical(stripGutters(quote));
    return whole.length >= 3 && haystacks.some((h) => h.includes(whole));
  }

  return segments.every((seg) => haystacks.some((h) => h.includes(seg)));
}

/**
 * Turns one parsed model verdict into an outcome, enforcing the evidence rule.
 *
 * Shared by both grading modes on purpose: the anti-false-pass guarantee must
 * not depend on which mode is configured. A claimed pass with no quote, or with
 * a quote that isn't actually in the user's files, is downgraded to a failure
 * here regardless of how the call was made.
 */
function verdictFromParsed(
  criterion: CriterionInput,
  parsed: any,
  files: FileEntry[],
): CriterionOutcome {
  const base: CriterionOutcome = {
    criterionId: criterion.id,
    passed: false,
    evidencePath: "",
    evidenceLines: "",
    evidenceQuote: "",
    reasoning: "",
    ungraded: false,
  };

  const quote = typeof parsed.evidence_quote === "string" ? parsed.evidence_quote : "";
  const path = typeof parsed.evidence_path === "string" ? parsed.evidence_path : "";
  const lines = typeof parsed.evidence_lines === "string" ? parsed.evidence_lines : "";
  const reasoning =
    typeof parsed.reasoning === "string" && parsed.reasoning.trim()
      ? parsed.reasoning.trim()
      : "";

  if (!parsed.passed) {
    return { ...base, passed: false, reasoning: reasoning || "This check isn't met yet." };
  }

  if (!quote.trim()) {
    return {
      ...base,
      reasoning:
        "The grader judged this met but couldn't point to the code that does it, so it's recorded as not met.",
    };
  }
  if (!quoteAppearsInFiles(quote, files)) {
    return {
      ...base,
      reasoning:
        "The grader quoted code that isn't in your files, so this check wasn't credited. If you believe it's met, submit again.",
    };
  }

  return {
    criterionId: criterion.id,
    passed: true,
    evidencePath: path,
    evidenceLines: lines,
    evidenceQuote: quote.slice(0, 400),
    reasoning: reasoning || "Met.",
    ungraded: false,
  };
}

async function gradeOne(
  criterion: CriterionInput,
  fileContext: string,
  files: FileEntry[],
  phaseTitle: string,
  phaseGoal: string,
): Promise<CriterionOutcome> {
  const base: CriterionOutcome = {
    criterionId: criterion.id,
    passed: false,
    evidencePath: "",
    evidenceLines: "",
    evidenceQuote: "",
    reasoning: "",
    ungraded: false,
  };

  const userPrompt = [
    `Phase: ${phaseTitle}`,
    phaseGoal ? `Phase goal (context only): ${phaseGoal}` : "",
    "",
    "Submitted files:",
    fileContext || "(the learner has not created any files yet)",
    "",
    `Criterion to judge: ${criterion.text}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const provider = getChatProvider();
    const result = await provider.getChatCompletion([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);

    const parsed = extractJson(result.content ?? "");
    if (!parsed || typeof parsed.passed !== "boolean") {
      return {
        ...base,
        ungraded: true,
        reasoning: "This check couldn't be graded — try submitting again.",
      };
    }

    return verdictFromParsed(criterion, parsed, files);
  } catch (err: any) {
    console.error(`Grading criterion ${criterion.id} failed:`, err?.message ?? err);
    return {
      ...base,
      ungraded: true,
      reasoning: "This check couldn't be graded — try submitting again.",
    };
  }
}

/** Runs `workers` tasks at a time, preserving input order in the output. */
async function mapWithConcurrency<T, R>(
  items: T[],
  workers: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const run = async () => {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(workers, items.length) }, run));
  return out;
}

/**
 * Batched grading: one call, all criteria, evidence still required per criterion.
 *
 * The cost of grading one criterion at a time is that the whole file context is
 * resent every time, so N criteria cost roughly N times the tokens. On a
 * tokens-per-minute quota that is also N times the *latency*, since the calls
 * can't run in parallel without immediately hitting the limit. A five-criterion
 * review took about ten seconds for that reason.
 *
 * This sends the context once and asks for N verdicts. The mechanism that
 * actually prevents false passes — every pass must quote real code, and the
 * quote is verified against the files afterwards — is unchanged. What is
 * weakened is isolation: the model sees all the criteria together and may
 * anchor, judging them as a set rather than independently.
 *
 * That is a real risk and not one to hand-wave, so it is settled by measurement
 * rather than argument: tests/phase2.accuracy.test.ts scores both modes against
 * the same ground-truth fixtures. Switch with GRADING_MODE.
 */
const SYSTEM_PROMPT_BATCH = [
  "You are grading a coding exercise against a numbered list of criteria, inside a learn-by-doing platform.",
  "",
  "You are given the learner's complete submitted files, with line numbers, and the criteria.",
  "Judge EACH criterion completely independently. A criterion is met or not met entirely on its own terms:",
  "do not let your judgement of one influence another, do not assume a submission that satisfies most",
  "criteria satisfies the rest, and do not grade the submission as a whole. Some may pass while others fail.",
  "",
  "To mark a criterion met you MUST quote the exact line or lines from the submitted files that make it true.",
  "Copy the text verbatim from the file content given to you — do not retype it from memory, do not reformat",
  "it, do not write what it should say. If you cannot find such a line, that criterion is NOT met.",
  "",
  "Be strict but fair. Each criterion is the whole standard for itself: do not require more than it asks,",
  "and do not accept less. Code that only appears inside a comment does not count as doing the thing.",
  "",
  "Respond with a single JSON object and nothing else, in exactly this shape:",
  '{"verdicts":[{"id":"<the criterion id given to you>","passed":true|false,"evidence_path":"path/to/file","evidence_lines":"12-15","evidence_quote":"the exact copied text","reasoning":"one sentence"}]}',
  "",
  "Include exactly one entry per criterion, using the id given.",
  'For a criterion that is not met, use "" for evidence_path, evidence_lines and evidence_quote, and make the',
  "reasoning say specifically what is missing or wrong — the learner reads it.",
  "Never include markdown code fences anywhere in the JSON. Never write the fix.",
].join("\n");

async function gradeBatch(
  criteria: CriterionInput[],
  fileContext: string,
  files: FileEntry[],
  phaseTitle: string,
  phaseGoal: string,
): Promise<CriterionOutcome[]> {
  const ungraded = (reason: string): CriterionOutcome[] =>
    criteria.map((c) => ({
      criterionId: c.id,
      passed: false,
      evidencePath: "",
      evidenceLines: "",
      evidenceQuote: "",
      reasoning: reason,
      ungraded: true,
    }));

  const userPrompt = [
    `Phase: ${phaseTitle}`,
    phaseGoal ? `Phase goal (context only): ${phaseGoal}` : "",
    "",
    "Submitted files:",
    fileContext || "(the learner has not created any files yet)",
    "",
    "Criteria to judge, each independently:",
    ...criteria.map((c) => `- id: ${c.id}\n  ${c.text}`),
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const provider = getChatProvider();
    const result = await provider.getChatCompletion([
      { role: "system", content: SYSTEM_PROMPT_BATCH },
      { role: "user", content: userPrompt },
    ]);

    const parsed = extractJson(result.content ?? "");
    const verdicts = Array.isArray(parsed?.verdicts) ? parsed.verdicts : null;
    if (!verdicts) return ungraded("This check couldn't be graded — try submitting again.");

    const byId = new Map<string, any>();
    for (const v of verdicts) {
      if (v && typeof v.id === "string") byId.set(v.id, v);
    }

    return criteria.map((c) => {
      const v = byId.get(c.id);
      // A criterion the model simply omitted was not judged. Treating silence
      // as a pass would be the worst possible default here.
      if (!v || typeof v.passed !== "boolean") {
        return {
          criterionId: c.id,
          passed: false,
          evidencePath: "",
          evidenceLines: "",
          evidenceQuote: "",
          reasoning: "This check couldn't be graded — try submitting again.",
          ungraded: true,
        };
      }
      return verdictFromParsed(c, v, files);
    });
  } catch (err: any) {
    console.error("Batch grading failed:", err?.message ?? err);
    return ungraded("This check couldn't be graded — try submitting again.");
  }
}

export async function gradeCriteria(params: {
  userEmail: string;
  projectId: string;
  phaseTitle: string;
  phaseGoal: string;
  criteria: CriterionInput[];
}): Promise<CriterionOutcome[]> {
  const raw = await listProjectFilesWithContent(params.projectId, params.userEmail);
  const files: FileEntry[] = (raw ?? [])
    .filter((f: any) => !f.isDirectory && !f.is_directory)
    .map((f: any) => ({
      path: f.filePath ?? f.file_path ?? "",
      content: f.content ?? "",
    }))
    .filter((f: FileEntry) => f.path);

  const fileContext = buildFileContext(files);

  if (GRADING_MODE === "batch") {
    return gradeBatch(params.criteria, fileContext, files, params.phaseTitle, params.phaseGoal);
  }

  return mapWithConcurrency(params.criteria, GRADING_CONCURRENCY, (c) =>
    gradeOne(c, fileContext, files, params.phaseTitle, params.phaseGoal),
  );
}
