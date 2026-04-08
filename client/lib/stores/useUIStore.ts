/**
 * useUIStore
 *
 * Manages transient UI state that needs to be shared across multiple layout
 * components without prop-drilling.
 *
 * ─── State ───────────────────────────────────────────────────────────────────
 *  isRightSidebarCollapsed : Whether the AI Assistant right sidebar is hidden.
 *                            Defaults to `false` (sidebar visible on load).
 *
 * ─── Actions ─────────────────────────────────────────────────────────────────
 *  collapseRightSidebar : Hide the right sidebar (show the ✨ FAB instead).
 *  expandRightSidebar   : Show the right sidebar.
 *  toggleRightSidebar   : Flip the collapsed state — useful for keyboard
 *                         shortcuts or a single toggle button.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   ```tsx
 *   // RightSidebar.tsx
 *   const { isRightSidebarCollapsed, collapseRightSidebar } = useUIStore();
 *
 *   // Any other component that wants to open the sidebar
 *   const { expandRightSidebar } = useUIStore();
 *   <button onClick={expandRightSidebar}>Open AI Assistant</button>
 *   ```
 */

import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UIState {
  /** True when the AI Assistant right sidebar is hidden. */
  isRightSidebarCollapsed: boolean;

  // Actions
  /** Hide the right sidebar. */
  collapseRightSidebar: () => void;
  /** Show the right sidebar. */
  expandRightSidebar: () => void;
  /** Toggle the right sidebar visibility. */
  toggleRightSidebar: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUIStore = create<UIState>((set) => ({
  isRightSidebarCollapsed: false,

  collapseRightSidebar: () => set({ isRightSidebarCollapsed: true }),
  expandRightSidebar: () => set({ isRightSidebarCollapsed: false }),
  toggleRightSidebar: () =>
    set((state) => ({
      isRightSidebarCollapsed: !state.isRightSidebarCollapsed,
    })),
}));
