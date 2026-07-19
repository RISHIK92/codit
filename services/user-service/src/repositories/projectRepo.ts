import { prisma } from "../db/prismaClient";
import { Status } from "../db/prismaClient";

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

/** The user's single "live" project, if any — in progress and not archived. */
export const getLiveProject = async (email: string) => {
  return await prisma.userProjects.findFirst({
    where: { user_email: email, status: "in_progress", archived: false },
  });
};

/** The user's single archived project, if any. */
export const getArchivedProject = async (email: string) => {
  return await prisma.userProjects.findFirst({
    where: { user_email: email, archived: true },
  });
};

export const setArchived = async (
  projectId: string,
  email: string,
  archived: boolean,
) => {
  return await prisma.userProjects.update({
    where: { project_id_user_email: { project_id: projectId, user_email: email } },
    data: { archived },
  });
};

/** Atomically bumps current_phase by 1 — called after an AI review judges the phase goal met. */
export const advancePhase = async (projectId: string, email: string) => {
  return await prisma.userProjects.update({
    where: { project_id_user_email: { project_id: projectId, user_email: email } },
    data: { current_phase: { increment: 1 } },
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
      deliverables: { orderBy: { order: "asc" }, select: { text: true } },
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
      deliverables: { orderBy: { order: "asc" }, select: { text: true } },
      learningPhases: {
        orderBy: { phase_number: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          long_description: true,
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
