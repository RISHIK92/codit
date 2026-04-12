import * as fileRepo from "../repositories/fileRepo";

export const upsertFile = (
  projectId: string,
  userEmail: string,
  filePath: string,
  content: string,
  isDirectory: boolean,
) => fileRepo.upsertFile(projectId, userEmail, filePath, content, isDirectory);

export const getFile = (
  projectId: string,
  userEmail: string,
  filePath: string,
) => fileRepo.getFile(projectId, userEmail, filePath);

export const listFiles = (projectId: string, userEmail: string) =>
  fileRepo.listFiles(projectId, userEmail);

export const deleteFile = (
  projectId: string,
  userEmail: string,
  filePath: string,
) => fileRepo.deleteFile(projectId, userEmail, filePath);

export const batchUpsert = (
  projectId: string,
  userEmail: string,
  entries: Array<{ filePath: string; content: string; isDirectory: boolean }>,
) => fileRepo.batchUpsert(projectId, userEmail, entries);
