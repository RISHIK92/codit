"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { X, History, Terminal, Minimize2, Maximize2 } from "lucide-react";
import type { FileNode } from "../types";
import { getFileLanguage } from "../utils/fileUtils";
import { FileExplorer } from "./FileExplorer";
import { AiAssistant } from "./AiAssistant";
import { XTermPanel } from "./XTermPanel";
import { PanelModeSwitcher, type PanelMode } from "./PanelModeSwitcher";
import { PreviewPane } from "./PreviewPane";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.Editor),
  { ssr: false },
);

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
  // the live workspace uses. Run lives in the top bar (page.tsx), same as
  // live — hasHtmlFile here is only used for the empty-preview-state copy.
  hasHtmlFile: boolean;
  previewUrl: string | null;
  // Shared with the live workspace (not local state) so that clicking Run
  // in the top bar — which always switches to split view — reaches this
  // view too, whichever one happens to be showing.
  activePanel: PanelMode;
  onSetActivePanel: (mode: PanelMode) => void;
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
  /** Same WebContainer instance the live workspace uses — its fs has
   * already been swapped to this phase's snapshot by the caller, so a
   * terminal here can install deps / start a dev server against exactly
   * what was submitted. Whatever runs is discarded on close, when the
   * caller wipes and restores the live tree. */
  wcRef: React.RefObject<import("@webcontainer/api").WebContainer | null>;
  /** Px width of the Phase Guide panel to its left — the overlay covers
   * only the region to the right of it, so Phase Guide (which already
   * shows the correct phase's description/resources/checks, unrelated to
   * this overlay) stays visible and interactive underneath. */
  leftOffset: number;
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
  activePanel,
  onSetActivePanel,
  aiOpen,
  aiPanelWidth,
  onAiPanelDragStart,
  onAiClose,
  projectId,
  phaseId,
  currentTask,
  getToken,
  wcRef,
  leftOffset,
}: PastPhaseSnapshotOverlayProps) {
  const [splitPos, setSplitPos] = useState(50);
  const isSplitDragging = useRef(false);
  const [terminalOpen, setTerminalOpen] = useState(true);

  const activeContent = contents[activeFileId] ?? "";
  const activeLanguage = activeFileId
    ? getFileLanguage({ name: activeFileId.split("/").pop() ?? "" })
    : "plaintext";

  return (
    <div
      className="absolute inset-y-0 right-0 z-30 flex flex-col bg-void"
      style={{ left: leftOffset }}
    >
      {/* Banner */}
      <div className="h-10 shrink-0 flex items-center gap-2 px-4 border-b border-warning/30 bg-warning/10">
        <History size={13} className="text-warning shrink-0" />
        <span className="font-sans text-sm text-warning">
          Viewing Phase {phaseNumber} as submitted — read-only, can't be
          edited or resubmitted.
        </span>
        <button
          onClick={onClose}
          className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-sm border border-border-s text-txt-ghost hover:text-txt hover:border-border-a transition-colors cursor-pointer font-sans text-xs uppercase tracking-[0.07em]"
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
            <p className="font-sans text-base text-error">
              {error}
            </p>
          </div>
        ) : tree.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-sans text-base text-txt-ghost">
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
                <div className="flex-1" />
                <PanelModeSwitcher
                  activePanel={activePanel}
                  onChange={onSetActivePanel}
                  previewUrl={previewUrl}
                />
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
                      // Namespaced, not the bare file path: @monaco-editor/react
                      // keys its model registry globally by path, and the live
                      // editor (still mounted underneath this overlay, just
                      // visually covered) uses the bare path for the same
                      // file — sharing it would mean this "read-only" view
                      // is actually displaying the live, editable model.
                      path={`__snapshot_phase_${phaseNumber}__/${activeFileId}`}
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
                      <p className="font-sans text-sm text-txt-ghost uppercase tracking-[0.07em]">
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
                  <PreviewPane
                    previewUrl={previewUrl}
                    emptyState={
                      <p className="font-sans text-base text-txt-muted max-w-60">
                        {hasHtmlFile
                          ? 'Click "Run" to serve this phase\'s snapshot exactly as it was submitted.'
                          : "Use the terminal below to install and start this phase's snapshot, e.g. npm install && npm run dev."}
                      </p>
                    }
                  />
                )}
              </div>

              {/* Terminal — same XTermPanel/wcRef as live, against this
                  phase's snapshot files. Needed for anything that isn't a
                  static HTML project, which has no other way to start a
                  dev server here. */}
              <div
                className="flex flex-col border-t border-border-s bg-[#0d0d0d] shrink-0"
                style={{ height: terminalOpen ? 220 : 36 }}
              >
                <div className="h-9 shrink-0 flex items-center justify-between px-3 border-b border-border-s bg-surface/50">
                  <div className="flex items-center gap-2">
                    <Terminal size={12} className="text-accent/70" />
                    <span className="font-sans text-xs uppercase tracking-[0.07em] text-txt-ghost">
                      Terminal
                    </span>
                  </div>
                  <button
                    onClick={() => setTerminalOpen((v) => !v)}
                    className="p-1 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
                    title={terminalOpen ? "Collapse terminal" : "Expand terminal"}
                  >
                    {terminalOpen ? (
                      <Minimize2 size={12} />
                    ) : (
                      <Maximize2 size={12} />
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <XTermPanel visible={terminalOpen} wcRef={wcRef} />
                </div>
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
