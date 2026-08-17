import { Metadata } from "@grpc/grpc-js";
import * as projectRepo from "../repositories/projectRepo";
import * as knowledgeCheckRepo from "../repositories/knowledgeCheckRepo";
import * as fileRepo from "../repositories/fileRepo";
import { aiClient } from "../grpc-clients/aiClient";
import {
  runDeterministicCheck,
  type CheckSubject,
} from "../grading/deterministicChecks";

/**
 * The phase gate.
 *
 * Everything that decides whether a user advances lives here, on the server:
 * which phase is under review, whether its knowledge checks are passed, what
 * each criterion was judged against, and whether the phase moved. The client's
 * only role is to say "I'm submitting" and render what comes back.
 *
 * The verdict is a conjunction over criteria, computed — never an opinion
 * parsed out of prose. Two earlier designs failed at exactly that point: first
 * the browser regex-matched "VERDICT: MET" out of a chat reply and called a
 * separate advance endpoint (so the client decided, and prose describing a
 * passing verdict could trip the match), then the server did the same parse on
 * a holistic judgement (better, but a single "is this good?" question drifts
 * generous, and generous is the direction that breaks the product).
 *
 * Now: deterministic checks run first, in code. Everything else is graded one
 * criterion at a time with evidence required. Every criterion must pass.
 */

const GRADING_TIMEOUT_MS = 120_000;

const gradingModel = () => process.env.GROQ_MODEL || "openai/gpt-oss-120b";

export interface CriterionResult {
  criterionId: string;
  text: string;
  kind: string;
  passed: boolean;
  reasoning: string;
  evidencePath: string;
  evidenceLines: string;
  evidenceQuote: string;
  hint: string;
  ungraded: boolean;
  decidedBy: "deterministic" | "model" | "ungraded";
}

export interface PhaseReviewResult {
  verdict: "met" | "not_met" | "blocked";
  advanced: boolean;
  feedback: string;
  currentPhase: number;
  checksTotal: number;
  checksCorrect: number;
  results: CriterionResult[];
  criteriaTotal: number;
  criteriaPassed: number;
}

function gradeViaAi(params: {
  userEmail: string;
  projectId: string;
  phaseTitle: string;
  phaseGoal: string;
  criteria: { id: string; text: string; kind: string }[];
}): Promise<{ verdicts: any[]; model: string }> {
  return new Promise((resolve, reject) => {
    aiClient.gradeCriteria(
      params,
      new Metadata(),
      { deadline: new Date(Date.now() + GRADING_TIMEOUT_MS) },
      (err: any, res: any) => {
        if (err || !res) {
          reject(err ?? new Error("No response from grader"));
          return;
        }
        resolve(res);
      },
    );
  });
}

/**
 * Human-readable summary. Deliberately does not restate every passing check —
 * the client renders the full checklist, and repeating it here would bury what
 * actually needs attention.
 */
