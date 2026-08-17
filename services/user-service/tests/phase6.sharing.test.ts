/**
 * Publishing rules and the public-read privacy boundary.
 *
 * Two things matter here. First that you cannot publish a phase you haven't
 * explained back — that rule is what makes a shared artifact evidence rather
 * than a badge. Second that the unauthenticated read leaks nothing beyond what
 * was opted into; it's the only endpoint in the system a stranger can call.
 *
 *   npx ts-node tests/phase6.sharing.test.ts
 */
import { prisma } from "../src/db/prismaClient";
import * as shareService from "../src/services/shareService";
import * as growthRepo from "../src/repositories/growthRepo";
import { computeStats } from "../src/growth/stats";

const EMAIL = "phase6-share@codit.invalid";
const OTHER = "phase6-other@codit.invalid";

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`); }
}

async function cleanup() {
  for (const email of [EMAIL, OTHER]) {
    const ups = await prisma.userProjects.findMany({ where: { user_email: email }, select: { id: true } });
    const ids = ups.map((u) => u.id);
    const reviews = await prisma.phaseReview.findMany({ where: { user_project_id: { in: ids } }, select: { id: true } });
    await prisma.reviewCriterionResult.deleteMany({ where: { review_id: { in: reviews.map((r) => r.id) } } });
    await prisma.phaseReview.deleteMany({ where: { user_project_id: { in: ids } } });
    await prisma.sharedArtifact.deleteMany({ where: { user_email: email } });
    await prisma.understandingCheckpoint.deleteMany({ where: { user_email: email } });
    await prisma.userPhaseProgress.deleteMany({ where: { user_project_id: { in: ids } } });
    await prisma.phaseSnapshotFile.deleteMany({ where: { user_email: email } });
    await prisma.projectFile.deleteMany({ where: { user_email: email } });
    await prisma.knowledgeCheckAttempt.deleteMany({ where: { user_email: email } });
    await prisma.userProjects.deleteMany({ where: { user_email: email } });
    await prisma.user.deleteMany({ where: { email } });
  }
}

async function main() {
  const project = await prisma.projects.findFirstOrThrow({
    where: { name: "Personal Portfolio Website" },
    include: { learningPhases: { orderBy: { phase_number: "asc" }, include: { criteria: true } } },
  });
  const phase1 = project.learningPhases.find((p) => p.phase_number === 1)!;

  await cleanup();
  await prisma.user.create({ data: { uid: `p6-${Date.now()}`, email: EMAIL, name: "Jane Doe" } });
  await prisma.user.create({ data: { uid: `p6b-${Date.now()}`, email: OTHER, name: "Someone Else" } });
  const up = await prisma.userProjects.create({
    data: { project_id: project.id, user_email: EMAIL, status: "in_progress", current_phase: 1 },
  });
  await prisma.userPhaseProgress.create({
    data: { user_project_id: up.id, phase_number: 1, status: "completed", completed_at: new Date() },
  });
  const blob = await prisma.blob.upsert({
    where: { hash: "p6testhash" },
    update: {},
    create: { hash: "p6testhash", content: "<h1>hello</h1>", size: 14 },
  });
  await prisma.phaseSnapshotFile.create({
    data: {
      project_id: project.id, user_email: EMAIL, phase_number: 1,
      file_path: "index.html", blob_hash: blob.hash, is_directory: false,
    },
  });
  const review = await prisma.phaseReview.create({
    data: { user_project_id: up.id, phase_number: 1, verdict: "met", feedback: "", model: "t" },
  });
  await prisma.reviewCriterionResult.create({
    data: {
      review_id: review.id, criterion_id: phase1.criteria[0].id, passed: true,
      decided_by: "model", evidence_path: "index.html", evidence_lines: "1",
    },
  });

  console.log("\n1. Publishing requires having explained it back");
  {
    let threw = "";
    try {
      await shareService.shareArtifact(EMAIL, project.id, 1, true);
    } catch (e: any) { threw = e.message; }
    check("a completed-but-unexplained phase cannot be published", threw.length > 0);
    check("and the reason says why", /explain/i.test(threw), threw);

    let threw2 = false;
    try { await shareService.shareArtifact(EMAIL, project.id, 3, true); } catch { threw2 = true; }
    check("an incomplete phase cannot be published", threw2);

    const list = await shareService.listMyArtifacts(EMAIL);
    check("nothing shows as ready to publish yet", list.shareable.length === 0);
  }

  console.log("\n2. Once explained, it can be published");
  let slug = "";
  {
    await prisma.understandingCheckpoint.create({
      data: {
        user_email: EMAIL, project_id: project.id, phase_number: 1,
        question: "Why does your nav jump to the right section?",
        answer: "Because each href points at the id of a section on the same page.",
        passed: true,
      },
    });

    const list = await shareService.listMyArtifacts(EMAIL);
    check("it now shows as ready to publish", list.shareable.length === 1);
    check("profile is still locked below the Builder era", !list.profileUnlocked);
    check("and says so plainly", /unlock/i.test(list.profileLockedReason));

    const r = await shareService.shareArtifact(EMAIL, project.id, 1, true);
    slug = r.slug;
    check("publishing returns a slug", slug.length >= 10);
    check("the slug is not the row id or otherwise enumerable", !/^\d+$/.test(slug));

    const again = await shareService.shareArtifact(EMAIL, project.id, 1, true);
    check("publishing twice is idempotent", again.slug === slug);

    const after = await shareService.listMyArtifacts(EMAIL);
    check("it moves from shareable to shared", after.shared.length === 1 && after.shareable.length === 0);
  }

  console.log("\n3. Show only moves on publishing");
  {
    const inputs = await growthRepo.getGrowthInputs(EMAIL);
    check("Show counts the live share", computeStats(inputs).show > 0);
  }

  console.log("\n4. The public read — what a stranger sees");
  {
    const pub: any = await shareService.getPublicArtifact(slug);
    check("found", pub.found && !pub.revoked);
    check("shows the author's display name", pub.authorName === "Jane Doe");
    check("shows the explanation", pub.explanationAnswer.includes("same page"));
    check("shows the verified criteria", pub.criteria.length === 1);
    check("including where each was verified", pub.criteria[0].evidencePath === "index.html");
    check("includes the frozen code when opted in", pub.files.length === 1);

    // The privacy boundary. This endpoint takes no auth, so anything reachable
    // from it is public by definition.
    const serialised = JSON.stringify(pub);
    check("never leaks the author's email", !serialised.includes(EMAIL));
    check("never leaks any email at all", !/@codit\.invalid/.test(serialised));
    check("never leaks the internal project id", !serialised.includes(project.id));
    check("never leaks user or enrollment ids", !serialised.includes(up.id));

    const missing: any = await shareService.getPublicArtifact("definitely-not-a-real-slug");
    check("an unknown slug is simply not found", !missing.found);
  }

  console.log("\n5. Withdrawing");
  {
    let denied = false;
    try { await shareService.revokeArtifact(OTHER, slug); } catch { denied = true; }
    check("someone else cannot withdraw your artifact", denied);

    const stillUp: any = await shareService.getPublicArtifact(slug);
    check("...and it stays published", stillUp.found && !stillUp.revoked);

    await shareService.revokeArtifact(EMAIL, slug);
    const gone: any = await shareService.getPublicArtifact(slug);
    check("the author can withdraw it", gone.found && gone.revoked);
    check("a withdrawn artifact exposes no content", !gone.explanationAnswer && !gone.files);

    const inputs = await growthRepo.getGrowthInputs(EMAIL);
    check("Show falls back when withdrawn", computeStats(inputs).show === 0);

    // A link the author killed must stay dead.
    const republished = await shareService.shareArtifact(EMAIL, project.id, 1, true);
    check("re-publishing issues a NEW slug", republished.slug !== slug, republished.slug);
    const oldLink: any = await shareService.getPublicArtifact(slug);
    check("the withdrawn link does not come back to life", !oldLink.found || oldLink.revoked);
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
