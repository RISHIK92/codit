// ─── Pure file-system helpers (no React) ─────────────────────────────────────

import type { FileNode, Language, OpenTab } from "../types";
import { DEFAULT_FILE_CONTENT, STATIC_SERVER_FILENAME } from "../constants";

// ── Language detection ─────────────────────────────────────────────────────

export function getFileLanguage(
  node: Pick<FileNode, "name" | "language">,
): Language {
  if (node.language) return node.language;
  const n = node.name;
  if (n.endsWith(".ts") || n.endsWith(".tsx")) return "typescript";
  if (n.endsWith(".js") || n.endsWith(".jsx") || n.endsWith(".mjs"))
    return "javascript";
  if (n.endsWith(".py")) return "python";
  if (n.endsWith(".html") || n.endsWith(".htm")) return "html";
  if (n.endsWith(".css")) return "css";
  if (n.endsWith(".json")) return "json";
  if (n.endsWith(".md")) return "markdown";
  return "plaintext";
}

// ── Default content ────────────────────────────────────────────────────────

export function getDefaultFileContent(fileId: string): string {
  if (DEFAULT_FILE_CONTENT[fileId]) return DEFAULT_FILE_CONTENT[fileId];
  if (fileId === ".env" || fileId.endsWith("/.env"))
    return `# This file won't be saved\n`;
  if (fileId.endsWith(".md")) return `# ${fileId.split("/").pop()}\n`;
  if (fileId.endsWith(".json")) return `{}\n`;
  if (fileId.endsWith(".txt")) return "";
  if (fileId.endsWith(".py")) return `# ${fileId.split("/").pop()}\n`;
  return `// ${fileId.split("/").pop()}\n`;
}

// ── Build tree from flat DB entries ───────────────────────────────────────

export function buildFileTreeFromEntries(
  entries: Array<{ filePath: string; content: string; isDirectory: boolean }>,
): FileNode[] {
  const root: FileNode[] = [];
  const sorted = [...entries].sort((a, b) =>
    a.filePath.localeCompare(b.filePath),
  );

  for (const entry of sorted) {
    const path = entry.filePath.replace(/^\//, "");
    const parts = path.split("/");
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const id = parts.slice(0, i + 1).join("/");
      const isLast = i === parts.length - 1;
      let node = current.find((n) => n.id === id);
      if (!node) {
        if (isLast && !entry.isDirectory) {
          node = {
            id,
            name,
            type: "file",
            language: getFileLanguage({ id, name } as FileNode),
          };
        } else {
          node = { id, name, type: "folder", children: [] };
        }
        current.push(node);
      }
      if (node.type === "folder") current = node.children!;
    }
  }

  return root;
}

// ── Tree mutation helpers ──────────────────────────────────────────────────

export function insertNode(
  tree: FileNode[],
  parentId: string | null,
  newNode: FileNode,
): FileNode[] {
  if (parentId === null) return [...tree, newNode];
  return tree.map((n) => {
    if (n.id === parentId && n.type === "folder")
      return { ...n, children: [...(n.children ?? []), newNode] };
    if (n.children)
      return { ...n, children: insertNode(n.children, parentId, newNode) };
    return n;
  });
}

export function makeNodeId(parentId: string | null, name: string): string {
  return parentId ? `${parentId}/${name}` : name;
}

/**
 * Whether a sibling with this name already exists at the given level
 * (root if parentId is null). A node's id doubles as its DB file_path and
 * its Monaco model URI, both keyed only by path — two siblings with the
 * same name would collide into the same id, silently overwriting one
 * file's content with the other's on save instead of staying distinct.
 * excludeId skips the node being renamed, so renaming to its own current
 * name isn't flagged as a collision with itself.
 */
export function hasSiblingWithName(
  tree: FileNode[],
  parentId: string | null,
  name: string,
  excludeId?: string,
): boolean {
  const siblings = parentId
    ? findNodeById(tree, parentId)?.children ?? []
    : tree;
  return siblings.some((n) => n.id !== excludeId && n.name === name);
}