function buildFeedback(results: CriterionResult[], met: boolean): string {
  const failed = results.filter((r) => !r.passed);
  const ungraded = failed.filter((r) => r.ungraded);

  if (met) {
    return `All ${results.length} checks passed. Phase complete.`;
  }
  if (ungraded.length === failed.length && ungraded.length > 0) {
    return `${ungraded.length} of ${results.length} checks couldn't be graded just now — your work hasn't been judged. Try submitting again in a moment.`;
  }

  const lines = [
    `${results.length - failed.length} of ${results.length} checks passed. Still to fix:`,
    "",
  ];
  for (const r of failed) {
    lines.push(`• ${r.text}`);
    if (r.reasoning) lines.push(`  ${r.reasoning}`);
    if (r.hint) lines.push(`  Hint: ${r.hint}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}

export const submitPhaseReview = async (
  projectId: string,
  email: string,
  activeFilePath: string,
): Promise<PhaseReviewResult> => {
  void activeFilePath; // context hint only; nothing is decided from it

  const resolved = await projectRepo.getEnrollmentWithCurrentPhase(projectId, email);
  if (!resolved) throw new Error("You're not enrolled in this project.");

  const { enrollment, phase, phaseNumber, projectName } = resolved;

  if (enrollment.archived) {
    throw new Error("This project is archived — resume it before submitting.");
  }
  if (enrollment.status !== "in_progress") {
    throw new Error(`This project is already ${enrollment.status}.`);
  }
  if (!phase) throw new Error("There's no phase left to submit on this project.");

  const empty = { results: [] as CriterionResult[], criteriaTotal: 0, criteriaPassed: 0 };

  // ── Gate 1: knowledge checks, on correctness ──────────────────────────────
  // Enforced here rather than only in the UI. A client-side check is a courtesy
  // that saves a wasted grading call; it is not a gate.
  const { total, correct } = await knowledgeCheckRepo.getPhaseCheckProgress(
    phase.id,
    email,
  );
  if (total > 0 && correct < total) {
    const feedback =
      `Answer all of this phase's knowledge checks correctly before submitting — ` +
      `${correct} of ${total} so far. You can retry them as many times as you need.`;
    await projectRepo.recordFailedReview(projectId, email, phaseNumber, "blocked", feedback, "");
    return {
      verdict: "blocked",
      advanced: false,
      feedback,
      currentPhase: enrollment.current_phase,
      checksTotal: total,
      checksCorrect: correct,
      ...empty,
    };
  }

  // ── Gate 2: the rubric ────────────────────────────────────────────────────
  const criteria = await projectRepo.getPhaseCriteria(phase.id);
  if (criteria.length === 0) {
    // No rubric authored. Refuse rather than inventing a standard — advancing
    // on an empty rubric would be a free pass, and grading against a goal
    // sentence is the holistic judgement this design exists to replace.
    throw new Error(
      "This phase has no review criteria yet, so it can't be graded. Please report this.",
    );
  }

  const files = await fileRepo.listFiles(projectId, email);
  const subject: CheckSubject = {
    files: new Map(
      files.filter((f: any) => !f.is_directory).map((f: any) => [f.file_path, f.content ?? ""]),
    ),
  };

  const results: CriterionResult[] = [];

  // Deterministic first — instant, free, and unarguable.
  const deterministic = criteria.filter((c) => c.check_type === "deterministic");
  for (const c of deterministic) {
    const outcome = runDeterministicCheck(c.check_config as any, subject);
    results.push({
      criterionId: c.id,
      text: c.text,
      kind: c.kind,
      passed: outcome.passed,
      reasoning: outcome.reasoning,
      evidencePath: outcome.evidencePath ?? "",
      evidenceLines: outcome.evidenceLines ?? "",
      evidenceQuote: outcome.evidenceQuote ?? "",
      hint: c.hint ?? "",
      ungraded: false,
      decidedBy: "deterministic",
    });
  }

  // Then the model-judged ones, each with evidence required.
  const modelJudged = criteria.filter((c) => c.check_type === "model_judged");
  let model = "";
  if (modelJudged.length > 0) {
    const goalText =
      phase.goal && typeof phase.goal === "object" && "description" in phase.goal
        ? String((phase.goal as { description?: unknown }).description ?? "")
        : "";
    try {
      const res = await gradeViaAi({
        userEmail: email,
        projectId,
        phaseTitle: `${projectName} — Phase ${phase.phase_number}: ${phase.title}`,
        phaseGoal: goalText,
        criteria: modelJudged.map((c) => ({ id: c.id, text: c.text, kind: c.kind })),
      });
      model = res.model ?? gradingModel();
      const byId = new Map(res.verdicts.map((v: any) => [v.criterionId, v]));
      for (const c of modelJudged) {
        const v: any = byId.get(c.id);
        results.push({
          criterionId: c.id,
          text: c.text,
          kind: c.kind,
          // A criterion the grader didn't return an answer for is not a met one.
          passed: v ? !!v.passed && !v.ungraded : false,
          reasoning: v?.reasoning || "This check couldn't be graded — try submitting again.",
          evidencePath: v?.evidencePath ?? "",
          evidenceLines: v?.evidenceLines ?? "",
          evidenceQuote: v?.evidenceQuote ?? "",
          hint: c.hint ?? "",
          ungraded: v ? !!v.ungraded : true,
          decidedBy: v && !v.ungraded ? "model" : "ungraded",
        });
      }
    } catch (err: any) {
      // The grader is unreachable. Every model-judged criterion is ungraded —
      // NOT failed. Telling users their work is wrong when grading broke is
      // both untrue and poisons the accuracy record these rows feed.
      console.error(
        `Grading call failed for ${projectId} (${email}) phase ${phaseNumber}:`,
        err?.message ?? err,
      );
      for (const c of modelJudged) {
        results.push({
          criterionId: c.id,
          text: c.text,
          kind: c.kind,
          passed: false,
          reasoning: "The reviewer couldn't be reached — this check wasn't graded.",
          evidencePath: "",
          evidenceLines: "",
          evidenceQuote: "",
          hint: c.hint ?? "",
          ungraded: true,
          decidedBy: "ungraded",
        });
      }
    }
  }

  // Restore rubric order — deterministic checks were evaluated first.
  const orderById = new Map(criteria.map((c) => [c.id, c.order]));
  results.sort((a, b) => (orderById.get(a.criterionId) ?? 0) - (orderById.get(b.criterionId) ?? 0));

  const passedCount = results.filter((r) => r.passed).length;
  const met = passedCount === results.length;
  const feedback = buildFeedback(results, met);

  const base = {
    checksTotal: total,
    checksCorrect: correct,
    results,
    criteriaTotal: results.length,
    criteriaPassed: passedCount,
  };

  if (!met) {
    await projectRepo.recordFailedReview(
      projectId,
      email,
      phaseNumber,
      "not_met",
      feedback,
      model || gradingModel(),
      results,
    );
    return {
      verdict: "not_met",
      advanced: false,
      feedback,
      currentPhase: enrollment.current_phase,
      ...base,
    };
  }

  const updated = await projectRepo.advancePhase(projectId, email, phaseNumber, {
    verdict: "met",
    feedback,
    model: model || gradingModel(),
    results,
  });

  return {
    verdict: "met",
    advanced: true,
    feedback,
    currentPhase: updated.current_phase,
    ...base,
  };
};
