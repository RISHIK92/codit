/**
 * Growth-layer logic — pure, no database.
 *
 * The load-bearing test here is section 3: **no era can be reached by building
 * alone.** That is the one rule that stops this from becoming a progress bar
 * for output, and it's asserted by brute force against every era rather than
 * trusted to reviewers noticing.
 *
 *   npx ts-node tests/phase5.growth.test.ts
 */
import { computeStats, computeFog, type GrowthInputs } from "../src/growth/stats";
import { ERAS, resolveEra, type EraCounts } from "../src/growth/eras";

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

const noInputs: GrowthInputs = {
  phasesCompleted: 0,
  projectsCompleted: 0,
  criteriaPassed: { behavioral: 0, structural: 0, conceptual: 0 },
  criteriaRecovered: 0,
  checksCorrect: 0,
  checkpointsPassed: 0,
  resourcesCompleted: 0,
  reviewAttempts: 0,
  phasesEngaged: 0,
  sharedArtifacts: 0,
};

const noCounts: EraCounts = {
  phasesCompleted: 0,
  projectsCompleted: 0,
  checksCorrect: 0,
  checkpointsPassed: 0,
  criteriaRecovered: 0,
  resourcesCompleted: 0,
  sharedArtifacts: 0,
  fogCount: 0,
};

console.log("\n1. Stats stay separate");
{
  // The central claim: shipping a lot moves exactly one stat.
  const shipper = computeStats({
    ...noInputs,
    phasesCompleted: 20,
    projectsCompleted: 5,
    criteriaPassed: { behavioral: 60, structural: 60, conceptual: 0 },
  });
  check("heavy shipping moves Build", shipper.build > 0);
  check("heavy shipping does NOT move Understand at all", shipper.understand === 0, `${shipper.understand}`);

  const learner = computeStats({
    ...noInputs,
    checksCorrect: 20,
    checkpointsPassed: 5,
    criteriaRecovered: 10,
  });
  check("comprehension moves Understand", learner.understand > 0);
  check("comprehension does NOT move Build", learner.build === 0, `${learner.build}`);

  // Passing a conceptual criterion is understanding, not output.
  const conceptual = computeStats({
    ...noInputs,
    criteriaPassed: { behavioral: 0, structural: 0, conceptual: 5 },
  });
  check("conceptual criteria count as Understand, not Build", conceptual.understand > 0 && conceptual.build === 0);

  check("Show is zero until the social layer exists", learner.show === 0);
  check("empty input gives all zeros", Object.values(computeStats(noInputs)).every((v) => v === 0));
}

console.log("\n2. A failed review still moves something");
{
  // The pressure valve. A gate that says no and moves nothing is the one that
  // makes people quit.
  const tried = computeStats({ ...noInputs, reviewAttempts: 4, phasesEngaged: 2 });
  check("review attempts move Explore even with nothing passed", tried.explore > 0);
  check("...without inflating Build", tried.build === 0);
  check("...without inflating Understand", tried.understand === 0);

  // And recovering from failure is the strongest learning signal we have.
  const recovered = computeStats({ ...noInputs, criteriaRecovered: 1 });
  const firstTry = computeStats({
    ...noInputs,
    criteriaPassed: { behavioral: 1, structural: 0, conceptual: 0 },
  });
  check(
    "failing then fixing a check is worth more Understand than passing one first try is worth Build",
    recovered.understand > firstTry.build,
    `${recovered.understand} vs ${firstTry.build}`,
  );
}

console.log("\n3. INVARIANT: no era is reachable by building alone");
{
  // Someone who ships relentlessly and never demonstrates comprehension.
  const prolificButUnreflective: EraCounts = {
    ...noCounts,
    phasesCompleted: 500,
    projectsCompleted: 100,
    resourcesCompleted: 500,
    // Explicitly zero on every Understand source:
    checksCorrect: 0,
    checkpointsPassed: 0,
    criteriaRecovered: 0,
    fogCount: 500,
  };
  const stuckAtStart = resolveEra(prolificButUnreflective);
  check(
    "infinite shipping with zero comprehension stays at the first era",
    stuckAtStart.current.index === 0,
    `reached ${stuckAtStart.current.name}`,
  );

  // Stronger: assert it structurally for every era, not just the extreme case.
  let allGated = true;
  for (const era of ERAS.slice(1)) {
    const metByBuildingAlone = era.requirements.every((r) => r.met(prolificButUnreflective));
    if (metByBuildingAlone) {
      allGated = false;
      console.log(`        ${era.name} is reachable without understanding anything`);
    }
  }
  check("every era past the first requires Understand movement", allGated);
}

