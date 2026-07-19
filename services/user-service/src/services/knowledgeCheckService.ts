import * as repo from "../repositories/knowledgeCheckRepo";
import { aiClient } from "../grpc-clients/aiClient";

export const getPhaseKnowledgeChecks = (phaseId: string, userEmail: string) =>
  repo.getPhaseKnowledgeChecks(phaseId, userEmail);

/**
 * LLM-graded judgment for free-text answers (code_completion/debug) — exact
 * string matching is too brittle for code (different variable names, or an
 * answer that states only the crucial change rather than a full rewrite,
 * would otherwise be marked wrong despite being correct). Falls back to
 * exact match if the ai-service call fails, so grading degrades rather than
 * breaking outright.
 */
const gradeFreeTextAnswer = (
  question: string,
  correctAnswer: string,
  explanation: string,
  questionType: string,
  userAnswer: string,
): Promise<boolean> =>
  new Promise((resolve) => {
    aiClient.gradeAnswer(
      {
        question,
        correctAnswer,
        explanation,
        questionType,
        userAnswer,
      },
      (err, res) => {
        if (err || !res) {
          resolve(
            userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase(),
          );
          return;
        }
        resolve(res.isCorrect);
      },
    );
  });

/** Grade an answer server-side and record the attempt. correct_answer is never sent to the client. */
export const submitAnswer = async (
  knowledgeCheckId: string,
  userEmail: string,
  projectId: string,
  answer: string,
) => {
  const check = await repo.findById(knowledgeCheckId);
  if (!check) throw new Error("Knowledge check not found");

  let isCorrect = false;
  if (check.correct_answer != null) {
    isCorrect =
      check.question_type === "multiple_choice"
        ? answer.trim().toLowerCase() === check.correct_answer.trim().toLowerCase()
        : await gradeFreeTextAnswer(
            check.question,
            check.correct_answer,
            check.explanation,
            check.question_type,
            answer,
          );
  }

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