/** The id of the folder that directly contains this node (null at root) —
 * unlike getParentFolderId, this is always the true parent regardless of
 * whether the node itself is a file or a folder. Used for collision checks
 * on rename, where we need this node's actual siblings, not "where should
 * a new item go relative to it". */
export function getNodeParentId(
  tree: FileNode[],
  id: string,
  parentId: string | null = null,
): string | null | undefined {
  for (const n of tree) {
    if (n.id === id) return parentId;
    if (n.children) {
      const found = getNodeParentId(n.children, id, n.id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function findNodeById(tree: FileNode[], id: string): FileNode | undefined {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function getParentFolderId(
  fileId: string,
  tree: FileNode[],
): string | null {
  function findParent(
    nodes: FileNode[],
    targetId: string,
    parentId: string | null,
  ): string | null | undefined {
    for (const n of nodes) {
      if (n.id === targetId) return n.type === "folder" ? n.id : parentId;
      if (n.children) {
        const found = findParent(n.children, targetId, n.id);
        if (found !== undefined) return found;
      }
    }
    return undefined;
  }
  return findParent(tree, fileId, null) ?? null;
}

export function deleteNode(tree: FileNode[], id: string): FileNode[] {
  return tree
    .filter((n) => n.id !== id)
    .map((n) =>
      n.children ? { ...n, children: deleteNode(n.children, id) } : n,
    );
}

export function collectFileIds(node: FileNode): string[] {
  if (node.type === "file") return [node.id];
  return (node.children ?? []).flatMap(collectFileIds);
}

export function renameNode(
  tree: FileNode[],
  id: string,
  newName: string,
): FileNode[] {
  return tree.map((n) => {
    if (n.id === id) {
      const parts = id.split("/");
      parts[parts.length - 1] = newName;
      const newId = parts.join("/");
      if (n.type === "folder") {
        return {
          ...n,
          id: newId,
          name: newName,
          children: rebaseChildren(n.children ?? [], id, newId),
        };
      }
      return { ...n, id: newId, name: newName };
    }
    if (n.children)
      return { ...n, children: renameNode(n.children, id, newName) };
    return n;
  });
}

export function rebaseChildren(
  children: FileNode[],
  oldPrefix: string,
  newPrefix: string,
): FileNode[] {
  return children.map((n) => {
    const newId = n.id.replace(oldPrefix, newPrefix);
    if (n.type === "folder")
      return {
        ...n,
        id: newId,
        children: rebaseChildren(n.children ?? [], oldPrefix, newPrefix),
      };
    return { ...n, id: newId };
  });
}

export function collectAllIds(nodes: FileNode[]): string[] {
  return nodes.flatMap((n) =>
    n.type === "file" ? [n.id] : [n.id, ...collectAllIds(n.children ?? [])],
  );
}

// ── WC file tree builder ───────────────────────────────────────────────────

export function buildWcFileTree(
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
      result[node.name] = { file: { contents: getContent(node.id) } };
    }
  }
  return result;
}

// ── Tab helpers ────────────────────────────────────────────────────────────

export function makeDefaultTab(lang: Language): OpenTab {
  const fileId =
    lang === "python"
      ? "src/main.py"
      : lang === "typescript"
        ? "src/main.ts"
        : "src/main.js";
  return { id: fileId, name: fileId.split("/").pop()!, language: lang };
}

// ── Formatting utils ───────────────────────────────────────────────────────

export function fmtMinutes(mins: number): string {
  if (!mins) return "";
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function parseGoal(raw: string): string {
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

// ── Save exclusion helper ──────────────────────────────────────────────────

export const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".vercel",
]);

export const IGNORED_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  ".DS_Store",
  ".env",
  STATIC_SERVER_FILENAME,
]);

export function isSaveExcluded(filePath: string): boolean {
  const parts = filePath.split("/");
  for (const part of parts) {
    if (IGNORED_DIRECTORIES.has(part) || IGNORED_FILES.has(part)) {
      return true;
    }
  }
  return false;
}
