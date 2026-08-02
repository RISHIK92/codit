"use client";

import dynamic from "next/dynamic";
import { X, History, Folder, File as FileIcon } from "lucide-react";
import type { FileNode } from "../types";
import { getFileLanguage } from "../utils/fileUtils";

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
}

/** Simple, non-interactive tree — no create/rename/delete/drag, just click-to-view. */
function SnapshotTreeNode({
  node,
  depth,
  activeFileId,
  onSelectFile,
}: {
  node: FileNode;
  depth: number;
  activeFileId: string;
  onSelectFile: (id: string) => void;
}) {
  if (node.type === "folder") {
    return (
      <div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-(family-name:--font-dm) text-txt-ghost"
          style={{ paddingLeft: 8 + depth * 14 }}
        >
          <Folder size={12} className="shrink-0" />
          <span className="truncate">{node.name}</span>
        </div>
        {(node.children ?? []).map((child) => (
          <SnapshotTreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    );
  }

  const isActive = node.id === activeFileId;
  return (
    <button
      onClick={() => onSelectFile(node.id)}
      className={`w-full flex items-center gap-1.5 px-2 py-1 text-[11px] font-(family-name:--font-dm) text-left transition-colors cursor-pointer ${
        isActive
          ? "bg-accent/10 text-accent"
          : "text-txt-muted hover:text-txt hover:bg-surface/50"
      }`}
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      <FileIcon size={12} className="shrink-0" />
      <span className="truncate">{node.name}</span>
    </button>
  );
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
}: PastPhaseSnapshotOverlayProps) {
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
          Viewing Phase {phaseNumber} as submitted — read-only, can't be edited or resubmitted.
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
            {/* Read-only file tree */}
            <div className="w-48 shrink-0 border-r border-border-s overflow-y-auto py-1">
              {tree.map((node) => (
                <SnapshotTreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  activeFileId={activeFileId}
                  onSelectFile={onSelectFile}
                />
              ))}
            </div>

            {/* Read-only editor */}
            <div className="flex-1 overflow-hidden">
              {activeFileId ? (
                <MonacoEditor
                  height="100%"
                  theme="vs-dark"
                  path={activeFileId}
                  language={activeLanguage}
                  value={activeContent}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    domReadOnly: true,
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="font-(family-name:--font-dm) text-[12px] text-txt-ghost">
                    Select a file to view
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
