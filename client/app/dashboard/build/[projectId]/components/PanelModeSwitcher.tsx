"use client";

import { FileCode, Columns2, Globe } from "lucide-react";

export type PanelMode = "editor" | "split" | "preview";

interface PanelModeSwitcherProps {
  activePanel: PanelMode;
  onChange: (mode: PanelMode) => void;
  previewUrl: string | null;
}

/** Editor / Split / Preview tab switcher — identical in the live workspace
 * and the read-only past-phase view, so both render this instead of two
 * copies of the same three buttons. */
export function PanelModeSwitcher({
  activePanel,
  onChange,
  previewUrl,
}: PanelModeSwitcherProps) {
  return (
    <div className="flex items-center h-full border-l border-border-s shrink-0">
      <button
        onClick={() => onChange("editor")}
        className={`flex items-center gap-1.5 px-3 h-full font-sans text-xs uppercase tracking-[0.07em] transition-colors cursor-pointer border-b-2
          ${activePanel === "editor" ? "text-accent border-accent bg-void" : "text-txt-ghost border-transparent hover:text-txt"}`}
      >
        <FileCode size={11} />
        Editor
      </button>
      <button
        onClick={() => onChange("split")}
        title="Split view"
        className={`flex items-center gap-1.5 px-3 h-full font-sans text-xs uppercase tracking-[0.07em] transition-colors cursor-pointer border-b-2
          ${activePanel === "split" ? "text-accent border-accent bg-void" : "text-txt-ghost border-transparent hover:text-txt"}`}
      >
        <Columns2 size={11} />
        Split
      </button>
      <button
        onClick={() => onChange("preview")}
        className={`flex items-center gap-1.5 px-3 h-full font-sans text-xs uppercase tracking-[0.07em] transition-colors cursor-pointer border-b-2
          ${activePanel === "preview" ? "text-accent border-accent bg-void" : "text-txt-ghost border-transparent hover:text-txt"}
          ${previewUrl && activePanel !== "preview" ? "text-accent/60" : ""}
        `}
      >
        <Globe size={11} />
        Preview
        {previewUrl && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        )}
      </button>
    </div>
  );
}
