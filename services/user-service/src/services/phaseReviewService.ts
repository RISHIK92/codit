import * as projectRepo from "../repositories/projectRepo";
import * as knowledgeCheckRepo from "../repositories/knowledgeCheckRepo";
import { aiClient } from "../grpc-clients/aiClient";

/**
 * The phase gate.
 *
 * Everything that decides whether a user advances lives here, on the server:
 * which phase is under review, whether its knowledge checks are passed, what
 * the grader was asked, how its verdict was read, and whether the phase moved.
 * The client's only role is to say "I'm submitting" and render what comes back.
 *
 * This used to be split across the browser and the AI service — the client sent
 * a review-mode chat message, regex-matched "VERDICT: MET" in the streamed
 * reply, and called a separate advance endpoint on a match. Three things were
 * wrong with that: the advance endpoint would advance anyone who called it, the
 * regex could fire on prose merely *describing* a passing verdict, and a client
 * that grades itself isn't a gate at all.
 */

/** Mirrors the literal contract the review prompt in ai-service enforces. */
const VERDICT_MET = /^\s*VERDICT:\s*MET\s*$/im;
const VERDICT_NOT_MET = /^\s*VERDICT:\s*NOT\s*MET\s*$/im;

/** Recorded with each verdict so a bad grading batch can be traced to a model. */
const gradingModel = () =>
  process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/**
 * Hard ceiling on a grading call.
 *
 * Grading runs a multi-round tool-calling loop against an external model, and
 * that loop can stall — a malformed tool call, a provider hiccup, a stream that
 * never ends. Without a deadline the gRPC call waits forever, which means the
 * HTTP request waits forever, which means the user's Submit button spins with
 * no verdict and no error. Bounding it converts an indefinite hang into a
 * plain "try again", which is recoverable.
 */
const GRADING_TIMEOUT_MS = 90_000;

export interface PhaseReviewResult {
  verdict: "met" | "not_met" | "blocked";
  advanced: boolean;
  feedback: string;
  currentPhase: number;
  checksTotal: number;
  checksCorrect: number;
}

/**
 * Runs the AI grader over the user's submission and returns its full reply.
 *
 * `Chat` is a server-streaming RPC, so this collects the stream. It's a single
 * write today, but consuming it properly means per-token streaming can be
 * turned on in ai-service without breaking grading.
 */
function gradeSubmission(params: {
  userEmail: string;
  projectId: string;
  phaseId: string;
  activeFilePath: string;
  message: string;
  currentTask: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = aiClient.chat(
      {
        userEmail: params.userEmail,
        projectId: params.projectId,
        phaseId: params.phaseId,
        activeFilePath: params.activeFilePath,
        message: params.message,
        history: [],
        mode: "review",
        currentTask: params.currentTask,
        snapshotPhaseNumber: 0,
      },
      { deadline: new Date(Date.now() + GRADING_TIMEOUT_MS) },
    );

    let full = "";
    stream.on("data", (res: { reply?: string }) => {
      full += res.reply ?? "";
    });
    stream.on("error", reject);
    stream.on("end", () => resolve(full));
  });
}

/** Strips the machine-read verdict line before the feedback is shown to the
 * user — it's a protocol token between services, not something worth reading. */
function stripVerdictLine(text: string): string {
  return text
    .replace(/^\s*VERDICT:\s*(NOT\s*)?MET\s*$/gim, "")
    .trim();
}

