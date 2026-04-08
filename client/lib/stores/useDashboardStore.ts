/**
 * useDashboardStore
 *
 * Owns all data that drives the main `/dashboard` page:
 *   - The user's active project metadata (title, phase, progress, next objective).
 *   - The ordered list of learning phases and their completion status.
 *   - The recent-activity feed.
 *   - The recommended-resource list.
 *
 * ─── Why Zustand here? ────────────────────────────────────────────────────────
 * This data is currently hardcoded as module-level constants in `dashboard/page.tsx`.
 * Moving it into a store means:
 *   1. Multiple components (TopBar, LeftSidebar, RightSidebar, page) can all read
 *      the same project info without prop-drilling.
 *   2. When real API calls replace the mocks, only this store changes — UI is untouched.
 *   3. Future features (optimistic updates, polling, etc.) have a single place to live.
 *
 * ─── State ───────────────────────────────────────────────────────────────────
 *  currentProject  : The active project the user is working on right now.
 *  phases          : Ordered array of learning phases for the current project.
 *  activities      : Recent activity items shown in the activity feed.
 *  resources       : Recommended reference resources shown on the dashboard.
 *
 * ─── Actions ─────────────────────────────────────────────────────────────────
 *  setCurrentProject : Replace the active project (e.g., after an API fetch).
 *  setPhases         : Replace the phases array.
 *  setActivities     : Replace the activities list.
 *  setResources      : Replace the resources list.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   ```tsx
 *   const { currentProject, phases } = useDashboardStore();
 *   ```
 */

import { create } from "zustand";
import {
  getAllUserProjects,
  getUserProjectById,
  type UserProjectDTO,
} from "@/lib/api/projectsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  phase: number;
  description: string;
  progress: number;
  nextObjective: string;
}

export type PhaseStatus = "completed" | "active" | "locked";

export interface Phase {
  id: string;
  title: string;
  description: string;
  status: PhaseStatus;
  progress: number;
}

export type ActivityType = "quiz" | "video";

export interface Activity {
  text: string;
  time: string;
  type: ActivityType;
}

export interface Resource {
  title: string;
  type: string;
  time: string;
}

interface DashboardState {
  /** The project the user is actively learning right now. */
  currentProject: Project;
  /** Ordered learning phases for the current project. */
  phases: Phase[];
  /** Recent activity feed items. */
  activities: Activity[];
  /** Recommended reference resources. */
  resources: Resource[];

  /**
   * All user-project records fetched from the API.
   * Each entry represents a project the user has started or completed.
   */
  userProjects: UserProjectDTO[];
  /** True while a user-projects fetch is in flight. */
  projectsLoading: boolean;
  /** Error message from the last failed fetch, or null. */
  projectsError: string | null;

  // ── Local setters ──────────────────────────────────────────────────────────
  /** Replace the current project (e.g., after fetching from the API). */
  setCurrentProject: (project: Project) => void;
  /** Replace the phases list. */
  setPhases: (phases: Phase[]) => void;
  /** Replace the activities list. */
  setActivities: (activities: Activity[]) => void;
  /** Replace the resources list. */
  setResources: (resources: Resource[]) => void;

  // ── Async API actions ──────────────────────────────────────────────────────
  /**
   * Fetch all projects for the authenticated user from the gateway.
   * Requires a valid Firebase ID token.
   * Sets `userProjects`, `projectsLoading`, and `projectsError`.
   */
  fetchUserProjects: (idToken: string) => Promise<void>;

  /**
   * Fetch a single user-project by project_id from the gateway.
   * On success, updates `currentProject` with the returned data.
   * Requires a valid Firebase ID token.
   *
   * @param idToken   Firebase ID token
   * @param projectId The project_id to look up
   */
  fetchUserProjectById: (idToken: string, projectId: string) => Promise<void>;
}

// ─── Initial / mock data ──────────────────────────────────────────────────────

const INITIAL_PROJECT: Project = {
  id: "1",
  title: "Invoice Generator",
  phase: 2,
  description: "Backend Integration",
  progress: 40,
  nextObjective: "Build Invoice API Endpoint",
};

const INITIAL_PHASES: Phase[] = [
  {
    id: "01",
    title: "Project Setup",
    description: "Environment & Init",
    status: "completed",
    progress: 100,
  },
  {
    id: "02",
    title: "Frontend Base",
    description: "Atomic Components",
    status: "completed",
    progress: 100,
  },
  {
    id: "03",
    title: "Backend Core",
    description: "API & Data Modeling",
    status: "active",
    progress: 20,
  },
  {
    id: "04",
    title: "Integration",
    description: "Auth & Services",
    status: "locked",
    progress: 0,
  },
  {
    id: "05",
    title: "Deployment",
    description: "Cloud & CI/CD",
    status: "locked",
    progress: 0,
  },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    text: 'Completed "useState with Arrays" Knowledge Check',
    time: "2 hours ago",
    type: "quiz",
  },
  {
    text: 'Watched "Handling Forms in React" Walkthrough',
    time: "Yesterday",
    type: "video",
  },
];

const INITIAL_RESOURCES: Resource[] = [
  {
    title: "React State Mastery & Derived State",
    type: "Video Lesson",
    time: "12 min",
  },
  {
    title: "Structuring RESTful Endpoints",
    type: "Technical Article",
    time: "8 min",
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>((set) => ({
  currentProject: {
    id: "",
    title: "",
    phase: 0,
    description: "",
    progress: 0,
    nextObjective: "",
  },
  phases: [],
  activities: [],
  resources: [],

  userProjects: [],
  projectsLoading: false,
  projectsError: null,

  setCurrentProject: (project) => set({ currentProject: project }),
  setPhases: (phases) => set({ phases }),
  setActivities: (activities) => set({ activities }),
  setResources: (resources) => set({ resources }),

  fetchUserProjects: async (idToken: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const data = await getAllUserProjects(idToken);
      set({ userProjects: data.userProjects, projectsLoading: false });
    } catch (err: any) {
      set({
        projectsError: err.message ?? "Failed to fetch projects",
        projectsLoading: false,
      });
    }
  },

  fetchUserProjectById: async (idToken: string, projectId: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const data = await getUserProjectById(idToken, projectId);
      if (data.userProject) {
        // Map the DTO onto the local Project shape, preserving
        // UI-only fields (title, description, nextObjective) from current state.
        set((state) => ({
          currentProject: {
            ...state.currentProject,
            id: data.userProject!.projectId,
            phase: data.userProject!.currentPhase,
          },
          projectsLoading: false,
        }));
      } else {
        set({ projectsLoading: false });
      }
    } catch (err: any) {
      set({
        projectsError: err.message ?? "Failed to fetch project",
        projectsLoading: false,
      });
    }
  },
}));
