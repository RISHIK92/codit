"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
} from "lucide-react";
import type { FileNode, Language } from "../types";
import { getParentFolderId } from "../utils/fileUtils";

// ── File icon helper ───────────────────────────────────────────────────────

export function getFileIcon(name: string, isFolder = false, isOpen = false) {
  if (isFolder) {
    return isOpen ? (
      <FolderOpen size={13} className="text-accent/70 shrink-0" />
    ) : (
      <Folder size={13} className="text-accent/50 shrink-0" />
    );
  }
  if (
    name.endsWith(".ts") ||
    name.endsWith(".tsx") ||
    name.endsWith(".js") ||
    name.endsWith(".jsx")
  )
    return <FileCode size={13} className="text-accent/60 shrink-0" />;
  if (name.endsWith(".md") || name.endsWith(".txt"))
    return <FileText size={13} className="text-txt-ghost shrink-0" />;
  return <File size={13} className="text-txt-ghost shrink-0" />;
}

// ── TreeNode ───────────────────────────────────────────────────────────────

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  activeFileId: string;
  selectedExplorerItemId: string;
  onFileClick: (node: FileNode) => void;
  onFolderClick: (node: FileNode) => void;
  pendingParentId: string | null;
  pendingType: "file" | "folder" | null;
  onCommitCreate: (
    parentId: string | null,
    name: string,
    type: "file" | "folder",
  ) => void;
  onCancelCreate: () => void;
  onDelete: (node: FileNode) => void;
  onRename: (node: FileNode, newName: string) => void;
}

