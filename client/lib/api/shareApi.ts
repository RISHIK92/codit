/**
 * shareApi.ts
 *
 * ─── Authenticated ──────────────────────────────────────────────────────────
 *   GET  /api/share/mine    → what you've published, and what you could
 *   POST /api/share         → publish a phase
 *   POST /api/share/revoke  → withdraw one
 *
 * ─── Public (no auth) ───────────────────────────────────────────────────────
 *   GET  /public/api/share?slug= → the published artifact
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

export interface MyArtifactDTO {
  slug: string;
  project_id: string;
  project_name: string;
  phase_number: number;
  phase_title: string;
  include_code: boolean;
  view_count: number;
}

export interface ShareablePhaseDTO {
  project_id: string;
  project_name: string;
  phase_number: number;
  phase_title: string;
}

export interface MyArtifactsDTO {
  shared: MyArtifactDTO[];
  /** Completed AND explained back — the only phases eligible to publish. */
  shareable: ShareablePhaseDTO[];
  profile_unlocked: boolean;
  profile_locked_reason: string;
}

export interface PublicCriterionDTO {
  text: string;
  kind: string;
  evidence_path: string;
  evidence_lines: string;
}

export interface PublicArtifactDTO {
  found: boolean;
  revoked: boolean;
  author_name: string;
  project_name: string;
  phase_number: number;
  phase_title: string;
  created_at: string;
  criteria: PublicCriterionDTO[];
  explanation_question: string;
  explanation_answer: string;
  files: { path: string; content: string }[];
}

async function req(path: string, init?: RequestInit, idToken?: string) {
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }
  return res.json();
}

export async function listMyArtifacts(idToken: string): Promise<MyArtifactsDTO> {
  const j = await req("/api/share/mine", undefined, idToken);
  return {
    shared: (j.shared ?? []).map((a: any) => ({
      slug: a.slug ?? "",
      project_id: a.projectId ?? a.project_id ?? "",
      project_name: a.projectName ?? a.project_name ?? "",
      phase_number: a.phaseNumber ?? a.phase_number ?? 0,
      phase_title: a.phaseTitle ?? a.phase_title ?? "",
      include_code: a.includeCode ?? a.include_code ?? false,
      view_count: a.viewCount ?? a.view_count ?? 0,
    })),
    shareable: (j.shareable ?? []).map((a: any) => ({
      project_id: a.projectId ?? a.project_id ?? "",
      project_name: a.projectName ?? a.project_name ?? "",
      phase_number: a.phaseNumber ?? a.phase_number ?? 0,
      phase_title: a.phaseTitle ?? a.phase_title ?? "",
    })),
    profile_unlocked: j.profileUnlocked ?? j.profile_unlocked ?? false,
    profile_locked_reason: j.profileLockedReason ?? j.profile_locked_reason ?? "",
  };
}

export async function shareArtifact(
  idToken: string,
  projectId: string,
  phaseNumber: number,
  includeCode: boolean,
): Promise<{ slug: string }> {
  const j = await req(
    "/api/share",
    { method: "POST", body: JSON.stringify({ projectId, phaseNumber, includeCode }) },
    idToken,
  );
  return { slug: j.slug ?? "" };
}

export async function revokeArtifact(idToken: string, slug: string): Promise<void> {
  await req("/api/share/revoke", { method: "POST", body: JSON.stringify({ slug }) }, idToken);
}

/** No token — this is the read a stranger with the link performs. */
export async function getPublicArtifact(slug: string): Promise<PublicArtifactDTO> {
  const j = await req(`/public/api/share?slug=${encodeURIComponent(slug)}`);
  return {
    found: j.found ?? false,
    revoked: j.revoked ?? false,
    author_name: j.authorName ?? j.author_name ?? "",
    project_name: j.projectName ?? j.project_name ?? "",
    phase_number: j.phaseNumber ?? j.phase_number ?? 0,
    phase_title: j.phaseTitle ?? j.phase_title ?? "",
    created_at: j.createdAt ?? j.created_at ?? "",
    criteria: (j.criteria ?? []).map((c: any) => ({
      text: c.text ?? "",
      kind: c.kind ?? "",
      evidence_path: c.evidencePath ?? c.evidence_path ?? "",
      evidence_lines: c.evidenceLines ?? c.evidence_lines ?? "",
    })),
    explanation_question: j.explanationQuestion ?? j.explanation_question ?? "",
    explanation_answer: j.explanationAnswer ?? j.explanation_answer ?? "",
    files: (j.files ?? []).map((f: any) => ({ path: f.path ?? "", content: f.content ?? "" })),
  };
}
