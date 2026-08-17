import { prisma } from "../db/prismaClient";

/** Fetch all knowledge checks for a phase with the user's attempt joined in. */
export const getPhaseKnowledgeChecks = async (
  phaseId: string,
  userEmail: string,
) => {
  const checks = await prisma.knowledgeChecks.findMany({
    where: { phase_id: phaseId },
    include: {
      attempts: {
        where: { user_email: userEmail },
        take: 1,
      },
    },
  });
  return checks.map((c) => ({
    ...c,
    attempt: c.attempts[0] ?? null,
  }));
};

export const findById = async (id: string) => {
  return prisma.knowledgeChecks.findUnique({ where: { id } });
};

/**
 * How many of a phase's knowledge checks the user has answered *correctly*.
 *
 * Correctness, not attemptedness, is the gate: a user who answered every
 * question wrong has demonstrated the opposite of readiness, and letting that
 * through to review reduces the checks to an attendance register. Retries are
 * unlimited by design — the point is to end up understanding it, not to
 * measure how many tries that took.
 */
export const getPhaseCheckProgress = async (
  phaseId: string,
  userEmail: string,
): Promise<{ total: number; correct: number }> => {
  const [total, correct] = await Promise.all([
    prisma.knowledgeChecks.count({ where: { phase_id: phaseId } }),
    prisma.knowledgeCheckAttempt.count({
      where: {
        user_email: userEmail,
        is_correct: true,
        knowledgeCheck: { phase_id: phaseId },
      },
    }),
  ]);
  return { total, correct };
};

/** Record a graded attempt — upsert so re-submitting updates the existing row. */
export const upsertAttempt = async (
  knowledgeCheckId: string,
  userEmail: string,
  projectId: string,
  answer: string,
  isCorrect: boolean,
) => {
  return prisma.knowledgeCheckAttempt.upsert({
    where: {
      knowledge_check_id_user_email: {
        knowledge_check_id: knowledgeCheckId,
        user_email: userEmail,
      },
    },
    update: { answer, is_correct: isCorrect, project_id: projectId },
    create: {
      knowledge_check_id: knowledgeCheckId,
      user_email: userEmail,
      project_id: projectId,
      answer,
      is_correct: isCorrect,
    },
  });
};

/**
 * All of a user's attempts, joined through to the project's skill_level,
 * for computing per-level quiz averages.
 */
export const getAttemptsWithSkillLevel = async (userEmail: string) => {
  return prisma.knowledgeCheckAttempt.findMany({
    where: { user_email: userEmail },
    include: {
      knowledgeCheck: {
        include: {
          learningPhase: {
            include: { project: { select: { skill_level: true } } },
          },
        },
      },
    },
  });
};

/** Total knowledge-check count per skill level, for the denominator in averages. */
export const countKnowledgeChecksBySkillLevel = async () => {
  const checks = await prisma.knowledgeChecks.findMany({
    include: {
      learningPhase: { select: { project: { select: { skill_level: true } } } },
    },
  });
  const counts: Record<string, number> = {};
  for (const c of checks) {
    const level = c.learningPhase.project.skill_level;
    counts[level] = (counts[level] ?? 0) + 1;
  }
  return counts;
};
