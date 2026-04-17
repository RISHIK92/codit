import { prisma } from "../db/prismaClient";

/** Strip null bytes and other non-UTF8-safe characters Postgres rejects. */
function sanitize(content: string): string {
  // eslint-disable-next-line no-control-regex
  return content.replace(/\x00/g, "");
}

/** Create or update a single file/directory entry. */
export const upsertFile = async (
  projectId: string,
  userEmail: string,
  filePath: string,
  content: string,
  isDirectory: boolean,
) => {
  const safe = sanitize(content);
  return prisma.projectFile.upsert({
    where: {
      project_id_user_email_file_path: {
        project_id: projectId,
        user_email: userEmail,
        file_path: filePath,
      },
    },
    update: { content: safe, is_directory: isDirectory },
    create: {
      project_id: projectId,
      user_email: userEmail,
      file_path: filePath,
      content: safe,
      is_directory: isDirectory,
    },
  });
};

/** Retrieve a single file by its path. */
export const getFile = async (
  projectId: string,
  userEmail: string,
  filePath: string,
) => {
  return prisma.projectFile.findUnique({
    where: {
      project_id_user_email_file_path: {
        project_id: projectId,
        user_email: userEmail,
        file_path: filePath,
      },
    },
  });
};

/** List every file/directory belonging to a project. */
export const listFiles = async (projectId: string, userEmail: string) => {
  return prisma.projectFile.findMany({
    where: { project_id: projectId, user_email: userEmail },
    orderBy: { file_path: "asc" },
  });
};

/**
 * Delete a single file, or a directory and all its descendants
 * (matched by prefix, e.g. "/src/components/" removes everything below).
 */
export const deleteFile = async (
  projectId: string,
  userEmail: string,
  filePath: string,
) => {
  // Delete exact match + anything whose path starts with filePath + "/"
  const result = await prisma.projectFile.deleteMany({
    where: {
      project_id: projectId,
      user_email: userEmail,
      OR: [
        { file_path: filePath },
        {
          file_path: {
            startsWith: filePath.endsWith("/") ? filePath : filePath + "/",
          },
        },
      ],
    },
  });
  return result.count;
};

/** Batch upsert — used on initial project load to seed all files at once. */
export const batchUpsert = async (
  projectId: string,
  userEmail: string,
  entries: Array<{ filePath: string; content: string; isDirectory: boolean }>,
) => {
  const ops = entries.map((e) => {
    const safe = sanitize(e.content);
    return prisma.projectFile.upsert({
      where: {
        project_id_user_email_file_path: {
          project_id: projectId,
          user_email: userEmail,
          file_path: e.filePath,
        },
      },
      update: { content: safe, is_directory: e.isDirectory },
      create: {
        project_id: projectId,
        user_email: userEmail,
        file_path: e.filePath,
        content: safe,
        is_directory: e.isDirectory,
      },
    });
  });
  const results = await prisma.$transaction(ops);
  return results.length;
};
