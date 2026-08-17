/**
 * Growth pipeline against a live database, plus real checkpoint grading.
 *
 * The claims under test:
 *   - stats derive from actual rows, and shipping alone never moves Understand
 *   - "recovered" counts a criterion failed then passed, and only that
 *   - a checkpoint can't be opened on a phase you haven't completed
 *   - pasted code fails the checkpoint, because the code already works
 *   - a real explanation passes, and passing is what clears fog
 *
 * Requires: database, user-service (50051), ai-service (50053).
 *
 *   npx ts-node tests/phase5.checkpoint.test.ts
 */
import { prisma } from "../src/db/prismaClient";
import * as growthService from "../src/services/growthService";
import * as growthRepo from "../src/repositories/growthRepo";
import { computeStats } from "../src/growth/stats";

const EMAIL = "phase5-growth@codit.invalid";

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
  await prisma.understandingCheckpoint.deleteMany({ where: { user_email: EMAIL } });
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
        include: { criteria: { orderBy: { order: "asc" } }, knowledgeChecks: true },
      },
    },
  });
  const phase1 = project.learningPhases.find((p) => p.phase_number === 1)!;

  await cleanup();
  await prisma.user.create({
    data: { uid: `phase5-${Date.now()}`, email: EMAIL, skillLevel: "beginner" },
  });
  const up = await prisma.userProjects.create({
    data: { project_id: project.id, user_email: EMAIL, status: "in_progress", current_phase: 1 },
  });
  await prisma.projectFile.create({
    data: {
      project_id: project.id,
      user_email: EMAIL,
      file_path: "index.html",
      content: `<!DOCTYPE html>
<html><head><title>P</title><link rel="stylesheet" href="style.css"></head>
<body>
  <header><nav><a href="#about">About</a><a href="#contact">Contact</a></nav></header>
  <main>
    <section id="about"><h2>About</h2></section>
    <section id="contact"><form><label for="n">Name</label><input id="n"></form></section>
  </main>
  <footer></footer>
</body></html>`,
      is_directory: false,
    },
  });
  await prisma.userPhaseProgress.create({
    data: { user_project_id: up.id, phase_number: 1, status: "completed", completed_at: new Date() },
  });

  // ── 1. Shipping alone moves Build only ────────────────────────────────────
  console.log("\n1. Stats derive from real rows");
  {
    const review = await prisma.phaseReview.create({
      data: { user_project_id: up.id, phase_number: 1, verdict: "met", feedback: "", model: "t" },
    });
    await prisma.reviewCriterionResult.createMany({
      data: phase1.criteria.map((c) => ({
        review_id: review.id,
        criterion_id: c.id,
        passed: true,
        decided_by: "model" as const,
      })),
    });

    const inputs = await growthRepo.getGrowthInputs(EMAIL);
    const stats = computeStats(inputs);
    check("Build reflects the completed phase and passed criteria", stats.build > 0);
    check(
      "Understand is still zero — nothing has been demonstrated",
      stats.understand === 0,
      `${stats.understand}`,
    );
    check("Explore registers the review attempt", stats.explore > 0);
    check("phase counted as completed", inputs.phasesCompleted === 1);
  }

  // ── 2. Recovery is failed-then-passed, and only that ──────────────────────
  console.log("\n2. Recovered criteria");
  {
    const before = (await growthRepo.getGrowthInputs(EMAIL)).criteriaRecovered;
    check("nothing counts as recovered yet", before === 0, `${before}`);

    // Fail one criterion on an earlier submission, then it's already passed above.
    const failedReview = await prisma.phaseReview.create({
      data: { user_project_id: up.id, phase_number: 1, verdict: "not_met", feedback: "", model: "t" },
    });
    await prisma.reviewCriterionResult.create({
      data: {
        review_id: failedReview.id,
        criterion_id: phase1.criteria[0].id,
        passed: false,
        decided_by: "model",
      },
    });

    const after = await growthRepo.getGrowthInputs(EMAIL);
    check("a criterion failed then passed counts as recovered", after.criteriaRecovered === 1, `${after.criteriaRecovered}`);
    check("recovery moves Understand", computeStats(after).understand > 0);

    // An ungraded result is a grader outage, not a user failure — crediting it
    // would reward downtime.
    const outage = await prisma.phaseReview.create({
      data: { user_project_id: up.id, phase_number: 1, verdict: "not_met", feedback: "", model: "t" },
    });
    await prisma.reviewCriterionResult.create({
      data: {
        review_id: outage.id,
        criterion_id: phase1.criteria[1].id,
        passed: false,
        decided_by: "ungraded",
      },
    });
    const afterOutage = await growthRepo.getGrowthInputs(EMAIL);
    check(
      "an ungraded criterion never counts as recovered",
      afterOutage.criteriaRecovered === 1,
      `${afterOutage.criteriaRecovered}`,
    );
  }

  // ── 3. Checkpoint eligibility ─────────────────────────────────────────────
  console.log("\n3. Checkpoint eligibility");
  {
    let threw = false;
    try {
      await growthService.startCheckpoint(EMAIL, project.id, 3); // never completed
    } catch {
      threw = true;
    }
    check("cannot explain back a phase you haven't completed", threw);
  }

  // ── 4. Real grading ───────────────────────────────────────────────────────
  console.log("\n4. Explain-it-back grading");
  let checkpointId = "";
  {
    const started = await growthService.startCheckpoint(EMAIL, project.id, 1);
    checkpointId = started.checkpointId;
    console.log(`     Q: "${started.question.slice(0, 160)}"`);
    check("a question is generated", started.question.length > 15);
    check("the question asks for prose, not code", !started.question.includes("```"));

    // Pasting code is the exact behaviour this gate exists to reject: the code
    // already works, so reproducing it demonstrates nothing.
    const pasted = await growthService.submitCheckpoint(
      EMAIL,
      checkpointId,
      `<header><nav><a href="#about">About</a></nav></header>
       <section id="about"><h2>About</h2></section>
       <form><label for="n">Name</label><input id="n"></form>`,
    );
    check("pasted code fails", !pasted.passed);
    check("and says why without supplying the answer", !pasted.feedback.includes("```"));

    const tooShort = await growthService.submitCheckpoint(EMAIL, checkpointId, "it works");
    check("a non-answer fails", !tooShort.passed);

    const real = await growthService.submitCheckpoint(
      EMAIL,
      checkpointId,
      "The nav links work because each one's href starts with a hash followed by the id of a section further down the same page. " +
        "When you click it the browser looks for an element on the page whose id matches the text after the hash, and scrolls to it instead of loading a new document. " +
        "That's why the ids on the section elements have to match the hrefs exactly — if they don't line up, the browser finds nothing and the link does nothing. " +
        "The labels on the form work the same way: the for attribute points at the input's id, which is what ties them together for screen readers and makes clicking the label focus the field.",
    );
    console.log(`     Verdict: ${real.passed ? "passed" : "not passed"} — "${real.feedback.slice(0, 180)}"`);
    check("a real explanation passes", real.passed, real.feedback);
  }

  // ── 5. Only a passed checkpoint clears fog ────────────────────────────────
  console.log("\n5. Fog clears only by explaining");
  {
    const growth = await growthService.getGrowth(EMAIL);
    check("fog is now clear for the explained phase", growth.fog.count === 0, `${growth.fog.count}`);
    check("Understand has moved", growth.stats.understand > 0);
    check("era is named, not a number", growth.era.current.name.length > 0);
    check(
      "next-era requirements are human-readable",
      growth.era.nextRequirements.every((r) => /\s/.test(r.label)),
    );

    // Shipping another phase without explaining it puts fog back.
    await prisma.userPhaseProgress.create({
      data: { user_project_id: up.id, phase_number: 2, status: "completed", completed_at: new Date() },
    });
    const after = await growthService.getGrowth(EMAIL);
    check("shipping more without explaining raises fog again", after.fog.count === 1, `${after.fog.count}`);
    check("and Build rises while Understand does not", after.stats.build > growth.stats.build && after.stats.understand === growth.stats.understand);
  }

  // ── 6. Ownership ──────────────────────────────────────────────────────────
  console.log("\n6. Ownership");
  {
    let denied = false;
    try {
      await growthService.submitCheckpoint("someone-else@codit.invalid", checkpointId, "x".repeat(60));
    } catch {
      denied = true;
    }
    check("another user cannot submit your checkpoint", denied);
  }

  await cleanup();
  console.log(`\n${passed} passed, ${failed} failed\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("Test run failed:", e);
  await cleanup().catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
