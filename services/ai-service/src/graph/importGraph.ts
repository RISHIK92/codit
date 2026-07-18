// ─── Layer 1: deterministic import graph ──────────────────────────────────
// Lexer-free, LLM-free — just regex extraction of relative import specifiers
// plus path resolution against the project's known file list. Gives the
// polyfill agent a way to jump straight to "what does X import" / "what
// imports X" instead of guessing paths via list_files + read_file.

import * as path from "path";

const IMPORT_PATTERNS = [
  /import\s+(?:[\w*{}\n\r\t, ]+\s+from\s+)?["']([^"']+)["']/g,
  /export\s+(?:[\w*{}\n\r\t, ]+\s+from\s+)?["']([^"']+)["']/g,
  /require\(\s*["']([^"']+)["']\s*\)/g,
  /import\(\s*["']([^"']+)["']\s*\)/g,
];

const RESOLVABLE_EXTENSIONS = [
  "",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  "/index.ts",
  "/index.tsx",
  "/index.js",
  "/index.jsx",
];

export interface ProjectFileInput {
  filePath: string;
  content: string;
}

export interface ImportGraph {
  /** file -> files it imports (resolved to known project paths only) */
  imports: Map<string, string[]>;
  /** file -> files that import it */
  importers: Map<string, string[]>;
}

function extractSpecifiers(content: string): string[] {
  const specifiers = new Set<string>();
  for (const pattern of IMPORT_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content))) {
      const specifier = match[1];
      // Only relative/project-local imports are part of the project's own
      // graph — bare specifiers (npm packages) resolve outside it.
      if (specifier.startsWith(".") || specifier.startsWith("/")) {
        specifiers.add(specifier);
      }
    }
  }
  return [...specifiers];
}

function resolveSpecifier(
  fromFile: string,
  specifier: string,
  knownPaths: Set<string>,
): string | null {
  const base = specifier.startsWith(".")
    ? path.posix.join(path.posix.dirname(fromFile), specifier)
    : specifier;

  for (const ext of RESOLVABLE_EXTENSIONS) {
    const candidate = base + ext;
    if (knownPaths.has(candidate)) return candidate;
  }
  return null;
}

export function buildImportGraph(files: ProjectFileInput[]): ImportGraph {
  const knownPaths = new Set(files.map((f) => f.filePath));
  const imports = new Map<string, string[]>();
  const importers = new Map<string, string[]>();

  for (const file of files) {
    const resolved = extractSpecifiers(file.content)
      .map((s) => resolveSpecifier(file.filePath, s, knownPaths))
      .filter((p): p is string => p !== null && p !== file.filePath);

    imports.set(file.filePath, resolved);

    for (const target of resolved) {
      const existing = importers.get(target) ?? [];
      existing.push(file.filePath);
      importers.set(target, existing);
    }
  }

  return { imports, importers };
}