export function TreeNode({
  node,
  depth,
  activeFileId,
  selectedExplorerItemId,
  onFileClick,
  onFolderClick,
  pendingParentId,
  pendingType,
  onCommitCreate,
  onCancelCreate,
  onDelete,
  onRename,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(node.name === "src");
  const [inputVal, setInputVal] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(node.name);

  useEffect(() => {
    if (pendingParentId === node.id) setExpanded(true);
  }, [pendingParentId, node.id]);

  function commitInput() {
    const name = inputVal.trim();
    if (name) onCommitCreate(pendingParentId, name, pendingType!);
    else onCancelCreate();
    setInputVal("");
  }

  function commitRename() {
    const name = renameVal.trim();
    if (name && name !== node.name) onRename(node, name);
    setRenaming(false);
  }

  const actions = (
    <div className="flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity shrink-0 ml-auto pr-1">
      <button
        title="Rename"
        onClick={(e) => {
          e.stopPropagation();
          setRenameVal(node.name);
          setRenaming(true);
        }}
        className="p-0.5 rounded-sm text-txt-ghost hover:text-accent hover:bg-surface transition-colors cursor-pointer"
      >
        <Pencil size={10} />
      </button>
      <button
        title="Delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node);
        }}
        className="p-0.5 rounded-sm text-txt-ghost hover:text-red-400 hover:bg-surface transition-colors cursor-pointer"
      >
        <Trash2 size={10} />
      </button>
    </div>
  );

  if (node.type === "folder") {
    const isCreatingHere = pendingParentId === node.id;
    return (
      <div>
        {renaming ? (
          <div
            className="flex items-center gap-1.5 px-2 py-0.75 bg-surface/40"
            style={{ paddingLeft: `${8 + depth * 12}px` }}
          >
            <ChevronRight size={10} className="text-txt-ghost shrink-0" />
            {getFileIcon(node.name, true, expanded)}
            <input
              autoFocus
              value={renameVal}
              onChange={(e) => setRenameVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
              onBlur={commitRename}
              className="flex-1 bg-transparent border-b border-accent/50 text-[12px] font-(family-name:--font-dm) text-txt outline-none min-w-0"
            />
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setExpanded((v) => !v);
              onFolderClick(node);
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && (setExpanded((v) => !v), onFolderClick(node))
            }
            className={`w-full flex items-center group/row font-(family-name:--font-dm) gap-1.5 px-2 py-0.75 transition-colors cursor-pointer
              ${selectedExplorerItemId === node.id ? "bg-accent/10 text-accent" : "hover:bg-surface/60"}`}
            style={{ paddingLeft: `${8 + depth * 12}px` }}
          >
            <ChevronRight
              size={10}
              className={`text-txt-ghost shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
            />
            {getFileIcon(node.name, true, expanded)}
            <span className="text-[12px] font-(family-name:--font-dm) text-txt-muted group-hover/row:text-txt truncate flex-1 text-left">
              {node.name}
            </span>
            {actions}
          </div>
        )}

        {expanded && (
          <>
            {[...(node.children ?? [])]
              .sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === "folder" ? -1 : 1;
              })
              .map((child) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  activeFileId={activeFileId}
                  selectedExplorerItemId={selectedExplorerItemId}
                  onFileClick={onFileClick}
                  onFolderClick={onFolderClick}
                  pendingParentId={pendingParentId}
                  pendingType={pendingType}
                  onCommitCreate={onCommitCreate}
                  onCancelCreate={onCancelCreate}
                  onDelete={onDelete}
                  onRename={onRename}
                />
              ))}
            {isCreatingHere && (
              <div
                className="flex items-center gap-1.5 px-2 py-0.75"
                style={{ paddingLeft: `${8 + (depth + 1) * 12}px` }}
              >
                {pendingType === "folder" ? (
                  <Folder size={13} className="text-accent/50 shrink-0" />
                ) : (
                  <FileCode size={13} className="text-accent/60 shrink-0" />
                )}
                <input
                  autoFocus
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitInput();
                    if (e.key === "Escape") {
                      onCancelCreate();
                      setInputVal("");
                    }
                  }}
                  onBlur={commitInput}
                  placeholder={
                    pendingType === "folder" ? "folder name" : "file name"
                  }
                  className="flex-1 bg-transparent border-b border-accent/50 text-[12px] font-(family-name:--font-dm) text-txt outline-none placeholder:text-txt-ghost min-w-0"
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // File row
  const isActive = node.id === activeFileId;
  return renaming ? (
    <div
      className="flex items-center gap-1.5 px-2 py-0.75 bg-surface/40"
      style={{ paddingLeft: `${8 + depth * 12}px` }}
    >
      {getFileIcon(node.name)}
      <input
        autoFocus
        value={renameVal}
        onChange={(e) => setRenameVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitRename();
          if (e.key === "Escape") setRenaming(false);
        }}
        onBlur={commitRename}
        className="flex-1 bg-transparent border-b border-accent/50 text-[12px] font-(family-name:--font-dm) text-txt outline-none min-w-0"
      />
    </div>
  ) : (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onFileClick(node)}
      onKeyDown={(e) => e.key === "Enter" && onFileClick(node)}
      className={`w-full flex items-center group/row gap-1.5 px-2 py-0.75 transition-colors cursor-pointer
        ${isActive ? "bg-accent/10 text-accent" : "text-txt-muted hover:bg-surface/60 hover:text-txt"}
      `}
      style={{ paddingLeft: `${8 + depth * 12}px` }}
    >
      {getFileIcon(node.name)}
      <span className="font-(family-name:--font-dm) text-[12px] truncate flex-1 text-left">
        {node.name}
      </span>
      {actions}
    </div>
  );
}

// ── FileExplorer panel ─────────────────────────────────────────────────────

interface FileExplorerProps {
  fileTree: FileNode[];
  activeTabId: string;
  selectedExplorerItemId: string;
  explorerWidth: number;
  pendingParentId: string | null | undefined;
  pendingType: "file" | "folder" | null;
  rootInputVal: string;
  onFileClick: (node: FileNode) => void;
  onFolderClick: (node: FileNode) => void;
  onCommitCreate: (
    parentId: string | null,
    name: string,
    type: "file" | "folder",
  ) => void;
  onCancelCreate: () => void;
  onDelete: (node: FileNode) => void;
  onRename: (node: FileNode, newName: string) => void;
  onSetPendingParentId: (id: string | null) => void;
  onSetPendingType: (t: "file" | "folder") => void;
  onSetRootInputVal: (v: string) => void;
  onSetSelectedExplorerItemId: (id: string) => void;
  onExplorerDragStart: (e: React.MouseEvent) => void;
}

export function FileExplorer({
  fileTree,
  activeTabId,
  selectedExplorerItemId,
  explorerWidth,
  pendingParentId,
  pendingType,
  rootInputVal,
  onFileClick,
  onFolderClick,
  onCommitCreate,
  onCancelCreate,
  onDelete,
  onRename,
  onSetPendingParentId,
  onSetPendingType,
  onSetRootInputVal,
  onSetSelectedExplorerItemId,
  onExplorerDragStart,
}: FileExplorerProps) {
  return (
    <div
      className="shrink-0 bg-void border-r border-border-s flex flex-col overflow-hidden relative"
      style={{ width: explorerWidth }}
    >
      {/* Header */}
      <div className="h-9 shrink-0 flex items-center gap-2 px-3 border-b border-border-s bg-surface/50">
        <Folder size={12} className="text-accent/60" />
        <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost flex-1">
          Explorer
        </span>
        <button
          title="New file"
          onClick={() => {
            onSetPendingParentId(
              getParentFolderId(selectedExplorerItemId, fileTree),
            );
            onSetPendingType("file");
          }}
          className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
        >
          <FilePlus size={13} />
        </button>
        <button
          title="New folder"
          onClick={() => {
            onSetPendingParentId(
              getParentFolderId(selectedExplorerItemId, fileTree),
            );
            onSetPendingType("folder");
          }}
          className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
        >
          <FolderPlus size={13} />
        </button>
      </div>

      {/* Tree */}
      <div
        className="flex-1 overflow-y-auto py-1"
        onClick={(e) => {
          if (e.target === e.currentTarget) onSetSelectedExplorerItemId("");
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
              onFileClick={onFileClick}
              onFolderClick={onFolderClick}
              pendingParentId={pendingParentId ?? null}
              pendingType={pendingType}
              onCommitCreate={onCommitCreate}
              onCancelCreate={onCancelCreate}
              onDelete={onDelete}
              onRename={onRename}
            />
          ))}

        {/* Root-level inline input */}
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
              onChange={(e) => onSetRootInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  onCommitCreate(null, rootInputVal, pendingType!);
                if (e.key === "Escape") onCancelCreate();
              }}
              onBlur={() => onCommitCreate(null, rootInputVal, pendingType!)}
              placeholder={
                pendingType === "folder" ? "folder name" : "file name"
              }
              className="flex-1 bg-transparent border-b border-accent/50 text-[12px] font-(family-name:--font-dm) text-txt outline-none placeholder:text-txt-ghost min-w-0"
            />
          </div>
        )}
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={onExplorerDragStart}
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-accent/30 transition-colors z-10"
      />
    </div>
  );
}
