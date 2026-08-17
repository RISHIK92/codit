/**
 * Live tier behaviour — the three tiers must actually differ, not just be
 * labelled differently.
 *
 * The claim being tested is that tier 3 knows the project's shape before it
 * starts. The question asked is one that CANNOT be answered from the active
 * file alone: "which files break if I change this function's signature". That
 * needs reverse dependencies, which is exactly what the import graph supplies
 * and what the old list-files-and-guess approach had to stumble into.
 *
 * Requires: database, user-service (50051), ai-service (50053).
 *
 *   npx ts-node tests/phase3.tiers.test.ts
 */
import { Metadata } from "@grpc/grpc-js";
import { prisma } from "../src/db/prismaClient";
import { aiClient } from "../src/grpc-clients/aiClient";

const EMAIL = "phase3-tiers@codit.invalid";

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

const FILES: Record<string, string> = {
  "src/index.js": `import { addItem, total } from "./cart";

const cart = [];
addItem(cart, { name: "Book", price: 12 });
console.log(total(cart));
`,
  "src/cart.js": `import { currency } from "./format";

export function addItem(cart, item) {
  cart.push(item);
  return cart;
}

export function total(cart) {
  return currency(cart.reduce((sum, i) => sum + i.price, 0));
}
`,
  "src/format.js": `export function currency(n) {
  return "$" + n.toFixed(2);
}
`,
};

function chat(params: {
  mode: string;
  message: string;
  activeFilePath: string;
  projectId: string;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = aiClient.chat(
      {
        userEmail: EMAIL,
        projectId: params.projectId,
        phaseId: "",
        activeFilePath: params.activeFilePath,
        message: params.message,
        history: [],
        mode: params.mode,
        currentTask: "Project: Cart demo — Phase 1: Modules",
        snapshotPhaseNumber: 0,
      },
      new Metadata(),
      { deadline: new Date(Date.now() + 120_000) },
    );
    let full = "";
    stream.on("data", (r: { reply?: string }) => (full += r.reply ?? ""));
    stream.on("error", reject);
    stream.on("end", () => resolve(full));
  });
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
  await prisma.projectFile.deleteMany({ where: { user_email: EMAIL } });
  await prisma.userProjects.deleteMany({ where: { user_email: EMAIL } });
  await prisma.user.deleteMany({ where: { email: EMAIL } });
}

const hasFence = (s: string) => s.includes("```");

async function main() {
  const project = await prisma.projects.findFirstOrThrow({
    where: { name: "To-Do List App" },
  });

  await cleanup();
  await prisma.user.create({
    data: { uid: `phase3-${Date.now()}`, email: EMAIL, skillLevel: "beginner" },
  });
  await prisma.userProjects.create({
    data: { project_id: project.id, user_email: EMAIL, status: "in_progress", current_phase: 0 },
  });
  for (const [file_path, content] of Object.entries(FILES)) {
    await prisma.projectFile.create({
      data: { project_id: project.id, user_email: EMAIL, file_path, content, is_directory: false },
    });
  }

  // ── Tier 1: explain ───────────────────────────────────────────────────────
  console.log("\n1. explain — cheap, single shot, scoped to the snippet");
  {
    const t0 = Date.now();
    const reply = await chat({
      mode: "explain",
      message: 'Explain what "reduce" does in this line: cart.reduce((sum, i) => sum + i.price, 0)',
      activeFilePath: "src/cart.js",
      projectId: project.id,
    });
    const ms = Date.now() - t0;
    console.log(`     (${(ms / 1000).toFixed(1)}s)`);
    check("answers", reply.trim().length > 20, `${reply.length} chars`);
    check("explains the concept asked about", /reduce|accumulat|sum/i.test(reply));
    check("stays brief", reply.length < 1200, `${reply.length} chars`);
  }

  // ── Tier 2: suggest ───────────────────────────────────────────────────────
  console.log("\n2. suggest — unprompted nudge, may decline");
  {
    const t0 = Date.now();
    const reply = await chat({
      mode: "suggest",
      message: "",
      activeFilePath: "src/cart.js",
      projectId: project.id,
    });
    console.log(`     (${((Date.now() - t0) / 1000).toFixed(1)}s) ${reply ? `"${reply.slice(0, 140)}"` : "(declined — empty)"}`);
    check("returns a short nudge or declines outright", reply === "" || reply.length < 700, `${reply.length} chars`);
    check("never writes code", !hasFence(reply));
    // The sentinel is an internal protocol token; leaking it to the UI would
    // show the user a magic string instead of nothing.
    check("never leaks the NO_SUGGESTION sentinel", !reply.includes("NO_SUGGESTION"));
  }

  // ── Tier 3: chat, with the project map ────────────────────────────────────
  console.log("\n3. chat — needs the project's shape, not just the active file");
  {
    const t0 = Date.now();
    const reply = await chat({
      mode: "chat",
      message:
        "If I change the signature of addItem, which other files in this project would I have to update?",
      activeFilePath: "src/cart.js",
      projectId: project.id,
    });
    console.log(`     (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    console.log(`     "${reply.slice(0, 400).replace(/\n/g, " ")}"`);

    // The correct answer requires knowing what imports cart.js. index.js is
    // the only caller; format.js is a dependency of cart, not a dependent.
    check("identifies the reverse dependency (src/index.js)", /index\.js/.test(reply));
    check("does not claim format.js needs updating", !/format\.js.*(update|change|modif)/i.test(reply));
    check("never writes code", !hasFence(reply));
    check("gives a real answer rather than narrating a plan", !/^(i'll|let me|first,? i|to answer)/i.test(reply.trim()));
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
