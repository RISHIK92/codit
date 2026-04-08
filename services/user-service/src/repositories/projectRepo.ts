import prisma from "../db/prismaClient";
import { Status } from "@prisma/client";

export const createProject = async (
  projectId: string,
  email: string,
  status: Status,
  currentPhase: number,
) => {
  return await prisma.userProjects.create({
    data: {
      project_id: projectId,
      user_email: email,
      status: status,
      current_phase: currentPhase,
    },
  });
};

export const findProjectById = async (projectId: string) => {
  return await prisma.userProjects.findFirst({
    where: { project_id: projectId },
  });
};

export const getAllProjects = async (email: string) => {
  return await prisma.userProjects.findMany({
    where: { user_email: email },
  });
};

export const updateProject = async (
  id: string,
  status: Status,
  currentPhase: number,
) => {
  return await prisma.userProjects.update({
    where: { id },
    data: {
      status: status,
      current_phase: currentPhase,
    },
  });
};
