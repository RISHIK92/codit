/**
 * Grading-accuracy audit.
 *
 * "Harden the review gate" is unfalsifiable without a number, so this produces
 * one. It runs known-ground-truth submissions through the real gate and reports:
 *
 *   FALSE PASS  — work a human would reject that the gate advanced.
 *                 The failure that matters. Every false pass is a user who
 *                 skipped a phase they didn't understand, which is the exact
 *                 outcome this product exists to prevent.
 *   FALSE FAIL  — work a human would accept that the gate rejected.
 *                 Bad, but recoverable: the user resubmits.
 *   MISATTRIBUTION — right verdict, wrong criterion blamed. Not counted as an
 *                 error, but tracked, because feedback pointing at the wrong
 *                 thing sends people to fix code that was already fine.
 *
 * Grading is stochastic, so pass RUNS=3 to measure consistency rather than a
 * single sample.
 *
 * Requires: database, user-service (50051) and ai-service (50053) running.
 *
 *   npx ts-node tests/phase2.accuracy.test.ts
 *   RUNS=3 npx ts-node tests/phase2.accuracy.test.ts
 */
import { prisma } from "../src/db/prismaClient";
import * as knowledgeCheckRepo from "../src/repositories/knowledgeCheckRepo";
import * as phaseReviewService from "../src/services/phaseReviewService";
import { FIXTURES, type Fixture } from "./fixtures/portfolioPhase1";

const EMAIL = "phase2-accuracy@codit.invalid";
const RUNS = Number(process.env.RUNS ?? "1");

interface Trial {
  fixture: Fixture;
  run: number;
  verdict: string;
  passedCriteria: number;
  totalCriteria: number;
  failedOrders: number[];
  ungraded: number;
}

/** Drops the enrollment and everything hanging off it, children first. */
async function cleanupEnrollment() {
  const ups = await prisma.userProjects.findMany({
    where: { user_email: EMAIL },
    select: { id: true },
  });
  const ids = ups.map((u) => u.id);
  const reviews = await prisma.phaseReview.findMany({
    where: { user_project_id: { in: ids } },
    select: { id: true },
  });
  await prisma.reviewCriterionResult.deleteMany({
    where: { review_id: { in: reviews.map((r) => r.id) } },
  });
  await prisma.phaseReview.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.userPhaseProgress.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.phaseSnapshotFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.projectFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.userProjects.deleteMany({ where: { user_email: EMAIL } });
}

async function cleanup() {
  const ups = await prisma.userProjects.findMany({
    where: { user_email: EMAIL },
    select: { id: true },
  });
  const ids = ups.map((u) => u.id);
  const reviews = await prisma.phaseReview.findMany({
    where: { user_project_id: { in: ids } },
    select: { id: true },
  });
  await prisma.reviewCriterionResult.deleteMany({
    where: { review_id: { in: reviews.map((r) => r.id) } },
  });
  await prisma.phaseReview.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.userPhaseProgress.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.phaseSnapshotFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.projectFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.knowledgeCheckAttempt.deleteMany({ where: { user_email: EMAIL } });
  await prisma.userProjects.deleteMany({ where: { user_email: EMAIL } });
  await prisma.user.deleteMany({ where: { email: EMAIL } });
}

