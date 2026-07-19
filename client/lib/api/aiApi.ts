/**
 * aiApi.ts
 *
 * Typed fetch helper for the AI assistant endpoint.
 *
 * ─── Authenticated endpoint (requires Bearer token) ──────────────────────────
 *   POST /api/ai/chat → streamed plain-text body, one chunk per flush
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

export interface ChatHistoryEntry {
  role: "user" | "assistant";
  content: string;
}

/**
 * "chat" (default) routes through the full agentic assistant (can fetch other
 * project files via tools). "explain" is a direct, single-shot call scoped to
 * just the active file — used for the cheap Option+Click "explain this" popup.
 * "review" evaluates a phase submission against its goal, using a parsed
 * code summary rather than raw file contents — used by the Submit button.
 */
export type ChatMode = "chat" | "explain" | "review";

/**
 * Send a message to the AI assistant; context is assembled server-side.
 * The reply streams in over the response body — `onChunk` fires once per
 * chunk as it arrives, and the returned promise resolves with the full
 * concatenated text once the stream ends.
 */
export async function sendChatMessage(
  token: string,
  params: {
    projectId: string;
    phaseId?: string;
    activeFilePath?: string;
    message: string;
    history: ChatHistoryEntry[];
    mode?: ChatMode;
    /** Short human-readable summary of the current project + phase, e.g. "Project: Recipe Tracker (React, Node) — Phase 2: State Management". */
    currentTask?: string;
  },
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
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
      currentTask: params.currentTask ?? "",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (!res.body) {
    // No streaming body support — fall back to a single read.
    const text = await res.text();
    if (text) onChunk(text);
    return text;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (text) {
      full += text;
      onChunk(text);
    }
  }
  return full;
}
