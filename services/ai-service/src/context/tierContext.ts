/**
 * Per-tier context assembly.
 *
 * The three tiers exist because they need wildly different amounts of context,
 * and paying for the largest on every request is what made the assistant both
 * slow and expensive:
 *
 *   explain  — a snippet the user clicked. Nothing else. No project, no graph,
 *              no tools. Must feel instant, so it gets nothing it doesn't need.
 *   suggest  — the user appears stuck. The active file plus its immediate
 *              dependency neighbours: enough to see what this code touches,
 *              without the cost of understanding the whole project.
 *   polyfill — real questions and debugging. A structural map of the entire
 *              project up front, plus neighbours, plus the sandbox constraints.
 *
 * The polyfill tier is the one that changes most. It previously started every
 * question knowing nothing: it would call list_files, get a flat list of paths,
 * and then guess which to read — burning tool rounds on navigation before it
 * could begin answering. Handing it a structural map (what each file exports,
 * what imports what, how the HTML is shaped) means it can go straight to the
 * file that matters. Same tools, far less groping.
 */
import { listProjectFilesWithContent } from "../clients/contextClients";
import { getImportGraph } from "../graph/graphCache";
import { buildProjectSymbolSummary } from "../graph/symbolExtractor";

/** Per-file cap when neighbour contents are inlined. */
const NEIGHBOUR_CHAR_LIMIT = 2_000;
/** Total cap on the project map, so a large project degrades instead of
 * blowing the context window. */
const PROJECT_MAP_CHAR_LIMIT = 8_000;

/**
 * Facts about the runtime that are true regardless of what the user wrote, and
 * that no amount of reading their code will reveal. Without this the assistant
 * confidently suggests things that cannot work in the browser sandbox — native
 * fs access, spawning processes, packages with build steps — and the user loses
 * an afternoon discovering that on their own.
 */
export const WEBCONTAINER_CONSTRAINTS = [
  "The user's code runs in a WebContainer: Node.js compiled to WebAssembly, inside their browser tab. This constrains what can possibly work:",
  "- No native modules and no node-gyp. Anything requiring a compile step at install time will fail.",
  "- No access to the real filesystem outside the container, and no child_process spawning of system binaries.",
  "- No listening on arbitrary network ports from outside; preview URLs are proxied by the container.",
  "- npm installs work but are slower than local, and packages with native bindings (sharp, bcrypt, sqlite3, puppeteer) will not install.",
  "- There is no Docker, no system package manager, and no persistent state between sessions beyond the project's own files.",
  "Never suggest a fix that depends on any of the above.",
].join("\n");

export interface NeighbourSlice {
  /** Files the active file imports. */
  imports: string[];
  /** Files that import the active file — the ones a change here would break. */
  importers: string[];
  /** Path -> truncated contents, for the neighbours worth inlining. */
  contents: Map<string, string>;
}

/**
 * The active file's immediate dependency neighbourhood.
 *
 * Reverse dependencies matter more than forward ones when someone is stuck: if
 * they're editing a module, what breaks is whatever imports it, and that's the
 * thing they can't see from where they're looking.
 */
export async function getNeighbourSlice(
  projectId: string,
  userEmail: string,
  activeFilePath: string,
): Promise<NeighbourSlice> {
  const empty: NeighbourSlice = { imports: [], importers: [], contents: new Map() };
  if (!activeFilePath) return empty;

  const normalise = (p: string) => p.replace(/^\/+/, "");
  const active = normalise(activeFilePath);

  const graph = await getImportGraph(projectId, userEmail);

  // The graph is keyed by whatever paths the file service returned, which may
  // or may not carry a leading slash. Match on the normalised form.
  const keyFor = (want: string) => {
    for (const k of graph.imports.keys()) if (normalise(k) === want) return k;
    for (const k of graph.importers.keys()) if (normalise(k) === want) return k;
    return null;
  };

  const key = keyFor(active);
  if (!key) return empty;

  const imports = graph.imports.get(key) ?? [];
  const importers = graph.importers.get(key) ?? [];

  const wanted = new Set([...imports, ...importers]);
  const contents = new Map<string, string>();
  if (wanted.size > 0) {
    const files = await listProjectFilesWithContent(projectId, userEmail);
    for (const f of files) {
      if (wanted.has(f.filePath)) {
        contents.set(f.filePath, f.content.slice(0, NEIGHBOUR_CHAR_LIMIT));
      }
    }
  }

  return { imports, importers, contents };
}

/** Renders a neighbour slice as prompt text, or "" when there's nothing to say. */
export function renderNeighbourSlice(slice: NeighbourSlice): string {
  if (!slice.imports.length && !slice.importers.length) return "";

  const lines: string[] = [];
  if (slice.importers.length) {
    lines.push(
      `Files that import the active file (a change here affects these): ${slice.importers.join(", ")}`,
    );
  }
  if (slice.imports.length) {
    lines.push(`Files the active file imports: ${slice.imports.join(", ")}`);
  }

  for (const [path, content] of slice.contents) {
    lines.push(`\n--- ${path} ---\n${content}`);
  }
  return lines.join("\n");
}

/**
 * A structural map of the whole project: what each file exports and imports,
 * how each HTML file is shaped, which CSS selectors carry layout. Deliberately
 * not the file contents — the point is orientation, so the model knows where to
 * look before spending a tool round finding out.
 */
export async function buildProjectMap(
  projectId: string,
  userEmail: string,
): Promise<string> {
  const files = await listProjectFilesWithContent(projectId, userEmail);
  if (!files.length) return "";
  const summary = buildProjectSymbolSummary(files);
  return summary.length > PROJECT_MAP_CHAR_LIMIT
    ? `${summary.slice(0, PROJECT_MAP_CHAR_LIMIT)}\n… (map truncated; use read_file for anything not shown)`
    : summary;
}
