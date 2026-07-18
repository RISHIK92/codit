import * as repo from "../repositories/knowledgeCheckRepo";

export const getPhaseKnowledgeChecks = (phaseId: string, userEmail: string) =>
  repo.getPhaseKnowledgeChecks(phaseId, userEmail);

/** Grade an answer server-side and record the attempt. correct_answer is never sent to the client. */
export const submitAnswer = async (
  knowledgeCheckId: string,
  userEmail: string,
  projectId: string,
  answer: string,
) => {
  const check = await repo.findById(knowledgeCheckId);
  if (!check) throw new Error("Knowledge check not found");

  const isCorrect =
    check.correct_answer != null &&
    answer.trim().toLowerCase() === check.correct_answer.trim().toLowerCase();

  await repo.upsertAttempt(
    knowledgeCheckId,
    userEmail,
    projectId,
    answer,
    isCorrect,
  );

  return { isCorrect, explanation: check.explanation };
};

/** Per-skill-level % correct, for progression gating (beginner/intermediate/advanced). */
export const getQuizAverages = async (userEmail: string) => {
  const [attempts, totals] = await Promise.all([
    repo.getAttemptsWithSkillLevel(userEmail),
    repo.countKnowledgeChecksBySkillLevel(),
  ]);

  const byLevel: Record<string, { correct: number; attempted: number }> = {};
  for (const a of attempts) {
    const level = a.knowledgeCheck.learningPhase.project.skill_level;
    byLevel[level] ??= { correct: 0, attempted: 0 };
    byLevel[level].attempted += 1;
    if (a.is_correct) byLevel[level].correct += 1;
  }

  const levels = ["beginner", "intermediate", "advanced"];
  return levels.map((level) => {
    const stats = byLevel[level] ?? { correct: 0, attempted: 0 };
    return {
      skillLevel: level,
      averagePct:
        stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0,
      attemptedCount: stats.attempted,
      totalCount: totals[level] ?? 0,
    };
  });
};
