// ─── Cmd/Ctrl+Click "go to definition" for import statements ─────────────────
// Pure, framework-free helpers: parse an import/require line, resolve the
// specifier against the in-memory file tree, and locate a symbol's
// declaration inside the resolved file's source.

import type { FileNode } from "../types";
import { collectAllIds } from "./fileUtils";

export interface ImportName {
  local: string;
  imported: string; // "default" | "*" | actual exported/declared name
}

export interface ParsedImportLine {
  specifier: string;
  specifierStart: number; // 1-based column, first char inside the quotes
  specifierEnd: number; // 1-based column, just past the last char inside quotes
  names: ImportName[];
}

const JS_REQUIRE_RE = /require\(\s*["']([^"']+)["']\s*\)/;
const JS_IMPORT_FROM_RE =
  /^\s*(?:export\s+)?import\s+(?:type\s+)?(.*?)\s+from\s+["']([^"']+)["']/;
const JS_EXPORT_FROM_RE =
  /^\s*export\s+(?:\*(?:\s+as\s+[\w$]+)?|\{[^}]*\})\s+from\s+["']([^"']+)["']/;
const JS_BARE_IMPORT_RE = /^\s*import\s+["']([^"']+)["']/;
const PY_FROM_IMPORT_RE = /^\s*from\s+([.\w]+)\s+import\s+(.+)/;
const PY_IMPORT_RE = /^\s*import\s+([.\w]+)/;

function specifierRange(
  line: string,
  specifier: string,
): { start: number; end: number } {
  const idx = line.indexOf(specifier);
  return { start: idx + 1, end: idx + specifier.length + 1 };
}

function parseNamedClause(clause: string): ImportName[] {
  return clause
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((seg) => {
      const cleaned = seg.replace(/^type\s+/, "");
      const asMatch = cleaned.match(/^([\w$]+)\s+as\s+([\w$]+)$/);
      if (asMatch) return { local: asMatch[2], imported: asMatch[1] };
      return { local: cleaned, imported: cleaned };
    });
}

function parseFromClause(clause: string): ImportName[] {
  const names: ImportName[] = [];
  const trimmed = clause.trim();

  const nsMatch = trimmed.match(/\*\s+as\s+([\w$]+)/);
  if (nsMatch) names.push({ local: nsMatch[1], imported: "*" });

  const namedMatch = trimmed.match(/\{([^}]*)\}/);
  if (namedMatch) names.push(...parseNamedClause(namedMatch[1]));

  const withoutOthers = trimmed
    .replace(/\{[^}]*\}/, "")
    .replace(/\*\s+as\s+[\w$]+/, "");
  const defaultMatch = withoutOthers.match(/^\s*([\w$]+)\s*,?\s*$/);
  if (defaultMatch && defaultMatch[1]) {
    names.push({ local: defaultMatch[1], imported: "default" });
  }

  return names;
}

/** Parses a single source line for an import/require/Python-import statement. */
export function parseImportLine(line: string): ParsedImportLine | null {
  const req = JS_REQUIRE_RE.exec(line);
  if (req) {
    const range = specifierRange(line, req[1]);
    return {
      specifier: req[1],
      specifierStart: range.start,
      specifierEnd: range.end,
      names: [],
    };
  }

  const fromMatch = JS_IMPORT_FROM_RE.exec(line);
  if (fromMatch) {
    const range = specifierRange(line, fromMatch[2]);
    return {
      specifier: fromMatch[2],
      specifierStart: range.start,
      specifierEnd: range.end,
      names: parseFromClause(fromMatch[1]),
    };
  }

  const exportFrom = JS_EXPORT_FROM_RE.exec(line);
  if (exportFrom) {
    const range = specifierRange(line, exportFrom[1]);
    return {
      specifier: exportFrom[1],
      specifierStart: range.start,
      specifierEnd: range.end,
      names: [],
    };
  }

  const bare = JS_BARE_IMPORT_RE.exec(line);
  if (bare) {
    const range = specifierRange(line, bare[1]);
    return {
      specifier: bare[1],
      specifierStart: range.start,
      specifierEnd: range.end,
      names: [],
    };
  }

  const pyFrom = PY_FROM_IMPORT_RE.exec(line);
  if (pyFrom) {
    const range = specifierRange(line, pyFrom[1]);
    const names = pyFrom[2]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((seg) => {
        const asMatch = seg.match(/^([\w.]+)\s+as\s+(\w+)$/);
        if (asMatch) return { local: asMatch[2], imported: asMatch[1] };
        return { local: seg, imported: seg };
      });
    return {
      specifier: pyFrom[1],
      specifierStart: range.start,
      specifierEnd: range.end,
      names,
    };
  }

  const pyImport = PY_IMPORT_RE.exec(line);
  if (pyImport) {
    const range = specifierRange(line, pyImport[1]);
    return {
      specifier: pyImport[1],
      specifierStart: range.start,
      specifierEnd: range.end,
      names: [],
    };
  }

  return null;
}

