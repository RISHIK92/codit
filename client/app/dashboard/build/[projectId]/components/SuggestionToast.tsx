"use client";

import { Lightbulb, X } from "lucide-react";
import type { ActiveSuggestion } from "../hooks/useStuckDetector";

/**
 * An unprompted nudge, presented as something to ignore.
 *
 * The user didn't ask for this, which sets the design constraints: it must not
 * cover the editor, must not steal focus, must not block anything, and must be
 * closable without reading it. Anything that demands attention it wasn't
 * granted is how a helpful feature becomes one people turn off — so "turn these
 * off" is offered right here, plainly, rather than buried in settings.
 */
export function SuggestionToast({
  suggestion,
  onDismiss,
  onTurnOff,
}: {
  suggestion: ActiveSuggestion;
  onDismiss: () => void;
  onTurnOff: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-40 w-[min(370px,calc(100vw-2.5rem))] rounded-sm border border-accent/25 bg-surface shadow-lg shadow-void/40 animate-in"
    >
      <div className="flex items-start gap-2.5 px-4 pt-3.5 pb-2">
        <Lightbulb size={13} className="text-accent shrink-0 mt-[3px]" />
        <p className="flex-1 font-sans text-base leading-[1.65] text-txt/90">
          {suggestion.text}
        </p>
        <button
          onClick={onDismiss}
          aria-label="Dismiss suggestion"
          className="p-0.5 rounded-sm text-txt-ghost hover:text-txt hover:bg-void/60 transition-colors cursor-pointer shrink-0"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex items-center justify-between px-4 pb-2.5">
        <span className="font-sans text-xs uppercase tracking-[0.07em] text-txt-ghost/70">
          Suggestion
        </span>
        <button
          onClick={onTurnOff}
          className="font-sans text-xs text-txt-ghost hover:text-txt-muted underline underline-offset-2 transition-colors cursor-pointer"
        >
          Turn these off
        </button>
      </div>
    </div>
  );
}
