// ─── Static data: default file trees and default file contents ───────────────

import type { FileNode, Language } from "./types";

export const FILE_TREES: Record<
  "javascript" | "typescript" | "python" | "html",
  FileNode[]
> = {
  html: [
    { id: "index.html", name: "index.html", type: "file", language: "html" },
    { id: "style.css", name: "style.css", type: "file", language: "css" },
    {
      id: "script.js",
      name: "script.js",
      type: "file",
      language: "javascript",
    },
  ],
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
    { id: "package.json", name: "package.json", type: "file" },
    { id: "README.md", name: "README.md", type: "file" },
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
    { id: "tsconfig.json", name: "tsconfig.json", type: "file" },
    { id: "package.json", name: "package.json", type: "file" },
    { id: "README.md", name: "README.md", type: "file" },
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

export const DEFAULT_FILE_CONTENT: Record<string, string> = {
  "index.html": `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>My Project</title>\n  <link rel="stylesheet" href="style.css" />\n</head>\n<body>\n  <h1>Hello, world!</h1>\n  <script src="script.js"></script>\n</body>\n</html>\n`,
  "style.css": `body {\n  font-family: sans-serif;\n  margin: 2rem;\n}\n`,
  "script.js": `// Edit freely\nconsole.log("Hello from script.js");\n`,
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

/**
 * Dependency-free static file server + hot reload, written into the
 * WebContainer fs at run time for the Run button (HTML/CSS/JS projects).
 * Deliberately avoids `npx live-server`/`serve` etc. — third-party packages
 * that shell out to fs-watching native bindings (e.g. chokidar) are prone to
 * silently failing inside WebContainer's virtual filesystem, which leaves
 * the preview blank with no visible error. This uses only Node's built-in
 * `http`/`fs` so there's nothing to fetch and nothing that can be
 * WebContainer-incompatible. Hot reload is a minimal SSE stream: the server
 * watches its own directory and pings connected clients on any change; an
 * injected script reloads the page on that ping.
 */
export const STATIC_SERVER_FILENAME = ".codit-server.cjs";
export const STATIC_SERVER_SCRIPT = `const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const ROOT = process.cwd();
const RELOAD_SNIPPET =
  '<script>new EventSource("/__codit_reload").onmessage = () => location.reload();</script>';

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

/** @type {import("http").ServerResponse[]} */
const reloadClients = [];

const server = http.createServer((req, res) => {
  if (req.url === "/__codit_reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("\\n");
    reloadClients.push(res);
    req.on("close", () => {
      const i = reloadClients.indexOf(res);
      if (i !== -1) reloadClients.splice(i, 1);
    });
    return;
  }

  let urlPath = req.url.split("?")[0];
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(ROOT, decodeURIComponent(urlPath));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found: " + urlPath);
      return;
    }
    const ext = path.extname(filePath);
    const type = MIME[ext] || "application/octet-stream";
    if (ext === ".html") {
      const withReload = data
        .toString("utf-8")
        .replace("</body>", RELOAD_SNIPPET + "</body>");
      data = Buffer.from(
        withReload.includes(RELOAD_SNIPPET)
          ? withReload
          : withReload + RELOAD_SNIPPET,
      );
    }
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("codit static server listening on port " + PORT);
});

// Non-recursive watch (WebContainer's fs.watch may not support recursive on
// every platform) — sufficient for this project's flat file layout.
try {
  fs.watch(ROOT, () => {
    reloadClients.forEach((res) => res.write("data: reload\\n\\n"));
  });
} catch (err) {
  console.error("watch failed, hot reload disabled:", err);
}
`;

/** Files/paths that are never saved to the database */
export const SAVE_EXCLUDE = new Set([
  "node_modules",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  ".env",
]);

/** Default language when creating files of a given extension */
export const DEFAULT_LANGUAGE: Language = "javascript";
