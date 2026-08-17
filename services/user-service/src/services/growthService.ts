import { Metadata } from "@grpc/grpc-js";
import * as growthRepo from "../repositories/growthRepo";
import { prisma } from "../db/prismaClient";
import { aiClient } from "../grpc-clients/aiClient";
import { computeStats, computeFog } from "../growth/stats";
import { resolveEra } from "../growth/eras";

const CHECKPOINT_TIMEOUT_MS = 60_000;
const gradingModel = () => process.env.GROQ_MODEL || "openai/gpt-oss-120b";

/**
 * The growth record.
 *
 * Read-only and recomputed on demand. Storing these numbers would let them
 * drift from the events that produced them, and the entire credibility of this
 * layer rests on every figure being traceable to something the user actually
 * did.
 */
export const getGrowth = async (email: string) => {
  const [inputs, unexplained] = await Promise.all([
    growthRepo.getGrowthInputs(email),
    growthRepo.getUnexplainedPhases(email),
  ]);

  const stats = computeStats(inputs);
  const fog = computeFog({
    phasesCompleted: inputs.phasesCompleted,
    phasesWithPassedCheckpoint: inputs.phasesWithPassedCheckpoint,
  });

  const era = resolveEra({
    phasesCompleted: inputs.phasesCompleted,
    projectsCompleted: inputs.projectsCompleted,
    checksCorrect: inputs.checksCorrect,
    checkpointsPassed: inputs.checkpointsPassed,
    criteriaRecovered: inputs.criteriaRecovered,
    resourcesCompleted: inputs.resourcesCompleted,
    sharedArtifacts: inputs.sharedArtifacts,
    fogCount: fog.count,
  });

  return { stats, fog, era, unexplained };
};

function callAi<T>(fn: (md: Metadata, opts: any, cb: any) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    fn(
      new Metadata(),
      { deadline: new Date(Date.now() + CHECKPOINT_TIMEOUT_MS) },
      (err: any, res: T) => (err || !res ? reject(err ?? new Error("no response")) : resolve(res)),
    );
  });
}

/**
 * Opens a checkpoint on a completed phase.
 *
 * Only completed phases are eligible — the question is "explain what you
 * built", which is meaningless before there's anything built. Checked
 * server-side rather than trusted from the client.
 */
export const startCheckpoint = async (
  email: string,
  projectId: string,
  phaseNumber: number,
) => {
  const progress = await prisma.userPhaseProgress.findFirst({
    where: {
      phase_number: phaseNumber,
      status: "completed",
      userProject: { user_email: email, project_id: projectId },
    },
  });
  if (!progress) {
    throw new Error("You can only explain back a phase you've completed.");
  }

  const phase = await prisma.learningPhase.findFirst({
    where: { project_id: projectId, phase_number: phaseNumber },
    select: { title: true, concepts: true },
  });

  const { question } = await callAi<{ question: string }>((md, opts, cb) =>
    aiClient.generateCheckpoint(
      {
        userEmail: email,
        projectId,
        phaseNumber,
        phaseTitle: phase?.title ?? `Phase ${phaseNumber}`,
        concepts: phase?.concepts ?? [],
      },
      md,
      opts,
      cb,
    ),
  );

  const record = await growthRepo.createCheckpoint({
    userEmail: email,
    projectId,
    phaseNumber,
    question,
  });

  return { checkpointId: record.id, question };
};

export const submitCheckpoint = async (
  email: string,
  checkpointId: string,
  answer: string,
) => {
  const checkpoint = await growthRepo.findCheckpoint(checkpointId);
  if (!checkpoint) throw new Error("Checkpoint not found.");
  // The checkpoint id is a uuid, but ownership still has to be checked — an id
  // is not an authorisation.
  if (checkpoint.user_email !== email) throw new Error("Checkpoint not found.");
  if (checkpoint.passed) {
    return {
      passed: true,
      feedback: "You've already explained this one.",
      missingConcepts: [] as string[],
    };
  }

  const phase = await prisma.learningPhase.findFirst({
    where: { project_id: checkpoint.project_id, phase_number: checkpoint.phase_number },
    select: { title: true, concepts: true },
  });

  const grade = await callAi<{
    passed: boolean;
    feedback: string;
    missingConcepts: string[];
  }>((md, opts, cb) =>
    aiClient.gradeExplanation(
      {
        question: checkpoint.question,
        answer,
        phaseTitle: phase?.title ?? "",
        concepts: phase?.concepts ?? [],
      },
      md,
      opts,
      cb,
    ),
  );

  // Recorded whether it passed or not. A failed explanation is a real datum —
  // it's the difference between shipping and understanding, which is the thing
  // this whole layer exists to make visible.
  await growthRepo.recordCheckpointResult(checkpointId, {
    answer,
    passed: grade.passed,
    feedback: grade.feedback,
    missingConcepts: grade.missingConcepts ?? [],
    model: gradingModel(),
  });

  return {
    passed: grade.passed,
    feedback: grade.feedback,
    missingConcepts: grade.missingConcepts ?? [],
  };
};
