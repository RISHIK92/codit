import { prisma } from "../db/prismaClient";
import { Difficulty, Skill_Level, TestStatus } from "../db/prismaClient";

// ── Question pool ─────────────────────────────────────────────────────────────

export const getQuestionsByDifficulty = async (
  difficulty: Difficulty,
  excludeIds: string[],
  count: number,
) => {
  // Fetch more than needed then randomly pick `count` — gives variety each run
  const pool = await prisma.entranceQuestion.findMany({
    where: {
      difficulty,
      id: { notIn: excludeIds },
    },
  });
  // Fisher-Yates shuffle then slice
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
};

// ── Attempt CRUD ──────────────────────────────────────────────────────────────

export const upsertAttempt = async (email: string) => {
  // Delete any previous attempt so the user always starts fresh
  await prisma.entranceTestAttempt.deleteMany({ where: { user_email: email } });
  return await prisma.entranceTestAttempt.create({
    data: { user_email: email },
  });
};

export const getAttempt = async (email: string) => {
  return await prisma.entranceTestAttempt.findUnique({
    where: { user_email: email },
  });
};

export const updateAttempt = async (
  email: string,
  patch: {
    round?: number;
    answers?: object;
    status?: TestStatus;
    result_level?: Skill_Level;
    completed_at?: Date;
  },
) => {
  return await prisma.entranceTestAttempt.update({
    where: { user_email: email },
    data: patch,
  });
};
