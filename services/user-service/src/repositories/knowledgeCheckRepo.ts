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
