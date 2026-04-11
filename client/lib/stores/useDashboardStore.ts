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
  getProjectWithPhases,
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
  /** Ordered deliverables for the project, e.g. "You'll understand React hooks" */
  deliverables: string[];
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
  deliverables: [],
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
    deliverables: [],
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
      // Go's encoding/json uses snake_case keys; jsonpb would use camelCase.
      // Accept both so the client works regardless of the marshaller.
      const projects = data.user_projects ?? data.userProjects ?? [];
      set({ userProjects: projects, projectsLoading: false });

      // Find the active project and hydrate currentProject + phases from the catalogue
      const active = projects.find((p) => p.status === "in_progress");
      if (active) {
        try {
          const detail = await getProjectWithPhases(idToken, active.project_id);
          const cat = detail.project;
          const phaseList = detail.phases ?? [];
          // current_phase is 0-indexed: 0 = working on phase 1, 1 = working on phase 2, etc.
          // phase_number in the DB/proto is 1-indexed (1, 2, 3…)
          const currentPhaseIdx = active.current_phase ?? 0;
          // The phase the user is currently working on has phase_number = currentPhaseIdx + 1
          const currentPhaseNumber = currentPhaseIdx + 1;

          if (cat) {
            // Derive overall progress: phases completed / total phases
            // currentPhaseIdx phases are fully done (0-indexed)
            const pct =
              cat.phase_count > 0
                ? Math.round((currentPhaseIdx / cat.phase_count) * 100)
                : 0;

            // Match by 1-indexed phase_number
            const currentPhaseData = phaseList.find(
              (p) => p.phase_number === currentPhaseNumber,
            );
            const nextObjective = currentPhaseData?.title ?? cat.goal ?? "";

            set({
              currentProject: {
                id: active.project_id,
                title: cat.name,
                // Store 1-indexed for display (Phase 1, Phase 2…)
                phase: currentPhaseNumber,
                description: currentPhaseData?.description ?? cat.goal ?? "",
                progress: pct,
                nextObjective,
                deliverables: cat.deliverables ?? [],
              },
            });
          }

          // Map phases into the Phase shape expected by the dashboard UI
          // phase_number is 1-indexed in the DB
          const mappedPhases = phaseList
            .slice()
            .sort((a, b) => a.phase_number - b.phase_number)
            .map((p) => {
              let status: PhaseStatus;
              if (p.phase_number < currentPhaseNumber) status = "completed";
              else if (p.phase_number === currentPhaseNumber) status = "active";
              else status = "locked";

              const phaseProgress =
                status === "completed" ? 100 : status === "active" ? 20 : 0;

              return {
                // id is the 1-indexed phase_number, zero-padded
                id: String(p.phase_number).padStart(2, "0"),
                title: p.title,
                description: p.description,
                status,
                progress: phaseProgress,
              };
            });

          set({ phases: mappedPhases });
        } catch {
          // Catalogue fetch failed — leave currentProject/phases as empty defaults
        }
      }
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
      // Accept both snake_case (Go encoding/json) and camelCase (jsonpb)
      const project = data.user_project ?? data.userProject;
      if (project) {
        set((state) => ({
          currentProject: {
            ...state.currentProject,
            id: project.project_id,
            phase: project.current_phase,
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
