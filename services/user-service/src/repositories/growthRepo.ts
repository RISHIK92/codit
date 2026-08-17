import { prisma } from "../db/prismaClient";
import type { GrowthInputs } from "../growth/stats";

/**
 * Gathers the raw counts the growth stats are computed from.
 *
 * Everything here is a count of rows that already exist because the user did
 * something — no derived scores are stored, and nothing is written. That's
 * deliberate: a stored score drifts from the events that produced it, and the
 * whole claim of this layer is that every number is traceable.
 */
export const getGrowthInputs = async (email: string): Promise<
  GrowthInputs & { phasesWithPassedCheckpoint: number }
> => {
  const [
    phasesCompleted,
    projectsCompleted,
    passedResults,
    checksCorrect,
    checkpoints,
    resourcesCompleted,
    reviewAttempts,
    engagedPhases,
    sharedArtifacts,
  ] = await Promise.all([
    prisma.userPhaseProgress.count({
      where: { status: "completed", userProject: { user_email: email } },
    }),
    prisma.userProjects.count({ where: { user_email: email, status: "completed" } }),
    // Distinct criteria passed, with their kind. A criterion passed across
    // several submissions must count once — otherwise resubmitting inflates
    // Build, which would reward churn.
    prisma.reviewCriterionResult.findMany({
      where: { passed: true, review: { userProject: { user_email: email } } },
      select: { criterion_id: true, criterion: { select: { kind: true } } },
      distinct: ["criterion_id"],
    }),
    prisma.knowledgeCheckAttempt.count({ where: { user_email: email, is_correct: true } }),
    prisma.understandingCheckpoint.findMany({
      where: { user_email: email, passed: true },
      select: { project_id: true, phase_number: true },
    }),
    prisma.resourceProgress.count({ where: { user_email: email, completed: true } }),
    prisma.phaseReview.count({ where: { userProject: { user_email: email } } }),
    prisma.knowledgeCheckAttempt.findMany({
      where: { user_email: email },
      select: { knowledgeCheck: { select: { phase_id: true } } },
      distinct: ["knowledge_check_id"],
    }),
    // Only live shares count. A revoked artifact is one the author took back,
    // and Show should fall when they do.
    prisma.sharedArtifact.count({ where: { user_email: email, revoked: false } }),
  ]);

  const criteriaPassed = { behavioral: 0, structural: 0, conceptual: 0 };
  for (const r of passedResults) {
    const kind = r.criterion?.kind as keyof typeof criteriaPassed | undefined;
    if (kind && kind in criteriaPassed) criteriaPassed[kind] += 1;
  }

  // "Recovered" — failed at least once, and passed at some point. This is the
  // single most honest learning signal available: not that they got it right,
  // but that they got it wrong, found out why, and fixed it.
  const failedIds = await prisma.reviewCriterionResult.findMany({
    where: {
      passed: false,
      // A criterion that was never graded wasn't failed — the grader broke.
      // Counting that as a recovery would reward an outage.
      decided_by: { in: ["deterministic", "model"] },
      review: { userProject: { user_email: email } },
    },
    select: { criterion_id: true },
    distinct: ["criterion_id"],
  });
  const passedIds = new Set(passedResults.map((r) => r.criterion_id));
  const criteriaRecovered = failedIds.filter((f) => passedIds.has(f.criterion_id)).length;

  const phasesWithPassedCheckpoint = new Set(
    checkpoints.map((c) => `${c.project_id}:${c.phase_number}`),
  ).size;

  const phasesEngaged = new Set(
    engagedPhases.map((e) => e.knowledgeCheck?.phase_id).filter(Boolean),
  ).size;

  return {
    phasesCompleted,
    projectsCompleted,
    criteriaPassed,
    criteriaRecovered,
    checksCorrect,
    checkpointsPassed: checkpoints.length,
    resourcesCompleted,
    reviewAttempts,
    phasesEngaged,
    sharedArtifacts,
    phasesWithPassedCheckpoint,
  };
};

/** Phases the user has completed but never explained back — the fog. */
export const getUnexplainedPhases = async (email: string) => {
  const completed = await prisma.userPhaseProgress.findMany({
    where: { status: "completed", userProject: { user_email: email } },
    select: {
      phase_number: true,
      userProject: { select: { project_id: true, projects: { select: { name: true } } } },
    },
    orderBy: { completed_at: "asc" },
  });

  const explained = new Set(
    (
      await prisma.understandingCheckpoint.findMany({
        where: { user_email: email, passed: true },
        select: { project_id: true, phase_number: true },
      })
    ).map((c) => `${c.project_id}:${c.phase_number}`),
  );

  return completed
    .filter((p) => !explained.has(`${p.userProject.project_id}:${p.phase_number}`))
    .map((p) => ({
      projectId: p.userProject.project_id,
      projectName: p.userProject.projects?.name ?? "",
      phaseNumber: p.phase_number,
    }));
};

export const createCheckpoint = (data: {
  userEmail: string;
  projectId: string;
  phaseNumber: number;
  question: string;
}) =>
  prisma.understandingCheckpoint.create({
    data: {
      user_email: data.userEmail,
      project_id: data.projectId,
      phase_number: data.phaseNumber,
      question: data.question,
    },
  });

export const findCheckpoint = (id: string) =>
  prisma.understandingCheckpoint.findUnique({ where: { id } });

export const recordCheckpointResult = (
  id: string,
  data: { answer: string; passed: boolean; feedback: string; missingConcepts: string[]; model: string },
) =>
  prisma.understandingCheckpoint.update({
    where: { id },
    data: {
      answer: data.answer,
      passed: data.passed,
      feedback: data.feedback,
      missing_concepts: data.missingConcepts,
      model: data.model,
    },
  });
