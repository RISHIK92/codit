/**
 * growthApi.ts
 *
 * ─── Authenticated endpoints ────────────────────────────────────────────────
 *   GET  /api/growth              → GrowthDTO
 *   POST /api/checkpoints/start   → { checkpoint_id, question }
 *   POST /api/checkpoints/submit  → { passed, feedback, missing_concepts }
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

export interface EraRequirementDTO {
  label: string;
  met: boolean;
  have: number;
  need: number;
}

export interface UnexplainedPhaseDTO {
  project_id: string;
  project_name: string;
  phase_number: number;
}

/**
 * The four stats arrive separately and must stay that way. Do not add a
 * combined total, level, or percentage anywhere downstream — a single number
 * lets output stand in for comprehension, which is exactly the confusion this
 * layer exists to expose.
 */
export interface GrowthDTO {
  build: number;
  understand: number;
  explore: number;
  show: number;
  era_name: string;
  era_blurb: string;
  era_index: number;
  next_era_name: string;
  next_requirements: EraRequirementDTO[];
  /** Phases shipped but never explained back. */
  fog_count: number;
  unexplained: UnexplainedPhaseDTO[];
}

async function req(path: string, idToken: string, init?: RequestInit) {
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }
  return res.json();
}

export async function getGrowth(idToken: string): Promise<GrowthDTO> {
  const j = await req("/api/growth", idToken);
  // protojson emits camelCase and omits proto3 zero values.
  return {
    build: j.build ?? 0,
    understand: j.understand ?? 0,
    explore: j.explore ?? 0,
    show: j.show ?? 0,
    era_name: j.eraName ?? j.era_name ?? "Blank Page",
    era_blurb: j.eraBlurb ?? j.era_blurb ?? "",
    era_index: j.eraIndex ?? j.era_index ?? 0,
    next_era_name: j.nextEraName ?? j.next_era_name ?? "",
    next_requirements: (j.nextRequirements ?? j.next_requirements ?? []).map((r: any) => ({
      label: r.label ?? "",
      met: r.met ?? false,
      have: r.have ?? 0,
      need: r.need ?? 0,
    })),
    fog_count: j.fogCount ?? j.fog_count ?? 0,
    unexplained: (j.unexplained ?? []).map((u: any) => ({
      project_id: u.projectId ?? u.project_id ?? "",
      project_name: u.projectName ?? u.project_name ?? "",
      phase_number: u.phaseNumber ?? u.phase_number ?? 0,
    })),
  };
}

export async function startCheckpoint(
  idToken: string,
  projectId: string,
  phaseNumber: number,
): Promise<{ checkpoint_id: string; question: string }> {
  const j = await req("/api/checkpoints/start", idToken, {
    method: "POST",
    body: JSON.stringify({ projectId, phaseNumber }),
  });
  return {
    checkpoint_id: j.checkpointId ?? j.checkpoint_id ?? "",
    question: j.question ?? "",
  };
}

export async function submitCheckpoint(
  idToken: string,
  checkpointId: string,
  answer: string,
): Promise<{ passed: boolean; feedback: string; missing_concepts: string[] }> {
  const j = await req("/api/checkpoints/submit", idToken, {
    method: "POST",
    body: JSON.stringify({ checkpointId, answer }),
  });
  return {
    passed: j.passed ?? false,
    feedback: j.feedback ?? "",
    missing_concepts: j.missingConcepts ?? j.missing_concepts ?? [],
  };
}
