import prisma from "../db/prismaClient";

/** Fetch all resources for a phase with per-user completion status joined. */
export const getPhaseResources = async (
  phaseId: string,
  userEmail: string,
  projectId: string,
) => {
  const resources = await prisma.resources.findMany({
    where: { phase_id: phaseId },
    include: {
      userProgress: {
        where: { user_email: userEmail, project_id: projectId },
        take: 1,
      },
    },
    orderBy: { quality_score: "desc" },
  });
  return resources.map((r) => ({
    ...r,
    completed: r.userProgress[0]?.completed ?? false,
    completed_at: r.userProgress[0]?.completed_at ?? null,
  }));
};

/** Mark a resource as completed (or uncompleted) — upsert. */
export const markCompleted = async (
  resourceId: string,
  userEmail: string,
  projectId: string,
  completed: boolean,
) => {
  return prisma.resourceProgress.upsert({
    where: {
      resource_id_user_email_project_id: {
        resource_id: resourceId,
        user_email: userEmail,
        project_id: projectId,
      },
    },
    update: {
      completed,
      completed_at: completed ? new Date() : null,
    },
    create: {
      resource_id: resourceId,
      user_email: userEmail,
      project_id: projectId,
      completed,
      completed_at: completed ? new Date() : null,
    },
  });
};

/** Get all progress records for a user+project (across all phases). */
export const getProgress = async (userEmail: string, projectId: string) => {
  return prisma.resourceProgress.findMany({
    where: { user_email: userEmail, project_id: projectId },
  });
};
