import { createHash } from "crypto";
import { prisma } from "../db/prismaClient";
import { Status } from "../db/prismaClient";

/** SHA-256 of the file's content, hex-encoded — the Blob's primary key. Two
 * files with identical content hash the same and share one Blob row. */
function hashContent(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

export const createProject = async (
  projectId: string,
  email: string,
  status: Status,
  currentPhase: number,
) => {
  return await prisma.$transaction(async (tx) => {
    const userProject = await tx.userProjects.create({
      data: {
        project_id: projectId,
        user_email: email,
        status: status,
        current_phase: currentPhase,
      },
    });

    const phases = await tx.learningPhase.findMany({
      where: { project_id: projectId },
      select: { phase_number: true },
    });
    if (phases.length > 0) {
      await tx.userPhaseProgress.createMany({
        data: phases.map((p) => ({
          user_project_id: userProject.id,
          phase_number: p.phase_number,
          status: p.phase_number === currentPhase + 1 ? "in_progress" : "locked",
        })),
      });
    }

    return userProject;
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

/**
 * Bumps current_phase by 1 — called after an AI review judges the phase goal
 * met. Before advancing, freezes a snapshot of the user's current files
 * tagged with the phase number just completed, so it stays viewable
 * (read-only) even after the live tree moves on to the next phase.
 */
export const advancePhase = async (projectId: string, email: string) => {
  return await prisma.$transaction(async (tx) => {
    const current = await tx.userProjects.findUniqueOrThrow({
      where: { project_id_user_email: { project_id: projectId, user_email: email } },
    });
    const completedPhaseNumber = current.current_phase + 1;
    const nextPhaseNumber = completedPhaseNumber + 1;

    const files = await tx.projectFile.findMany({
      where: { project_id: projectId, user_email: email },
    });
    if (files.length > 0) {
      // Content-addressed: hash each file's content, write the distinct
      // blobs once (identical content — e.g. an untouched starter file —
      // hashes the same across phases and across users, so it's stored
      // exactly once), then point every snapshot row at its blob by hash.
      const blobsByHash = new Map<string, string>();
      for (const f of files) {
        if (!f.is_directory && !blobsByHash.has(hashContent(f.content))) {
          blobsByHash.set(hashContent(f.content), f.content);
        }
      }
      if (blobsByHash.size > 0) {
        await tx.blob.createMany({
          data: Array.from(blobsByHash.entries()).map(([hash, content]) => ({
            hash,
            content,
            size: Buffer.byteLength(content, "utf8"),
          })),
          skipDuplicates: true,
        });
      }

      await tx.phaseSnapshotFile.createMany({
        data: files.map((f) => ({
          project_id: projectId,
          user_email: email,
          phase_number: completedPhaseNumber,
          file_path: f.file_path,
          blob_hash: f.is_directory ? null : hashContent(f.content),
          is_directory: f.is_directory,
        })),
        skipDuplicates: true,
      });
    }

    // Lock the completed phase in as done, and unlock the next one (if the
    // project has one) — upsert since enrollments created before per-user
    // phase tracking existed won't have a UserPhaseProgress row yet.
    await tx.userPhaseProgress.upsert({
      where: {
        user_project_id_phase_number: {
          user_project_id: current.id,
          phase_number: completedPhaseNumber,
        },
      },
      create: {
        user_project_id: current.id,
        phase_number: completedPhaseNumber,
        status: "completed",
        completed_at: new Date(),
      },
      update: { status: "completed", completed_at: new Date() },
    });

    const nextPhase = await tx.learningPhase.findFirst({
      where: { project_id: projectId, phase_number: nextPhaseNumber },
      select: { phase_number: true },
    });
    if (nextPhase) {
      await tx.userPhaseProgress.upsert({
        where: {
          user_project_id_phase_number: {
            user_project_id: current.id,
            phase_number: nextPhaseNumber,
          },
        },
        create: {
          user_project_id: current.id,
          phase_number: nextPhaseNumber,
          status: "in_progress",
        },
        update: { status: "in_progress" },
      });
    }

    return await tx.userProjects.update({
      where: { project_id_user_email: { project_id: projectId, user_email: email } },
      data: { current_phase: { increment: 1 } },
    });
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
