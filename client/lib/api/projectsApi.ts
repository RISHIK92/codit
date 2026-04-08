/**
 * projectsApi.ts
 *
 * Typed fetch helpers that talk to the gateway's user-project endpoints.
 * Every function requires a Firebase ID token so the gateway's RequireAuth
 * middleware can verify the caller.
 *
 * Endpoints used (all require Bearer token):
 *   GET  /api/user-projects/get-all        → GetAllUserProjectsResponse
 *   GET  /api/user-projects/get?projectId= → GetUserProjectByIdResponse
 *
 * ─── Types mirror the proto ───────────────────────────────────────────────────
 *  UserProjectDTO  : Single user-project record returned by the gateway.
 *  AllProjectsDTO  : Wrapper around the repeated list.
 *  SingleProjectDTO: Wrapper around a single project.
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

// ─── DTO Types (match proto field names after JSON encoding) ─────────────────

export interface UserProjectDTO {
  projectId: string;
  email: string;
  /** "in_progress" | "completed" | "abandoned" */
  status: string;
  currentPhase: number;
}

export interface GetAllUserProjectsResponse {
  userProjects: UserProjectDTO[];
}

export interface GetUserProjectByIdResponse {
  userProject: UserProjectDTO | undefined;
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