export const submitPhaseReview = async (
  projectId: string,
  email: string,
  activeFilePath: string,
): Promise<PhaseReviewResult> => {
  const resolved = await projectRepo.getEnrollmentWithCurrentPhase(
    projectId,
    email,
  );
  if (!resolved) {
    throw new Error("You're not enrolled in this project.");
  }
  const { enrollment, phase, phaseNumber, projectName } = resolved;

  if (enrollment.archived) {
    throw new Error("This project is archived — resume it before submitting.");
  }
  if (enrollment.status !== "in_progress") {
    throw new Error(`This project is already ${enrollment.status}.`);
  }
  if (!phase) {
    throw new Error("There's no phase left to submit on this project.");
  }

  // ── Gate 1: knowledge checks, on correctness ──────────────────────────────
  // Enforced here rather than only in the UI. A client-side check is a
  // courtesy that saves a wasted grading call; it is not a gate, because
  // nothing stops a caller from skipping it.
  const { total, correct } = await knowledgeCheckRepo.getPhaseCheckProgress(
    phase.id,
    email,
  );
  if (total > 0 && correct < total) {
    const feedback =
      `Answer all of this phase's knowledge checks correctly before submitting — ` +
      `${correct} of ${total} so far. You can retry them as many times as you need.`;
    await projectRepo.recordFailedReview(
      projectId,
      email,
      phaseNumber,
      "blocked",
      feedback,
      "",
    );
    return {
      verdict: "blocked",
      advanced: false,
      feedback,
      currentPhase: enrollment.current_phase,
      checksTotal: total,
      checksCorrect: correct,
    };
  }

  // ── Gate 2: the grader ────────────────────────────────────────────────────
  // The goal comes from the database, not the request. A client-supplied goal
  // would let a caller grade themselves against a trivially easy one.
  const goalText =
    phase.goal && typeof phase.goal === "object" && "description" in phase.goal
      ? String((phase.goal as { description?: unknown }).description ?? "")
      : "";

  const message = [
    `Review my submission for Phase ${phase.phase_number}: ${phase.title}.`,
    goalText ? `Goal: ${goalText}` : "",
    phase.concepts.length
      ? `Concepts this phase covers: ${phase.concepts.join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  // A grader that errors or times out has not judged anything. Recording that
  // as "not_met" would both tell the user their work failed when it was never
  // looked at, and poison the review history that the grading-accuracy audit
  // depends on. Surface it as the infrastructure failure it is.
  let reply: string;
  try {
    reply = await gradeSubmission({
      userEmail: email,
      projectId,
      phaseId: phase.id,
      activeFilePath,
      message,
      currentTask: `Project: ${projectName} — Phase ${phase.phase_number}: ${phase.title}`,
    });
  } catch (err: any) {
    console.error(
      `Grading call failed for ${projectId} (${email}) phase ${phaseNumber}:`,
      err?.message ?? err,
    );
    throw new Error(
      "The reviewer couldn't be reached just now — your work is saved, try submitting again in a moment.",
    );
  }

  const feedback = stripVerdictLine(reply);
  const model = gradingModel();

  // Require an explicit, well-formed MET line on a line of its own. Anything
  // else — a NOT MET, a malformed reply, an empty one, or a model that talked
  // about verdicts without issuing one — does not advance. Failing closed is
  // the whole point: a false "met" silently turns this into the tutorial
  // platform it exists to not be.
  const met = VERDICT_MET.test(reply) && !VERDICT_NOT_MET.test(reply);

  if (!met) {
    await projectRepo.recordFailedReview(
      projectId,
      email,
      phaseNumber,
      "not_met",
      feedback,
      model,
    );
    return {
      verdict: "not_met",
      advanced: false,
      feedback:
        feedback ||
        "The grader couldn't complete a review just now — try submitting again.",
      currentPhase: enrollment.current_phase,
      checksTotal: total,
      checksCorrect: correct,
    };
  }

  // Records the passing review and advances in one transaction, so a pass can
  // never exist without the advance it authorised, or the reverse.
  const updated = await projectRepo.advancePhase(projectId, email, phaseNumber, {
    verdict: "met",
    feedback,
    model,
  });

  return {
    verdict: "met",
    advanced: true,
    feedback,
    currentPhase: updated.current_phase,
    checksTotal: total,
    checksCorrect: correct,
  };
};
