"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuthStore, useDashboardStore } from "@/lib/stores";
import {
  getProjectWithPhases,
  submitPhaseReview,
  type PhaseReviewResultDTO,
  getAllUserProjects,
  type LearningPhaseDTO,
} from "@/lib/api/projectsApi";
import { getPhaseKnowledgeChecks } from "@/lib/api/knowledgeCheckApi";
import {
  batchUpsertFiles,
  listFiles as listProjectFiles,
  deleteFile as deleteProjectFile,
  getPhaseSnapshot,
  type ProjectFileDTO,
} from "@/lib/api/filesApi";
import { sendChatMessage } from "@/lib/api/aiApi";
import type * as Monaco from "monaco-editor";
import type { editor as EditorNS } from "monaco-editor";
import {
  BookOpen,
  Play,
  ArrowLeft,
  Folder,
  FilePlus,
  FolderPlus,
  FileCode,
  X,
  Terminal,
  Maximize2,
  Minimize2,
  Save,
  CheckCircle2,
  Sparkles,
  Globe,
  RefreshCw,
  Plus,
  Columns2,
  SendHorizonal,
} from "lucide-react";

// Types, constants, utils
import type { Language, FileNode, OpenTab } from "./types";
import {
  FILE_TREES,
  STATIC_SERVER_FILENAME,
  STATIC_SERVER_SCRIPT,
} from "./constants";
import {
  getDefaultFileContent as getFileContent,
  getFileLanguage,
  buildFileTreeFromEntries,
  buildWcFileTree,
  insertNode,
  makeNodeId,
  hasSiblingWithName,
  getNodeParentId,
  getParentFolderId,
  deleteNode,
  collectFileIds,
  renameNode,
  collectAllIds,
  makeDefaultTab,
  fmtMinutes,
  parseGoal,
  isSaveExcluded,
} from "./utils/fileUtils";
import { scanWcFs, spawnShell, replaceWcFiles } from "./utils/wcUtils";
import {
  parseImportLine,
  getQuotedStringAt,
  resolveModulePath,
  findFileNodeById,
  findDefinitionLine,
} from "./utils/importNav";

// Components
import { FileExplorer, getFileIcon, TreeNode } from "./components/FileExplorer";
import { PhaseSelector } from "./components/PhaseSelector";
import { DescriptionPanel } from "./components/DescriptionPanel";
import { PastPhaseSnapshotOverlay } from "./components/PastPhaseSnapshotOverlay";
import { PanelModeSwitcher } from "./components/PanelModeSwitcher";
import { PreviewPane } from "./components/PreviewPane";
import { XTermPanel } from "./components/XTermPanel";
import { AiAssistant } from "./components/AiAssistant";
import { ReviewResultsPanel } from "./components/ReviewResultsPanel";
import { SuggestionToast } from "./components/SuggestionToast";
import { useStuckDetector } from "./hooks/useStuckDetector";
import type { StuckEvent } from "@/lib/stuck/stuckDetector";
import { ResourcesPanel } from "./components/ResourcesPanel";
import { KnowledgeChecksPanel } from "./components/KnowledgeChecksPanel";

let wcBootPromise: Promise<import("@webcontainer/api").WebContainer> | null =
  null;
let wcLiveInstance: import("@webcontainer/api").WebContainer | null = null;

function getOrBootWebContainer(): Promise<
  import("@webcontainer/api").WebContainer
> {
  // Reuse existing live instance (covers navigate-away-and-back).
  if (wcLiveInstance) {
    return Promise.resolve(wcLiveInstance);
  }
  // Reuse in-flight boot promise (covers StrictMode double-invoke).
  if (!wcBootPromise) {
    wcBootPromise = import("@webcontainer/api")
      .then(({ WebContainer }) => WebContainer.boot())
      .then((wc) => {
        wcLiveInstance = wc;
        return wc;
      })
      .catch((err) => {
        wcBootPromise = null;
        wcLiveInstance = null;
        throw err;
      });
  }
  return wcBootPromise;
}

// Monaco is SSR-incompatible — load it client-side only
const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center bg-void">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
            Loading editor
          </span>
        </div>
      </div>
    ),
  },
);

