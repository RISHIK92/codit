/**
 * CLI wrapper for the phase-rubric backfill.
 *
 * The rubric itself and the code that applies it live in services/shared/prisma
 * (criteria.ts and apply-criteria.ts) alongside the rest of the catalogue
 * content. Only the entry point lives here, because this package is the one
 * with the ts-node toolchain and Node type definitions.
 *
 *   npm run db:criteria
 */
import { prisma } from "../src/db/prismaClient";
import { applyCriteria } from "../../shared/prisma/apply-criteria";

applyCriteria(prisma)
  .catch((e) => {
    console.error("Backfill failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
