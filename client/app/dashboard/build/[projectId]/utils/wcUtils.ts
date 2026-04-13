// ─── WebContainer filesystem scanner + shell spawner ─────────────────────────

import type { FileNode } from "../types";
import {
  getFileLanguage,
  IGNORED_DIRECTORIES,
  IGNORED_FILES,
} from "./fileUtils";

/** Recursively read the WC filesystem and return a FileNode[] tree */
export async function scanWcFs(
  wc: import("@webcontainer/api").WebContainer,
  dirPath = ".",
  parentId = "",
): Promise<FileNode[]> {
  const entries = await wc.fs.readdir(dirPath, { withFileTypes: true });
  const nodes: FileNode[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    if (!entry.isDirectory() && IGNORED_FILES.has(entry.name)) continue;

    const id = parentId ? `${parentId}/${entry.name}` : entry.name;
    const fsPath = dirPath === "." ? entry.name : `${dirPath}/${entry.name}`;

    if (entry.isDirectory()) {
      const children = await scanWcFs(wc, fsPath, id);
      nodes.push({ id, name: entry.name, type: "folder", children });
    } else {
      nodes.push({
        id,
        name: entry.name,
        type: "file",
        language: getFileLanguage({
          id,
          name: entry.name,
        } as import("../types").FileNode),
      });
    }
  }

  return nodes.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "folder" ? -1 : 1;
  });
}

/** Spawn an interactive shell inside WebContainer and pipe it to an XTerm terminal */
export async function spawnShell(
  term: import("@xterm/xterm").Terminal,
  _fitAddon: import("@xterm/addon-fit").FitAddon,
  wc: import("@webcontainer/api").WebContainer,
  onNameChange?: (name: string) => void,
): Promise<import("@webcontainer/api").WebContainerProcess> {
  const { cols, rows } = term;
  const shell = await wc.spawn("jsh", { terminal: { cols, rows } });

  let pendingNewline = false;

  shell.output.pipeTo(
    new WritableStream({
      write: (data) => {
        let out = data;

        // Try to parse the directory from the prompt
        // eslint-disable-next-line no-control-regex
        const plainText = out.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
        const promptMatch = plainText.match(/~(?:\/([^\s❯$]+))?\s*[❯$]/);
        if (promptMatch) {
          const path = promptMatch[1];
          if (path) {
            const parts = path.split("/");
            const currentFolder = parts[parts.length - 1];
            onNameChange?.(currentFolder || "bash");
          } else {
            onNameChange?.("bash");
          }
        }

        if (pendingNewline && out.match(/^\r?\n\x1b\[[0-9;]*m?~\//)) {
          out = out.replace(/^\r?\n/, "");
        }
        out = out.replace(/(\n)\r?\n(\x1b\[[0-9;]*m?~\/)/g, "$1$2");
        if (out.length > 0) pendingNewline = out.endsWith("\n");
        term.write(out);
      },
    }),
  );

  const input = shell.input.getWriter();
  term.onData((data) => input.write(data));
  // onResize is triggered BY fitAddon.fit() — do NOT call fit() here again
  // or it creates an infinite resize → fit → resize loop.
  term.onResize(({ cols, rows }) => {
    shell.resize({ cols, rows });
  });

  return shell;
}
