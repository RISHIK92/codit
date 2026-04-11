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

export const getProjectsByStatus = async (email: string, status: Status) => {
  return await prisma.userProjects.findMany({
    where: { user_email: email, status },
    orderBy: { started_at: "desc" },
  });
};

const SKILL_LEVEL_ORDER: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export const getAllCatalogueProjects = async () => {
  const projects = await prisma.projects.findMany({
    include: {
      _count: { select: { learningPhases: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return projects.sort(
    (a, b) =>
      (SKILL_LEVEL_ORDER[a.skill_level] ?? 99) -
      (SKILL_LEVEL_ORDER[b.skill_level] ?? 99),
  );
};

export const getCatalogueProjectById = async (projectId: string) => {
  return await prisma.projects.findFirst({
    where: { id: projectId },
    include: {
      _count: { select: { learningPhases: true } },
      learningPhases: {
        orderBy: { phase_number: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          goal: true,
          phase_number: true,
          estimated_minutes: true,
        },
      },
    },
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
