import * as projectRepo from "../repositories/projectRepo";
import { Status } from "@prisma/client";

export const createProject = async (
  projectId: string,
  email: string,
  status: Status,
  currentPhase: number,
) => {
  return await projectRepo.createProject(
    projectId,
    email,
    status,
    currentPhase,
  );
};

export const findProjectById = async (id: string) => {
  return await projectRepo.findProjectById(id);
};

export const getAllProjects = async (email: string) => {
  return await projectRepo.getAllProjects(email);
};

export const updateProject = async (
  id: string,
  status: Status,
  currentPhase: number,
) => {
  return await projectRepo.updateProject(id, status, currentPhase);
};

// ── Project catalogue ─────────────────────────────────────────────────────────

export const getAllCatalogueProjects = async () => {
  return await projectRepo.getAllCatalogueProjects();
};

export const getCatalogueProjectById = async (projectId: string) => {
  return await projectRepo.getCatalogueProjectById(projectId);
};

export const getProjectWithPhases = async (projectId: string) => {
  return await projectRepo.getCatalogueProjectById(projectId);
};
