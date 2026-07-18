/**
 * aiApi.ts
 *
 * Typed fetch helper for the AI assistant endpoint.
 *
 * ─── Authenticated endpoint (requires Bearer token) ──────────────────────────
 *   POST /api/ai/chat → { reply: string }
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

export interface ChatHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * "chat" (default) routes through the full agentic assistant (can fetch other
 * project files via tools). "explain" is a direct, single-shot call scoped to
 * just the active file — used for the cheap Option+Click "explain this" popup.
 */
export type ChatMode = "chat" | "explain";

/** Send a message to the AI assistant; context is assembled server-side. */
export async function sendChatMessage(
  token: string,
  params: {
    projectId: string;
    phaseId?: string;
    activeFilePath?: string;
    message: string;
    history: ChatHistoryEntry[];
    mode?: ChatMode;
  },
  signal?: AbortSignal,
): Promise<ChatResponse> {
  const res = await fetch(`${GATEWAY_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({
      projectId: params.projectId,
      phaseId: params.phaseId ?? "",
      activeFilePath: params.activeFilePath ?? "",
      message: params.message,
      history: params.history,
      mode: params.mode ?? "chat",
    }),
  });
  return handleResponse<ChatResponse>(res);
}
