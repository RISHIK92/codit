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
import type * as Monaco from "monaco-editor";
import type { editor as EditorNS } from "monaco-editor";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  BookOpen,
  Play,
  ArrowLeft,
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  File,
  FilePlus,
  FolderPlus,
  Pencil,
  Trash2,
  X,
  Lock,
  Terminal,
  ChevronDown as PanelChevron,
  Maximize2,
  Minimize2,
} from "lucide-react";

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

type Tab = "description" | "concepts" | "goal";
type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "json"
  | "markdown"
  | "plaintext";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: Language;
  children?: FileNode[];
}

interface OpenTab {
  id: string;
  name: string;
  language: Language;
}

const FILE_TREES: Record<"javascript" | "typescript" | "python", FileNode[]> = {
  javascript: [
    {
      id: "src",
      name: "src",
      type: "folder",
      children: [
        {
          id: "src/index.js",
          name: "index.js",
          type: "file",
          language: "javascript",
        },
        {
          id: "src/main.js",
          name: "main.js",
          type: "file",
          language: "javascript",
        },
        {
          id: "src/utils",
          name: "utils",
          type: "folder",
          children: [
            {
              id: "src/utils/helpers.js",
              name: "helpers.js",
              type: "file",
              language: "javascript",
            },
          ],
        },
      ],
    },
    {
      id: "package.json",
      name: "package.json",
      type: "file",
    },
    {
      id: "README.md",
      name: "README.md",
      type: "file",
    },
  ],
  typescript: [
    {
      id: "src",
      name: "src",
      type: "folder",
      children: [
        {
          id: "src/index.ts",
          name: "index.ts",
          type: "file",
          language: "typescript",
        },
        {
          id: "src/main.ts",
          name: "main.ts",
          type: "file",
          language: "typescript",
        },
        {
          id: "src/types",
          name: "types",
          type: "folder",
          children: [
            {
              id: "src/types/index.ts",
              name: "index.ts",
              type: "file",
              language: "typescript",
            },
          ],
        },
        {
          id: "src/utils",
          name: "utils",
          type: "folder",
          children: [
            {
              id: "src/utils/helpers.ts",
              name: "helpers.ts",
              type: "file",
              language: "typescript",
            },
          ],
        },
      ],
    },
    {
      id: "tsconfig.json",
      name: "tsconfig.json",
      type: "file",
    },
    {
      id: "package.json",
      name: "package.json",
      type: "file",
    },
    {
      id: "README.md",
      name: "README.md",
      type: "file",
    },
  ],
  python: [
    {
      id: "src",
      name: "src",
      type: "folder",
      children: [
        {
          id: "src/__init__.py",
          name: "__init__.py",
          type: "file",
          language: "python",
        },
        {
          id: "src/main.py",
          name: "main.py",
          type: "file",
          language: "python",
        },
        {
          id: "src/utils",
          name: "utils",
          type: "folder",
          children: [
            {
              id: "src/utils/__init__.py",
              name: "__init__.py",
              type: "file",
              language: "python",
            },
            {
              id: "src/utils/helpers.py",
              name: "helpers.py",
              type: "file",
              language: "python",
            },
          ],
        },
      ],
    },
    {
      id: "requirements.txt",
      name: "requirements.txt",
      type: "file",
      language: "plaintext",
    },
    { id: "README.md", name: "README.md", type: "file" },
  ],
};

