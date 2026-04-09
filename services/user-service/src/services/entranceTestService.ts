import { Difficulty, Skill_Level } from "@prisma/client";
import * as repo from "../repositories/entranceTestRepo";
import * as userRepo from "../repositories/userRepo";
import { EntranceQuestion } from "@prisma/client";
import prisma from "../db/prismaClient";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AnswerInput {
  questionId: string;
  selectedOption: number;
}

interface StoredAnswer {
  question_id: string;
  selected_option: number;
  correct: boolean;
  difficulty: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDTO(q: EntranceQuestion) {
  return {
    id: q.id,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
    topic: q.topic,
    // correct_option intentionally omitted
  };
}

function seenIds(answers: StoredAnswer[]): string[] {
  return answers.map((a) => a.question_id);
}

function countCorrect(answers: StoredAnswer[], difficulty: string): number {
  return answers.filter((a) => a.difficulty === difficulty && a.correct).length;
}

// ── Start Test ────────────────────────────────────────────────────────────────

export const startTest = async (email: string) => {
  const attempt = await repo.upsertAttempt(email);

  const questions = await repo.getQuestionsByDifficulty(Difficulty.easy, [], 2);

  if (questions.length < 2) {
    throw new Error("Not enough easy questions in the pool");
  }

  return {
    attemptId: attempt.id,
    round: 1,
    questions: questions.map(toDTO),
  };
};

// ── Submit Round ──────────────────────────────────────────────────────────────

export const submitRound = async (email: string, answers: AnswerInput[]) => {
  const attempt = await repo.getAttempt(email);
  if (!attempt) throw new Error("No active test attempt found");
  if (attempt.status === "completed") throw new Error("Test already completed");

  // ── Build a lookup map: questionId → correct_option ────────────────────────
  const qIds = answers.map((a) => a.questionId);
  const dbQuestions = await prisma.entranceQuestion.findMany({
    where: { id: { in: qIds } },
  });

  const correctMap = new Map(dbQuestions.map((q) => [q.id, q]));

  // ── Append new answers to stored history ───────────────────────────────────
  const prevAnswers = (attempt.answers as unknown as StoredAnswer[]) ?? [];
  const newAnswers: StoredAnswer[] = answers.map((a) => {
    const q = correctMap.get(a.questionId);
    if (!q) throw new Error(`Unknown question id: ${a.questionId}`);
    return {
      question_id: a.questionId,
      selected_option: a.selectedOption,
      correct: q.correct_option === a.selectedOption,
      difficulty: q.difficulty,
    };
  });
  const allAnswers = [...prevAnswers, ...newAnswers];

  // ── Determine current round from attempt ───────────────────────────────────
  const currentRound = attempt.round;

  // ── Branching logic ───────────────────────────────────────────────────────
  //
  //  Round 1 (2 easy):
  //    2/2 → Round 2 with 2 intermediate
  //    1/2 → Round 2 with 2 intermediate (one last chance)
  //    0/2 → Round 2 with 2 easy (retry)
  //
  //  Round 2 (2 intermediate OR 2 easy-retry):
  //    came from easy 2/2 + now intermediate 2/2 → Round 3 advanced
  //    came from easy 2/2 + now intermediate <2/2 → beginner  DONE
  //    came from easy 1/2 + now intermediate 2/2 → intermediate  DONE
  //    came from easy 1/2 + now intermediate <2/2 → beginner  DONE
  //    came from easy 0/2 (retry) → any → beginner  DONE
  //
  //  Round 3 (2 advanced):
  //    2/2 → advanced  DONE
  //    else → intermediate  DONE

  const easyR1 = allAnswers.filter(
    (a) =>
      a.difficulty === "easy" &&
      prevAnswers.every((p) => p.question_id !== a.question_id),
  );
  // We need a clean way to track which round brought which answers:
  // Use round number stored on attempt.
  const r1Answers = allAnswers.filter((_, i) => i < 2);
  const r2Answers = allAnswers.filter((_, i) => i >= 2 && i < 4);
  const r3Answers = allAnswers.filter((_, i) => i >= 4);

  const r1Correct = r1Answers.filter((a) => a.correct).length;
  const r2Correct = r2Answers.filter((a) => a.correct).length;
  const r3Correct = r3Answers.filter((a) => a.correct).length;

  // Save progress
  await repo.updateAttempt(email, {
    answers: allAnswers,
    round: currentRound + 1,
  });

  // ── Round 1 complete ───────────────────────────────────────────────────────
  if (currentRound === 1) {
    if (r1Correct === 0) {
      // Retry with 2 more easy questions
      const nextQs = await repo.getQuestionsByDifficulty(
        Difficulty.easy,
        seenIds(allAnswers),
        2,
      );
      return { done: false, round: 2, nextQuestions: nextQs.map(toDTO) };
    }
    // 1/2 or 2/2 → go to intermediate
    const nextQs = await repo.getQuestionsByDifficulty(
      Difficulty.intermediate,
      seenIds(allAnswers),
      2,
    );
    return { done: false, round: 2, nextQuestions: nextQs.map(toDTO) };
  }

  // ── Round 2 complete ───────────────────────────────────────────────────────
  if (currentRound === 2) {
    const wasEasyRetry = r1Correct === 0; // came from 0/2 easy

    if (wasEasyRetry) {
      // Always beginner regardless of easy-retry result
      return await finalize(email, allAnswers, Skill_Level.beginner);
    }

    if (r1Correct === 1) {
      // 1/2 easy → intermediate round
      const level =
        r2Correct === 2 ? Skill_Level.intermediate : Skill_Level.beginner;
      return await finalize(email, allAnswers, level);
    }

    // r1Correct === 2
    if (r2Correct < 2) {
      // failed intermediate after 2/2 easy → mark intermediate (not beginner)
      return await finalize(email, allAnswers, Skill_Level.intermediate);
    }
    // 2/2 easy + 2/2 intermediate → go to advanced
    const nextQs = await repo.getQuestionsByDifficulty(
      Difficulty.advanced,
      seenIds(allAnswers),
      2,
    );
    return { done: false, round: 3, nextQuestions: nextQs.map(toDTO) };
  }

  // ── Round 3 complete ───────────────────────────────────────────────────────
  if (currentRound === 3) {
    const level =
      r3Correct === 2 ? Skill_Level.advanced : Skill_Level.intermediate;
    return await finalize(email, allAnswers, level);
  }

  throw new Error("Unexpected round state");
};

// ── Finalize: persist result + update user's skill_level ─────────────────────

async function finalize(
  email: string,
  allAnswers: StoredAnswer[],
  level: Skill_Level,
) {
  await repo.updateAttempt(email, {
    status: "completed",
    result_level: level,
    completed_at: new Date(),
    answers: allAnswers,
  });
  await userRepo.updateUserSkillLevel(email, level);
  return { done: true, skillLevel: level, nextQuestions: [] };
}
