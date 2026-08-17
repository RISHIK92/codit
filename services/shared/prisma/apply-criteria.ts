/**
 * Loads the authored rubric in criteria.ts into the database.
 *
 * Idempotent: criteria are replaced per phase, so this can be re-run after
 * editing criteria.ts without producing duplicates. Existing seeded projects
 * predate PhaseCriterion, so this is how they get their rubric — seed.ts
 * imports the same module, meaning a fresh seed and a backfill produce
 * identical results.
 *
 * Invoked by seed.ts and by the `db:criteria` script in user-service. The CLI
 * wrapper lives there rather than here because this package has no Node types.
 */
import { PrismaClient } from "../src/generated/prisma-client";
import { PHASE_CRITERIA } from "./criteria";

const prisma = new PrismaClient();

/**
 * Applies the authored rubric to whatever projects exist. Exported so seed.ts
 * calls the same code path — a fresh seed and a backfill producing different
 * rubrics is exactly the drift this avoids.
 */
export async function applyCriteria(db: PrismaClient = prisma) {
  let written = 0;
  let phasesCovered = 0;
  const missing: string[] = [];

  for (const [projectName, byPhase] of Object.entries(PHASE_CRITERIA)) {
    const project = await db.projects.findFirst({
      where: { name: projectName },
      include: { learningPhases: { orderBy: { phase_number: "asc" } } },
    });
    if (!project) {
      missing.push(`project not found: ${projectName}`);
      continue;
    }

    for (const phase of project.learningPhases) {
      const criteria = byPhase[phase.phase_number];
      if (!criteria?.length) {
        missing.push(`${projectName} P${phase.phase_number} (${phase.title})`);
        continue;
      }

      // Replace rather than upsert — criteria.ts is the source of truth, and a
      // criterion removed there should disappear here too.
      await db.$transaction([
        db.phaseCriterion.deleteMany({ where: { phase_id: phase.id } }),
        db.phaseCriterion.createMany({
          data: criteria.map((c) => ({
            phase_id: phase.id,
            order: c.order,
            text: c.text,
            kind: c.kind,
            check_type: c.check_type,
            check_config: (c.check_config ?? undefined) as any,
            hint: c.hint ?? "",
          })),
        }),
      ]);

      written += criteria.length;
      phasesCovered++;
    }
  }

  const totalPhases = await db.learningPhase.count();
  const det = await db.phaseCriterion.count({ where: { check_type: "deterministic" } });

  console.log(`\nWrote ${written} criteria across ${phasesCovered}/${totalPhases} phases.`);
  console.log(`  deterministic: ${det}   model-judged: ${written - det}`);
  if (missing.length) {
    console.log(`\nPhases still without criteria (${missing.length}):`);
    for (const m of missing) console.log(`  - ${m}`);
  } else {
    console.log("\nEvery phase has a rubric.");
  }
}
