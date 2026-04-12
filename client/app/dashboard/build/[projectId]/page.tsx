"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuthStore, useDashboardStore } from "@/lib/stores";
import {
  getProjectWithPhases,
  type LearningPhaseDTO,
} from "@/lib/api/projectsApi";
import {
  batchUpsertFiles,
  listFiles as listProjectFiles,
  deleteFile as deleteProjectFile,
  type ProjectFileDTO,
} from "@/lib/api/filesApi";
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
} from "lucide-react";

// Types, constants, utils
import type { Language, FileNode, OpenTab } from "./types";
import { FILE_TREES } from "./constants";
import {
  getDefaultFileContent as getFileContent,
  getFileLanguage,
  buildFileTreeFromEntries,
  buildWcFileTree,
  insertNode,
  makeNodeId,
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
import { scanWcFs, spawnShell } from "./utils/wcUtils";

// Components
import { FileExplorer, getFileIcon, TreeNode } from "./components/FileExplorer";
import { PhaseSelector } from "./components/PhaseSelector";
import { DescriptionPanel } from "./components/DescriptionPanel";
import { XTermPanel } from "./components/XTermPanel";
import { AiAssistant } from "./components/AiAssistant";

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
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [currentPhaseNum, setCurrentPhaseNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [aiOpen, setAiOpen] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminals, setTerminals] = useState([{ id: "term-1", name: "bash" }]);
  const [activeTerminalId, setActiveTerminalId] = useState("term-1");

  // Preview panel state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<"editor" | "preview">(
    "editor",
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [terminalHeight, setTerminalHeight] = useState(220);
  const [explorerWidth, setExplorerWidth] = useState(192);
  const [phaseGuideWidth, setPhaseGuideWidth] = useState(320);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const isExplorerDragging = useRef(false);
  const explorerDragStartX = useRef(0);
  const explorerDragStartWidth = useRef(0);
  const isPhaseGuideDragging = useRef(false);
  const phaseGuideDragStartX = useRef(0);
  const phaseGuideDragStartWidth = useRef(0);

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

  // WebContainer instance
  const wcRef = useRef<import("@webcontainer/api").WebContainer | null>(null);
  // Signalling: wcReadyRef flips true when WC has booted; wcReadyCallbackRef
  // holds a one-shot resolver so the fetch-phases effect can await WC readiness.
  const wcReadyRef = useRef(false);
  const wcReadyCallbackRef = useRef<(() => void) | null>(null);

  // Boot WebContainer once on mount
  useEffect(() => {
    let mounted = true;
    import("@webcontainer/api").then(({ WebContainer }) => {
      WebContainer.boot()
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
    });
    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!wcRef.current) return;
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
      getProjectWithPhases(token, projectId)
        .then(async (data) => {
          const phaseList = data.phases ?? [];
          setPhases(phaseList);
          setProjectName(data.project?.name ?? currentProject.title ?? "");

          // Start on the user's current phase
          const currentPhaseNum = currentProject.phase || 1;
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
            // Fallback: no DB files and no initial_files — use default JS tree
            const defaultTree = FILE_TREES["javascript"];
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
      if (!name.trim()) {
        setPendingParentId(undefined);
        setPendingType(null);
        return;
      }
      const id = makeNodeId(parentId, name);
      const newNode: FileNode =
        type === "folder"
          ? { id, name, type: "folder", children: [] }
          : { id, name, type: "file", language };
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
          return [...prev, { id, name, language: getFileLanguage(newNode) }];
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
    [language],
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
    [activeTabId],
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
    setSaveStatus("saving");
    try {
      const token = await user.getIdToken();
      // Skip files whose content contains null bytes (binary files)
      const isBinary = (content: string) => content.includes("\x00");
      
      const fileNodes = fileTree.flatMap(function flat(n: FileNode): FileNode[] {
        return n.type === "file" ? [n] : (n.children ?? []).flatMap(flat);
      });
      
      const entries: Array<{filePath: string, content: string, isDirectory: boolean}> = [];
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
  }, [user, projectId, saveStatus, fileTree]);

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
              onSelect={setActivePhaseIdx}
            />
          )}
        </div>

        {/* Right: AI + save + run buttons */}
        <div className="flex items-center gap-3">
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
          {/* Save button */}
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
        </div>
      </div>

      {/* ── SPLIT WORKSPACE ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
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

          <DescriptionPanel phase={activePhase} projectName={projectName} />
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
              {/* File tabs — only shown in editor mode */}
              {activePanel === "editor" &&
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
              <div className="flex items-center h-full border-l border-border-s shrink-0">
                <button
                  onClick={() => setActivePanel("editor")}
                  className={`flex items-center gap-1.5 px-3 h-full font-(family-name:--font-dm) text-[10px] uppercase tracking-widest transition-colors cursor-pointer border-b-2
                    ${activePanel === "editor" ? "text-accent border-accent bg-void" : "text-txt-ghost border-transparent hover:text-txt"}`}
                >
                  <FileCode size={11} />
                  Editor
                </button>
                <button
                  onClick={() => setActivePanel("preview")}
                  className={`flex items-center gap-1.5 px-3 h-full font-(family-name:--font-dm) text-[10px] uppercase tracking-widest transition-colors cursor-pointer border-b-2
                    ${activePanel === "preview" ? "text-accent border-accent bg-void" : "text-txt-ghost border-transparent hover:text-txt"}
                    ${previewUrl ? "text-accent/80" : ""}
                  `}
                >
                  <Globe size={11} />
                  Preview
                  {previewUrl && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* Panel content */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Monaco editor — hidden (not unmounted) when preview is active */}
              <div
                className={`flex-1 overflow-hidden min-h-0 ${activePanel === "preview" ? "hidden" : "flex flex-col"}`}
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

                      let writeTimer: ReturnType<typeof setTimeout> | null =
                        null;
                      editor.onDidChangeModelContent(() => {
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

              {/* Preview panel */}
              {activePanel === "preview" && (
                <div className="flex-1 flex flex-col bg-void overflow-hidden">
                  {previewUrl ? (
                    <>
                      {/* Preview address bar */}
                      <div className="h-8 shrink-0 flex items-center gap-2 px-3 border-b border-border-s bg-surface/40">
                        <Globe size={11} className="text-accent/60 shrink-0" />
                        <span className="font-(family-name:--font-dm) text-[11px] text-txt-muted truncate flex-1">
                          {previewUrl}
                        </span>
                        <button
                          onClick={() => {
                            if (iframeRef.current) {
                              iframeRef.current.src = previewUrl;
                            }
                          }}
                          title="Reload preview"
                          className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
                        >
                          <RefreshCw size={11} />
                        </button>
                      </div>
                      <iframe
                        ref={iframeRef}
                        src={previewUrl}
                        className="flex-1 w-full border-none bg-white"
                        allow="cross-origin-isolated"
                        title="Preview"
                      />
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
                      <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
                        <Globe size={20} className="text-accent/40" />
                      </div>
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
                    </div>
                  )}
                </div>
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
                className={`h-9 shrink-0 flex items-center gap-0 border-b border-border-s bg-surface/50 ${terminalOpen ? "cursor-row-resize" : ""}`}
              >
                <div className="px-3 border-r border-border-s h-full flex items-center shrink-0">
                  <Terminal size={12} className="text-accent/70" />
                </div>
                
                <div className="flex-1 flex items-center h-full overflow-x-auto no-scrollbar">
                  {terminals.map((t) => (
                    <div
                      key={t.id}
                      onClick={(e) => { e.stopPropagation(); setActiveTerminalId(t.id); setTerminalOpen(true); }}
                      className={`flex items-center gap-2 px-3 h-full border-r border-border-s cursor-pointer group transition-colors shrink-0
                        ${
                          activeTerminalId === t.id && terminalOpen
                            ? "bg-void border-b-2 border-b-accent text-accent"
                            : "text-txt-ghost hover:text-txt hover:bg-void/50"
                        }
                      `}
                    >
                      <span className="font-(family-name:--font-dm) text-[11px]">{t.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTerminals(prev => {
                            const next = prev.filter(x => x.id !== t.id);
                            if (activeTerminalId === t.id && next.length > 0) {
                                setActiveTerminalId(next[next.length - 1].id);
                            } else if (next.length === 0) {
                                const newId = `term-${Date.now()}`;
                                setActiveTerminalId(newId);
                                return [{ id: newId, name: "bash" }];
                            }
                            return next;
                          });
                        }}
                        className="ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-surface transition-all cursor-pointer"
                      >
                        <X size={9} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1 px-2 border-l border-border-s h-full shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newId = `term-${Date.now()}`;
                      setTerminals(prev => [...prev, { id: newId, name: "bash" }]);
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
                    title={terminalOpen ? "Collapse terminal" : "Expand terminal"}
                  >
                    {terminalOpen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  </button>
                </div>
              </div>

              {/* XTerm instances */}
              <div className="flex-1 overflow-hidden relative">
                {terminals.map((t) => (
                   <div
                     key={t.id}
                     className="absolute inset-0"
                     style={{
                       opacity: activeTerminalId === t.id ? 1 : 0,
                       pointerEvents: activeTerminalId === t.id ? "auto" : "none",
                       zIndex: activeTerminalId === t.id ? 10 : 0,
                     }}
                   >
                     <XTermPanel visible={terminalOpen && activeTerminalId === t.id} wcRef={wcRef} />
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI ASSISTANT ────────────────────────────────────────────────── */}
      <AiAssistant
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        projectName={projectName}
        activePhaseTitle={phases[activePhaseIdx]?.title}
        activeFileId={activeTabId || undefined}
        getFileContent={(id) =>
          fileContentsRef.current[id] ?? getFileContent(id)
        }
      />
    </div>
  );
}
