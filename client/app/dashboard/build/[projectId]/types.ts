// ─── Shared types for the build workspace ────────────────────────────────────

export type Tab = "description" | "concepts" | "goal";

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "json"
  | "markdown"
  | "plaintext";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  language?: Language;
  children?: FileNode[];
}

export interface OpenTab {
  id: string;
  name: string;
  language: Language;
}