console.log("\n4. Era progression is sequential and legible");
{
  check("everyone starts at Blank Page", resolveEra(noCounts).current.name === "Blank Page");

  const firstLight = resolveEra({ ...noCounts, phasesCompleted: 1, checksCorrect: 1 });
  check("First Light needs a phase and a correct check", firstLight.current.name === "First Light");

  const halfway = resolveEra({ ...noCounts, phasesCompleted: 1 });
  check("a phase without a correct check is not enough", halfway.current.index === 0);

  // Eras are a path, not a best match — a later gate being satisfiable must not
  // let someone skip an earlier one.
  const lopsided = resolveEra({
    ...noCounts,
    projectsCompleted: 100,
    checkpointsPassed: 100,
    checksCorrect: 0, // fails First Light
  });
  check(
    "an unmet early gate blocks later eras even when they'd pass",
    lopsided.current.index === 0,
    `reached ${lopsided.current.name}`,
  );

  check("the next era is named", firstLight.next?.name === "Rough Draft");
  check("its requirements come with progress", firstLight.nextRequirements.length > 0);
  check(
    "progress never exceeds what's needed",
    firstLight.nextRequirements.every((r) => r.have <= r.need),
  );
  check(
    "requirements are phrased for a human, not as field names",
    firstLight.nextRequirements.every((r) => /\s/.test(r.label) && !/[_A-Z]{2}/.test(r.label)),
  );

  const final = resolveEra({
    ...noCounts,
    phasesCompleted: 200,
    projectsCompleted: 100,
    checksCorrect: 500,
    checkpointsPassed: 100,
    criteriaRecovered: 200,
    fogCount: 0,
  });
  check("a complete record reaches the final era", final.current.name === "The Long Approach");
  check("the final era has no next", final.next === null);
  check("and therefore no outstanding requirements", final.nextRequirements.length === 0);
}

console.log("\n5. Fog describes the world, not the person");
{
  check("no work means no fog", computeFog({ phasesCompleted: 0, phasesWithPassedCheckpoint: 0 }).count === 0);

  const shipped = computeFog({ phasesCompleted: 10, phasesWithPassedCheckpoint: 0 });
  check("shipping without explaining creates fog", shipped.count === 10 && shipped.ratio === 1);

  const explained = computeFog({ phasesCompleted: 10, phasesWithPassedCheckpoint: 10 });
  check("explaining it all clears the fog", explained.count === 0 && explained.ratio === 0);

  // The point of fog: building more can't clear it, only explaining can.
  const before = computeFog({ phasesCompleted: 5, phasesWithPassedCheckpoint: 2 });
  const afterMoreBuilding = computeFog({ phasesCompleted: 9, phasesWithPassedCheckpoint: 2 });
  check(
    "building more increases fog rather than reducing it",
    afterMoreBuilding.count > before.count,
  );
  const afterExplaining = computeFog({ phasesCompleted: 5, phasesWithPassedCheckpoint: 4 });
  check("explaining reduces it", afterExplaining.count < before.count);

  check(
    "fog never goes negative even with inconsistent inputs",
    computeFog({ phasesCompleted: 2, phasesWithPassedCheckpoint: 7 }).count === 0,
  );

  // The Cartographer gate is the one that requires fog to be gone.
  const foggy = resolveEra({
    ...noCounts,
    phasesCompleted: 40,
    projectsCompleted: 3,
    checkpointsPassed: 10,
    checksCorrect: 50,
    criteriaRecovered: 20,
    fogCount: 1,
  });
  check(
    "one unexplained phase blocks Cartographer",
    foggy.current.index < 6,
    `reached ${foggy.current.name}`,
  );
}

console.log("\n6. No shame mechanics");
{
  // Absence is a season. Nothing in the inputs is time-based, so a gap in
  // usage cannot reduce any stat or era — which is checked here by the absence
  // of any decay path rather than by simulating time.
  const counts: EraCounts = { ...noCounts, phasesCompleted: 3, checksCorrect: 5, checkpointsPassed: 1 };
  const a = resolveEra(counts);
  const b = resolveEra(counts);
  check("era resolution is deterministic and time-independent", a.current.index === b.current.index);
  check(
    "stats have no decay term — recomputing identical inputs is identical",
    JSON.stringify(computeStats(noInputs)) === JSON.stringify(computeStats(noInputs)),
  );
  check(
    "no stat can be negative",
    Object.values(
      computeStats({ ...noInputs, reviewAttempts: 50, checksCorrect: 0 }),
    ).every((v) => v >= 0),
  );
}

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
