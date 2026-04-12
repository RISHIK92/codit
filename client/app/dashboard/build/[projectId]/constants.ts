// ─── Static data: default file trees and default file contents ───────────────

import type { FileNode, Language } from "./types";

export const FILE_TREES: Record<
  "javascript" | "typescript" | "python",
  FileNode[]
> = {
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
