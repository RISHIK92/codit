/**
 * knowledgeCheckApi.ts
 *
 * Typed fetch helpers for knowledge-check endpoints.
 *
 *   GET  /api/knowledge-checks?phaseId=              → GetPhaseKnowledgeChecksResponse
 *   POST /api/knowledge-checks/submit                → SubmitAnswerResponse
 *   GET  /api/knowledge-checks/quiz-averages          → GetQuizAveragesResponse
 */

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

// ─── DTO Types ────────────────────────────────────────────────────────────────

export interface KnowledgeCheckItemDTO {
  id: string;
  phase_id: string;
  question: string;
  options: string[]; // only populated for multiple_choice
  question_type: string; // "code_completion" | "multiple_choice" | "debug"
  attempted: boolean;
  is_correct: boolean; // meaningful only when attempted = true
  explanation: string; // only revealed once attempted
  submitted_answer: string;
}

export interface GetPhaseKnowledgeChecksResponse {
  checks: KnowledgeCheckItemDTO[];
}

export interface SubmitAnswerResponse {
  is_correct: boolean;
  explanation: string;
}

export interface SkillLevelAverageDTO {
  skill_level: string; // "beginner" | "intermediate" | "advanced"
  average_pct: number; // 0-100
  attempted_count: number;
  total_count: number;
}

export interface GetQuizAveragesResponse {
  averages: SkillLevelAverageDTO[];
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export async function getPhaseKnowledgeChecks(
  token: string,
  phaseId: string,
): Promise<GetPhaseKnowledgeChecksResponse> {
  const url = `${GATEWAY_URL}/api/knowledge-checks?phaseId=${encodeURIComponent(phaseId)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getPhaseKnowledgeChecks failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return { checks: data.checks ?? [] };
}

export async function submitAnswer(
  token: string,
  knowledgeCheckId: string,
  projectId: string,
  answer: string,
): Promise<SubmitAnswerResponse> {
  const res = await fetch(`${GATEWAY_URL}/api/knowledge-checks/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ knowledgeCheckId, projectId, answer }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`submitAnswer failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function getQuizAverages(
  token: string,
): Promise<GetQuizAveragesResponse> {
  const res = await fetch(`${GATEWAY_URL}/api/knowledge-checks/quiz-averages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getQuizAverages failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  return { averages: data.averages ?? [] };
}
