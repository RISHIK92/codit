/**
 * entranceTestApi.ts — typed fetch helpers for the adaptive entrance test.
 *
 *   POST /api/entrance-test/start   → StartTestResponse
 *   POST /api/entrance-test/submit  → SubmitRoundResponse
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

function authHeader(idToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  };
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface EntranceQuestionDTO {
  id: string;
  question: string;
  options: [string, string, string, string];
  difficulty: "easy" | "intermediate" | "advanced";
  topic: string;
}

export interface StartTestResponse {
  questions: EntranceQuestionDTO[];
  attempt_id: string;
  round: number;
}

export interface AnswerPayload {
  question_id: string;
  selected_option: number;
}

export interface SubmitRoundResponse {
  done: boolean;
  /** populated when done = true */
  skill_level: string;
  /** populated when done = false */
  next_questions: EntranceQuestionDTO[];
  round: number;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function startEntranceTest(
  idToken: string,
): Promise<StartTestResponse> {
  const res = await fetch(`${GATEWAY_URL}/api/entrance-test/start`, {
    method: "POST",
    headers: authHeader(idToken),
  });
  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }
  return res.json();
}

export async function submitEntranceRound(
  idToken: string,
  answers: AnswerPayload[],
): Promise<SubmitRoundResponse> {
  const res = await fetch(`${GATEWAY_URL}/api/entrance-test/submit`, {
    method: "POST",
    headers: authHeader(idToken),
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }
  return res.json();
}
