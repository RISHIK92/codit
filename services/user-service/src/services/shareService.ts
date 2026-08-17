import { randomBytes } from "crypto";
import { prisma } from "../db/prismaClient";
import { resolveEra, ERAS } from "../growth/eras";
import * as growthRepo from "../repositories/growthRepo";
import { computeFog } from "../growth/stats";

/**
 * Publishing a phase.
 *
 * Two rules shape everything here.
 *
 * First: **you can only publish a phase you have explained back.** Completing it
 * isn't enough. An artifact that says "this person finished a phase" is a badge,
 * and badges are exactly the credential-without-substance this product exists to
 * argue against. An artifact that says "here is what they built, here is where
 * each requirement was verified in their code, and here is them explaining why
 * it works" is evidence. Only the second is worth showing anyone.
 *
 * Second: publishing exposes the author's own code and writing to anyone with
 * the link, so it is per-phase, explicit, and revocable — and the public read
 * returns only what was opted into, never anything adjacent to it.
 */

/** Unguessable. Never sequential and never the row id, so published artifacts
 * can't be enumerated by walking ids. */
function makeSlug(): string {
  return randomBytes(9).toString("base64url");
}

/** The era at which an aggregated public profile unlocks. Individual phases can
 * be shared before this; the profile is the milestone-gated reveal. */
const PROFILE_ERA_INDEX = 5; // Builder

export const shareArtifact = async (
  email: string,
  projectId: string,
  phaseNumber: number,
  includeCode: boolean,
) => {
  const completed = await prisma.userPhaseProgress.findFirst({
    where: {
      phase_number: phaseNumber,
      status: "completed",
      userProject: { user_email: email, project_id: projectId },
    },
  });
  if (!completed) {
    throw new Error("You can only share a phase you've completed.");
  }

  const explained = await prisma.understandingCheckpoint.findFirst({
    where: {
      user_email: email,
      project_id: projectId,
      phase_number: phaseNumber,
      passed: true,
    },
  });
  if (!explained) {
    throw new Error(
      "Explain this phase back first. What's worth sharing is that you understood it, not that you finished it.",
    );
  }

  // Re-sharing a previously revoked phase reuses the row but issues a NEW slug:
  // a link the author withdrew should stay dead, not silently come back to life.
  const existing = await prisma.sharedArtifact.findUnique({
    where: {
      user_email_project_id_phase_number: {
        user_email: email,
        project_id: projectId,
        phase_number: phaseNumber,
      },
    },
  });

  if (existing && !existing.revoked) {
    return { slug: existing.slug };
  }

  const slug = makeSlug();
  if (existing) {
    await prisma.sharedArtifact.update({
      where: { id: existing.id },
      data: { slug, revoked: false, include_code: includeCode, view_count: 0 },
    });
  } else {
    await prisma.sharedArtifact.create({
      data: {
        slug,
        user_email: email,
        project_id: projectId,
        phase_number: phaseNumber,
        include_code: includeCode,
      },
    });
  }
  return { slug };
};

export const revokeArtifact = async (email: string, slug: string) => {
  const artifact = await prisma.sharedArtifact.findUnique({ where: { slug } });
  // Ownership, not just existence — a slug is an address, not an authorisation.
  if (!artifact || artifact.user_email !== email) {
    throw new Error("Not found.");
  }
  await prisma.sharedArtifact.update({ where: { id: artifact.id }, data: { revoked: true } });
  return { revoked: true };
};

export const listMyArtifacts = async (email: string) => {
  const [shared, checkpoints, completedPhases, inputs] = await Promise.all([
    prisma.sharedArtifact.findMany({
      where: { user_email: email, revoked: false },
      orderBy: { created_at: "desc" },
    }),
    prisma.understandingCheckpoint.findMany({
      where: { user_email: email, passed: true },
      select: { project_id: true, phase_number: true },
    }),
    prisma.userPhaseProgress.findMany({
      where: { status: "completed", userProject: { user_email: email } },
      select: {
        phase_number: true,
        userProject: { select: { project_id: true, projects: { select: { name: true } } } },
      },
    }),
    growthRepo.getGrowthInputs(email),
  ]);

  const fog = computeFog({
    phasesCompleted: inputs.phasesCompleted,
    phasesWithPassedCheckpoint: inputs.phasesWithPassedCheckpoint,
  });
  const era = resolveEra({
    phasesCompleted: inputs.phasesCompleted,
    projectsCompleted: inputs.projectsCompleted,
    checksCorrect: inputs.checksCorrect,
    checkpointsPassed: inputs.checkpointsPassed,
    criteriaRecovered: inputs.criteriaRecovered,
    resourcesCompleted: inputs.resourcesCompleted,
    sharedArtifacts: inputs.sharedArtifacts,
    fogCount: fog.count,
  });

  const explainedKeys = new Set(checkpoints.map((c) => `${c.project_id}:${c.phase_number}`));
  const sharedKeys = new Set(shared.map((s) => `${s.project_id}:${s.phase_number}`));

  const phaseTitles = await phaseTitleLookup(
    completedPhases.map((p) => ({
      projectId: p.userProject.project_id,
      phaseNumber: p.phase_number,
    })),
  );

  const shareable = completedPhases
    .filter((p) => {
      const key = `${p.userProject.project_id}:${p.phase_number}`;
      return explainedKeys.has(key) && !sharedKeys.has(key);
    })
    .map((p) => ({
      projectId: p.userProject.project_id,
      projectName: p.userProject.projects?.name ?? "",
      phaseNumber: p.phase_number,
      phaseTitle: phaseTitles.get(`${p.userProject.project_id}:${p.phase_number}`) ?? "",
    }));

  const sharedOut = await Promise.all(
    shared.map(async (s) => {
      const project = await prisma.projects.findFirst({
        where: { id: s.project_id },
        select: { name: true },
      });
      return {
        slug: s.slug,
        projectId: s.project_id,
        projectName: project?.name ?? "",
        phaseNumber: s.phase_number,
        phaseTitle: phaseTitles.get(`${s.project_id}:${s.phase_number}`) ?? "",
        includeCode: s.include_code,
        viewCount: s.view_count,
      };
    }),
  );

  const unlocked = era.current.index >= PROFILE_ERA_INDEX;
  return {
    shared: sharedOut,
    shareable,
    profileUnlocked: unlocked,
    profileLockedReason: unlocked
      ? ""
      : `Public profiles unlock at the ${ERAS[PROFILE_ERA_INDEX].name} era. You can still share individual phases now.`,
  };
};

