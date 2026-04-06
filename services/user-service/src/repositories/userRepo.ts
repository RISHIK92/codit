import prisma from "../db/prismaClient";

export const createUserInDb = async (email: string, passwordHash: string) => {
  return await prisma.user.create({
    data: {
      email,
      password: passwordHash,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};
