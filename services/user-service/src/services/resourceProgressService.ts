import * as repo from "../repositories/resourceProgressRepo";

export const getPhaseResources = (
  phaseId: string,
  userEmail: string,
  projectId: string,
) => repo.getPhaseResources(phaseId, userEmail, projectId);

export const markCompleted = (
  resourceId: string,
  userEmail: string,
  projectId: string,
  completed: boolean,
) => repo.markCompleted(resourceId, userEmail, projectId, completed);

export const getProgress = (userEmail: string, projectId: string) =>
  repo.getProgress(userEmail, projectId);
