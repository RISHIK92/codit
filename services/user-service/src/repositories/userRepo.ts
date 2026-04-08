import prisma from "../db/prismaClient";

export const createUserInDb = async (uid: string, email: string) => {
  return await prisma.user.create({
    data: {
      uid,
      email,
    },
  });
};

export const findUserByUid = async (uid: string) => {
  return await prisma.user.findUnique({
    where: { uid },
  });
};

export const upsertUser = async (uid: string, email: string, name: string) => {
  return await prisma.user.upsert({
    where: {
      uid,
    },
    update: {
      name: name || undefined,
    },
    create: {
      uid: uid,
      email: email,
      name: name || "Anonymous User",
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const updateUserPreferences = async (
  email: string,
  skillLevel: string,
  learningModes: string[],
  hoursPerWeek: number,
) => {
  return await prisma.user.update({
    where: { email },
    data: {
      skillLevel: skillLevel as any,
      learningModes,
      hoursPerWeek,
    },
  });
};
