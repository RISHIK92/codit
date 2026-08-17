/**
 * Era progression — named milestones, no hidden score.
 *
 * The user should always be able to read exactly what the next era requires and
 * why they haven't reached it. Nothing here is a threshold on a blended number;
 * every gate is a conjunction of specific, countable achievements.
 *
 * The invariant that matters: **every era gate requires Understand movement.**
 * Not one of these can be reached by building faster. That is enforced by a
 * test, not by convention, because it is the single rule that stops this from
 * becoming a progress bar for output.
 *
 * NAMES: three come from the authored spec and are load-bearing — "Blank Page"
 * (first), "Builder" (the era at which public profiles unlock, referenced by
 * shareService.PROFILE_ERA_INDEX), and "The Long Approach" (last). The other six
 * are chosen to sit in the same register: quiet and concrete rather than
 * rank-like, because "Apprentice / Journeyman / Master" would frame this as a
 * ladder to climb, and the point is that it's a road you're still on.
 *
 * They remain the easiest thing in this file to change — the gates are the
 * engineering, the names are voice.
 */
import type { GrowthStats } from "./stats";

export interface EraRequirement {
  /** Human-readable, in the user's terms — this is shown verbatim. */
  label: string;
  met: (c: EraCounts) => boolean;
  /** Progress toward this requirement, for "2 of 3" style display. */
  progress: (c: EraCounts) => { have: number; need: number };
}

export interface EraCounts {
  phasesCompleted: number;
  projectsCompleted: number;
  checksCorrect: number;
  checkpointsPassed: number;
  criteriaRecovered: number;
  resourcesCompleted: number;
  sharedArtifacts: number;
  fogCount: number;
}

export interface Era {
  index: number;
  name: string;
  /** One line on what this era means. */
  blurb: string;
  requirements: EraRequirement[];
}

const req = (
  label: string,
  need: number,
  get: (c: EraCounts) => number,
): EraRequirement => ({
  label,
  met: (c) => get(c) >= need,
  progress: (c) => ({ have: Math.min(get(c), need), need }),
});

/** Requirements that count as Understand movement. Used by the invariant test —
 * every era past the first must include at least one of these. */
export const UNDERSTAND_SOURCES = [
  "checksCorrect",
  "checkpointsPassed",
  "criteriaRecovered",
] as const;

export const ERAS: Era[] = [
  {
    index: 0,
    name: "Blank Page",
    blurb: "Nothing built yet. Everything still possible.",
    requirements: [],
  },
  {
    index: 1,
    name: "First Light",
    blurb: "Something of yours runs, and you know why it does.",
    requirements: [
      req("Complete a phase", 1, (c) => c.phasesCompleted),
      req("Answer a knowledge check correctly", 1, (c) => c.checksCorrect),
    ],
  },
  {
    index: 2,
    name: "Rough Draft",
    blurb: "You've explained your own work back, in your own words.",
    requirements: [
      req("Complete 3 phases", 3, (c) => c.phasesCompleted),
      req("Pass an explain-it-back checkpoint", 1, (c) => c.checkpointsPassed),
    ],
  },
  {
    index: 3,
    name: "Working Knowledge",
    blurb: "A finished project, and evidence you understood it.",
    requirements: [
      req("Finish a project", 1, (c) => c.projectsCompleted),
      req("Pass 2 checkpoints", 2, (c) => c.checkpointsPassed),
      req("Answer 10 knowledge checks correctly", 10, (c) => c.checksCorrect),
    ],
  },
  {
    index: 4,
    name: "Load Bearing",
    blurb:
      "You've been wrong, found out why, and fixed it — repeatedly. This is the era most people skip and shouldn't.",
    requirements: [
      // Recovery is the defining skill here: failing a check, understanding the
      // failure, and passing it. Nothing else in the system evidences that.
      req("Recover 5 failed review checks", 5, (c) => c.criteriaRecovered),
      req("Pass 3 checkpoints", 3, (c) => c.checkpointsPassed),
    ],
  },
  {
    index: 5,
    name: "Builder",
    blurb: "Two finished projects you can both run and explain.",
    requirements: [
      req("Finish 2 projects", 2, (c) => c.projectsCompleted),
      req("Pass 5 checkpoints", 5, (c) => c.checkpointsPassed),
      req("Recover 10 failed review checks", 10, (c) => c.criteriaRecovered),
    ],
  },
  {
    index: 6,
    name: "Clear Ground",
    blurb: "You've cleared the fog behind you — no phase left unexamined.",
    requirements: [
      req("Finish 3 projects", 3, (c) => c.projectsCompleted),
      req("Pass 10 checkpoints", 10, (c) => c.checkpointsPassed),
      // The only gate that requires the absence of something. You cannot reach
      // this era with shipped-but-unexplained work behind you.
      {
        label: "Leave no phase unexplained",
        met: (c) => c.fogCount === 0 && c.phasesCompleted > 0,
        progress: (c) => ({
          have: Math.max(0, c.phasesCompleted - c.fogCount),
          need: Math.max(1, c.phasesCompleted),
        }),
      },
    ],
  },
  {
    index: 7,
    name: "Steady Hand",
    blurb: "Depth, not just coverage.",
    requirements: [
      req("Finish 5 projects", 5, (c) => c.projectsCompleted),
      req("Pass 20 checkpoints", 20, (c) => c.checkpointsPassed),
      req("Recover 25 failed review checks", 25, (c) => c.criteriaRecovered),
    ],
  },
  {
    index: 8,
    name: "The Long Approach",
    blurb:
      "Still going. The work stopped being about finishing a while ago.",
    requirements: [
      req("Finish 8 projects", 8, (c) => c.projectsCompleted),
      req("Pass 40 checkpoints", 40, (c) => c.checkpointsPassed),
      req("Answer 100 knowledge checks correctly", 100, (c) => c.checksCorrect),
    ],
  },
];

export interface EraProgress {
  current: Era;
  next: Era | null;
  /** Requirements for the next era, with progress. Empty at the final era. */
  nextRequirements: {
    label: string;
    met: boolean;
    have: number;
    need: number;
  }[];
}

/**
 * The highest era whose requirements are all met, walking forward from the
 * start and stopping at the first unmet gate.
 *
 * Sequential rather than best-matching on purpose: eras are a path, and
 * skipping one because a later gate happens to be satisfiable would let someone
 * with lopsided stats appear further along than they are.
 */
export function resolveEra(counts: EraCounts): EraProgress {
  let current = ERAS[0];
  for (let i = 1; i < ERAS.length; i++) {
    const era = ERAS[i];
    if (era.requirements.every((r) => r.met(counts))) {
      current = era;
    } else {
      break;
    }
  }

  const next = ERAS[current.index + 1] ?? null;
  return {
    current,
    next,
    nextRequirements:
      next?.requirements.map((r) => {
        const p = r.progress(counts);
        return { label: r.label, met: r.met(counts), have: p.have, need: p.need };
      }) ?? [],
  };
}

/** Stats are reported alongside eras but never gate them — the gates are
 * countable achievements, and a stat is a summary of those, not a currency. */
export function summarise(stats: GrowthStats): string {
  return `Build ${stats.build} · Understand ${stats.understand} · Explore ${stats.explore} · Show ${stats.show}`;
}
