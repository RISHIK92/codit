/**
 * userApi.ts — typed fetch helpers for user profile & preferences.
 *
 *   GET  /api/users/profile         → UserProfileResponse   (auth required)
 *   POST /api/users/preferences     → { success: boolean }  (auth required)
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

export interface UserProfileDTO {
  uid: string;
  email: string;
  name: string;
  /** "beginner" | "intermediate" | "advanced" | "" */
  skill_level: string;
  learning_modes: string[];
  hours_per_week: number;
  /** true when any preference field is missing → redirect to onboarding */
  is_new: boolean;
}

export interface UpdatePreferencesPayload {
  skill_level: string;
  learning_modes: string[];
  hours_per_week: number;
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getUserProfile(idToken: string): Promise<UserProfileDTO> {
  const res = await fetch(`${GATEWAY_URL}/api/users/profile`, {
    method: "GET",
    headers: authHeader(idToken),
  });
  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }
  return res.json() as Promise<UserProfileDTO>;
}

export async function updateUserPreferences(
  idToken: string,
  payload: UpdatePreferencesPayload,
): Promise<{ success: boolean }> {
  const res = await fetch(`${GATEWAY_URL}/api/users/preferences`, {
    method: "POST",
    headers: authHeader(idToken),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }
  return res.json() as Promise<{ success: boolean }>;
}