async function phaseTitleLookup(
  keys: { projectId: string; phaseNumber: number }[],
): Promise<Map<string, string>> {
  if (!keys.length) return new Map();
  const phases = await prisma.learningPhase.findMany({
    where: { project_id: { in: [...new Set(keys.map((k) => k.projectId))] } },
    select: { project_id: true, phase_number: true, title: true },
  });
  return new Map(phases.map((p) => [`${p.project_id}:${p.phase_number}`, p.title]));
}

/**
 * The public read. Unauthenticated, so what it returns is a deliberate list
 * rather than whatever happened to be joined in.
 *
 * Never returned: the author's email, their other projects, failed submissions,
 * knowledge-check answers, or anything about their account. A published phase
 * reveals what its author opted into and nothing adjacent to it.
 */
export const getPublicArtifact = async (slug: string) => {
  const artifact = await prisma.sharedArtifact.findUnique({ where: { slug } });
  if (!artifact) return { found: false, revoked: false };
  if (artifact.revoked) return { found: true, revoked: true };

  const [author, project, phase, checkpoint] = await Promise.all([
    prisma.user.findUnique({
      where: { email: artifact.user_email },
      select: { name: true },
    }),
    prisma.projects.findFirst({
      where: { id: artifact.project_id },
      select: { name: true },
    }),
    prisma.learningPhase.findFirst({
      where: { project_id: artifact.project_id, phase_number: artifact.phase_number },
      select: { title: true },
    }),
    prisma.understandingCheckpoint.findFirst({
      where: {
        user_email: artifact.user_email,
        project_id: artifact.project_id,
        phase_number: artifact.phase_number,
        passed: true,
      },
      orderBy: { created_at: "desc" },
    }),
  ]);

  // The criteria that were passed, with where each was verified. "Passed" alone
  // is a badge; passed plus the line it was checked against is evidence.
  const enrollment = await prisma.userProjects.findUnique({
    where: {
      project_id_user_email: {
        project_id: artifact.project_id,
        user_email: artifact.user_email,
      },
    },
    select: { id: true },
  });

  let criteria: {
    text: string;
    kind: string;
    evidencePath: string;
    evidenceLines: string;
  }[] = [];

  if (enrollment) {
    const results = await prisma.reviewCriterionResult.findMany({
      where: {
        passed: true,
        review: { user_project_id: enrollment.id, phase_number: artifact.phase_number },
      },
      select: {
        evidence_path: true,
        evidence_lines: true,
        criterion: { select: { text: true, kind: true, order: true } },
      },
      distinct: ["criterion_id"],
    });
    criteria = results
      .filter((r) => r.criterion)
      .sort((a, b) => (a.criterion!.order ?? 0) - (b.criterion!.order ?? 0))
      .map((r) => ({
        text: r.criterion!.text,
        kind: r.criterion!.kind,
        evidencePath: r.evidence_path,
        evidenceLines: r.evidence_lines,
      }));
  }

  // The frozen snapshot taken when the phase was completed — not the live tree,
  // which has moved on and may no longer be what was actually reviewed.
  let files: { path: string; content: string }[] = [];
  if (artifact.include_code) {
    const snapshot = await prisma.phaseSnapshotFile.findMany({
      where: {
        project_id: artifact.project_id,
        user_email: artifact.user_email,
        phase_number: artifact.phase_number,
        is_directory: false,
      },
      select: { file_path: true, blob: { select: { content: true } } },
      orderBy: { file_path: "asc" },
    });
    files = snapshot.map((f) => ({ path: f.file_path, content: f.blob?.content ?? "" }));
  }

  // Best-effort; a failed counter must never break the page.
  prisma.sharedArtifact
    .update({ where: { id: artifact.id }, data: { view_count: { increment: 1 } } })
    .catch(() => {});

  return {
    found: true,
    revoked: false,
    authorName: author?.name?.trim() || "A Codit learner",
    projectName: project?.name ?? "",
    phaseNumber: artifact.phase_number,
    phaseTitle: phase?.title ?? "",
    createdAt: artifact.created_at.toISOString(),
    criteria,
    explanationQuestion: checkpoint?.question ?? "",
    explanationAnswer: checkpoint?.answer ?? "",
    files,
  };
};
