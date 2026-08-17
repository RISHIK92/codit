/**
 * projectsApi.ts
 *
 * Typed fetch helpers that talk to the gateway.
 *
 * ─── Authenticated endpoints (require Bearer token) ───────────────────────────
 *   GET  /api/user-projects/get-all        → GetAllUserProjectsResponse
 *   GET  /api/user-projects/get?projectId= → GetUserProjectByIdResponse
 *   POST /api/user-projects/create         → { success: boolean }
 *   POST /api/user-projects/archive        → SetUserProjectArchivedResponse
 *   POST /api/user-projects/submit-review  → SubmitPhaseReviewResponse
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
  /** True when this project is archived — not the user's live project, but not abandoned either. */
  archived: boolean;
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
  /** Ordered list of project deliverables, e.g. "You'll understand React hooks" */
  deliverables?: string[];
  /** Ids of other projects that must be completed before this one unlocks. */
  prerequisite_ids?: string[];
  /**
   * Optional per-project seed file-system. If present, the build workspace
   * loads this structure instead of the generic language default tree.
   * Shape: Array<{ filePath: string; content: string; isDirectory: boolean }>
   * The gateway sends this as a JSON-encoded string that is parsed client-side.
   */
  initial_files?: Array<{
    filePath: string;
    content: string;
    isDirectory: boolean;
  }>;
}

export interface LearningPhaseDTO {
  id: string;
  title: string;
  description: string;
  /** Full markdown/prose description of the phase shown in the build view */
  long_description?: string;
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

  const data = (await res.json()) as GetProjectWithPhasesResponse & {
    project?: CatalogueProjectDTO & { initial_files?: unknown };
  };

  // The gateway sends `initial_files` as a JSON-encoded string (proto field).
  // Parse it into the expected array shape here so the rest of the app
  // can treat it as Array<{ filePath, content, isDirectory }>.
  if (data.project && typeof (data.project as any).initial_files === "string") {
    const raw = (data.project as any).initial_files as string;
    if (raw) {
      try {
        data.project.initial_files = JSON.parse(raw);
      } catch {
        data.project.initial_files = undefined;
      }
    } else {
      data.project.initial_files = undefined;
    }
  }

  return data;
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

/**
 * Archive or resume (un-archive) a project for the authenticated user.
 * At most one live (in_progress, unarchived) project and at most one
 * archived project are allowed at a time — archiving the live project frees
 * the live slot to start a different one.
 *
 * Hits POST /api/user-projects/archive on the gateway.
 */
export async function setUserProjectArchived(
  idToken: string,
  projectId: string,
  archived: boolean,
): Promise<{ user_project?: UserProjectDTO; userProject?: UserProjectDTO }> {
  const res = await fetch(`${GATEWAY_URL}/api/user-projects/archive`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, archived }),
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  return res.json();
}

export interface PhaseReviewResultDTO {
  /** "met" — advanced. "not_met" — graded and rejected. "blocked" — never
   * reached the grader because the phase's knowledge checks aren't all
   * correct yet. */
  verdict: "met" | "not_met" | "blocked";
  /** Whether the phase actually advanced. Trust this, never the feedback text. */
  advanced: boolean;
  /** The grader's explanation, or why the submission was blocked. */
  feedback: string;
  /** Authoritative post-review phase number — adopt this rather than
   * incrementing a local counter. */
  current_phase: number;
  checks_total: number;
  checks_correct: number;
}

/**
 * Submits the user's current phase for grading, advancing it if the grader
 * judges the goal met.
 *
 * Hits POST /api/user-projects/submit-review on the gateway.
 *
 * This is the only way a phase advances. The client does not grade, does not
 * parse a verdict, and does not ask to advance — it submits, and renders the
 * result. Everything that decides the outcome (which phase, whether its
 * knowledge checks are passed, what the grader said, whether that counts)
 * happens server-side, because a client that grades itself is not a gate.
 */
export async function submitPhaseReview(
  idToken: string,
  projectId: string,
  activeFilePath?: string,
): Promise<PhaseReviewResultDTO> {
  const res = await fetch(`${GATEWAY_URL}/api/user-projects/submit-review`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, activeFilePath: activeFilePath ?? "" }),
  });

  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }

  const json = await res.json();
  // protojson emits camelCase and omits proto3 zero values; normalise both.
  return {
    verdict: json.verdict ?? "not_met",
    advanced: json.advanced ?? false,
    feedback: json.feedback ?? "",
    current_phase: json.currentPhase ?? json.current_phase ?? 0,
    checks_total: json.checksTotal ?? json.checks_total ?? 0,
    checks_correct: json.checksCorrect ?? json.checks_correct ?? 0,
  };
}
