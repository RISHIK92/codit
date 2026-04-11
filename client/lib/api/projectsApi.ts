/**
 * projectsApi.ts
 *
 * Typed fetch helpers that talk to the gateway.
 *
 * ─── Authenticated endpoints (require Bearer token) ───────────────────────────
 *   GET  /api/user-projects/get-all        → GetAllUserProjectsResponse
 *   GET  /api/user-projects/get?projectId= → GetUserProjectByIdResponse
 *   POST /api/user-projects/create         → { success: boolean }
 *
 * ─── Public endpoints (no auth) ───────────────────────────────────────────────
 *   GET  /public/api/projects/get-all           → GetAllCatalogueProjectsResponse
 *   GET  /public/api/projects/get?projectId=    → GetCatalogueProjectByIdResponse
 *   GET  /public/api/projects/detail?projectId= → GetProjectWithPhasesResponse
 *
 * ─── Wire format note ────────────────────────────────────────────────────────
 * Go's encoding/json serialises proto struct tags as snake_case, e.g.
 * `tech_stack`, `skill_level`, `estimated_minutes`, `phase_count`.
 * All response interfaces below reflect the actual wire keys.
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

// ─── DTO Types (match Go encoding/json snake_case wire format) ───────────────

export interface UserProjectDTO {
  project_id: string;
  email: string;
  /** "in_progress" | "completed" | "abandoned" */
  status: string;
  current_phase: number;
}

// Go's encoding/json serialises proto snake_case fields as snake_case,
// e.g. `user_projects` not `userProjects`. Both shapes are accepted below.
export interface GetAllUserProjectsResponse {
  // snake_case from Go's encoding/json (actual wire format)
  user_projects?: UserProjectDTO[];
  // camelCase fallback (in case the gateway is updated to use jsonpb)
  userProjects?: UserProjectDTO[];
}

export interface GetUserProjectByIdResponse {
  // snake_case from Go's encoding/json
  user_project?: UserProjectDTO;
  // camelCase fallback
  userProject?: UserProjectDTO;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Build the Authorization header from a Firebase ID token. */
function authHeader(idToken: string): HeadersInit {
  return { Authorization: `Bearer ${idToken}` };
}

/**
 * Fetch all user-projects for the authenticated user.
 * The gateway injects X-User-Email from the verified JWT so no extra params needed.
 *
 * @param idToken  Firebase ID token from `user.getIdToken()`
 * @throws Error   if the gateway returns a non-2xx status
 */
export async function getAllUserProjects(
  idToken: string,
): Promise<GetAllUserProjectsResponse> {
  const res = await fetch(`${GATEWAY_URL}/api/user-projects/get-all`, {
    method: "GET",
    headers: authHeader(idToken),
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json() as Promise<GetAllUserProjectsResponse>;
}

/**
 * Fetch user-projects filtered by status on the backend.
 * status: "in_progress" | "completed" | "abandoned"
 */
export async function getUserProjectsByStatus(
  idToken: string,
  status: string,
): Promise<GetAllUserProjectsResponse> {
  const url = new URL(`${GATEWAY_URL}/api/user-projects/get-by-status`);
  url.searchParams.set("status", status);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: authHeader(idToken),
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json() as Promise<GetAllUserProjectsResponse>;
}

/**
 * Fetch a single user-project by its project_id.
 *
 * @param idToken   Firebase ID token
 * @param projectId The project_id to look up (NOT the internal uuid PK)
 * @throws Error    if the gateway returns a non-2xx status
 */
export async function getUserProjectById(
  idToken: string,
  projectId: string,
): Promise<GetUserProjectByIdResponse> {
  const url = new URL(`${GATEWAY_URL}/api/user-projects/get`);
  url.searchParams.set("projectId", projectId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: authHeader(idToken),
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json() as Promise<GetUserProjectByIdResponse>;
}

// ─── Public catalogue DTOs ────────────────────────────────────────────────────
// Field names match Go's encoding/json snake_case output from project.pb.go.

export interface CatalogueProjectDTO {
  id: string;
  name: string;
  tech_stack: string[];
  skill_level: string;
  estimated_minutes: number;
  phase_count: number;
  goal: string;
  demo_url: string;
}

export interface LearningPhaseDTO {
  id: string;
  title: string;
  description: string;
  goal: string; // JSON-encoded string from DB
  phase_number: number;
  estimated_minutes: number;
}

export interface GetProjectWithPhasesResponse {
  project?: CatalogueProjectDTO;
  phases?: LearningPhaseDTO[];
  /** true when the user already has this project in_progress */
  already_started?: boolean;
  /** true when the user has a *different* project in_progress (slot occupied) */
  locked?: boolean;
}

export interface GetAllCatalogueProjectsResponse {
  projects?: CatalogueProjectDTO[];
}

export interface GetCatalogueProjectByIdResponse {
  project?: CatalogueProjectDTO;
}

// ─── Public catalogue fetchers ────────────────────────────────────────────────

/**
 * Fetch the full project catalogue. No auth required.
 * Hits GET /public/api/projects/get-all on the gateway.
 */
export async function getAllCatalogueProjects(): Promise<GetAllCatalogueProjectsResponse> {
  const res = await fetch(`${GATEWAY_URL}/public/api/projects/get-all`, {
    method: "GET",
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json() as Promise<GetAllCatalogueProjectsResponse>;
}

/**
 * Fetch a single catalogue project by its id.
 * Hits GET /public/api/projects/get?projectId= on the gateway.
 */
export async function getCatalogueProjectById(
  projectId: string,
): Promise<GetCatalogueProjectByIdResponse> {
  const url = new URL(`${GATEWAY_URL}/public/api/projects/get`);
  url.searchParams.set("projectId", projectId);

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json() as Promise<GetCatalogueProjectByIdResponse>;
}

/**
 * Fetch a catalogue project with its full learning phases.
 * Auth-protected — the gateway uses the token to compute locked / already_started.
 * Hits GET /api/projects/detail?projectId= on the gateway.
 *
 * @param idToken   Firebase ID token
 * @param projectId The catalogue project id to look up
 */
export async function getProjectWithPhases(
  idToken: string,
  projectId: string,
): Promise<GetProjectWithPhasesResponse> {
  const url = new URL(`${GATEWAY_URL}/api/projects/detail`);
  url.searchParams.set("projectId", projectId);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: authHeader(idToken),
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json() as Promise<GetProjectWithPhasesResponse>;
}

/**
 * Add a project to the authenticated user's projects list.
 * Hits POST /api/user-projects/create on the gateway.
 *
 * @param idToken   Firebase ID token
 * @param projectId The catalogue project id to start
 */
export async function createUserProject(
  idToken: string,
  projectId: string,
): Promise<{ success: boolean }> {
  const res = await fetch(`${GATEWAY_URL}/api/user-projects/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, status: "in_progress", currentPhase: 0 }),
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json() as Promise<{ success: boolean }>;
}
