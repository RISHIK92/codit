/**
 * resourceProgressApi.ts
 *
 * Typed fetch helpers for resource progress endpoints.
 *
 *   GET  /api/resources?phaseId=&projectId=   → GetPhaseResourcesResponse
 *   POST /api/resources/progress              → MarkCompletedResponse
 *   GET  /api/resources/progress?projectId=   → GetProgressResponse
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

// ─── DTO Types ────────────────────────────────────────────────────────────────

export interface ResourceItemDTO {
  id: string;
  phase_id: string;
  type: string; // "video" | "article" | "docs" | etc.
  title: string;
  url: string;
  duration_minutes: number;
  provider: string;
  quality_score: number;
  completed: boolean;
  completed_at: string; // ISO string or ""
}

export interface ProgressEntryDTO {
  resource_id: string;
  completed: boolean;
  completed_at: string;
}

export interface GetPhaseResourcesResponse {
  resources: ResourceItemDTO[];
}

export interface MarkCompletedResponse {
  success: boolean;
}

export interface GetProgressResponse {
  entries: ProgressEntryDTO[];
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export async function getPhaseResources(
  token: string,
  phaseId: string,
  projectId: string,
): Promise<GetPhaseResourcesResponse> {
  const url = `${GATEWAY_URL}/api/resources?phaseId=${encodeURIComponent(phaseId)}&projectId=${encodeURIComponent(projectId)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getPhaseResources failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  // Normalise: proto JSON may return `resources: null` when empty
  return { resources: data.resources ?? [] };
}

export async function markCompleted(
  token: string,
  resourceId: string,
  projectId: string,
  completed: boolean,
): Promise<MarkCompletedResponse> {
  const res = await fetch(`${GATEWAY_URL}/api/resources/progress`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resourceId, projectId, completed }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`markCompleted failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function getProgress(
  token: string,
  projectId: string,
): Promise<GetProgressResponse> {
  const url = `${GATEWAY_URL}/api/resources/progress?projectId=${encodeURIComponent(projectId)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getProgress failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return { entries: data.entries ?? [] };
}