async function main() {
  const project = await prisma.projects.findFirstOrThrow({
    where: { name: "Personal Portfolio Website" },
    include: {
      learningPhases: {
        orderBy: { phase_number: "asc" },
        include: { knowledgeChecks: true, criteria: { orderBy: { order: "asc" } } },
      },
    },
  });
  const phase1 = project.learningPhases.find((p) => p.phase_number === 1)!;
  const orderById = new Map(phase1.criteria.map((c) => [c.id, c.order]));

  console.log(`\nGrading accuracy — ${project.name} phase 1 (${phase1.title})`);
  console.log(`${FIXTURES.length} fixtures x ${RUNS} run(s), ${phase1.criteria.length} criteria each\n`);

  await cleanup();
  await prisma.user.create({
    data: { uid: `phase2-acc-${Date.now()}`, email: EMAIL, skillLevel: "beginner" },
  });

  const trials: Trial[] = [];
  // Latency is part of the felt product, so it's reported next to accuracy —
  // a more accurate gate that nobody waits for isn't better.
  const elapsed: number[] = [];

  for (let run = 1; run <= RUNS; run++) {
    for (const fixture of FIXTURES) {
      // Fresh enrollment per trial so each fixture is graded from phase 1.
      // Children first — ProjectFile and the review rows both hold FKs onto it.
      await cleanupEnrollment();
      const up = await prisma.userProjects.create({
        data: {
          project_id: project.id,
          user_email: EMAIL,
          status: "in_progress",
          current_phase: 0,
        },
      });
      for (const c of phase1.knowledgeChecks) {
        await knowledgeCheckRepo.upsertAttempt(c.id, EMAIL, project.id, "ok", true);
      }
      for (const [path, content] of Object.entries(fixture.files)) {
        await prisma.projectFile.create({
          data: {
            project_id: project.id,
            user_email: EMAIL,
            file_path: path,
            content,
            is_directory: false,
          },
        });
      }

      const t0 = Date.now();
      const res = await phaseReviewService.submitPhaseReview(project.id, EMAIL, "index.html");
      const elapsedMs = Date.now() - t0;
      elapsed.push(elapsedMs);
      const failedOrders = res.results
        .filter((r) => !r.passed)
        .map((r) => orderById.get(r.criterionId) ?? 0)
        .sort((a, b) => a - b);

      trials.push({
        fixture,
        run,
        verdict: res.verdict,
        passedCriteria: res.criteriaPassed,
        totalCriteria: res.criteriaTotal,
        failedOrders,
        ungraded: res.results.filter((r) => r.ungraded).length,
      });

      // A wrong verdict is only actionable if you can see the grader's stated
      // reason, so surface it rather than just the criterion number.
      if (fixture.expectPass && res.verdict !== "met") {
        for (const r of res.results.filter((x) => !x.passed)) {
          console.log(
            `        [${orderById.get(r.criterionId)}] "${r.text}"\n         -> ${r.reasoning}`,
          );
        }
      }

      const advanced = res.verdict === "met";
      const correct = advanced === fixture.expectPass;
      const tag = correct
        ? "ok        "
        : advanced
          ? "FALSE PASS"
          : "false fail";
      console.log(
        `  ${tag}  ${fixture.name.padEnd(20)} run${run}  ` +
          `${res.criteriaPassed}/${res.criteriaTotal} passed` +
          (failedOrders.length ? `  failed: [${failedOrders.join(",")}]` : "") +
          (res.results.some((r) => r.ungraded) ? "  (ungraded present)" : "") +
          `  ${(elapsedMs / 1000).toFixed(1)}s`,
      );

      void up;
    }
  }

  // ── Report ────────────────────────────────────────────────────────────────
  const expectedPass = trials.filter((t) => t.fixture.expectPass);
  const expectedFail = trials.filter((t) => !t.fixture.expectPass);
  const falsePasses = expectedFail.filter((t) => t.verdict === "met");
  const falseFails = expectedPass.filter((t) => t.verdict !== "met");

  const falsePassRate = expectedFail.length ? falsePasses.length / expectedFail.length : 0;
  const falseFailRate = expectedPass.length ? falseFails.length / expectedPass.length : 0;

  const sorted = [...elapsed].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  console.log("\n─── Latency ────────────────────────────────────────────");
  console.log(
    `  mode: ${process.env.GRADING_MODE ?? "batch (server default)"}   median ${(median / 1000).toFixed(1)}s   ` +
      `slowest ${(Math.max(...elapsed, 0) / 1000).toFixed(1)}s`,
  );

  console.log("\n─── Accuracy ───────────────────────────────────────────");
  console.log(
    `  FALSE PASS rate: ${(falsePassRate * 100).toFixed(1)}%  (${falsePasses.length}/${expectedFail.length})` +
      `   <- the one that breaks the product`,
  );
  console.log(
    `  false fail rate: ${(falseFailRate * 100).toFixed(1)}%  (${falseFails.length}/${expectedPass.length})`,
  );

  if (falsePasses.length) {
    console.log("\n  Work that should have been rejected but advanced:");
    for (const t of falsePasses) {
      console.log(`    - ${t.fixture.name} (run ${t.run}): ${t.fixture.why}`);
    }
  }
  if (falseFails.length) {
    console.log("\n  Work that should have passed but was rejected:");
    for (const t of falseFails) {
      console.log(`    - ${t.fixture.name} (run ${t.run}): failed [${t.failedOrders.join(",")}]`);
    }
  }

  // ── Did it blame the right criterion? ─────────────────────────────────────
  const withExpectations = trials.filter((t) => t.fixture.expectFailedOrders?.length);
  let misattributed = 0;
  for (const t of withExpectations) {
    const expected = new Set(t.fixture.expectFailedOrders!);
    const actual = new Set(t.failedOrders);
    const missed = [...expected].filter((o) => !actual.has(o));
    const spurious = [...actual].filter((o) => !expected.has(o));
    if (missed.length || spurious.length) {
      misattributed++;
      console.log(
        `\n  misattributed  ${t.fixture.name} (run ${t.run}): ` +
          `expected [${[...expected].join(",")}] got [${[...actual].join(",")}]`,
      );
    }
  }
  console.log(
    `\n  criterion attribution: ${withExpectations.length - misattributed}/${withExpectations.length} exact`,
  );

  const ungradedTrials = trials.filter((t) => t.ungraded > 0).length;
  if (ungradedTrials) {
    console.log(`  trials with ungraded criteria: ${ungradedTrials}/${trials.length}`);
  }

  // ── Consistency across runs ───────────────────────────────────────────────
  if (RUNS > 1) {
    let unstable = 0;
    for (const f of FIXTURES) {
      const verdicts = new Set(trials.filter((t) => t.fixture.name === f.name).map((t) => t.verdict));
      if (verdicts.size > 1) {
        unstable++;
        console.log(`  unstable: ${f.name} produced ${[...verdicts].join(" and ")} across runs`);
      }
    }
    console.log(`  stable verdicts: ${FIXTURES.length - unstable}/${FIXTURES.length}`);
  }

  await cleanup();
  await prisma.$disconnect();

  // A false pass is the failure this whole phase exists to prevent, so it is
  // the only condition that fails the audit outright.
  console.log(
    falsePasses.length === 0
      ? "\nNo false passes.\n"
      : `\n${falsePasses.length} FALSE PASS(ES) — the gate let through work it should have rejected.\n`,
  );
  process.exit(falsePasses.length === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("Audit failed:", e);
  await cleanup().catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
