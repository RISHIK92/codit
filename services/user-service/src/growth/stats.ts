/**
 * The four growth stats — Build, Understand, Explore, Show.
 *
 * One rule governs everything here: **these are never blended into a single
 * number.** A combined score would let output substitute for comprehension,
 * which is precisely the substitution this product exists to prevent. Someone
 * who prompted their way to six finished projects should look obviously
 * different from someone who finished two and understands them, and no single
 * bar can show that.
 *
 * Each stat counts things that actually happened. There is no hidden formula,
 * no decay, no streak — every number here can be traced to specific rows, and
 * the UI is expected to show what they were.
 *
 * Pure and input-only so the definitions can be tested directly. Nothing in
 * here queries anything.
 */

export interface GrowthInputs {
  /** Phases the user has completed, across all enrollments. */
  phasesCompleted: number;
  /** Projects finished end to end. */
  projectsCompleted: number;
  /** Distinct criteria passed, by kind. */
  criteriaPassed: { behavioral: number; structural: number; conceptual: number };
  /**
   * Criteria the user failed on one submission and passed on a later one.
   *
   * The most honest evidence of learning in the whole system: not "got it
   * right", but "got it wrong, found out why, and fixed it". Counted toward
   * Understand rather than Build for exactly that reason.
   */
  criteriaRecovered: number;
  /** Knowledge checks answered correctly (distinct checks, not attempts). */
  checksCorrect: number;
  /** Explain-it-back checkpoints passed. */
  checkpointsPassed: number;
  /** Learning resources marked complete. */
  resourcesCompleted: number;
  /**
   * Review submissions made. Counts toward Explore, not Build — submitting is
   * an act of investigation, and it must move *something* even when it fails.
   * A gate that says no and moves nothing is the one that makes people quit.
   */
  reviewAttempts: number;
  /** Distinct phases the user has opened resources or checks against. */
  phasesEngaged: number;
  /** Publicly shared artifacts. Phase 6; zero until then. */
  sharedArtifacts: number;
}

export interface GrowthStats {
  build: number;
  understand: number;
  explore: number;
  show: number;
}

/** Per-stat weights. Deliberately small integers rather than tuned constants —
 * these are counts of real events, and inventing precision would imply the
 * numbers mean more than they do. */
export const WEIGHTS = {
  build: { phase: 10, project: 40, behavioral: 3, structural: 3 },
  understand: { check: 5, checkpoint: 25, recovered: 8, conceptual: 6 },
  explore: { resource: 4, reviewAttempt: 2, phaseEngaged: 3 },
  show: { artifact: 20 },
} as const;

export function computeStats(input: GrowthInputs): GrowthStats {
  const w = WEIGHTS;

  // Build — what exists because of you. Output only. Note that passing a
  // conceptual criterion contributes nothing here: understanding something is
  // not the same as having built it.
  const build =
    input.phasesCompleted * w.build.phase +
    input.projectsCompleted * w.build.project +
    input.criteriaPassed.behavioral * w.build.behavioral +
    input.criteriaPassed.structural * w.build.structural;

  // Understand — what you can demonstrate you know. Nothing here can be earned
  // by shipping. Checkpoints are weighted highest because they're the only
  // signal that can't be pattern-matched.
  const understand =
    input.checksCorrect * w.understand.check +
    input.checkpointsPassed * w.understand.checkpoint +
    input.criteriaRecovered * w.understand.recovered +
    input.criteriaPassed.conceptual * w.understand.conceptual;

  // Explore — how far you've looked around. This is where a failed review
  // lands, so effort registers even when it doesn't yet succeed.
  const explore =
    input.resourcesCompleted * w.explore.resource +
    input.reviewAttempts * w.explore.reviewAttempt +
    input.phasesEngaged * w.explore.phaseEngaged;

  const show = input.sharedArtifacts * w.show.artifact;

  return { build, understand, explore, show };
}

/**
 * Fog — work shipped but never explained back.
 *
 * Deliberately a property of the world, not of the person: it describes which
 * *phases* remain unexamined, never "how confused you are". It clears only by
 * passing a checkpoint, and it cannot be cleared by building more, which is the
 * point. Shipping faster should visibly increase it.
 */
export function computeFog(input: {
  phasesCompleted: number;
  phasesWithPassedCheckpoint: number;
}): { count: number; ratio: number } {
  const count = Math.max(0, input.phasesCompleted - input.phasesWithPassedCheckpoint);
  const ratio = input.phasesCompleted === 0 ? 0 : count / input.phasesCompleted;
  return { count, ratio };
}
