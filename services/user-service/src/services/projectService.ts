import * as projectRepo from "../repositories/projectRepo";
import { Status } from "../db/prismaClient";

export const createProject = async (
  projectId: string,
  email: string,
  status: Status,
  currentPhase: number,
) => {
  if (status === "in_progress") {
    const live = await projectRepo.getLiveProject(email);
    if (live) {
      throw new Error(
        "You already have a live project in progress — archive it before starting a new one.",
      );
    }
  }
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

export const getProjectsByStatus = async (email: string, status: Status) => {
  return await projectRepo.getProjectsByStatus(email, status);
};

export const updateProject = async (
  id: string,
  status: Status,
  currentPhase: number,
) => {
  return await projectRepo.updateProject(id, status, currentPhase);
};

/**
 * Archives or resumes a user's project. At most one live project
 * (in_progress && !archived) and at most one archived project are allowed
 * per user at a time — archiving frees the live slot; resuming requires it.
 */
export const setUserProjectArchived = async (
  projectId: string,
  email: string,
  archived: boolean,
) => {
  if (archived) {
    const existingArchived = await projectRepo.getArchivedProject(email);
    if (existingArchived && existingArchived.project_id !== projectId) {
      throw new Error(
        "You already have an archived project — resume or complete it before archiving another.",
      );
    }
  } else {
    const live = await projectRepo.getLiveProject(email);
    if (live && live.project_id !== projectId) {
      throw new Error(
        "You already have a live project — archive it before resuming this one.",
      );
    }
  }
  return await projectRepo.setArchived(projectId, email, archived);
};

// Phase advancement deliberately has no entry point here. It is reachable only
// through phaseReviewService.submitPhaseReview, which grades the submission
// first — see the comment at the top of that file.

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
