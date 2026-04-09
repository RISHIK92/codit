/**
 * stores/index.ts
 *
 * Barrel file — re-exports every Zustand store so consumers can import from
 * a single path:
 *
 *   import { useAuthStore, useDashboardStore, useUIStore } from "@/lib/stores";
 *
 * Stores overview:
 *  - useAuthStore      : Firebase auth state (user, loading, initAuth)
 *  - useDashboardStore : Dashboard data (project, phases, activities, resources)
 *  - useUIStore        : Transient UI state (sidebar collapse, etc.)
 */

export { useAuthStore } from "./useAuthStore";
export { useDashboardStore } from "./useDashboardStore";
export { useUIStore } from "./useUIStore";
export { useUserStore } from "./useUserStore";
export { useEntranceTestStore } from "./useEntranceTestStore";

// Named type re-exports for convenience
export type {
  Project,
  Phase,
  PhaseStatus,
  Activity,
  ActivityType,
  Resource,
} from "./useDashboardStore";
