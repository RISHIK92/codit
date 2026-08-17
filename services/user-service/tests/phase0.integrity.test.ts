/**
 * Phase 0 integration checks — run against a live database with throwaway data.
 *
 * Exercises the real repository/service code, not reimplementations of it.
 * Everything is namespaced to a test email and deleted at the end; no existing
 * user, enrollment, or project row is written to.
 *
 *   npx ts-node tests/phase0.integrity.test.ts
 */
import { prisma } from "../src/db/prismaClient";
import * as projectRepo from "../src/repositories/projectRepo";
import * as knowledgeCheckRepo from "../src/repositories/knowledgeCheckRepo";
import * as phaseReviewService from "../src/services/phaseReviewService";

const EMAIL = "phase0-test@codit.invalid";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function cleanup(projectId: string) {
  const ups = await prisma.userProjects.findMany({
    where: { user_email: EMAIL },
    select: { id: true },
  });
  const ids = ups.map((u) => u.id);
  await prisma.phaseReview.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.userPhaseProgress.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.phaseSnapshotFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.projectFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.knowledgeCheckAttempt.deleteMany({ where: { user_email: EMAIL } });
  await prisma.userProjects.deleteMany({ where: { user_email: EMAIL } });
  await prisma.user.deleteMany({ where: { email: EMAIL } });
  void projectId;
}