export default function BuildPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const { user, loading: authLoading } = useAuthStore();
  const { currentProject } = useDashboardStore();

  const [phases, setPhases] = useState<LearningPhaseDTO[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [projectTechStack, setProjectTechStack] = useState<string[]>([]);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [currentPhaseNum, setCurrentPhaseNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read-only snapshot of a completed phase's code, shown as an overlay —
  // never editable/re-submittable, just a frozen record of what was
  // submitted. null when viewing the live (current) phase.
  const [viewingPastPhase, setViewingPastPhase] = useState<number | null>(null);
  // Mirrors viewingPastPhase for effects with empty dependency arrays
  // (the WC-fs poll/merge loop) that would otherwise close over a stale
  // null forever and keep merging whatever's in WC — including a snapshot
  // that's been temporarily mounted there — into the live fileTree.
  const viewingPastPhaseRef = useRef<number | null>(null);
  useEffect(() => {
    viewingPastPhaseRef.current = viewingPastPhase;
  }, [viewingPastPhase]);
  const [snapshotTree, setSnapshotTree] = useState<FileNode[]>([]);
  const [snapshotContents, setSnapshotContents] = useState<Record<string, string>>({});
  const [snapshotActiveTabId, setSnapshotActiveTabId] = useState("");
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  // Left panel tab: "description" | "resources" | "knowledge-checks"
  const [leftTab, setLeftTab] = useState<
    "description" | "resources" | "knowledge-checks"
  >("description");

  // Editor state
  const [language, setLanguage] = useState<Language>("javascript");
  const [fileTree, setFileTree] = useState<FileNode[]>(
    FILE_TREES["javascript"],
  );
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    makeDefaultTab("javascript"),
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("src/main.js");
  const [selectedExplorerItemId, setSelectedExplorerItemId] =
    useState<string>("src/main.js");
  // In-memory mirror of WC filesystem — source of truth for Monaco defaultValue
  // Start empty; fetch-phases effect populates it (DB → initial_files → defaults)
  const fileContentsRef = useRef<Record<string, string>>({});
  useEffect(() => {
    fileTreeRef.current = fileTree;
  }, [fileTree]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [aiOpen, setAiOpen] = useState(false);
  // Submit-for-review flow: POST to the server, which grades the submission,
  // decides the verdict, and advances the phase if it passed. The result is
  // then shown in the AI panel as an already-finished exchange — the client
  // neither grades nor asks to advance.
  // Server-graded review outcome, rendered as a checklist in its own panel.
  const [reviewResult, setReviewResult] = useState<PhaseReviewResultDTO | null>(
    null,
  );
  // Indirection so the Monaco onMount closure — which captures once and never
  // re-runs — can still reach the current recorder.
  const stuckRef = useRef<((e: StuckEvent) => void) | null>(null);
  const [submitChecking, setSubmitChecking] = useState(false);
  const [submitPrompt, setSubmitPrompt] = useState<string | null>(null);
  // Mirrors AiAssistant's internal loading state — Submit is only disabled
  // while the AI is actually responding, not while checking answered status.
  const [aiThinking, setAiThinking] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminals, setTerminals] = useState([{ id: "term-1", name: "bash" }]);
  const [activeTerminalId, setActiveTerminalId] = useState("term-1");

  // Preview panel state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Static-server run state — for HTML/CSS/JS projects with no build tool,
  // spawns a built-in static server (auto-reloads on file change) instead of
  // requiring the user to type a command in the terminal.
  const [previewServerRunning, setPreviewServerRunning] = useState(false);
  const [previewServerStarting, setPreviewServerStarting] = useState(false);
  const previewProcessRef = useRef<import("@webcontainer/api").WebContainerProcess | null>(
    null,
  );
  const [activePanel, setActivePanel] = useState<
    "editor" | "preview" | "split"
  >("editor");
  const [splitPos, setSplitPos] = useState(50); // percent
  const isSplitDragging = useRef(false);
  const [terminalHeight, setTerminalHeight] = useState(220);
  const [explorerWidth, setExplorerWidth] = useState(192);
  const [phaseGuideWidth, setPhaseGuideWidth] = useState(320);
  const [aiPanelWidth, setAiPanelWidth] = useState(380);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const isExplorerDragging = useRef(false);
  const explorerDragStartX = useRef(0);
  const explorerDragStartWidth = useRef(0);
  const isPhaseGuideDragging = useRef(false);
  const phaseGuideDragStartX = useRef(0);
  const phaseGuideDragStartWidth = useRef(0);
  const isAiPanelDragging = useRef(false);
  const aiPanelDragStartX = useRef(0);
  const aiPanelDragStartWidth = useRef(0);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStartY.current = e.clientY;
      dragStartHeight.current = terminalHeight;
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = dragStartY.current - ev.clientY;
        const next = Math.min(
          Math.max(dragStartHeight.current + delta, 80),
          600,
        );
        setTerminalHeight(next);
      };
      const onUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [terminalHeight],
  );

  const handleExplorerDragStart = useCallback(
    (e: React.MouseEvent) => {
      isExplorerDragging.current = true;
      explorerDragStartX.current = e.clientX;
      explorerDragStartWidth.current = explorerWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        if (!isExplorerDragging.current) return;
        const delta = ev.clientX - explorerDragStartX.current;
        const next = Math.min(
          Math.max(explorerDragStartWidth.current + delta, 120),
          400,
        );
        setExplorerWidth(next);
      };
      const onUp = () => {
        isExplorerDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [explorerWidth],
  );

  const handlePhaseGuideDragStart = useCallback(
    (e: React.MouseEvent) => {
      isPhaseGuideDragging.current = true;
      phaseGuideDragStartX.current = e.clientX;
      phaseGuideDragStartWidth.current = phaseGuideWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        if (!isPhaseGuideDragging.current) return;
        const delta = ev.clientX - phaseGuideDragStartX.current;
        const next = Math.min(
          Math.max(phaseGuideDragStartWidth.current + delta, 200),
          600,
        );
        setPhaseGuideWidth(next);
      };
      const onUp = () => {
        isPhaseGuideDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [phaseGuideWidth],
  );

  const handleAiPanelDragStart = useCallback(
    (e: React.MouseEvent) => {
      isAiPanelDragging.current = true;
      aiPanelDragStartX.current = e.clientX;
      aiPanelDragStartWidth.current = aiPanelWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        if (!isAiPanelDragging.current) return;
        // Handle sits on the panel's left edge — dragging left (negative
        // clientX delta) should grow the panel, so the delta is inverted
        // relative to the explorer/phase-guide handles on the left side.
        const delta = aiPanelDragStartX.current - ev.clientX;
        const next = Math.min(
          Math.max(aiPanelDragStartWidth.current + delta, 280),
          640,
        );
        setAiPanelWidth(next);
      };
      const onUp = () => {
        isAiPanelDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [aiPanelWidth],
  );

  const [pendingParentId, setPendingParentId] = useState<
    string | null | undefined
  >(undefined);
  const [pendingType, setPendingType] = useState<"file" | "folder" | null>(
    null,
  );
  const [rootInputVal, setRootInputVal] = useState("");

  // Monaco model registry
  const monacoRef = useRef<typeof Monaco | null>(null);
  const editorRef = useRef<EditorNS.IStandaloneCodeEditor | null>(null);
  // Cmd/Ctrl+Click "go to definition" — set right before switching tabs,
  // consumed once the target model is mounted (see reveal effect below).
  const pendingRevealRef = useRef<{
    fileId: string;
    line: number;
    word?: string;
  } | null>(null);
  // Monaco's onMount closure is captured once and outlives tab switches, so
  // reads of React state inside it go stale — mirror what it needs into refs.
  const fileTreeRef = useRef<FileNode[]>([]);

  // WebContainer instance
  const wcRef = useRef<import("@webcontainer/api").WebContainer | null>(null);
  // Signalling: wcReadyRef flips true when WC has booted; wcReadyCallbackRef
  // holds a one-shot resolver so the fetch-phases effect can await WC readiness.
  const wcReadyRef = useRef(false);
  const wcReadyCallbackRef = useRef<(() => void) | null>(null);

  // Boot WebContainer once on mount
  useEffect(() => {
    let mounted = true;
    getOrBootWebContainer()
      .then((wc) => {
        if (!mounted) return;
        wcRef.current = wc;
        // Signal WC readiness — fetch-phases effect owns all mounting
        wcReadyRef.current = true;
        wcReadyCallbackRef.current?.();

        // Listen for any dev server the user starts in the terminal
        wc.on("server-ready", (_port: number, url: string) => {
          setPreviewUrl(url);
        });
      })
      .catch((err: unknown) => {
        console.error("[WebContainer] boot failed:", err);
      });
    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!wcRef.current) return;
      // While viewing a past phase, WC's fs has been temporarily swapped to
      // that phase's frozen snapshot — don't let this merge it into the
      // live fileTree.
      if (viewingPastPhaseRef.current !== null) return;
      try {
        const wcTree = await scanWcFs(wcRef.current);
        setFileTree((prev) => {
          const prevIds = new Set(collectAllIds(prev));
          const wcIds = new Set(collectAllIds(wcTree));

          // Check if anything was added or removed
          const hasNew = [...wcIds].some((id) => !prevIds.has(id));
          const hasRemoved = [...prevIds].some((id) => !wcIds.has(id));
          if (!hasNew && !hasRemoved) return prev; // no change — skip re-render

          if (hasRemoved) {
            const removedIds = [...prevIds].filter((id) => !wcIds.has(id));
            removedIds.forEach((id) => {
              delete fileContentsRef.current[id];
            });
          }

          // Merge: for nodes that already exist in prev, keep them (preserving
          // any expanded state or language hints). For new ones, use WC data.
          function mergeTree(
            wcNodes: FileNode[],
            prevNodes: FileNode[],
          ): FileNode[] {
            return wcNodes.map((wcNode) => {
              const existing = prevNodes.find((p) => p.id === wcNode.id);
              if (existing && existing.type === wcNode.type) {
                if (existing.type === "folder") {
                  return {
                    ...existing,
                    children: mergeTree(
                      wcNode.children ?? [],
                      existing.children ?? [],
                    ),
                  };
                }
                return existing; // keep existing file node (has language hint)
              }
              return wcNode; // new node from WC
            });
          }

          const merged = mergeTree(wcTree, prev);

          // Also seed fileContentsRef for any brand-new files found in WC
          const newFileIds = [...wcIds].filter((id) => !prevIds.has(id));
          newFileIds.forEach((id) => {
            if (fileContentsRef.current[id] === undefined) {
              // Will be populated lazily when the file is opened
              wcRef
                .current!.fs.readFile(id, "utf-8")
                .then((content) => {
                  fileContentsRef.current[id] = content;
                })
                .catch(() => {});
            }
          });

          return merged;
        });
      } catch {
        // WC not ready or readdir failed — silently skip
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save every 10 seconds ─────────────────────────────────────────────
  // (declared after handleSave — see below)

  // ── Ctrl+S keyboard shortcut ───────────────────────────────────────────────
  // (declared after handleSave — see below)

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  // Fetch phases — and restore file system from backend on load
  useEffect(() => {
    if (!projectId || !user) return;
    setLoading(true);
    user.getIdToken().then((token) =>
      Promise.all([
        getProjectWithPhases(token, projectId),
        // Fetched independently rather than relying on useDashboardStore's
        // currentProject — that store only gets populated by a visit to
        // /dashboard and resets to its default (phase 0) on a hard reload of
        // this page, which was re-locking every phase past 1 on reload.
        getAllUserProjects(token).catch(() => null),
      ])
        .then(async ([data, userProjectsRes]) => {
          const phaseList = data.phases ?? [];
          setPhases(phaseList);
          setProjectName(data.project?.name ?? currentProject.title ?? "");
          setProjectTechStack(data.project?.tech_stack ?? []);

          // Start on the user's current phase — current_phase is 0-indexed
          // (0 = working on phase 1), so +1 for the 1-indexed phase_number.
          const userProjects =
            userProjectsRes?.user_projects ?? userProjectsRes?.userProjects ?? [];
          const thisProject = userProjects.find(
            (up) => up.project_id === projectId,
          );
          const currentPhaseNum = thisProject
            ? thisProject.current_phase + 1
            : currentProject.phase || 1;
          setCurrentPhaseNum(currentPhaseNum);
          const idx = phaseList.findIndex(
            (p) => p.phase_number === currentPhaseNum,
          );
          setActivePhaseIdx(idx >= 0 ? idx : 0);

          // ── Restore file system ──────────────────────────────────────────
          // Priority: 1) saved files in DB  2) project initial_files  3) default tree
          // Helper: resolves immediately if WC is already booted, otherwise waits.
          const waitForWc = () =>
            new Promise<void>((resolve) => {
              if (wcReadyRef.current) {
                resolve();
              } else {
                wcReadyCallbackRef.current = resolve;
              }
            });

          let restoredFromDB = false;
          try {
            const { files } = await listProjectFiles(token, projectId);
            if (files && files.length > 0) {
              // Rebuild tree + contents from DB
              const entries = files.map((f: ProjectFileDTO) => ({
                filePath: f.file_path,
                content: f.content,
                isDirectory: f.is_directory,
              }));
              const restoredTree = buildFileTreeFromEntries(entries);
              const restoredContents: Record<string, string> = {};
              files
                .filter((f: ProjectFileDTO) => !f.is_directory)
                .forEach((f: ProjectFileDTO) => {
                  restoredContents[f.file_path] = f.content;
                });

              setFileTree(restoredTree);
              fileContentsRef.current = restoredContents;
              setOpenTabs([]);
              setActiveTabId("");
              setSelectedExplorerItemId("");

              // Wait for WC to be ready, then mount restored content
              await waitForWc();
              if (wcRef.current) {
                const fs = buildWcFileTree(
                  restoredTree,
                  (id) => restoredContents[id] ?? "",
                ) as Parameters<typeof wcRef.current.mount>[0];
                await wcRef.current.mount(fs);
                // Sync back
                for (const [id] of Object.entries(restoredContents)) {
                  await wcRef.current.fs
                    .readFile(id, "utf-8")
                    .then((c) => {
                      fileContentsRef.current[id] = c;
                    })
                    .catch(() => {});
                }
              }
              restoredFromDB = true;
            }
          } catch {
            // No saved files yet — fall through
          }

          if (!restoredFromDB && data.project?.initial_files?.length) {
            // Use the project's custom initial file structure
            const entries = data.project.initial_files;
            const customTree = buildFileTreeFromEntries(entries);
            const customContents: Record<string, string> = {};
            entries
              .filter((e) => !e.isDirectory)
              .forEach((e) => {
                customContents[e.filePath] = e.content;
              });

            setFileTree(customTree);
            fileContentsRef.current = customContents;
            const firstFile = entries.find((e) => !e.isDirectory);
            if (firstFile) {
              const name = firstFile.filePath.split("/").pop()!;
              setOpenTabs([
                {
                  id: firstFile.filePath,
                  name,
                  language: getFileLanguage({
                    name,
                  }),
                },
              ]);
              setActiveTabId(firstFile.filePath);
              setSelectedExplorerItemId(firstFile.filePath);
            } else {
              setOpenTabs([]);
              setActiveTabId("");
            }

            // Wait for WC, then mount
            await waitForWc();
            if (wcRef.current) {
              const fs = buildWcFileTree(
                customTree,
                (id) => customContents[id] ?? "",
              ) as Parameters<typeof wcRef.current.mount>[0];
              wcRef.current.mount(fs).catch(console.error);
            }
          } else if (!restoredFromDB) {
            // Fallback: no DB files and no initial_files — pick a scaffold
            // matching the project's tech stack (plain HTML/CSS/JS projects
            // get an index.html tree instead of the generic Node.js one).
            const isHtmlProject = (data.project?.tech_stack ?? []).some(
              (t) => t.toLowerCase() === "html",
            );
            if (isHtmlProject) setLanguage("html");
            const defaultTree = FILE_TREES[isHtmlProject ? "html" : "javascript"];
            const allIds = defaultTree.flatMap(function flat(
              n: FileNode,
            ): string[] {
              return n.type === "file"
                ? [n.id]
                : (n.children ?? []).flatMap(flat);
            });
            fileContentsRef.current = Object.fromEntries(
              allIds.map((id) => [id, getFileContent(id)]),
            );
            // fileTree and openTabs are already initialised to JS defaults via useState
            await waitForWc();
            if (wcRef.current) {
              const fs = buildWcFileTree(
                defaultTree,
                getFileContent,
              ) as Parameters<typeof wcRef.current.mount>[0];
              await wcRef.current.mount(fs);
              await Promise.all(
                allIds.map((id) =>
                  wcRef
                    .current!.fs.readFile(id, "utf-8")
                    .then((c) => {
                      fileContentsRef.current[id] = c;
                    })
                    .catch(() => {}),
                ),
              );
            }
          }

          setLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        }),
    );
  }, [projectId, user, currentProject.phase, currentProject.title]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanguageChange = useCallback(
    (lang: "javascript" | "typescript" | "python") => {
      // Dispose all existing models inside Monaco
      if (monacoRef.current) {
        monacoRef.current.editor.getModels().forEach((m) => m.dispose());
      }
      setLanguage(lang);
      setFileTree(FILE_TREES[lang]);
      const defaultTab = makeDefaultTab(lang);
      setOpenTabs([defaultTab]);
      setActiveTabId(defaultTab.id);
      setSelectedExplorerItemId(defaultTab.id);
      setPendingParentId(undefined);
      setPendingType(null);

      // Reset in-memory mirror with the new language's defaults
      const newTree = FILE_TREES[lang];
      const allIds = newTree.flatMap(function flat(n: FileNode): string[] {
        return n.type === "file" ? [n.id] : (n.children ?? []).flatMap(flat);
      });
      fileContentsRef.current = Object.fromEntries(
        allIds.map((id) => [id, getFileContent(id)]),
      );

      // Re-mount new language's file tree into WebContainer and sync back
      if (wcRef.current) {
        const wc = wcRef.current;
        const fs = buildWcFileTree(newTree, getFileContent) as Parameters<
          typeof wc.mount
        >[0];
        wc.mount(fs)
          .then(() =>
            Promise.all(
              allIds.map((id) =>
                wc.fs
                  .readFile(id, "utf-8")
                  .then((content) => {
                    fileContentsRef.current[id] = content;
                  })
                  .catch(() => {}),
              ),
            ),
          )
          .catch(console.error);
      }
    },
    [],
  );

  const handleCommitCreate = useCallback(
    (parentId: string | null, name: string, type: "file" | "folder") => {
      const trimmed = name.trim();
      if (!trimmed) {
        setPendingParentId(undefined);
        setPendingType(null);
        return;
      }
      if (hasSiblingWithName(fileTree, parentId, trimmed)) {
        setSubmitPrompt(
          `"${trimmed}" already exists in this folder — choose a different name.`,
        );
        return;
      }
      const id = makeNodeId(parentId, trimmed);
      const newNode: FileNode =
        type === "folder"
          ? { id, name: trimmed, type: "folder", children: [] }
          : { id, name: trimmed, type: "file", language };
      setFileTree((prev) => insertNode(prev, parentId, newNode));
      setPendingParentId(undefined);
      setPendingType(null);
      setRootInputVal("");
      if (type === "file") {
        // Model will be lazily created by @monaco-editor/react when tab opens
        const initialContent = getFileContent(id);
        fileContentsRef.current[id] = initialContent;
        setOpenTabs((prev) => {
          if (prev.find((t) => t.id === id)) return prev;
          return [
            ...prev,
            { id, name: trimmed, language: getFileLanguage(newNode) },
          ];
        });
        setActiveTabId(id);
        // Write the new file into WebContainer
        if (wcRef.current) {
          wcRef.current.fs.writeFile(id, initialContent).catch(console.error);
        }
      } else {
        // Create directory in WebContainer
        if (wcRef.current) {
          wcRef.current.fs.mkdir(id, { recursive: true }).catch(console.error);
        }
      }
    },
    [language, fileTree],
  );

  const handleCancelCreate = useCallback(() => {
    setPendingParentId(undefined);
    setPendingType(null);
    setRootInputVal("");
  }, []);

  const handleDelete = useCallback(
    (node: FileNode) => {
      const removedIds = collectFileIds(node);
      // Dispose Monaco models for deleted files
      if (monacoRef.current) {
        removedIds.forEach((fid) => {
          const uri = monacoRef.current!.Uri.parse(`file:///${fid}`);
          monacoRef.current!.editor.getModel(uri)?.dispose();
        });
      }
      // Remove from in-memory mirror
      removedIds.forEach((fid) => {
        delete fileContentsRef.current[fid];
      });
      // Remove from WebContainer filesystem
      if (wcRef.current) {
        wcRef.current.fs.rm(node.id, { recursive: true }).catch(console.error);
      }
      setFileTree((prev) => deleteNode(prev, node.id));
      setOpenTabs((prev) => {
        const next = prev.filter((t) => !removedIds.includes(t.id));
        if (removedIds.includes(activeTabId) && next.length > 0) {
          setActiveTabId(next[next.length - 1].id);
        } else if (next.length === 0) {
          setActiveTabId("");
        }
        return next;
      });
      // ── Delete from DB immediately so reload won't restore it ──────────
      if (user && projectId) {
        user.getIdToken().then((token) => {
          deleteProjectFile(token, projectId, node.id).catch(console.error);
        });
      }
    },
    [activeTabId, user, projectId],
  );

  const handleRename = useCallback(
    (node: FileNode, newName: string) => {
      const oldId = node.id;
      const parentId = getNodeParentId(fileTree, oldId) ?? null;
      if (hasSiblingWithName(fileTree, parentId, newName, oldId)) {
        setSubmitPrompt(
          `"${newName}" already exists in this folder — choose a different name.`,
        );
        return;
      }
      const parts = oldId.split("/");
      parts[parts.length - 1] = newName;
      const newId = parts.join("/");

      // Re-key the model(s): create new model with same content, dispose old
      if (monacoRef.current) {
        if (node.type === "file") {
          const uri = monacoRef.current.Uri.parse(`file:///${oldId}`);
          const oldModel = monacoRef.current.editor.getModel(uri);
          if (oldModel) {
            const content = oldModel.getValue();
            const lang = getFileLanguage({ ...node, name: newName });
            oldModel.dispose();
            const newUri = monacoRef.current.Uri.parse(`file:///${newId}`);
            monacoRef.current.editor.createModel(content, lang, newUri);
          }
        } else {
          // Folder rename: rebase all descendant models
          const remap = (
            children: FileNode[],
            oldPfx: string,
            newPfx: string,
          ) => {
            children.forEach((c) => {
              const cNewId = c.id.replace(oldPfx, newPfx);
              if (c.type === "file" && monacoRef.current) {
                const uri = monacoRef.current.Uri.parse(`file:///${c.id}`);
                const m = monacoRef.current.editor.getModel(uri);
                if (m) {
                  const content = m.getValue();
                  const lang = getFileLanguage(c);
                  m.dispose();
                  const newUri = monacoRef.current.Uri.parse(
                    `file:///${cNewId}`,
                  );
                  monacoRef.current.editor.createModel(content, lang, newUri);
                }
              } else if (c.children) {
                remap(c.children, oldPfx, newPfx);
              }
            });
          };
          remap(node.children ?? [], oldId, newId);
        }
      }

      setFileTree((prev) => renameNode(prev, oldId, newName));

      // Rekey in-memory mirror
      if (node.type === "file") {
        if (fileContentsRef.current[oldId] !== undefined) {
          fileContentsRef.current[newId] = fileContentsRef.current[oldId];
          delete fileContentsRef.current[oldId];
        }
      } else {
        // Folder: rekey all descendants
        Object.keys(fileContentsRef.current).forEach((key) => {
          if (key.startsWith(oldId + "/")) {
            fileContentsRef.current[key.replace(oldId, newId)] =
              fileContentsRef.current[key];
            delete fileContentsRef.current[key];
          }
        });
      }

      setOpenTabs((prev) =>
        prev.map((t) => {
          if (t.id === oldId) return { ...t, id: newId, name: newName };
          if (t.id.startsWith(oldId + "/")) {
            return { ...t, id: t.id.replace(oldId, newId) };
          }
          return t;
        }),
      );
      if (activeTabId === oldId) setActiveTabId(newId);

      // Rename in WebContainer: read old → write new path → delete old
      if (wcRef.current) {
        const wc = wcRef.current;
        if (node.type === "file") {
          wc.fs
            .readFile(oldId, "utf-8")
            .then((content) =>
              wc.fs.writeFile(newId, content).then(() => wc.fs.rm(oldId)),
            )
            .catch(console.error);
        } else {
          // For folders, move each file individually (WC has no rename/mv)
          const moveAll = (
            children: FileNode[],
            oldPfx: string,
            newPfx: string,
          ): Promise<void>[] =>
            children.flatMap((c) => {
              const cOld = c.id;
              const cNew = c.id.replace(oldPfx, newPfx);
              if (c.type === "file") {
                return [
                  wc.fs
                    .readFile(cOld, "utf-8")
                    .then((content) =>
                      wc.fs.writeFile(cNew, content).then(() => wc.fs.rm(cOld)),
                    ),
                ];
              }
              return moveAll(c.children ?? [], oldPfx, newPfx);
            });
          Promise.all(moveAll(node.children ?? [], oldId, newId))
            .then(() => wc.fs.rm(oldId, { recursive: true }))
            .catch(console.error);
        }
      }
    },
    [activeTabId, fileTree],
  );

  const handleFileOpen = useCallback((node: FileNode) => {
    const lang = getFileLanguage(node);
    setOpenTabs((prev) => {
      if (prev.find((t) => t.id === node.id)) return prev;
      return [...prev, { id: node.id, name: node.name, language: lang }];
    });
    setActiveTabId(node.id);
    setSelectedExplorerItemId(node.id);

    // Read latest content from WC and update the Monaco model + in-memory mirror
    if (wcRef.current) {
      wcRef.current.fs
        .readFile(node.id, "utf-8")
        .then((content) => {
          fileContentsRef.current[node.id] = content;
          // If the model is already open in Monaco, push the update
          if (monacoRef.current) {
            const uri = monacoRef.current.Uri.parse(`file:///${node.id}`);
            const model = monacoRef.current.editor.getModel(uri);
            if (model && model.getValue() !== content) {
              model.setValue(content);
            }
          }
        })
        .catch(() => {
          // File not yet in WC (e.g. brand-new) — seed it from defaults
          const fallback =
            fileContentsRef.current[node.id] ?? getFileContent(node.id);
          fileContentsRef.current[node.id] = fallback;
          wcRef.current!.fs.writeFile(node.id, fallback).catch(console.error);
        });
    }
  }, []);

  const handleFolderClick = useCallback((node: FileNode) => {
    setSelectedExplorerItemId(node.id);
  }, []);

  // Applies a pending Cmd/Ctrl+Click navigation once its target tab/model is
  // actually mounted in Monaco (tab switches are async: state → model swap).
  useEffect(() => {
    const pending = pendingRevealRef.current;
    if (!pending || pending.fileId !== activeTabId) return;

    const tryReveal = () => {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      if (!editor || !monaco) return false;
      const uri = monaco.Uri.parse(`file:///${pending.fileId}`);
      const model = monaco.editor.getModel(uri);
      if (!model || editor.getModel() !== model) return false;

      const line = Math.min(pending.line, model.getLineCount());
      const lineContent = model.getLineContent(line);
      const col = pending.word
        ? Math.max(1, lineContent.indexOf(pending.word) + 1)
        : 1;
      const endCol = pending.word ? col + pending.word.length : col;

      editor.setSelection({
        startLineNumber: line,
        startColumn: col,
        endLineNumber: line,
        endColumn: endCol,
      });
      editor.revealLineInCenter(line);
      editor.focus();
      return true;
    };

    if (tryReveal()) {
      pendingRevealRef.current = null;
      return;
    }
    let attempts = 0;
    const id = setInterval(() => {
      attempts += 1;
      if (tryReveal() || attempts > 20) {
        clearInterval(id);
        pendingRevealRef.current = null;
      }
    }, 50);
    return () => clearInterval(id);
  }, [activeTabId]);

  const handleTabClose = useCallback(
    (tabId: string) => {
      setOpenTabs((prev) => {
        const next = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId && next.length > 0) {
          setActiveTabId(next[next.length - 1].id);
        }
        return next;
      });
    },
    [activeTabId],
  );

  // ── Save to backend ────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!user || !projectId) return;
    if (saveStatus === "saving") return; // don't double-save
    // WC's fs may currently hold a past phase's frozen snapshot, not the
    // live tree — never persist that as if it were current work.
    if (viewingPastPhase !== null) return;
    setSaveStatus("saving");
    try {
      const token = await user.getIdToken();
      // Skip files whose content contains null bytes (binary files)
      const isBinary = (content: string) => content.includes("\x00");

      const fileNodes = fileTree.flatMap(function flat(
        n: FileNode,
      ): FileNode[] {
        return n.type === "file" ? [n] : (n.children ?? []).flatMap(flat);
      });

      const entries: Array<{
        filePath: string;
        content: string;
        isDirectory: boolean;
      }> = [];
      for (const n of fileNodes) {
        if (isSaveExcluded(n.id)) continue;
        let content = fileContentsRef.current[n.id];
        if (content === undefined && wcRef.current) {
          try {
            content = await wcRef.current.fs.readFile(n.id, "utf-8");
            fileContentsRef.current[n.id] = content;
          } catch (e) {
            content = "";
          }
        }
        if (content !== undefined && !isBinary(content)) {
          entries.push({ filePath: n.id, content, isDirectory: false });
        }
      }

      // Also add folder entries from the fileTree
      function collectFolders(
        nodes: FileNode[],
      ): Array<{ filePath: string; content: string; isDirectory: boolean }> {
        const out: Array<{
          filePath: string;
          content: string;
          isDirectory: boolean;
        }> = [];
        for (const n of nodes) {
          if (n.type === "folder" && !isSaveExcluded(n.id)) {
            out.push({ filePath: n.id, content: "", isDirectory: true });
            out.push(...collectFolders(n.children ?? []));
          }
        }
        return out;
      }
      const folderEntries = collectFolders(fileTree);
      const allCurrentPaths = new Set([
        ...folderEntries.map((e) => e.filePath),
        ...entries.map((e) => e.filePath),
      ]);

      // ── Sync deletions: remove any DB records no longer in the current tree ──
      try {
        const { files: dbFiles } = await listProjectFiles(token, projectId);
        if (dbFiles && dbFiles.length > 0) {
          const stale = dbFiles.filter(
            (f: ProjectFileDTO) => !allCurrentPaths.has(f.file_path),
          );
          await Promise.all(
            stale.map((f: ProjectFileDTO) =>
              deleteProjectFile(token, projectId, f.file_path).catch(
                console.error,
              ),
            ),
          );
        }
      } catch {
        // Non-fatal: proceed with upsert even if cleanup fails
      }

      await batchUpsertFiles(token, projectId, [...folderEntries, ...entries]);
      setSaveStatus("saved");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveStatus("idle"), 8000);
    } catch (err) {
      console.error("[Save] failed:", err);
      setSaveStatus("idle");
    }
  }, [user, projectId, saveStatus, fileTree, viewingPastPhase]);

  // Any .html file anywhere in the tree means there's something to serve —
  // used to decide whether the Run button shows at all.
  const hasHtmlFile = fileTree.some(function has(n: FileNode): boolean {
    if (n.type === "file") return n.name.toLowerCase().endsWith(".html");
    return (n.children ?? []).some(has);
  });
  const snapshotHasHtmlFile = snapshotTree.some(function has(
    n: FileNode,
  ): boolean {
    if (n.type === "file") return n.name.toLowerCase().endsWith(".html");
    return (n.children ?? []).some(has);
  });

  // ── Run: static server with hot reload for HTML/CSS/JS projects ───────────
  // Writes a small dependency-free Node http server (STATIC_SERVER_SCRIPT)
  // into the container and runs it — deliberately not an npm package like
  // live-server/serve, since fs-watching packages can silently fail inside
  // WebContainer's virtual filesystem with zero visible error. The existing
  // `wc.on("server-ready", ...)` listener (registered once at boot) picks up
  // whatever URL/port the server binds to, so no extra plumbing is needed here.
  const handleToggleRun = useCallback(async () => {
    if (!wcRef.current) return;

    if (previewServerRunning || previewProcessRef.current) {
      previewProcessRef.current?.kill();
      previewProcessRef.current = null;
      setPreviewServerRunning(false);
      setPreviewUrl(null);
      return;
    }

    setPreviewServerStarting(true);
    try {
      await wcRef.current.fs.writeFile(
        STATIC_SERVER_FILENAME,
        STATIC_SERVER_SCRIPT,
      );
      const proc = await wcRef.current.spawn("node", [STATIC_SERVER_FILENAME]);
      proc.output.pipeTo(
        new WritableStream({
          write: (chunk) => console.log("[preview server]", chunk),
        }),
      );
      previewProcessRef.current = proc;
      setPreviewServerRunning(true);
      setActivePanel("split");
      proc.exit.then(() => {
        previewProcessRef.current = null;
        setPreviewServerRunning(false);
      });
    } catch (err) {
      console.error("[Run] failed to start live-server:", err);
    } finally {
      setPreviewServerStarting(false);
    }
  }, [previewServerRunning]);

  // Stop the preview server if the user navigates away mid-session.
  useEffect(() => {
    return () => {
      previewProcessRef.current?.kill();
    };
  }, []);

  // ── Auto-save every 10 seconds ─────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        user &&
        projectId &&
        Object.keys(fileContentsRef.current).length > 0
      ) {
        handleSave();
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [handleSave, user, projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Ctrl+S keyboard shortcut ───────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  const activePhase = phases[activePhaseIdx] ?? null;

  // Selecting an already-completed phase shows its frozen snapshot
  // (read-only overlay) instead of switching the live editable tree — the
  // live tree only ever reflects the current phase's in-progress work.
  // Stops any preview server and swaps WC's mounted files back to the live
  // tree — the one true "return to live" step, shared by every path that
  // can leave the snapshot view (there were two before this was unified:
  // the overlay's own "Back to current" button, and clicking the current
  // phase directly in PhaseSelector while a snapshot was showing — only
  // the first one actually restored WC, leaving the second able to hand
  // control back to the live view while WC silently kept the old phase's
  // files mounted underneath it).
  const restoreLiveToWc = useCallback(async () => {
    previewProcessRef.current?.kill();
    previewProcessRef.current = null;
    setPreviewServerRunning(false);
    setPreviewUrl(null);
    if (wcRef.current) {
      await replaceWcFiles(
        wcRef.current,
        fileTree,
        (id) => fileContentsRef.current[id] ?? "",
      );
    }
  }, [fileTree]);

  // Guards against rapid phase switches racing each other — each call
  // bumps this, and every step below checks it's still the latest call
  // before touching WC or state, so a superseded in-flight switch can't
  // clobber a newer one's result.
  const wcSwapGenRef = useRef(0);

  const handleSelectPhase = useCallback(
    async (idx: number) => {
      setActivePhaseIdx(idx);
      const phase = phases[idx];
      const gen = ++wcSwapGenRef.current;

      if (!phase || !user || phase.phase_number >= currentPhaseNum) {
        await restoreLiveToWc();
        if (wcSwapGenRef.current !== gen) return;
        setViewingPastPhase(null);
        return;
      }

      setViewingPastPhase(phase.phase_number);
      setSnapshotLoading(true);
      setSnapshotError(null);
      try {
        const token = await user.getIdToken();
        const { files } = await getPhaseSnapshot(
          token,
          projectId,
          phase.phase_number,
        );
        if (wcSwapGenRef.current !== gen) return;
        const entries = (files ?? []).map((f) => ({
          filePath: f.file_path,
          content: f.content,
          isDirectory: f.is_directory,
        }));
        setSnapshotTree(buildFileTreeFromEntries(entries));
        const contents: Record<string, string> = {};
        entries
          .filter((e) => !e.isDirectory)
          .forEach((e) => {
            contents[e.filePath] = e.content;
          });
        setSnapshotContents(contents);
        setSnapshotActiveTabId(entries.find((e) => !e.isDirectory)?.filePath ?? "");

        // Stop any live preview, then swap WC's mounted files to this
        // phase's frozen snapshot so Run/Preview show it exactly as
        // submitted — same mechanism as live, just pointed at old files.
        previewProcessRef.current?.kill();
        previewProcessRef.current = null;
        setPreviewServerRunning(false);
        setPreviewUrl(null);
        if (wcRef.current) {
          await replaceWcFiles(
            wcRef.current,
            buildFileTreeFromEntries(entries),
            (id) => contents[id] ?? "",
          );
        }
        if (wcSwapGenRef.current !== gen) return;
      } catch (err: any) {
        if (wcSwapGenRef.current === gen) {
          setSnapshotError(err.message ?? "Failed to load this phase's snapshot.");
        }
      } finally {
        if (wcSwapGenRef.current === gen) setSnapshotLoading(false);
      }
    },
    [phases, currentPhaseNum, user, projectId, restoreLiveToWc],
  );

  // Leaving the read-only snapshot view via the overlay's own banner
  // button — restore WC's fs to the live tree before handing control back
  // (the poll/merge loop stays paused until viewingPastPhase actually
  // clears, via viewingPastPhaseRef, so it can't race this restore).
  const handleClosePastPhase = useCallback(async () => {
    const gen = ++wcSwapGenRef.current;
    await restoreLiveToWc();
    if (wcSwapGenRef.current !== gen) return;
    setViewingPastPhase(null);
    const liveIdx = phases.findIndex((p) => p.phase_number === currentPhaseNum);
    setActivePhaseIdx(liveIdx >= 0 ? liveIdx : 0);
  }, [phases, currentPhaseNum, restoreLiveToWc]);

  // ── Unprompted nudges ─────────────────────────────────────────────────────
  // Suppressed whenever the user is already being helped or is reading history:
  // a nudge on top of an open assistant, a fresh review verdict, or frozen
  // past work is noise at best.
  const criterionTextById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of activePhase?.criteria ?? []) map[c.id] = c.text;
    return map;
  }, [activePhase]);

  const {
    suggestion,
    record: recordStuck,
    dismiss: dismissSuggestion,
    turnOff: turnOffSuggestions,
  } = useStuckDetector({
    projectId,
    activeFilePath: activeTabId || undefined,
    currentTask: activePhase
      ? `${projectName} — Phase ${activePhase.phase_number}: ${activePhase.title}`
      : projectName,
    getToken: useCallback(() => user!.getIdToken(), [user]),
    criterionText: criterionTextById,
    suppressed: aiOpen || reviewResult !== null || viewingPastPhase !== null,
  });

  useEffect(() => {
    stuckRef.current = recordStuck;
  }, [recordStuck]);

  // ── Submit for review ────────────────────────────────────────────────────
  //
  // One server call does everything: it checks the phase's knowledge checks are
  // all *correct*, grades the submitted work against the phase goal it looks up
  // itself, and advances the phase only if the grader passed it.
  //
  // Nothing here decides the outcome. The client used to regex "VERDICT: MET"
  // out of the AI's reply and then call a separate advance endpoint on a match —
  // which meant the browser decided advancement, the endpoint would advance
  // anyone who called it, and a reply merely *describing* a passing verdict
  // could trip the match. Now the client submits and renders the answer.
  const handleSubmitForReview = useCallback(async () => {
    if (!user || !activePhase) return;
    setSubmitChecking(true);
    setSubmitPrompt(null);
    try {
      const token = await user.getIdToken();

      // Cheap client-side pre-check, purely to avoid burning a grading call on
      // a submission the server will refuse anyway. Not a gate — the server
      // enforces the same rule, on correctness, and doesn't trust this.
      const { checks } = await getPhaseKnowledgeChecks(token, activePhase.id);
      const correct = checks.filter((c) => c.attempted && c.is_correct).length;
      if (checks.length > 0 && correct < checks.length) {
        setSubmitPrompt(
          `Answer all knowledge checks for this phase correctly before submitting — ${correct}/${checks.length} so far. Retry as many times as you need.`,
        );
        setLeftTab("knowledge-checks");
        return;
      }

      const result = await submitPhaseReview(token, projectId, activeTabId);
      setReviewResult(result);

      // The strongest stuck signal there is: the same criterion failing across
      // submissions means the user is trying and not converging, and we know
      // exactly what on.
      if (result.verdict === "met") {
        recordStuck({ type: "review_passed" });
      } else if (result.verdict === "not_met") {
        recordStuck({
          type: "review_failed",
          failedCriterionIds: result.results
            .filter((r) => !r.passed && !r.ungraded)
            .map((r) => r.criterion_id),
        });
      }

      if (result.verdict === "blocked") {
        setSubmitPrompt(result.feedback);
        setLeftTab("knowledge-checks");
        return;
      }

      // Adopt the server's phase number rather than incrementing locally —
      // it's authoritative, and it's what actually reflects whether the
      // advance happened.
      if (result.advanced) {
        setCurrentPhaseNum(result.current_phase);
        setActivePhaseIdx((i) => Math.min(i + 1, phases.length - 1));
      }
    } catch (err: any) {
      setSubmitPrompt(err.message ?? "Couldn't submit for review — try again.");
    } finally {
      setSubmitChecking(false);
    }
  }, [user, activePhase, projectId, activeTabId, phases.length]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="h-screen bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost tracking-widest uppercase">
            Loading workspace
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <p className="font-(family-name:--font-cormorant) text-2xl text-txt mb-2">
            Failed to load project
          </p>
          <p className="font-(family-name:--font-dm) text-sm text-txt-muted mb-6">
            {error}
          </p>
          <Link
            href="/dashboard"
            className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-accent border border-accent/30 px-5 py-2 rounded-sm hover:bg-accent/5 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-void text-txt overflow-hidden">
      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div className="h-12 shrink-0 flex items-center justify-between px-5 bg-surface border-b border-border-s z-40">
        {/* Left: back + project name + phase selector */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 font-(family-name:--font-dm) text-[11px] text-txt-ghost hover:text-txt transition-colors"
          >
            <ArrowLeft size={13} />
            Dashboard
          </Link>
          <span className="text-border-s">|</span>
          <span className="font-(family-name:--font-cormorant) text-[16px] font-medium text-txt">
            {projectName}
          </span>
          {phases.length > 0 && (
            <PhaseSelector
              phases={phases}
              activeIdx={activePhaseIdx}
              currentPhaseNum={currentPhaseNum}
              onSelect={handleSelectPhase}
            />
          )}
        </div>

        {/* Right: AI + save + run buttons */}
        <div className="flex items-center gap-3">
          {/* Run — HTML/CSS/JS projects only, starts a static server with hot reload.
              Stays in the top bar while viewing a past phase too — WC's fs is
              already swapped to that phase's snapshot, so this runs it exactly
              as submitted, same mechanism as live. */}
          {(viewingPastPhase === null ? hasHtmlFile : snapshotHasHtmlFile) && (
            <button
              onClick={handleToggleRun}
              disabled={previewServerStarting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-(family-name:--font-dm) text-[11px] uppercase tracking-widest border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  previewServerRunning
                    ? "border-accent/40 text-accent bg-accent/5"
                    : "border-border-s text-txt-ghost hover:text-accent hover:border-accent/30 hover:bg-surface"
                }
              `}
              title={
                previewServerRunning
                  ? "Stop the live server"
                  : "Run with live-reload"
              }
            >
              {previewServerStarting ? (
                <span className="w-2.5 h-2.5 rounded-full border border-accent/40 border-t-accent animate-spin" />
              ) : (
                <Play size={11} />
              )}
              {previewServerRunning
                ? "Stop"
                : previewServerStarting
                  ? "Starting…"
                  : "Run"}
            </button>
          )}
          {/* AI Assistant toggle */}
          <button
            onClick={() => setAiOpen((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-(family-name:--font-dm) text-[11px] uppercase tracking-widest border transition-all cursor-pointer
              ${
                aiOpen
                  ? "border-accent/40 text-accent bg-accent/5"
                  : "border-border-s text-txt-ghost hover:text-accent hover:border-accent/30 hover:bg-surface"
              }
            `}
            title="AI Assistant"
          >
            <Sparkles size={11} />
            AI
          </button>
          {/* Save + Submit — not shown at all while viewing a past phase's
              read-only snapshot; there's nothing here to save or resubmit. */}
          {viewingPastPhase === null && (
            <>
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-(family-name:--font-dm) text-[11px] uppercase tracking-widest border transition-all cursor-pointer
                  ${
                    saveStatus === "saved"
                      ? "border-accent/40 text-accent bg-accent/5"
                      : saveStatus === "saving"
                        ? "border-border-s text-txt-ghost cursor-not-allowed"
                        : "border-border-s text-txt-ghost hover:text-txt hover:border-accent/40 hover:bg-surface"
                  }
                `}
                title="Save files (Ctrl+S)"
              >
                {saveStatus === "saved" ? (
                  <CheckCircle2 size={11} className="text-accent" />
                ) : (
                  <Save size={11} />
                )}
                {saveStatus === "saving"
                  ? "Saving…"
                  : saveStatus === "saved"
                    ? "Saved"
                    : "Save"}
              </button>
              {/* Submit for review — one server call that checks this phase's
                  knowledge checks, grades the work, and advances on a pass. */}
              <button
                onClick={handleSubmitForReview}
                disabled={aiThinking || submitChecking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-(family-name:--font-dm) text-[11px] uppercase tracking-widest border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-accent/40 text-accent hover:bg-accent/5"
                title="Submit this phase for AI review"
              >
                {submitChecking ? (
                  <span className="w-2.5 h-2.5 rounded-full border border-accent/40 border-t-accent animate-spin" />
                ) : (
                  <SendHorizonal size={11} />
                )}
                {submitChecking ? "Reviewing…" : aiThinking ? "Thinking…" : "Submit"}
              </button>
            </>
          )}
        </div>
      </div>

      {submitPrompt && (
        <div className="px-4 py-2 bg-warning/10 border-b border-warning/30 flex items-center justify-between gap-3">
          <span className="font-(family-name:--font-dm) text-[11px] text-warning">
            {submitPrompt}
          </span>
          <button
            onClick={() => setSubmitPrompt(null)}
            className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost hover:text-txt transition-colors cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ── SPLIT WORKSPACE ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {viewingPastPhase !== null && (
          <PastPhaseSnapshotOverlay
            phaseNumber={viewingPastPhase}
            loading={snapshotLoading}
            error={snapshotError}
            tree={snapshotTree}
            contents={snapshotContents}
            activeFileId={snapshotActiveTabId}
            onSelectFile={setSnapshotActiveTabId}
            onClose={handleClosePastPhase}
            hasHtmlFile={snapshotHasHtmlFile}
            previewUrl={previewUrl}
            activePanel={activePanel}
            onSetActivePanel={setActivePanel}
            aiOpen={aiOpen}
            aiPanelWidth={aiPanelWidth}
            onAiPanelDragStart={handleAiPanelDragStart}
            onAiClose={() => setAiOpen(false)}
            projectId={projectId}
            phaseId={phases.find((p) => p.phase_number === viewingPastPhase)?.id}
            currentTask={
              [
                projectName
                  ? `Project: ${projectName}${
                      projectTechStack.length
                        ? ` (${projectTechStack.join(", ")})`
                        : ""
                    }`
                  : "",
                `Viewing Phase ${viewingPastPhase} as submitted (read-only history)`,
              ]
                .filter(Boolean)
                .join(" — ")
            }
            getToken={() => user!.getIdToken()}
            wcRef={wcRef}
            leftOffset={phaseGuideWidth + 6}
          />
        )}
        {/* LEFT PANEL — Phase description */}
        <div
          className="shrink-0 bg-void flex flex-col overflow-hidden"
          style={{ width: phaseGuideWidth }}
        >
          {/* Panel header */}
          <div className="h-9 shrink-0 flex items-center gap-2 px-4 border-b border-border-s bg-surface/50">
            <BookOpen size={12} className="text-accent" />
            <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              Phase Guide
            </span>
          </div>

          {/* Guide sub-tabs: Description | Resources | Knowledge Checks */}
          <div className="flex shrink-0 border-b border-border-s">
            {(
              [
                { id: "description", label: "Description" },
                { id: "resources", label: "Resources" },
                { id: "knowledge-checks", label: "Knowledge Checks" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLeftTab(tab.id)}
                className={`px-4 py-2 font-(family-name:--font-dm) text-[10px] uppercase tracking-widest border-b-2 transition-colors cursor-pointer ${
                  leftTab === tab.id
                    ? "text-accent border-accent"
                    : "text-txt-ghost border-transparent hover:text-txt"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {leftTab === "description" ? (
            <DescriptionPanel phase={activePhase} projectName={projectName} />
          ) : leftTab === "resources" ? (
            <ResourcesPanel
              phaseId={activePhase?.id ?? null}
              phaseNumber={activePhase?.phase_number}
              projectId={projectId}
              getToken={() => user!.getIdToken()}
            />
          ) : (
            <KnowledgeChecksPanel
              phaseId={activePhase?.id ?? null}
              phaseNumber={activePhase?.phase_number}
              projectId={projectId}
              getToken={() => user!.getIdToken()}
              onGraded={(checkId, isCorrect) =>
                recordStuck(
                  isCorrect
                    ? { type: "check_passed", checkId }
                    : { type: "check_failed", checkId },
                )
              }
            />
          )}
        </div>

        {/* Phase guide ↔ Explorer drag divider */}
        <div
          onMouseDown={handlePhaseGuideDragStart}
          className="w-1.5 shrink-0 bg-border-s hover:bg-accent/40 cursor-col-resize transition-colors z-20"
        />

        <div className="flex-1 flex overflow-hidden min-w-0">
          <div
            className="shrink-0 bg-void border-r border-border-s flex flex-col overflow-hidden relative"
            style={{ width: explorerWidth }}
          >
            <div className="h-9 shrink-0 flex items-center gap-2 px-3 border-b border-border-s bg-surface/50">
              <Folder size={12} className="text-accent/60" />
              <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost flex-1">
                Explorer
              </span>
              {/* New file / new folder buttons */}
              <button
                title="New file"
                onClick={() => {
                  setPendingParentId(
                    getParentFolderId(selectedExplorerItemId, fileTree),
                  );
                  setPendingType("file");
                }}
                className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
              >
                <FilePlus size={13} />
              </button>
              <button
                title="New folder"
                onClick={() => {
                  setPendingParentId(
                    getParentFolderId(selectedExplorerItemId, fileTree),
                  );
                  setPendingType("folder");
                }}
                className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
              >
                <FolderPlus size={13} />
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto py-1"
              onClick={(e) => {
                // Only trigger when clicking the blank area, not on tree nodes
                if (e.target === e.currentTarget) {
                  setSelectedExplorerItemId("");
                }
              }}
            >
              {[...fileTree]
                .sort((a, b) => {
                  if (a.type === b.type) return a.name.localeCompare(b.name);
                  return a.type === "folder" ? -1 : 1;
                })
                .map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    activeFileId={activeTabId}
                    selectedExplorerItemId={selectedExplorerItemId}
                    onFileClick={handleFileOpen}
                    onFolderClick={handleFolderClick}
                    pendingParentId={pendingParentId ?? null}
                    pendingType={pendingType}
                    onCommitCreate={handleCommitCreate}
                    onCancelCreate={handleCancelCreate}
                    onDelete={handleDelete}
                    onRename={handleRename}
                  />
                ))}
              {/* Root-level inline input (when no parent folder selected) */}
              {pendingParentId === null && (
                <div className="flex items-center gap-1.5 px-2 py-0.75 pl-2">
                  {pendingType === "folder" ? (
                    <Folder size={13} className="text-accent/50 shrink-0" />
                  ) : (
                    <FileCode size={13} className="text-accent/60 shrink-0" />
                  )}
                  <input
                    autoFocus
                    value={rootInputVal}
                    onChange={(e) => setRootInputVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleCommitCreate(null, rootInputVal, pendingType!);
                      if (e.key === "Escape") handleCancelCreate();
                    }}
                    onBlur={() =>
                      handleCommitCreate(null, rootInputVal, pendingType!)
                    }
                    placeholder={
                      pendingType === "folder" ? "folder name" : "file name"
                    }
                    className="flex-1 bg-transparent border-b border-accent/50 text-[12px] font-(family-name:--font-dm) text-txt outline-none placeholder:text-txt-ghost min-w-0"
                  />
                </div>
              )}
            </div>
            {/* Drag handle — right edge of explorer */}
            <div
              onMouseDown={handleExplorerDragStart}
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-accent/30 transition-colors z-10"
            />
          </div>

          {/* EDITOR + PREVIEW AREA */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Panel tab bar: open file tabs + Preview toggle */}
            <div className="h-9 shrink-0 flex items-center gap-0 border-b border-border-s bg-surface/50 overflow-x-auto no-scrollbar">
              {/* File tabs — shown in editor and split modes */}
              {activePanel !== "preview" &&
                openTabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`flex items-center gap-1.5 px-3 h-full border-r border-border-s cursor-pointer group transition-colors shrink-0
                    ${
                      tab.id === activeTabId
                        ? "bg-void border-b-2 border-b-accent text-accent"
                        : "text-txt-ghost hover:text-txt hover:bg-void/50"
                    }
                  `}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    {getFileIcon(tab.name)}
                    <span className="font-(family-name:--font-dm) text-[11px]">
                      {tab.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTabClose(tab.id);
                      }}
                      className="ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-surface transition-all cursor-pointer"
                    >
                      <X size={9} />
                    </button>
                  </div>
                ))}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Editor / Preview switcher */}
              <PanelModeSwitcher
                activePanel={activePanel}
                onChange={setActivePanel}
                previewUrl={previewUrl}
              />
            </div>

            {/* Panel content */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* ── EDITOR pane — visible in "editor" and "split" ── */}
              <div
                className={`flex flex-col overflow-hidden min-h-0 min-w-0 ${
                  activePanel === "preview"
                    ? "hidden"
                    : activePanel === "split"
                      ? "h-full"
                      : "flex-1"
                }`}
                style={
                  activePanel === "split"
                    ? { width: `${splitPos}%`, flexShrink: 0 }
                    : undefined
                }
              >
                {openTabs.length === 0 ? (
                  <div className="h-full flex items-center justify-center bg-void">
                    <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost uppercase tracking-widest">
                      Select a file to start editing
                    </p>
                  </div>
                ) : (
                  <MonacoEditor
                    height="100%"
                    theme="vs-dark"
                    path={activeTabId}
                    language={
                      openTabs.find((t) => t.id === activeTabId)?.language ||
                      "javascript"
                    }
                    defaultValue={
                      fileContentsRef.current[activeTabId] ??
                      getFileContent(activeTabId)
                    }
                    onMount={(editor, monaco) => {
                      editorRef.current = editor;
                      monacoRef.current = monaco as unknown as typeof Monaco;

                      // ── Cmd/Ctrl+Click word popup ─────────────────────────
                      let popup: HTMLDivElement | null = null;

                      const removePopup = () => {
                        popup?.remove();
                        popup = null;
                      };

                      editor.onMouseDown((e) => {
                        // ── Real Cmd (Mac) / Ctrl (Win/Linux) click: go to
                        // the import's definition — file and/or symbol ──
                        const isGotoClick = e.event.metaKey || e.event.ctrlKey;
                        if (isGotoClick) {
                          // Always swallow it: Monaco's default binding for
                          // this chord adds a secondary cursor, which we
                          // don't want here regardless of whether we can
                          // resolve a target.
                          e.event.preventDefault();
                          removePopup();

                          if (
                            e.target.type !==
                            monaco.editor.MouseTargetType.CONTENT_TEXT
                          ) {
                            return;
                          }
                          const pos = e.target.position;
                          const model = editor.getModel();
                          if (!pos || !model) return;

                          const currentFileId = model.uri.path.replace(
                            /^\//,
                            "",
                          );
                          const lineContent = model.getLineContent(
                            pos.lineNumber,
                          );
                          const parsed = parseImportLine(lineContent);
                          if (!parsed) return;

                          const isPython = model.getLanguageId() === "python";

                          const resolvedId = resolveModulePath(
                            currentFileId,
                            parsed.specifier,
                            fileTreeRef.current,
                            isPython,
                          );
                          if (!resolvedId) return;

                          const clickedInSpecifier =
                            pos.column >= parsed.specifierStart &&
                            pos.column <= parsed.specifierEnd;

                          const wordInfo = model.getWordAtPosition(pos);
                          const clickedName = clickedInSpecifier
                            ? null
                            : parsed.names.find(
                                (n) => n.local === wordInfo?.word,
                              );

                          if (!clickedInSpecifier && !clickedName) return;

                          const targetNode = findFileNodeById(
                            fileTreeRef.current,
                            resolvedId,
                          );
                          if (!targetNode) return;

                          const navigate = (content: string) => {
                            const line = clickedName
                              ? (findDefinitionLine(
                                  content,
                                  clickedName.imported,
                                ) ?? 1)
                              : 1;
                            pendingRevealRef.current = {
                              fileId: resolvedId,
                              line,
                              word: clickedName?.imported,
                            };
                            handleFileOpen(targetNode);
                          };

                          const cached = fileContentsRef.current[resolvedId];
                          if (cached !== undefined) {
                            navigate(cached);
                          } else if (wcRef.current) {
                            wcRef.current.fs
                              .readFile(resolvedId, "utf-8")
                              .then(navigate)
                              .catch(() => handleFileOpen(targetNode));
                          } else {
                            handleFileOpen(targetNode);
                          }
                          return;
                        }

                        // Option (Mac) / Alt (Windows/Linux)
                        const isCmdClick = e.event.altKey;
                        if (!isCmdClick) {
                          removePopup();
                          return;
                        }
                        if (
                          e.target.type !==
                          monaco.editor.MouseTargetType.CONTENT_TEXT
                        ) {
                          removePopup();
                          return;
                        }

                        const pos = e.target.position;
                        if (!pos) return;

                        const model = editor.getModel();
                        if (!model) return;

                        const wordInfo = model.getWordAtPosition(pos);
                        if (!wordInfo) return;

                        const lineContent = model.getLineContent(pos.lineNumber);

                        e.event.preventDefault();
                        removePopup();

                        // Get pixel coords of the word's start
                        const wordPos = editor.getScrolledVisiblePosition({
                          lineNumber: pos.lineNumber,
                          column: wordInfo.startColumn,
                        });
                        if (!wordPos) return;

                        const editorDom = editor.getDomNode();
                        if (!editorDom) return;
                        const editorRect = editorDom.getBoundingClientRect();

                        const x = editorRect.left + wordPos.left;
                        const y = editorRect.top + wordPos.top;

                        // Build popup
                        popup = document.createElement("div");
                        popup.style.cssText = `
                          position: fixed;
                          left: ${x}px;
                          top: ${y - 8}px;
                          transform: translateY(-100%);
                          z-index: 9999;
                          background: #12141a;
                          border: 1px solid rgba(127,255,212,0.18);
                          border-radius: 6px;
                          padding: 10px 14px;
                          min-width: 220px;
                          max-width: 340px;
                          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
                          font-family: 'DM Sans', system-ui, sans-serif;
                          font-size: 12px;
                          color: #a0aabf;
                          pointer-events: none;
                        `;

                        // Arrow pointing down
                        const arrow = document.createElement("div");
                        arrow.style.cssText = `
                          position: absolute;
                          bottom: -5px;
                          left: 16px;
                          width: 8px;
                          height: 8px;
                          background: #12141a;
                          border-right: 1px solid rgba(127,255,212,0.18);
                          border-bottom: 1px solid rgba(127,255,212,0.18);
                          transform: rotate(45deg);
                        `;
                        popup.appendChild(arrow);

                        // Word label
                        const label = document.createElement("div");
                        label.style.cssText = `
                          font-size: 10px;
                          text-transform: uppercase;
                          letter-spacing: 0.12em;
                          color: rgba(127,255,212,0.7);
                          margin-bottom: 6px;
                        `;
                        label.textContent = wordInfo.word;
                        popup.appendChild(label);

                        // Content area (loading → text)
                        const content = document.createElement("div");
                        content.style.cssText = `line-height: 1.6;`;

                        const spinner = document.createElement("div");
                        spinner.style.cssText = `
                          display: flex;
                          align-items: center;
                          gap: 6px;
                          color: rgba(160,170,191,0.5);
                          font-size: 11px;
                        `;
                        spinner.innerHTML = `
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(127,255,212,0.5)" stroke-width="2.5"
                            style="animation: spin 0.8s linear infinite; flex-shrink:0;">
                            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke-opacity="0.2"/>
                            <path d="M21 12a9 9 0 0 1-9 9" stroke="rgba(127,255,212,0.7)"/>
                          </svg>
                          Looking up…
                        `;

                        if (!document.getElementById("__popup_spin_style")) {
                          const s = document.createElement("style");
                          s.id = "__popup_spin_style";
                          s.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
                          document.head.appendChild(s);
                        }

                        content.appendChild(spinner);
                        popup.appendChild(content);
                        document.body.appendChild(popup);

                        // Fire the real explain call immediately — capture this
                        // popup instance so a stale response (popup already
                        // dismissed / a newer click fired) is a no-op.
                        const thisPopup = popup;
                        (async () => {
                          let answer: HTMLDivElement | null = null;
                          const ensureAnswerEl = () => {
                            if (answer) return answer;
                            spinner.remove();
                            answer = document.createElement("div");
                            answer.style.cssText = `
                              font-size: 12px;
                              color: rgba(224,228,238,0.9);
                              line-height: 1.6;
                              white-space: pre-wrap;
                            `;
                            content.appendChild(answer);
                            return answer;
                          };

                          try {
                            const token = await user!.getIdToken();
                            const full = await sendChatMessage(
                              token,
                              {
                                projectId,
                                activeFilePath: activeTabId,
                                message: `Explain what "${wordInfo.word}" means in this line of code:\n${lineContent}`,
                                history: [],
                                mode: "explain",
                              },
                              (chunk) => {
                                if (popup !== thisPopup) return;
                                ensureAnswerEl().textContent += chunk;
                              },
                            );
                            if (popup !== thisPopup) return;
                            if (!full) {
                              ensureAnswerEl().textContent =
                                "No explanation available.";
                            }
                          } catch {
                            if (popup !== thisPopup) return;
                            const errEl = ensureAnswerEl();
                            errEl.style.color = "rgba(255,140,140,0.8)";
                            errEl.textContent =
                              "Couldn't reach the AI service — try again.";
                          }
                        })();
                      });

                      // Dismiss on Escape or click elsewhere
                      editor.onKeyDown((e) => {
                        if (e.keyCode === monaco.KeyCode.Escape) removePopup();
                      });
                      document.addEventListener(
                        "mousedown",
                        (e) => {
                          if (popup && !popup.contains(e.target as Node))
                            removePopup();
                        },
                        { capture: true },
                      );

                      // ── Live WC file sync ─────────────────────────────────
                      let writeTimer: ReturnType<typeof setTimeout> | null =
                        null;
                      editor.onDidChangeModelContent(() => {
                        // Feeds the stuck detector. Typing is the signal that
                        // suppresses nudges, not one that invites them —
                        // someone actively editing is by definition not stuck.
                        stuckRef.current?.({ type: "edit" });
                        if (writeTimer) clearTimeout(writeTimer);
                        writeTimer = setTimeout(() => {
                          const model = editor.getModel();
                          if (!model || !wcRef.current) return;
                          const filePath = model.uri.path.replace(/^\//, "");
                          const content = model.getValue();
                          fileContentsRef.current[filePath] = content;
                          wcRef.current.fs
                            .writeFile(filePath, content)
                            .catch(console.error);
                        }, 300);
                      });
                    }}
                    options={{
                      fontSize: 13,
                      fontFamily:
                        "'Fira Code', 'Cascadia Code', Consolas, monospace",
                      fontLigatures: true,
                      lineHeight: 22,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      padding: { top: 16, bottom: 16 },
                      smoothScrolling: true,
                      cursorBlinking: "smooth",
                      cursorSmoothCaretAnimation: "on",
                      renderLineHighlight: "gutter",
                      lineNumbers: "on",
                      glyphMargin: false,
                      folding: true,
                      bracketPairColorization: { enabled: true },
                      formatOnPaste: true,
                      tabSize: 2,
                      guides: { indentation: true, bracketPairs: true },
                    }}
                  />
                )}
              </div>

              {/* ── Split drag divider ── */}
              {activePanel === "split" && (
                <div
                  className="w-1.5 shrink-0 bg-border-s hover:bg-accent/40 cursor-col-resize transition-colors z-20"
                  onMouseDown={(e) => {
                    isSplitDragging.current = true;
                    const container = (e.currentTarget as HTMLElement)
                      .parentElement!;
                    document.body.style.cursor = "col-resize";
                    document.body.style.userSelect = "none";
                    const onMove = (ev: MouseEvent) => {
                      if (!isSplitDragging.current) return;
                      const rect = container.getBoundingClientRect();
                      const pct = Math.min(
                        80,
                        Math.max(
                          20,
                          ((ev.clientX - rect.left) / rect.width) * 100,
                        ),
                      );
                      setSplitPos(pct);
                    };
                    const onUp = () => {
                      isSplitDragging.current = false;
                      document.body.style.cursor = "";
                      document.body.style.userSelect = "";
                      window.removeEventListener("mousemove", onMove);
                      window.removeEventListener("mouseup", onUp);
                    };
                    window.addEventListener("mousemove", onMove);
                    window.addEventListener("mouseup", onUp);
                  }}
                />
              )}

              {/* ── PREVIEW pane — visible in "preview" and "split" ── */}
              {(activePanel === "preview" || activePanel === "split") && (
                <PreviewPane
                  previewUrl={previewUrl}
                  emptyState={
                    <div>
                      <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted mb-1">
                        No server running
                      </p>
                      <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost leading-relaxed max-w-60">
                        Start a dev server in the terminal (e.g.{" "}
                        <code className="px-1 py-0.5 bg-surface rounded text-accent/70 text-[10px] font-mono">
                          npm run dev
                        </code>
                        ) and the preview will appear here automatically.
                      </p>
                    </div>
                  }
                />
              )}
            </div>

            {/* Terminal panel */}
            <div
              className="flex flex-col border-t border-border-s bg-[#0d0d0d] shrink-0"
              style={{ height: terminalOpen ? terminalHeight : 36 }}
            >
              {/* Terminal header bar */}
              <div
                onMouseDown={terminalOpen ? handleDragStart : undefined}
                className={`h-9 shrink-0 flex items-center justify-between px-3 border-b border-border-s bg-surface/50 ${terminalOpen ? "cursor-row-resize" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-accent/70" />
                  <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
                    Terminal
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newId = `term-${Date.now()}`;
                      setTerminals((prev) => [
                        ...prev,
                        { id: newId, name: "bash" },
                      ]);
                      setActiveTerminalId(newId);
                      setTerminalOpen(true);
                    }}
                    className="p-1 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
                    title="New terminal"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => setTerminalOpen((v) => !v)}
                    className="p-1 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
                    title={
                      terminalOpen ? "Collapse terminal" : "Expand terminal"
                    }
                  >
                    {terminalOpen ? (
                      <Minimize2 size={12} />
                    ) : (
                      <Maximize2 size={12} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terminal Body: XTerm instances + Right Tabs */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left side: XTerm instances */}
                <div className="flex-1 relative overflow-hidden">
                  {terminals.map((t) => (
                    <div
                      key={t.id}
                      className="absolute inset-0"
                      style={{
                        opacity: activeTerminalId === t.id ? 1 : 0,
                        pointerEvents:
                          activeTerminalId === t.id ? "auto" : "none",
                        zIndex: activeTerminalId === t.id ? 10 : 0,
                      }}
                    >
                      {/* Unmounted (not just hidden) while viewing a past
                          phase — WC's fs has been swapped to that phase's
                          snapshot, and a live shell left running would stay
                          connected to it invisibly, plus its open cwd risks
                          the restore-on-exit silently failing to fully wipe
                          and remount. Unmounting kills the shell via
                          XTermPanel's own cleanup; a fresh one spawns
                          against the restored live tree on return. */}
                      {viewingPastPhase === null && (
                        <XTermPanel
                          visible={terminalOpen && activeTerminalId === t.id}
                          wcRef={wcRef}
                          onNameChange={(newName) => {
                            setTerminals((prev) =>
                              prev.map((term) =>
                                term.id === t.id && term.name !== newName
                                  ? { ...term, name: newName }
                                  : term,
                              ),
                            );
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Right side: Terminal list sidebar */}
                {terminalOpen && (
                  <div className="w-32 shrink-0 border-l border-border-s bg-[#0f0f0f] flex flex-col overflow-y-auto no-scrollbar py-1">
                    {terminals.map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTerminalId(t.id);
                        }}
                        className={`flex items-center justify-between px-3 py-1.5 cursor-pointer group transition-colors mx-1 rounded-sm
                          ${
                            activeTerminalId === t.id
                              ? "bg-accent/10 text-accent"
                              : "text-txt-ghost hover:text-txt hover:bg-surface/50"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Terminal
                            size={10}
                            className={
                              activeTerminalId === t.id
                                ? "text-accent"
                                : "text-txt-ghost"
                            }
                          />
                          <span className="font-(family-name:--font-dm) text-[11px] truncate">
                            {t.name}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTerminals((prev) => {
                              const next = prev.filter((x) => x.id !== t.id);
                              if (
                                activeTerminalId === t.id &&
                                next.length > 0
                              ) {
                                setActiveTerminalId(next[next.length - 1].id);
                              } else if (next.length === 0) {
                                const newId = `term-${Date.now()}`;
                                setActiveTerminalId(newId);
                                return [{ id: newId, name: "bash" }];
                              }
                              return next;
                            });
                          }}
                          className="p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-surface transition-all cursor-pointer shrink-0"
                        >
                          <X size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── AI ASSISTANT — resizable sidebar alongside the editor, not a modal ── */}
        {/* Unprompted nudge. Fixed-position and non-blocking on purpose — the
            user didn't ask for it, so it must never cover the editor or take
            focus. */}
        {suggestion && viewingPastPhase === null && (
          <SuggestionToast
            suggestion={suggestion}
            onDismiss={dismissSuggestion}
            onTurnOff={turnOffSuggestions}
          />
        )}

        {/* Review outcome, in its own panel rather than as prose in the chat —
            a checklist with reasons and evidence is actionable in a way a
            paragraph isn't. */}
        {reviewResult && viewingPastPhase === null && (
          <>
            <div className="w-1.5 shrink-0 bg-border-s" />
            <div
              className="shrink-0 border-l border-border-s flex flex-col overflow-hidden"
              style={{ width: aiPanelWidth }}
            >
              <ReviewResultsPanel
                result={reviewResult}
                onClose={() => setReviewResult(null)}
              />
            </div>
          </>
        )}

        {aiOpen && viewingPastPhase === null && (
          <>
            <div
              onMouseDown={handleAiPanelDragStart}
              className="w-1.5 shrink-0 bg-border-s hover:bg-accent/40 cursor-col-resize transition-colors z-20"
            />
            <div
              className="shrink-0 bg-void border-l border-border-s flex flex-col overflow-hidden"
              style={{ width: aiPanelWidth }}
            >
              <AiAssistant
                open={aiOpen}
                onClose={() => setAiOpen(false)}
                projectId={projectId}
                phaseId={phases[activePhaseIdx]?.id}
                currentTask={
                  [
                    projectName
                      ? `Project: ${projectName}${
                          projectTechStack.length
                            ? ` (${projectTechStack.join(", ")})`
                            : ""
                        }`
                      : "",
                    activePhase
                      ? `Phase ${activePhase.phase_number}: ${activePhase.title}${
                          activePhase.goal
                            ? ` — Goal: ${parseGoal(activePhase.goal)}`
                            : ""
                        }`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" — ") || undefined
                }
                activeFileId={activeTabId || undefined}
                getToken={() => user!.getIdToken()}
                onLoadingChange={setAiThinking}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
