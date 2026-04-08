/**
 * AuthInitializer
 *
 * A tiny client component whose only job is to register the Firebase
 * `onAuthStateChanged` listener via `useAuthStore.initAuth()` exactly once
 * when the app mounts, and clean it up on unmount.
 *
 * This replaces the old `AuthProvider` React-Context wrapper.  Because
 * Next.js Root Layouts are Server Components, we can't call `useEffect`
 * there directly — so we delegate that side-effect to this leaf component
 * and drop it anywhere inside the layout tree.
 *
 * It renders nothing visible (`null`).
 */

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores";

export default function AuthInitializer() {
  useEffect(() => {
    // initAuth starts the Firebase listener and returns the unsubscribe fn.
    const unsub = useAuthStore.getState().initAuth();
    return unsub;
  }, []);

  return null;
}