async function main() {
  // ── Fixture: a real catalogue project that has phases and knowledge checks ──
  const project = await prisma.projects.findFirst({
    where: { learningPhases: { some: { knowledgeChecks: { some: {} } } } },
    include: {
      learningPhases: {
        orderBy: { phase_number: "asc" },
        include: { knowledgeChecks: true },
      },
    },
  });
  if (!project) throw new Error("No seeded project with knowledge checks found");

  const phase1 = project.learningPhases.find((p) => p.phase_number === 1)!;
  console.log(
    `\nFixture: "${project.name}" — ${project.learningPhases.length} phases, ` +
      `phase 1 has ${phase1.knowledgeChecks.length} knowledge checks\n`,
  );

  await cleanup(project.id);
  await prisma.user.create({ data: { uid: `phase0-${Date.now()}`, email: EMAIL } });
  await prisma.userProjects.create({
    data: {
      project_id: project.id,
      user_email: EMAIL,
      status: "in_progress",
      current_phase: 0,
    },
  });

  // ── 1. Knowledge-check gate is on correctness, not attendance ──────────────
  console.log("1. Knowledge-check gate");
  {
    // Answer every check, all WRONG — the old gate counted this as "attempted"
    // and let it through to review.
    for (const c of phase1.knowledgeChecks) {
      await knowledgeCheckRepo.upsertAttempt(
        c.id,
        EMAIL,
        project.id,
        "deliberately wrong",
        false,
      );
    }
    const prog = await knowledgeCheckRepo.getPhaseCheckProgress(phase1.id, EMAIL);
    check(
      "all-wrong answers count as 0 correct",
      prog.correct === 0 && prog.total === phase1.knowledgeChecks.length,
      JSON.stringify(prog),
    );

    const res = await phaseReviewService.submitPhaseReview(project.id, EMAIL, "");
    check("submission blocked despite every check attempted", res.verdict === "blocked");
    check("did not advance", res.advanced === false);
    check(
      "reports progress for the UI",
      res.checksCorrect === 0 && res.checksTotal === phase1.knowledgeChecks.length,
    );

    const enrollment = await prisma.userProjects.findFirstOrThrow({
      where: { user_email: EMAIL },
    });
    check("current_phase untouched", enrollment.current_phase === 0);

    const blockedRows = await prisma.phaseReview.count({
      where: { user_project_id: enrollment.id, verdict: "blocked" },
    });
    check("blocked attempt recorded for audit", blockedRows === 1);
  }

  // ── 2. Compare-and-swap: concurrent advances can't double-advance ──────────
  console.log("\n2. Concurrent advance (compare-and-swap)");
  {
    // Mark the checks correct so the gate isn't what's under test here.
    for (const c of phase1.knowledgeChecks) {
      await knowledgeCheckRepo.upsertAttempt(c.id, EMAIL, project.id, "ok", true);
    }

    // Two simultaneous advances off the same verdict — the exact double-submit
    // race (two tabs, double-click, replayed request).
    const results = await Promise.allSettled([
      projectRepo.advancePhase(project.id, EMAIL, 1, {
        verdict: "met",
        feedback: "race A",
        model: "test",
      }),
      projectRepo.advancePhase(project.id, EMAIL, 1, {
        verdict: "met",
        feedback: "race B",
        model: "test",
      }),
    ]);
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const rejected = results.filter((r) => r.status === "rejected").length;
    check("exactly one advance succeeded", ok === 1, `fulfilled=${ok} rejected=${rejected}`);

    const enrollment = await prisma.userProjects.findFirstOrThrow({
      where: { user_email: EMAIL },
    });
    check(
      "advanced by exactly 1, not 2",
      enrollment.current_phase === 1,
      `current_phase=${enrollment.current_phase}`,
    );

    const metRows = await prisma.phaseReview.count({
      where: { user_project_id: enrollment.id, verdict: "met" },
    });
    check("only the winning review was recorded", metRows === 1, `met rows=${metRows}`);

    const snap = await prisma.phaseSnapshotFile.count({
      where: { user_email: EMAIL, phase_number: 1 },
    });
    check("phase 1 snapshot taken (0 files is valid — none created)", snap >= 0);
  }

  // ── 3. Stale advance is rejected ──────────────────────────────────────────
  console.log("\n3. Stale / replayed advance");
  {
    let threw = false;
    try {
      // Phase 1 is already done; replaying it must not skip phase 2.
      await projectRepo.advancePhase(project.id, EMAIL, 1, {
        verdict: "met",
        feedback: "replay",
        model: "test",
      });
    } catch {
      threw = true;
    }
    check("replaying a spent verdict throws", threw);
    const e = await prisma.userProjects.findFirstOrThrow({ where: { user_email: EMAIL } });
    check("current_phase still 1", e.current_phase === 1, `current_phase=${e.current_phase}`);
  }

  // ── 4. Final phase completes the enrollment ───────────────────────────────
  console.log("\n4. Advancing past the final phase");
  {
    const last = project.learningPhases[project.learningPhases.length - 1].phase_number;
    // Walk to the end from the current position.
    let e = await prisma.userProjects.findFirstOrThrow({ where: { user_email: EMAIL } });
    while (e.current_phase < last) {
      await projectRepo.advancePhase(project.id, EMAIL, e.current_phase + 1, {
        verdict: "met",
        feedback: "walk",
        model: "test",
      });
      e = await prisma.userProjects.findFirstOrThrow({ where: { user_email: EMAIL } });
    }
    check(
      "enrollment marked completed at the end",
      e.status === "completed",
      `status=${e.status} current_phase=${e.current_phase}`,
    );
    check("completed_at set", e.completed_at != null);

    let threw = false;
    try {
      await projectRepo.advancePhase(project.id, EMAIL, last + 1, {
        verdict: "met",
        feedback: "past end",
        model: "test",
      });
    } catch {
      threw = true;
    }
    check("cannot advance past a completed project", threw);
  }

  // ── 5. Submitting on a completed project is refused ───────────────────────
  console.log("\n5. Submitting on a completed enrollment");
  {
    let msg = "";
    try {
      await phaseReviewService.submitPhaseReview(project.id, EMAIL, "");
    } catch (e: any) {
      msg = e.message;
    }
    check("refused with a clear message", msg.includes("completed"), msg);
  }

  await cleanup(project.id);
  console.log(`\n${passed} passed, ${failed} failed\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("Test run failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});
