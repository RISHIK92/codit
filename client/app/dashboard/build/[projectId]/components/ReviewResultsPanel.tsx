"use client";

import { CheckCircle2, XCircle, AlertCircle, X, MapPin } from "lucide-react";
import type { PhaseReviewResultDTO } from "@/lib/api/projectsApi";

/**
 * The outcome of a phase review, as a checklist.
 *
 * Replaces dumping the grader's prose into the chat panel. A paragraph saying
 * "close, but the labels aren't right" is something to argue with; a list
 * showing four checks green, one red, with the reason and where the grader
 * looked, is something to act on. It also makes a wrong verdict visible and
 * challengeable rather than mysterious, which matters when the thing standing
 * between the user and progress is a language model.
 */

interface ReviewResultsPanelProps {
  result: PhaseReviewResultDTO;
  onClose: () => void;
}

export function ReviewResultsPanel({ result, onClose }: ReviewResultsPanelProps) {
  const { verdict, results, criteria_total, criteria_passed } = result;
  const anyUngraded = results.some((r) => r.ungraded);

  const headline =
    verdict === "met"
      ? "Phase complete"
      : verdict === "blocked"
        ? "Knowledge checks first"
        : anyUngraded && results.every((r) => r.passed || r.ungraded)
          ? "Couldn't finish grading"
          : "Not yet";

  const accent =
    verdict === "met"
      ? "text-success border-success/40 bg-success/5"
      : verdict === "blocked"
        ? "text-warning border-warning/40 bg-warning/5"
        : "text-warning border-warning/40 bg-warning/5";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-s shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`px-2 py-0.5 rounded-sm border font-(family-name:--font-dm) text-[10px] uppercase tracking-widest ${accent}`}
          >
            {headline}
          </span>
          {criteria_total > 0 && (
            <span className="font-(family-name:--font-dm) text-[11px] text-txt-muted truncate">
              {criteria_passed} of {criteria_total} checks passed
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-sm text-txt-ghost hover:text-txt hover:bg-void/60 transition-colors cursor-pointer shrink-0"
          title="Close"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
        {verdict === "blocked" && (
          <p className="font-(family-name:--font-dm) text-[12.5px] text-txt/85 leading-[1.7]">
            {result.feedback}
          </p>
        )}

        {results.map((r) => {
          const Icon = r.ungraded ? AlertCircle : r.passed ? CheckCircle2 : XCircle;
          const tone = r.ungraded
            ? "text-txt-ghost"
            : r.passed
              ? "text-success"
              : "text-warning";

          return (
            <div
              key={r.criterion_id}
              className={`p-3 rounded-sm border ${
                r.passed
                  ? "border-border-s bg-void/30"
                  : "border-warning/25 bg-warning/[0.03]"
              }`}
            >
              <div className="flex gap-2.5">
                <Icon size={14} className={`${tone} shrink-0 mt-[2px]`} />
                <div className="min-w-0 space-y-1.5">
                  <p
                    className={`font-(family-name:--font-dm) text-[12.5px] leading-[1.6] ${
                      r.passed ? "text-txt/70" : "text-txt/95"
                    }`}
                  >
                    {r.text}
                  </p>

                  {/* Reasoning is the actionable part on a failure; on a pass
                      it's just confirmation, so it's de-emphasised. */}
                  {r.reasoning && (
                    <p
                      className={`font-(family-name:--font-dm) text-[11.5px] leading-[1.6] ${
                        r.passed ? "text-txt-ghost" : "text-txt-muted"
                      }`}
                    >
                      {r.reasoning}
                    </p>
                  )}

                  {/* Showing where the grader looked is what makes a wrong
                      verdict arguable instead of arbitrary. */}
                  {r.passed && r.evidence_path && (
                    <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-txt-ghost">
                      <MapPin size={9} />
                      <span className="truncate">
                        {r.evidence_path}
                        {r.evidence_lines ? `:${r.evidence_lines}` : ""}
                      </span>
                    </div>
                  )}

                  {!r.passed && r.hint && (
                    <p className="font-(family-name:--font-dm) text-[11.5px] text-accent/75 leading-[1.6]">
                      {r.hint}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {verdict !== "met" && results.length > 0 && (
          <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost italic pt-1 leading-[1.6]">
            {anyUngraded
              ? "Checks marked with a warning weren't graded — that's on us, not your code. Submit again."
              : "Fix what's flagged and submit again. There's no limit on attempts."}
          </p>
        )}
      </div>
    </div>
  );
}