/** Returns the quoted-string contents under `column` (1-based), if any. */
export function getQuotedStringAt(line: string, column: number): string | null {
  const idx = column - 1;
  const re = /["']([^"']*)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const start = m.index;
    const end = m.index + m[0].length;
    if (idx >= start && idx < end) return m[1];
  }
  return null;
}

function joinAndNormalize(dir: string, relative: string): string {
  const combined = dir ? `${dir}/${relative}` : relative;
  const stack: string[] = [];
  for (const part of combined.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack.join("/");
}

/**
 * Resolves an import specifier to an actual file id present in `tree`.
 * Returns null for bare package specifiers (node_modules) that aren't part
 * of the project, or when no matching file/extension is found.
 */
export function resolveModulePath(
  currentFileId: string,
  specifier: string,
  tree: FileNode[],
  isPython = false,
): string | null {
  const allFiles = new Set(collectAllIds(tree));
  const currentDir = currentFileId.split("/").slice(0, -1).join("/");

  let base: string | null = null;

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    base = joinAndNormalize(currentDir, specifier);
  } else if (isPython && /^\.+/.test(specifier)) {
    const dotMatch = specifier.match(/^(\.+)(.*)$/)!;
    const level = dotMatch[1].length;
    const rest = dotMatch[2].replace(/\./g, "/");
    const dirParts = currentDir.split("/").filter(Boolean);
    const upDir = dirParts.slice(0, Math.max(0, dirParts.length - (level - 1)));
    base = rest ? joinAndNormalize(upDir.join("/"), rest) : upDir.join("/");
  } else if (specifier.startsWith("@/")) {
    base = specifier.slice(2);
  } else if (specifier.startsWith("~/")) {
    base = specifier.slice(2);
  } else if (specifier.startsWith("/")) {
    base = specifier.slice(1);
  } else if (isPython && /^\w+(\.\w+)*$/.test(specifier)) {
    base = specifier.replace(/\./g, "/");
  } else {
    return null;
  }

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    `${base}.py`,
    `${base}.json`,
    `${base}/index.ts`,
    `${base}/index.tsx`,
    `${base}/index.js`,
    `${base}/index.jsx`,
    `${base}/__init__.py`,
  ];

  for (const c of candidates) {
    if (allFiles.has(c)) return c;
  }
  return null;
}

export function findFileNodeById(tree: FileNode[], id: string): FileNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findFileNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Finds the 1-based line where `name` is declared/exported in `content`. */
export function findDefinitionLine(content: string, name: string): number | null {
  if (!name || name === "*") return 1;

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns =
    name === "default"
      ? [
          new RegExp(`export\\s+default\\s+(?:async\\s+)?function\\b`),
          new RegExp(`export\\s+default\\s+class\\b`),
          new RegExp(`export\\s+default\\b`),
        ]
      : [
          new RegExp(`export\\s+(?:default\\s+)?(?:async\\s+)?function\\s*\\*?\\s*${escaped}\\b`),
          new RegExp(`export\\s+(?:default\\s+)?class\\s+${escaped}\\b`),
          new RegExp(`export\\s+(?:const|let|var)\\s+${escaped}\\b`),
          new RegExp(`^\\s*(?:export\\s+)?(?:const|let|var)\\s+${escaped}\\s*=`),
          new RegExp(`^\\s*(?:export\\s+)?function\\s*\\*?\\s*${escaped}\\b`),
          new RegExp(`^\\s*(?:export\\s+)?class\\s+${escaped}\\b`),
          new RegExp(`^\\s*def\\s+${escaped}\\b`),
        ];

  const lines = content.split("\n");
  for (const pattern of patterns) {
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) return i + 1;
    }
  }
  return null;
}
