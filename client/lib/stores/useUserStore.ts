/**
 * useUserStore
 *
 * Holds the server-side user profile (skill level, learning modes,
 * hours per week, isNew flag).  Populated once after Firebase auth resolves.
 */

import { create } from "zustand";
import {
  getUserProfile,
  updateUserPreferences,
  type UserProfileDTO,
  type UpdatePreferencesPayload,
} from "@/lib/api/userApi";

interface UserProfileState {
  profile: UserProfileDTO | null;
  profileLoading: boolean;
  profileError: string | null;

  fetchProfile: (idToken: string) => Promise<void>;
  savePreferences: (
    idToken: string,
    payload: UpdatePreferencesPayload,
  ) => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserProfileState>((set) => ({
  profile: null,
  profileLoading: false,
  profileError: null,

  fetchProfile: async (idToken) => {
    set({ profileLoading: true, profileError: null });
    try {
      const profile = await getUserProfile(idToken);
      set({ profile, profileLoading: false });
    } catch (err: any) {
      set({
        profileError: err.message ?? "Failed to load profile",
        profileLoading: false,
      });
    }
  },

  savePreferences: async (idToken, payload) => {
    await updateUserPreferences(idToken, payload);
    // Optimistically update the local profile
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            skill_level: payload.skill_level,
            learning_modes: payload.learning_modes,
            hours_per_week: payload.hours_per_week,
            is_new: false,
          }
        : null,
    }));
  },

  clearProfile: () => set({ profile: null, profileError: null }),
}));
