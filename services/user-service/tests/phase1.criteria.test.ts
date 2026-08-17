/**
 * Phase 1 checks — the rubric primitive.
 *
 * Verifies the authored criteria are in the database, are well-formed, and
 * actually reach the client through the same repository call the API serves
 * (including that grading internals do NOT reach it).
 *
 *   npx ts-node tests/phase1.criteria.test.ts
 */
import { prisma } from "../src/db/prismaClient";
import * as projectRepo from "../src/repositories/projectRepo";
import { PHASE_CRITERIA } from "../../shared/prisma/criteria";

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

async function main() {
  // ── 1. Coverage ───────────────────────────────────────────────────────────
  console.log("\n1. Coverage");
  {
    const phases = await prisma.learningPhase.findMany({
      include: { criteria: true, project: { select: { name: true } } },
    });
    const bare = phases.filter((p) => p.criteria.length === 0);
    check(
      "every phase has at least one criterion",
      bare.length === 0,
      bare.map((p) => `${p.project.name} P${p.phase_number}`).join(", "),
    );
    const thin = phases.filter((p) => p.criteria.length < 3);
    check(
      "every phase has at least 3 criteria",
      thin.length === 0,
      thin.map((p) => `${p.project.name} P${p.phase_number}=${p.criteria.length}`).join(", "),
    );
    const fat = phases.filter((p) => p.criteria.length > 6);
    check(
      "no phase has more than 6 criteria (a checklist you can hold in your head)",
      fat.length === 0,
      fat.map((p) => `${p.project.name} P${p.phase_number}=${p.criteria.length}`).join(", "),
    );
  }

  // ── 2. Well-formedness ────────────────────────────────────────────────────
  console.log("\n2. Well-formedness");
  {
    const all = await prisma.phaseCriterion.findMany();
    check("orders are contiguous from 1 within each phase", await ordersContiguous());
    check(
      "no criterion text is vague filler",
      all.every((c) => c.text.trim().length > 15),
      all.filter((c) => c.text.trim().length <= 15).map((c) => c.text).join(" | "),
    );
    check(
      "every deterministic criterion carries a check_config",
      all.filter((c) => c.check_type === "deterministic").every((c) => c.check_config != null),
    );
    check(
      "no model_judged criterion carries a check_config",
      all.filter((c) => c.check_type === "model_judged").every((c) => c.check_config == null),
    );
    check(
      "no conceptual criteria authored yet (nothing can grade them)",
      all.every((c) => c.kind !== "conceptual"),
    );
    const noHint = all.filter((c) => !c.hint || c.hint.trim() === "");
    check(
      "at least 80% of criteria have a failure hint",
      (all.length - noHint.length) / all.length >= 0.8,
      `${noHint.length} of ${all.length} without hints`,
    );
    // The whole product rests on not handing over the answer; a hint that
    // contains code is the same violation as the assistant writing it.
    const codey = all.filter((c) => /```|<link |<script |function\s*\(|=>/.test(c.hint ?? ""));
    check("no hint contains code", codey.length === 0, codey.map((c) => c.hint).join(" | "));
  }

  // ── 3. Deterministic configs are well-shaped ──────────────────────────────
  console.log("\n3. Deterministic check configs");
  {
    const det = await prisma.phaseCriterion.findMany({ where: { check_type: "deterministic" } });
    const KNOWN = ["file_exists", "file_matches", "file_lacks", "html_element"];
    check(
      "every config uses a known check kind",
      det.every((c) => KNOWN.includes((c.check_config as any)?.check)),
      det.map((c) => (c.check_config as any)?.check).filter((k) => !KNOWN.includes(k)).join(", "),
    );
    check(
      "every config names a path without a leading slash",
      det.every((c) => {
        const p = (c.check_config as any)?.path;
        return typeof p === "string" && p.length > 0 && !p.startsWith("/");
      }),
    );
    // A pattern that doesn't compile would throw inside the Phase 2 checker.
    let allCompile = true;
    for (const c of det) {
      const cfg = c.check_config as any;
      if (cfg?.pattern) {
        try {
          new RegExp(cfg.pattern, cfg.flags ?? "m");
        } catch {
          allCompile = false;
          console.log(`        bad pattern: ${cfg.pattern}`);
        }
      }
    }
    check("every regex pattern compiles", allCompile);
  }

  // ── 4. Criteria reach the client, internals don't ─────────────────────────
  console.log("\n4. API shape (via the repository the handler calls)");
  {
    const project = await prisma.projects.findFirstOrThrow({
      where: { name: "Personal Portfolio Website" },
    });
    const served: any = await projectRepo.getCatalogueProjectById(project.id);
    const phase1 = served.learningPhases.find((p: any) => p.phase_number === 1);

    check("phases carry criteria", (phase1.criteria?.length ?? 0) > 0);
    check(
      "criteria arrive ordered",
      phase1.criteria.every((c: any, i: number) => i === 0 || c.order >= phase1.criteria[i - 1].order),
    );
    check(
      "criteria expose id, order, text, kind, hint",
      phase1.criteria.every(
        (c: any) =>
          c.id && typeof c.order === "number" && c.text && c.kind && c.hint !== undefined,
      ),
    );
    // The client knowing the exact pattern being matched is a client that can be
    // written to satisfy the pattern instead of the intent.
    check(
      "check_config is NOT exposed to the client",
      phase1.criteria.every((c: any) => c.check_config === undefined),
    );
    check(
      "check_type is NOT exposed to the client",
      phase1.criteria.every((c: any) => c.check_type === undefined),
    );
  }

  // ── 5. Source module matches the database ─────────────────────────────────
  console.log("\n5. criteria.ts is the source of truth");
  {
    const authored = Object.values(PHASE_CRITERIA).reduce(
      (n, byPhase) => n + Object.values(byPhase).reduce((m, cs) => m + cs.length, 0),
      0,
    );
    const stored = await prisma.phaseCriterion.count();
    check(
      "database row count matches the authored count",
      authored === stored,
      `authored=${authored} stored=${stored}`,
    );
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  await prisma.$disconnect();
  process.exit(failed === 0 ? 0 : 1);
}

async function ordersContiguous(): Promise<boolean> {
  const phases = await prisma.learningPhase.findMany({
    include: { criteria: { orderBy: { order: "asc" } } },
  });
  return phases.every((p) =>
    p.criteria.length === 0
      ? true
      : p.criteria.every((c, i) => c.order === i + 1),
  );
}

main().catch(async (e) => {
  console.error("Test run failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});