const DEFAULT_FILE_CONTENT: Record<string, string> = {
  "src/index.js": `// Entry point\nimport { main } from "./main.js";\n\nmain();\n`,
  "src/main.js": `// Phase starter — edit freely\n\nexport function main() {\n  console.log("Hello, world!");\n}\n`,
  "src/utils/helpers.js": `// Utility helpers\n\nexport function add(a, b) {\n  return a + b;\n}\n`,
  "package.json": `{\n  "name": "project",\n  "version": "1.0.0",\n  "type": "module"\n}\n`,
  "README.md": `# Project\n\nEdit this file to document your project.\n`,
  "src/index.ts": `// Entry point\nimport { main } from "./main";\n\nmain();\n`,
  "src/main.ts": `// Phase starter — edit freely\n\nexport function main(): void {\n  console.log("Hello, world!");\n}\n`,
  "src/types/index.ts": `// Type definitions\n\nexport interface Result {\n  value: unknown;\n  error?: string;\n}\n`,
  "src/utils/helpers.ts": `// Utility helpers\n\nexport function add(a: number, b: number): number {\n  return a + b;\n}\n`,
  "tsconfig.json": `{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "ESNext",\n    "strict": true\n  }\n}\n`,
  "src/__init__.py": `# Package init\n`,
  "src/main.py": `# Phase starter — edit freely\n\ndef main():\n    print("Hello, world!")\n\nif __name__ == "__main__":\n    main()\n`,
  "src/utils/__init__.py": `# Utils package\n`,
  "src/utils/helpers.py": `# Utility helpers\n\ndef add(a, b):\n    return a + b\n`,
  "requirements.txt": `# Add your dependencies here\n`,
};

function getFileLanguage(node: FileNode): Language {
  if (node.language) return node.language;
  const n = node.name;
  if (n.endsWith(".ts") || n.endsWith(".tsx")) return "typescript";
  if (n.endsWith(".js") || n.endsWith(".jsx") || n.endsWith(".mjs"))
    return "javascript";
  if (n.endsWith(".py")) return "python";
  if (n.endsWith(".json")) return "json";
  if (n.endsWith(".md")) return "markdown";
  return "plaintext";
}

function getFileContent(fileId: string): string {
  if (DEFAULT_FILE_CONTENT[fileId]) return DEFAULT_FILE_CONTENT[fileId];
  if (fileId.endsWith(".md")) return `# ${fileId.split("/").pop()}\n`;
  if (fileId.endsWith(".json")) return `{}\n`;
  if (fileId.endsWith(".txt")) return "";
  if (fileId.endsWith(".py")) return `# ${fileId.split("/").pop()}\n`;
  return `// ${fileId.split("/").pop()}\n`;
}

// ─── Tree mutation helpers ────────────────────────────────────────────────────

/** Insert a new node as a child of the folder with `parentId`, or at root if parentId is null */
function insertNode(
  tree: FileNode[],
  parentId: string | null,
  newNode: FileNode,
): FileNode[] {
  if (parentId === null) return [...tree, newNode];
  return tree.map((n) => {
    if (n.id === parentId && n.type === "folder") {
      return { ...n, children: [...(n.children ?? []), newNode] };
    }
    if (n.children) {
      return { ...n, children: insertNode(n.children, parentId, newNode) };
    }
    return n;
  });
}

/** Build an id for a new node given its parent path and name */
function makeNodeId(parentId: string | null, name: string): string {
  return parentId ? `${parentId}/${name}` : name;
}

/** Remove a node by id (recursively) */
function deleteNode(tree: FileNode[], id: string): FileNode[] {
  return tree
    .filter((n) => n.id !== id)
    .map((n) =>
      n.children ? { ...n, children: deleteNode(n.children, id) } : n,
    );
}

/** Collect all descendant file ids of a node */
function collectFileIds(node: FileNode): string[] {
  if (node.type === "file") return [node.id];
  return (node.children ?? []).flatMap(collectFileIds);
}

/** Rename a node by id — also updates all descendant ids */
function renameNode(tree: FileNode[], id: string, newName: string): FileNode[] {
  return tree.map((n) => {
    if (n.id === id) {
      // Determine new id: keep same parent prefix, swap last segment
      const parts = id.split("/");
      parts[parts.length - 1] = newName;
      const newId = parts.join("/");
      if (n.type === "folder") {
        // Recursively rebase children ids
        const rebasedChildren = rebaseChildren(n.children ?? [], id, newId);
        return { ...n, id: newId, name: newName, children: rebasedChildren };
      }
      return { ...n, id: newId, name: newName };
    }
    if (n.children)
      return { ...n, children: renameNode(n.children, id, newName) };
    return n;
  });
}

