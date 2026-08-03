"use client";

import { useRef, type ReactNode } from "react";
import { Globe, RefreshCw } from "lucide-react";

interface PreviewPaneProps {
  previewUrl: string | null;
  /** Shown in place of the iframe when nothing is running yet — copy
   * differs between the live workspace and the read-only snapshot view
   * (e.g. whether a Run button or a terminal is what gets it started). */
  emptyState: ReactNode;
}

/** Preview address bar + iframe — identical in the live workspace and the
 * read-only past-phase view; both just point it at whatever previewUrl the
 * (shared) WebContainer's dev/static server is currently serving. */
export function PreviewPane({ previewUrl, emptyState }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex flex-col bg-void overflow-hidden min-w-0 min-h-0 flex-1">
      {previewUrl ? (
        <>
          <div className="h-8 shrink-0 flex items-center gap-2 px-3 border-b border-border-s bg-surface/40">
            <Globe size={11} className="text-accent/60 shrink-0" />
            <span className="font-(family-name:--font-dm) text-[11px] text-txt-muted truncate flex-1">
              {previewUrl}
            </span>
            <button
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = previewUrl;
                }
              }}
              title="Reload preview"
              className="p-0.5 text-txt-ghost hover:text-accent transition-colors cursor-pointer"
            >
              <RefreshCw size={11} />
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="flex-1 w-full border-none bg-white"
            allow="cross-origin-isolated"
            title="Preview"
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center bg-accent/5">
            <Globe size={20} className="text-accent/40" />
          </div>
          {emptyState}
        </div>
      )}
    </div>
  );
}
