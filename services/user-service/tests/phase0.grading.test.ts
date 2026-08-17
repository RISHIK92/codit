/**
 * Phase 0 end-to-end grading check — requires user-service (50051) and
 * ai-service (50053) running, plus a live database and a working GROQ_API_KEY.
 *
 * Drives the real path: submitPhaseReview → ai-service review-mode grading with
 * tool calls over the user's actual files → server-side verdict parse →
 * compare-and-swap advance. Uses throwaway data, cleaned up at the end.
 *
 *   npx ts-node tests/phase0.grading.test.ts
 */
import { prisma } from "../src/db/prismaClient";
import * as knowledgeCheckRepo from "../src/repositories/knowledgeCheckRepo";
import * as phaseReviewService from "../src/services/phaseReviewService";

const EMAIL = "phase0-grading@codit.invalid";

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
  await prisma.phaseReview.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.userPhaseProgress.deleteMany({ where: { user_project_id: { in: ids } } });
  await prisma.phaseSnapshotFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.projectFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.knowledgeCheckAttempt.deleteMany({ where: { user_email: EMAIL } });
  await prisma.userProjects.deleteMany({ where: { user_email: EMAIL } });
  await prisma.user.deleteMany({ where: { email: EMAIL } });
}

async function setFile(projectId: string, path: string, content: string) {
  await prisma.projectFile.upsert({
    where: {
      project_id_user_email_file_path: {
        project_id: projectId,
        user_email: EMAIL,
        file_path: path,
      },
    },
    update: { content },
    create: {
      project_id: projectId,
      user_email: EMAIL,
      file_path: path,
      content,
      is_directory: false,
    },
  });
}

const EMPTY_HTML = `<!DOCTYPE html>
<html>
<head><title>My Site</title></head>
<body>
  <h1>Hello</h1>
</body>
</html>`;

const COMPLETE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jane Doe — Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Jane Doe</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="about">
      <h2>About Me</h2>
      <p>I'm a front-end developer who likes building accessible interfaces.</p>
    </section>

    <section id="projects">
      <h2>Projects</h2>
      <article>
        <h3>Recipe Tracker</h3>
        <p>A small app for saving and tagging recipes.</p>
      </article>
      <article>
        <h3>Weather Dashboard</h3>
        <p>Displays a seven-day forecast from a public API.</p>
      </article>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>

        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>

        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" required></textarea>

        <button type="submit">Send</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Jane Doe</p>
  </footer>
</body>
</html>`;

async function main() {
  const project = await prisma.projects.findFirst({
    where: { name: "Personal Portfolio Website" },
    include: {
      learningPhases: {
        orderBy: { phase_number: "asc" },
        include: { knowledgeChecks: true },
      },
    },
  });
  if (!project) throw new Error("Portfolio project not found");
  const phase1 = project.learningPhases.find((p) => p.phase_number === 1)!;

  console.log(`\nGrading against: "${project.name}" phase 1 — ${phase1.title}`);
  console.log(`Goal: ${JSON.stringify(phase1.goal)}\n`);

  await cleanup();
  await prisma.user.create({
    data: { uid: `phase0-grading-${Date.now()}`, email: EMAIL, skillLevel: "beginner" },
  });
  await prisma.userProjects.create({
    data: {
      project_id: project.id,
      user_email: EMAIL,
      status: "in_progress",
      current_phase: 0,
    },
  });
  // Clear the knowledge-check gate so grading is what's under test.
  for (const c of phase1.knowledgeChecks) {
    await knowledgeCheckRepo.upsertAttempt(c.id, EMAIL, project.id, "ok", true);
  }

  // ── A. Incomplete work should NOT pass ────────────────────────────────────
  console.log("A. Submitting work that clearly doesn't meet the goal");
  await setFile(project.id, "/index.html", EMPTY_HTML);
  await setFile(project.id, "/style.css", "");
  {
    const t0 = Date.now();
    const res = await phaseReviewService.submitPhaseReview(project.id, EMAIL, "/index.html");
    console.log(`  (graded in ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    check("verdict is not_met", res.verdict === "not_met", `got ${res.verdict}`);
    check("did not advance", res.advanced === false);
    check("gave feedback", res.feedback.length > 40, `${res.feedback.length} chars`);
    check(
      "feedback contains no code fence (no-ghostwriting rule)",
      !res.feedback.includes("```"),
    );
    check("verdict line stripped from feedback", !/VERDICT:/i.test(res.feedback));
    const e = await prisma.userProjects.findFirstOrThrow({ where: { user_email: EMAIL } });
    check("current_phase still 0", e.current_phase === 0, `got ${e.current_phase}`);
    console.log(`\n  --- grader said ---\n  ${res.feedback.replace(/\n/g, "\n  ").slice(0, 700)}\n`);
  }

  // ── B. Complete work should pass and advance ──────────────────────────────
  console.log("B. Submitting work that meets the goal");
  await setFile(project.id, "/index.html", COMPLETE_HTML);
  {
    const t0 = Date.now();
    const res = await phaseReviewService.submitPhaseReview(project.id, EMAIL, "/index.html");
    console.log(`  (graded in ${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    check("verdict is met", res.verdict === "met", `got ${res.verdict}`);
    check("advanced", res.advanced === true);
    check("reports new phase number", res.currentPhase === 1, `got ${res.currentPhase}`);
    check(
      "feedback contains no code fence (no-ghostwriting rule)",
      !res.feedback.includes("```"),
    );

    const e = await prisma.userProjects.findFirstOrThrow({ where: { user_email: EMAIL } });
    check("current_phase is 1 in the database", e.current_phase === 1);

    const reviews = await prisma.phaseReview.findMany({
      where: { user_project_id: e.id },
      orderBy: { created_at: "asc" },
    });
    check(
      "both submissions recorded (not_met then met)",
      reviews.length === 2 && reviews[0].verdict === "not_met" && reviews[1].verdict === "met",
      reviews.map((r) => r.verdict).join(","),
    );
    check("model recorded on the verdict", (reviews[1].model ?? "").length > 0, reviews[1].model);

    const snap = await prisma.phaseSnapshotFile.count({
      where: { user_email: EMAIL, phase_number: 1 },
    });
    check("phase 1 snapshot frozen", snap === 2, `${snap} files`);

    const prog = await prisma.userPhaseProgress.findMany({
      where: { user_project_id: e.id },
      orderBy: { phase_number: "asc" },
    });
    check(
      "phase 1 completed and phase 2 unlocked",
      prog.some((p) => p.phase_number === 1 && p.status === "completed") &&
        prog.some((p) => p.phase_number === 2 && p.status === "in_progress"),
      prog.map((p) => `${p.phase_number}:${p.status}`).join(" "),
    );
    console.log(`\n  --- grader said ---\n  ${res.feedback.replace(/\n/g, "\n  ").slice(0, 700)}\n`);
  }

  await cleanup();
  console.log(`${passed} passed, ${failed} failed\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("Test run failed:", e);
  await cleanup().catch(() => {});
  await prisma.$disconnect();
  process.exit(1);
});
