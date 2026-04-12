/**
 * filesApi.ts
 *
 * Typed fetch helpers for the relational file-system endpoints.
 *
 * ─── Authenticated endpoints (require Bearer token) ──────────────────────────
 *   PUT    /api/files/upsert?projectId=        → { file: ProjectFileDTO }
 *   GET    /api/files/get?projectId=&filePath= → { file: ProjectFileDTO }
 *   GET    /api/files/list?projectId=          → { files: ProjectFileDTO[] }
 *   DELETE /api/files/delete?projectId=&filePath= → { success: boolean }
 *   POST   /api/files/batch-upsert?projectId=  → { upserted_count: number }
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface ProjectFileDTO {
  id: string;
  project_id: string;
  user_email: string;
  file_path: string;
  content: string;
  is_directory: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpsertFileResponse {
  file?: ProjectFileDTO;
}

export interface ListFilesResponse {
  files?: ProjectFileDTO[];
}

export interface BatchUpsertResponse {
  upserted_count?: number;
}

// ─── Initial-files shape stored in Projects.initial_files ────────────────────
export interface InitialFileEntry {
  filePath: string;
  content: string;
  isDirectory: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── API functions ────────────────────────────────────────────────────────────

/** Create or update a single file. */
export async function upsertFile(
  token: string,
  projectId: string,
  filePath: string,
  content: string,
  isDirectory = false,
): Promise<UpsertFileResponse> {
  const res = await fetch(
    `${GATEWAY_URL}/api/files/upsert?projectId=${encodeURIComponent(projectId)}`,
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify({ filePath, content, isDirectory }),
    },
  );
  return handleResponse<UpsertFileResponse>(res);
}

/** Fetch a single file by path. */
export async function getFile(
  token: string,
  projectId: string,
  filePath: string,
): Promise<UpsertFileResponse> {
  const res = await fetch(
    `${GATEWAY_URL}/api/files/get?projectId=${encodeURIComponent(projectId)}&filePath=${encodeURIComponent(filePath)}`,
    { headers: authHeaders(token) },
  );
  return handleResponse<UpsertFileResponse>(res);
}

/** List all files for a project. */
export async function listFiles(
  token: string,
  projectId: string,
): Promise<ListFilesResponse> {
  const res = await fetch(
    `${GATEWAY_URL}/api/files/list?projectId=${encodeURIComponent(projectId)}`,
    { headers: authHeaders(token) },
  );
  return handleResponse<ListFilesResponse>(res);
}

/** Delete a file (or directory + children). */
export async function deleteFile(
  token: string,
  projectId: string,
  filePath: string,
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${GATEWAY_URL}/api/files/delete?projectId=${encodeURIComponent(projectId)}&filePath=${encodeURIComponent(filePath)}`,
    { method: "DELETE", headers: authHeaders(token) },
  );
  return handleResponse<{ success: boolean }>(res);
}

/**
 * Batch-upsert many files at once.
 * Used on initial project load to seed the DB from the WC filesystem.
 */
export async function batchUpsertFiles(
  token: string,
  projectId: string,
  entries: Array<{ filePath: string; content: string; isDirectory: boolean }>,
): Promise<BatchUpsertResponse> {
  const res = await fetch(
    `${GATEWAY_URL}/api/files/batch-upsert?projectId=${encodeURIComponent(projectId)}`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ entries }),
    },
  );
  return handleResponse<BatchUpsertResponse>(res);
}
