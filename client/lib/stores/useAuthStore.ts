/**
 * useAuthStore
 *
 * Manages Firebase authentication state globally with Zustand.
 *
 * State:
 *  - user     : The current Firebase `User` object, or `null` when signed out.
 *  - loading  : `true` while the initial auth-state check is in flight.
 *
 * Actions:
 *  - setUser    : Directly update the stored user (called by the Firebase listener).
 *  - setLoading : Directly update the loading flag.
 *  - initAuth   : Registers the `onAuthStateChanged` listener once and returns
 *                 the unsubscribe function so callers can clean up.
 *
 * Usage:
 *   Call `initAuth()` once at the top of the component tree (e.g., in the root
 *   layout) to start listening for auth changes. After that, any component can
 *   read `user` and `loading` without prop-drilling or a React Context.
 *
 *   ```tsx
 *   // layout.tsx
 *   useEffect(() => {
 *     const unsub = useAuthStore.getState().initAuth();
 *     return unsub;
 *   }, []);
 *
 *   // any child component
 *   const { user, loading } = useAuthStore();
 *   ```
 */

import { create } from "zustand";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  /** The currently authenticated Firebase user, or null if signed out. */
  user: User | null;
  /** True while the initial Firebase auth check hasn't resolved yet. */
  loading: boolean;

  // Actions
  /** Overwrite the stored user object. */
  setUser: (user: User | null) => void;
  /** Overwrite the loading flag. */
  setLoading: (loading: boolean) => void;
  /**
   * Registers the Firebase `onAuthStateChanged` listener.
   * Returns the unsubscribe function — call it on component unmount.
   */
  initAuth: () => () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  initAuth: () => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      set({ user: firebaseUser, loading: false });
    });
    return unsub;
  },
}));
