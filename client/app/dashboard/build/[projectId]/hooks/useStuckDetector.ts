"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendChatMessage } from "@/lib/api/aiApi";
import {
  createState,
  reduce,
  evaluate,
  promptFor,
  type StuckEvent,
  type StuckState,
  type StuckTrigger,
} from "@/lib/stuck/stuckDetector";

/** How often the guards are re-checked. Time-based reasons (idleness) need a
 * tick; everything else is edge-triggered anyway, so this can be lazy. */
const TICK_MS = 20_000;

/** Persisted opt-out. Distinct from the session mute a dismissal produces:
 * this one is the user saying "not ever", and it has to survive a reload or
 * it isn't really an opt-out. */
const OPT_OUT_KEY = "codit:suggestions:off";

export interface ActiveSuggestion {
  text: string;
  trigger: StuckTrigger;
}

/**
 * Runs the stuck heuristic and fetches a nudge when it fires.
 *
 * All the judgement lives in lib/stuck/stuckDetector, which is pure and tested
 * separately. This hook is only plumbing: keep state in a ref so feeding events
 * doesn't re-render the editor, poll for time-based reasons, and make the
 * network call when the heuristic says it's warranted.
 */
export function useStuckDetector(params: {
  projectId: string;
  activeFilePath?: string;
  currentTask?: string;
  getToken: () => Promise<string>;
  /** Criterion id -> its text, so a nudge can name what's failing. */
  criterionText?: Record<string, string>;
  /** Pause while the user is already talking to the assistant, reading a
   * review, or looking at frozen history — a nudge there is redundant at best. */
  suppressed?: boolean;
}) {
  const { projectId, activeFilePath, currentTask, getToken, criterionText, suppressed } =
    params;

  const stateRef = useRef<StuckState>(createState(Date.now()));
  const inFlightRef = useRef(false);
  const [suggestion, setSuggestion] = useState<ActiveSuggestion | null>(null);
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(OPT_OUT_KEY) === "1") setOptedOut(true);
    } catch {
      // Private mode or storage disabled — default to suggestions on.
    }
  }, []);

  const record = useCallback((event: StuckEvent) => {
    stateRef.current = reduce(stateRef.current, event, Date.now());
  }, []);

  const dismiss = useCallback(() => {
    record({ type: "suggestion_dismissed" });
    setSuggestion(null);
  }, [record]);

  const turnOff = useCallback(() => {
    record({ type: "muted" });
    setSuggestion(null);
    setOptedOut(true);
    try {
      localStorage.setItem(OPT_OUT_KEY, "1");
    } catch {
      // Non-fatal: the session mute above still holds for this visit.
    }
  }, [record]);

  useEffect(() => {
    if (optedOut) return;

    const tick = async () => {
      if (suppressed || inFlightRef.current || suggestion) return;

      const now = Date.now();
      const trigger = evaluate(stateRef.current, now);
      if (!trigger) return;

      inFlightRef.current = true;
      try {
        const token = await getToken();
        const text = await sendChatMessage(
          token,
          {
            projectId,
            activeFilePath,
            currentTask,
            message: promptFor(
              trigger,
              trigger.subjectId ? criterionText?.[trigger.subjectId] : undefined,
            ),
            history: [],
            mode: "suggest",
          },
          () => {},
        );

        // The suggester is allowed to decline, and an empty reply means it did.
        // Marking the trigger offered anyway is deliberate: the moment has been
        // spent, and re-asking about the same thing would just spend another.
        stateRef.current = reduce(
          stateRef.current,
          { type: "suggestion_shown", key: trigger.key },
          Date.now(),
        );

        const trimmed = text.trim();
        if (trimmed) setSuggestion({ text: trimmed, trigger });
      } catch {
        // A failed nudge is not worth telling the user about — they didn't ask
        // for it. Stay silent and let the next trigger try.
      } finally {
        inFlightRef.current = false;
      }
    };

    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [
    optedOut,
    suppressed,
    suggestion,
    projectId,
    activeFilePath,
    currentTask,
    getToken,
    criterionText,
  ]);

  return { suggestion, record, dismiss, turnOff, optedOut };
}