function rebaseChildren(
  children: FileNode[],
  oldPrefix: string,
  newPrefix: string,
): FileNode[] {
  return children.map((n) => {
    const newId = n.id.replace(oldPrefix, newPrefix);
    if (n.type === "folder") {
      return {
        ...n,
        id: newId,
        children: rebaseChildren(n.children ?? [], oldPrefix, newPrefix),
      };
    }
    return { ...n, id: newId };
  });
}

function getFileIcon(name: string, isFolder = false, isOpen = false) {
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

function TreeNode({
  node,
  depth,
  activeFileId,
  onFileClick,
  pendingParentId,
  pendingType,
  onCommitCreate,
  onCancelCreate,
  onDelete,
  onRename,
}: {
  node: FileNode;
  depth: number;
  activeFileId: string;
  onFileClick: (node: FileNode) => void;
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
}) {
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
        {/* Folder row */}
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
            onClick={() => setExpanded((v) => !v)}
            onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
            className="w-full flex items-center group/row font-(family-name:--font-dm) gap-1.5 px-2 py-0.75 hover:bg-surface/60 transition-colors cursor-pointer"
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
            {node.children?.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                activeFileId={activeFileId}
                onFileClick={onFileClick}
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

/** Convert our flat FileNode tree into the FileSystemTree shape WebContainer expects */
function buildWcFileTree(
  nodes: FileNode[],
  getContent: (id: string) => string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const node of nodes) {
    if (node.type === "folder") {
      result[node.name] = {
        directory: buildWcFileTree(node.children ?? [], getContent),
      };
    } else {
      result[node.name] = {
        file: { contents: getContent(node.id) },
      };
    }
  }
  return result;
}

// ─── XTerm Terminal Panel ─────────────────────────────────────────────────────

function XTermPanel({
  visible,
  wcRef,
}: {
  visible: boolean;
  wcRef: React.RefObject<import("@webcontainer/api").WebContainer | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<import("@xterm/xterm").Terminal | null>(null);
  const fitRef = useRef<import("@xterm/addon-fit").FitAddon | null>(null);

  useEffect(() => {
    Promise.all([
      import("@xterm/xterm"),
      import("@xterm/addon-fit"),
      import("@xterm/addon-web-links"),
    ]).then(async ([{ Terminal }, { FitAddon }, { WebLinksAddon }]) => {
      if (!containerRef.current || termRef.current) return;

      const term = new Terminal({
        theme: {
          background: "#0d0d0d",
          foreground: "#c8d3f5",
          cursor: "#7fffd4",
          cursorAccent: "#0d0d0d",
          black: "#1b1d2b",
          red: "#ff757f",
          green: "#7fffd4",
          yellow: "#ffc777",
          blue: "#82aaff",
          magenta: "#c099ff",
          cyan: "#86e1fc",
          white: "#c8d3f5",
          brightBlack: "#444a73",
          brightRed: "#ff757f",
          brightGreen: "#7fffd4",
          brightYellow: "#ffc777",
          brightBlue: "#82aaff",
          brightMagenta: "#c099ff",
          brightCyan: "#86e1fc",
          brightWhite: "#c8d3f5",
          selectionBackground: "#2d3f76",
        },
        fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
        fontSize: 12,
        lineHeight: 1.4,
        cursorBlink: true,
        cursorStyle: "bar",
        allowTransparency: true,
        scrollback: 1000,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      term.open(containerRef.current);
      fitAddon.fit();

      termRef.current = term;
      fitRef.current = fitAddon;

      const resizeObserver = new ResizeObserver(() => fitAddon.fit());
      resizeObserver.observe(containerRef.current);

      // If WebContainer is already booted, spawn a shell and wire it up
      if (wcRef.current) {
        await spawnShell(term, fitAddon, wcRef.current);
      } else {
        // Fallback echo prompt until WC boots
        term.writeln("\x1b[2mWaiting for WebContainer to boot…\x1b[0m");
        // Poll until available
        const poll = setInterval(async () => {
          if (wcRef.current) {
            clearInterval(poll);
            term.reset();
            await spawnShell(term, fitAddon, wcRef.current);
          }
        }, 300);
      }
    });

    const handleResize = () => fitRef.current?.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      termRef.current?.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (visible) setTimeout(() => fitRef.current?.fit(), 50);
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#0d0d0d] overflow-hidden"
      style={{ padding: "4px 8px" }}
    />
  );
}

async function spawnShell(
  term: import("@xterm/xterm").Terminal,
  fitAddon: import("@xterm/addon-fit").FitAddon,
  wc: import("@webcontainer/api").WebContainer,
) {
  const { cols, rows } = term;
  const shell = await wc.spawn("jsh", { terminal: { cols, rows } });

  let pendingNewline = false;

  shell.output.pipeTo(
    new WritableStream({
      write: (data) => {
        let out = data;
        if (pendingNewline && out.match(/^\r?\n\x1b\[[0-9;]*m?~\//)) {
          out = out.replace(/^\r?\n/, "");
        }

        out = out.replace(/(\n)\r?\n(\x1b\[[0-9;]*m?~\/)/g, "$1$2");

        if (out.length > 0) {
          pendingNewline = out.endsWith("\n");
        }

        term.write(out);
      },
    }),
  );

  // terminal → WC
  const input = shell.input.getWriter();
  term.onData((data) => input.write(data));

  // Keep terminal size in sync
  term.onResize(({ cols, rows }) => {
    fitAddon.fit();
    shell.resize({ cols, rows });
  });
}

function fmtMinutes(mins: number): string {
  if (!mins) return "";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function parseGoal(raw: string): string {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
    if (typeof parsed === "object" && parsed !== null)
      return Object.values(parsed).join("\n");
  } catch {
    return raw;
  }
  return raw;
}

// ─── Phase Selector ───────────────────────────────────────────────────────────

function PhaseSelector({
  phases,
  activeIdx,
  currentPhaseNum,
  onSelect,
}: {
  phases: LearningPhaseDTO[];
  activeIdx: number;
  currentPhaseNum: number;
  onSelect: (i: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border-s rounded-sm font-(family-name:--font-dm) text-[11px] text-txt-muted hover:text-txt hover:border-accent/40 transition-colors cursor-pointer"
      >
        <span className="text-accent">
          Phase {phases[activeIdx]?.phase_number ?? activeIdx + 1}
        </span>
        <span className="text-txt-ghost truncate max-w-35">
          {phases[activeIdx]?.title}
        </span>
        {open ? (
          <ChevronUp size={12} className="shrink-0" />
        ) : (
          <ChevronDown size={12} className="shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-void border border-border-s rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
          {phases.map((ph, i) => {
            const isCurrentPhase = ph.phase_number === currentPhaseNum;
            const isLocked = !isCurrentPhase;
            return (
              <button
                key={ph.id}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) {
                    onSelect(i);
                    setOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${i !== phases.length - 1 ? "border-b border-border-s" : ""}
                  ${
                    isLocked
                      ? "opacity-40 cursor-not-allowed text-txt-ghost"
                      : i === activeIdx
                        ? "bg-accent/10 text-accent cursor-pointer"
                        : "text-txt-muted hover:bg-surface hover:text-txt cursor-pointer"
                  }
                `}
              >
                <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost shrink-0 w-5">
                  {String(ph.phase_number).padStart(2, "0")}
                </span>
                <span className="font-(family-name:--font-dm) text-[11px] flex-1 truncate">
                  {ph.title}
                </span>
                {isLocked ? (
                  <Lock size={10} className="text-txt-ghost shrink-0" />
                ) : (
                  <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost shrink-0">
                    {fmtMinutes(ph.estimated_minutes)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DescriptionPanel({
  phase,
  projectName,
}: {
  phase: LearningPhaseDTO | null;
  projectName: string;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  if (!phase) {
    return (
      <div className="flex-1 flex items-center justify-center text-txt-ghost">
        <span className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest">
          Select a phase
        </span>
      </div>
    );
  }

  const goalText = parseGoal(phase.goal);

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "concepts", label: "Concepts" },
    { id: "goal", label: "Goal" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Phase header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-s shrink-0">
        <div className="font-(family-name:--font-dm) text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
          Phase {phase.phase_number} · {fmtMinutes(phase.estimated_minutes)}
        </div>
        <h2 className="font-(family-name:--font-cormorant) text-2xl font-semibold text-txt leading-tight mb-1">
          {phase.title}
        </h2>
        <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted">
          {phase.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border-s shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-(family-name:--font-dm) text-[11px] uppercase tracking-widest transition-colors cursor-pointer border-b-2
              ${
                activeTab === tab.id
                  ? "text-accent border-accent"
                  : "text-txt-ghost border-transparent hover:text-txt"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {activeTab === "description" && (
          <div className="space-y-4">
            {phase.long_description ? (
              <div className="font-(family-name:--font-dm) text-[13px] text-txt-muted leading-[1.8] whitespace-pre-wrap">
                {phase.long_description}
              </div>
            ) : (
              <div className="font-(family-name:--font-dm) text-[13px] text-txt-muted leading-[1.8]">
                {phase.description}
              </div>
            )}
          </div>
        )}

        {activeTab === "concepts" && (
          <div className="space-y-2">
            <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost mb-4">
              Key concepts for this phase
            </p>
            <div className="font-(family-name:--font-dm) text-[12px] text-txt-ghost italic">
              Concepts will appear here once they are loaded.
            </div>
          </div>
        )}

        {activeTab === "goal" && goalText && (
          <div className="space-y-3">
            <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost mb-4">
              Learning objective
            </p>
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm">
              <p className="font-(family-name:--font-dm) text-[13px] text-accent/90 leading-[1.7] whitespace-pre-wrap">
                {goalText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function makeDefaultTab(lang: Language): OpenTab {
  const fileId =
    lang === "python"
      ? "src/main.py"
      : lang === "typescript"
        ? "src/main.ts"
        : "src/main.js";
  return {
    id: fileId,
    name: fileId.split("/").pop()!,
    language: lang,
  };
}

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
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(220);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

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

  // Creation pending state
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

  // Boot WebContainer once on mount
  useEffect(() => {
    let mounted = true;
    import("@webcontainer/api").then(({ WebContainer }) => {
      WebContainer.boot()
        .then(async (wc) => {
          if (!mounted) return;
          wcRef.current = wc;
          // Write the initial file tree into the container
          const fs = buildWcFileTree(
            FILE_TREES["javascript"],
            getFileContent,
          ) as Parameters<typeof wc.mount>[0];
          await wc.mount(fs);
        })
        .catch((err: unknown) => {
          console.error("[WebContainer] boot failed:", err);
        });
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  // Fetch phases
  useEffect(() => {
    if (!projectId || !user) return;
    setLoading(true);
    user.getIdToken().then((token) =>
      getProjectWithPhases(token, projectId)
        .then((data) => {
          const phaseList = data.phases ?? [];
          setPhases(phaseList);
          setProjectName(data.project?.name ?? currentProject.title ?? "");

          // Start on the user's current phase
          const currentPhaseNum = currentProject.phase ?? 1;
          setCurrentPhaseNum(currentPhaseNum);
          const idx = phaseList.findIndex(
            (p) => p.phase_number === currentPhaseNum,
          );
          setActivePhaseIdx(idx >= 0 ? idx : 0);
          setLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        }),
    );
  }, [projectId, user, currentProject.phase, currentProject.title]);

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
      setPendingParentId(undefined);
      setPendingType(null);
      // Re-mount new language's file tree into WebContainer
      if (wcRef.current) {
        const fs = buildWcFileTree(
          FILE_TREES[lang],
          getFileContent,
        ) as Parameters<typeof wcRef.current.mount>[0];
        wcRef.current.mount(fs).catch(console.error);
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
        setOpenTabs((prev) => {
          if (prev.find((t) => t.id === id)) return prev;
          return [...prev, { id, name, language: getFileLanguage(newNode) }];
        });
        setActiveTabId(id);
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
    },
    [activeTabId],
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

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1800);
  }, []);

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

        {/* Right: run button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-sm font-(family-name:--font-dm) text-[11px] uppercase tracking-widest transition-all cursor-pointer
              ${
                isRunning
                  ? "bg-surface text-txt-ghost cursor-not-allowed"
                  : "bg-accent text-void hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(127,255,212,0.3)]"
              }
            `}
          >
            <Play size={11} />
            {isRunning ? "Running…" : "Run"}
          </button>
        </div>
      </div>

      {/* ── SPLIT WORKSPACE ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL — 30% — Phase description */}
        <div className="w-[30%] shrink-0 bg-void border-r border-border-s flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="h-9 shrink-0 flex items-center gap-2 px-4 border-b border-border-s bg-surface/50">
            <BookOpen size={12} className="text-accent" />
            <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              Phase Guide
            </span>
          </div>

          <DescriptionPanel phase={activePhase} projectName={projectName} />
        </div>

        <div className="flex-1 flex overflow-hidden min-w-0">
          <div className="w-48 shrink-0 bg-void border-r border-border-s flex flex-col overflow-hidden">
            <div className="h-9 shrink-0 flex items-center gap-2 px-3 border-b border-border-s bg-surface/50">
              <Folder size={12} className="text-accent/60" />
              <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost flex-1">
                Explorer
              </span>
              {/* New file / new folder buttons */}
              <button
                title="New file"
                onClick={() => {
                  setPendingParentId(null);
                  setPendingType("file");
                }}
                className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
              >
                <FilePlus size={13} />
              </button>
              <button
                title="New folder"
                onClick={() => {
                  setPendingParentId(null);
                  setPendingType("folder");
                }}
                className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
              >
                <FolderPlus size={13} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {fileTree.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  activeFileId={activeTabId}
                  onFileClick={handleFileOpen}
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
          </div>

          {/* EDITOR AREA */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Open file tabs */}
            <div className="h-9 shrink-0 flex items-center gap-0 border-b border-border-s bg-surface/50 overflow-x-auto no-scrollbar">
              {openTabs.map((tab) => (
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
            </div>

            {/* Monaco editor */}
            <div className="overflow-hidden flex-1 min-h-0">
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
                  defaultValue={getFileContent(activeTabId)}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor;
                    monacoRef.current = monaco as unknown as typeof Monaco;
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

            {/* Terminal panel */}
            <div
              className="flex flex-col border-t border-border-s bg-[#0d0d0d] shrink-0"
              style={{ height: terminalOpen ? terminalHeight : 36 }}
            >
              {/* Terminal header bar */}
              <div
                onMouseDown={terminalOpen ? handleDragStart : undefined}
                className={`h-9 shrink-0 flex items-center gap-2 px-3 border-b border-border-s bg-surface/50 ${terminalOpen ? "cursor-row-resize" : ""}`}
              >
                <Terminal size={12} className="text-accent/70" />
                <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost flex-1">
                  Terminal
                </span>
                <button
                  onClick={() => setTerminalOpen((v) => !v)}
                  className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
                  title={terminalOpen ? "Collapse terminal" : "Expand terminal"}
                >
                  {terminalOpen ? (
                    <Minimize2 size={12} />
                  ) : (
                    <Maximize2 size={12} />
                  )}
                </button>
              </div>

              {/* XTerm instance */}
              <div className="flex-1 overflow-hidden">
                <XTermPanel visible={terminalOpen} wcRef={wcRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
