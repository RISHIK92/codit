"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  X,
  History,
  FileCode,
  Columns2,
  Globe,
  Play,
  RefreshCw,
} from "lucide-react";
import type { FileNode } from "../types";
import { getFileLanguage } from "../utils/fileUtils";
import { FileExplorer } from "./FileExplorer";
import { AiAssistant } from "./AiAssistant";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.Editor),
  { ssr: false },
);

type PanelMode = "editor" | "split" | "preview";

interface PastPhaseSnapshotOverlayProps {
  phaseNumber: number;
  loading: boolean;
  error: string | null;
  tree: FileNode[];
  contents: Record<string, string>;
  activeFileId: string;
  onSelectFile: (id: string) => void;
  onClose: () => void;
  // Preview — the snapshot's files are mounted into the same WebContainer
  // the live workspace uses, so Run/Preview here are the same underlying
  // mechanism as live, just currently pointed at this phase's frozen files.
  hasHtmlFile: boolean;
  previewUrl: string | null;
  previewServerRunning: boolean;
  previewServerStarting: boolean;
  onToggleRun: () => void;
  // AI — a fresh, snapshot-scoped assistant instance (its own thread, not
  // the live conversation), restricted server-side to this phase's files.
  aiOpen: boolean;
  aiPanelWidth: number;
  onAiPanelDragStart: (e: React.MouseEvent) => void;
  onAiClose: () => void;
  projectId: string;
  phaseId?: string;
  currentTask?: string;
  getToken: () => Promise<string>;
}

export function PastPhaseSnapshotOverlay({
  phaseNumber,
  loading,
  error,
  tree,
  contents,
  activeFileId,
  onSelectFile,
  onClose,
  hasHtmlFile,
  previewUrl,
  previewServerRunning,
  previewServerStarting,
  onToggleRun,
  aiOpen,
  aiPanelWidth,
  onAiPanelDragStart,
  onAiClose,
  projectId,
  phaseId,
  currentTask,
  getToken,
}: PastPhaseSnapshotOverlayProps) {
  const [activePanel, setActivePanel] = useState<PanelMode>("editor");
  const [splitPos, setSplitPos] = useState(50);
  const isSplitDragging = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeContent = contents[activeFileId] ?? "";
  const activeLanguage = activeFileId
    ? getFileLanguage({ name: activeFileId.split("/").pop() ?? "" })
    : "plaintext";

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-void">
      {/* Banner */}
      <div className="h-10 shrink-0 flex items-center gap-2 px-4 border-b border-warning/30 bg-warning/10">
        <History size={13} className="text-warning shrink-0" />
        <span className="font-(family-name:--font-dm) text-[11px] text-warning">
          Viewing Phase {phaseNumber} as submitted — read-only, can't be
          edited or resubmitted.
        </span>
        <button
          onClick={onClose}
          className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-sm border border-border-s text-txt-ghost hover:text-txt hover:border-border-a transition-colors cursor-pointer font-(family-name:--font-dm) text-[10px] uppercase tracking-widest"
        >
          <X size={11} />
          Back to current
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-(family-name:--font-dm) text-[12px] text-error">
              {error}
            </p>
          </div>
        ) : tree.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-(family-name:--font-dm) text-[12px] text-txt-ghost">
              No snapshot was saved for this phase.
            </p>
          </div>
        ) : (
          <>
            {/* Same FileExplorer as the live workspace, read-only */}
            <FileExplorer
              fileTree={tree}
              activeTabId={activeFileId}
              selectedExplorerItemId={activeFileId}
              explorerWidth={224}
              onFileClick={(node) => onSelectFile(node.id)}
              onFolderClick={() => {}}
              onSetSelectedExplorerItemId={() => {}}
              onExplorerDragStart={() => {}}
              readOnly
            />

            {/* EDITOR + PREVIEW AREA — same split/preview pattern as live */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <div className="h-9 shrink-0 flex items-center gap-0 border-b border-border-s bg-surface/50">
                {hasHtmlFile && (
                  <button
                    onClick={onToggleRun}
                    disabled={previewServerStarting}
                    className={`flex items-center gap-1.5 px-3 h-full font-(family-name:--font-dm) text-[10px] uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                      ${previewServerRunning ? "text-accent" : "text-txt-ghost hover:text-txt"}`}
                    title={
                      previewServerRunning
                        ? "Stop the live server"
                        : "Run this phase's snapshot"
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
                <div className="flex-1" />
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
                    onClick={() => setActivePanel("split")}
                    title="Split view"
                    className={`flex items-center gap-1.5 px-3 h-full font-(family-name:--font-dm) text-[10px] uppercase tracking-widest transition-colors cursor-pointer border-b-2
                      ${activePanel === "split" ? "text-accent border-accent bg-void" : "text-txt-ghost border-transparent hover:text-txt"}`}
                  >
                    <Columns2 size={11} />
                    Split
                  </button>
                  <button
                    onClick={() => setActivePanel("preview")}
                    className={`flex items-center gap-1.5 px-3 h-full font-(family-name:--font-dm) text-[10px] uppercase tracking-widest transition-colors cursor-pointer border-b-2
                      ${activePanel === "preview" ? "text-accent border-accent bg-void" : "text-txt-ghost border-transparent hover:text-txt"}
                      ${previewUrl && activePanel !== "preview" ? "text-accent/60" : ""}`}
                  >
                    <Globe size={11} />
                    Preview
                    {previewUrl && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Read-only editor pane */}
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
                  {activeFileId ? (
                    <MonacoEditor
                      height="100%"
                      theme="vs-dark"
                      path={activeFileId}
                      language={activeLanguage}
                      value={activeContent}
                      options={{
                        readOnly: true,
                        domReadOnly: true,
                        minimap: { enabled: false },
                        fontSize: 13,
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-void">
                      <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost uppercase tracking-widest">
                        Select a file to view
                      </p>
                    </div>
                  )}
                </div>

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

                {(activePanel === "preview" || activePanel === "split") && (
                  <div className="flex flex-col bg-void overflow-hidden min-w-0 min-h-0 flex-1">
                    {previewUrl ? (
                      <>
                        <div className="h-8 shrink-0 flex items-center gap-2 px-3 border-b border-border-s bg-surface/40">
                          <Globe
                            size={11}
                            className="text-accent/60 shrink-0"
                          />
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
                        <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted max-w-60">
                          {hasHtmlFile
                            ? 'Click "Run" to serve this phase\'s snapshot exactly as it was submitted.'
                            : "Nothing to preview for this phase."}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Same AiAssistant as live, scoped to this phase's snapshot */}
            {aiOpen && (
              <>
                <div
                  onMouseDown={onAiPanelDragStart}
                  className="w-1.5 shrink-0 bg-border-s hover:bg-accent/40 cursor-col-resize transition-colors z-20"
                />
                <div
                  className="shrink-0 bg-void border-l border-border-s flex flex-col overflow-hidden"
                  style={{ width: aiPanelWidth }}
                >
                  <AiAssistant
                    open={aiOpen}
                    onClose={onAiClose}
                    projectId={projectId}
                    phaseId={phaseId}
                    currentTask={currentTask}
                    activeFileId={activeFileId || undefined}
                    snapshotPhaseNumber={phaseNumber}
                    getToken={getToken}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
