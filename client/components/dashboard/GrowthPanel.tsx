"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Circle, CloudFog, Loader2, X } from "lucide-react";
import {
  getGrowth,
  startCheckpoint,
  submitCheckpoint,
  type GrowthDTO,
} from "@/lib/api/growthApi";

/**
 * The growth record.
 *
 * Four stats, shown as four. There is deliberately no total, no level number
 * and no percentage anywhere in here: a combined figure would let shipping
 * substitute for understanding, and making that substitution visible is the
 * entire reason this panel exists.
 *
 * Fog is presented as a property of the work — phases shipped but never
 * explained — not as a judgement about the person. It is never framed as a
 * failure, a streak, or something lost; only as something still open.
 */

const STAT_META: {
  key: keyof Pick<GrowthDTO, "build" | "understand" | "explore" | "show">;
  label: string;
  hint: string;
  className: string;
}[] = [
  { key: "build", label: "Build", hint: "What exists because of you", className: "text-success" },
  { key: "understand", label: "Understand", hint: "What you can explain", className: "text-accent" },
  { key: "explore", label: "Explore", hint: "How far you've looked", className: "text-[#b8a4e8]" },
  { key: "show", label: "Show", hint: "What others can see", className: "text-txt-muted" },
];

export function GrowthPanel({
  getToken,
  refreshSignal,
}: {
  getToken: () => Promise<string>;
  /** Bump this (e.g. an incrementing counter) to force a reload — used by
   * SharePanel so publishing or withdrawing an artifact is reflected in Show
   * immediately, instead of only on the next full page load. */
  refreshSignal?: number;
}) {
  const [growth, setGrowth] = useState<GrowthDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const [checkpoint, setCheckpoint] = useState<{
    id: string;
    question: string;
    projectId: string;
    phaseNumber: number;
  } | null>(null);
  const [answer, setAnswer] = useState("");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; feedback: string; missing: string[] } | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setGrowth(await getGrowth(await getToken()));
    } catch {
      // A missing growth record shouldn't take the dashboard down with it.
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, refreshSignal]);

  async function openCheckpoint(projectId: string, phaseNumber: number) {
    setError("");
    setResult(null);
    setAnswer("");
    try {
      const token = await getToken();
      const { checkpoint_id, question } = await startCheckpoint(token, projectId, phaseNumber);
      setCheckpoint({ id: checkpoint_id, question, projectId, phaseNumber });
    } catch (e: any) {
      setError(e.message ?? "Couldn't start that checkpoint.");
    }
  }

  async function submit() {
    if (!checkpoint || grading) return;
    setGrading(true);
    setError("");
    try {
      const token = await getToken();
      const r = await submitCheckpoint(token, checkpoint.id, answer);
      setResult({ passed: r.passed, feedback: r.feedback, missing: r.missing_concepts });
      if (r.passed) await load();
    } catch (e: any) {
      setError(e.message ?? "Couldn't grade that — try again.");
    } finally {
      setGrading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-5 border border-border-s rounded-sm flex items-center gap-2 text-txt-ghost">
        <Loader2 size={13} className="animate-spin" />
        <span className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest">
          Loading growth
        </span>
      </div>
    );
  }
  if (!growth) return null;

  return (
    <div className="border border-border-s rounded-sm overflow-hidden">
      {/* Era */}
      <div className="px-5 pt-5 pb-4 border-b border-border-s">
        <div className="font-(family-name:--font-dm) text-[10px] uppercase tracking-[0.2em] text-accent mb-1.5">
          Era {growth.era_index + 1}
        </div>
        <h3 className="font-(family-name:--font-cormorant) text-2xl text-txt leading-tight">
          {growth.era_name}
        </h3>
        {growth.era_blurb && (
          <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted mt-1.5 leading-[1.6]">
            {growth.era_blurb}
          </p>
        )}
      </div>

      {/* Four stats — four, always. Never summed. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border-s">
        {STAT_META.map((s) => (
          <div key={s.key} className="px-5 py-4 border-r last:border-r-0 border-border-s">
            <div className={`font-(family-name:--font-cormorant) text-2xl ${s.className}`}>
              {growth[s.key]}
            </div>
            <div className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt mt-0.5">
              {s.label}
            </div>
            <div className="font-(family-name:--font-dm) text-[10px] text-txt-ghost mt-0.5 leading-[1.4]">
              {s.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Next era — named requirements, no hidden score */}
      {growth.next_era_name && (
        <div className="px-5 py-4 border-b border-border-s">
          <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost mb-2.5">
            To reach {growth.next_era_name}
          </p>
          <ul className="space-y-1.5">
            {growth.next_requirements.map((r) => (
              <li key={r.label} className="flex items-center gap-2">
                {r.met ? (
                  <CheckCircle2 size={12} className="text-success shrink-0" />
                ) : (
                  <Circle size={12} className="text-txt-ghost shrink-0" />
                )}
                <span
                  className={`font-(family-name:--font-dm) text-[12px] ${r.met ? "text-txt-ghost line-through" : "text-txt/90"}`}
                >
                  {r.label}
                </span>
                {!r.met && (
                  <span className="font-(family-name:--font-dm) text-[10.5px] text-txt-ghost ml-auto">
                    {r.have} / {r.need}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fog — framed as work still open, never as a deficiency */}
      {growth.fog_count > 0 && (
        <div className="px-5 py-4">
          <div className="flex items-center gap-2 mb-1.5">
            <CloudFog size={13} className="text-txt-muted" />
            <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              {growth.fog_count} {growth.fog_count === 1 ? "phase" : "phases"} still unexplained
            </p>
          </div>
          <p className="font-(family-name:--font-dm) text-[11.5px] text-txt-muted leading-[1.6] mb-3">
            You built these. Explaining one back in your own words is the only thing that moves Understand.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {growth.unexplained.slice(0, 6).map((u) => (
              <button
                key={`${u.project_id}:${u.phase_number}`}
                onClick={() => openCheckpoint(u.project_id, u.phase_number)}
                className="px-2.5 py-1 rounded-sm border border-border-s hover:border-accent/40 hover:bg-accent/5 font-(family-name:--font-dm) text-[11px] text-txt-muted hover:text-accent transition-colors cursor-pointer"
              >
                {u.project_name || "Project"} · Phase {u.phase_number}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="px-5 pb-4 font-(family-name:--font-dm) text-[11.5px] text-warning">{error}</p>
      )}

      {/* Checkpoint */}
      {checkpoint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4">
          <div className="w-full max-w-lg bg-surface border border-border-s rounded-sm">
            <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-border-s">
              <div>
                <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-accent">
                  Explain it back
                </p>
                <p className="font-(family-name:--font-dm) text-[10.5px] text-txt-ghost mt-0.5">
                  Phase {checkpoint.phaseNumber}
                </p>
              </div>
              <button
                onClick={() => setCheckpoint(null)}
                className="p-1 text-txt-ghost hover:text-txt cursor-pointer"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <p className="font-(family-name:--font-dm) text-[13px] text-txt leading-[1.7]">
                {checkpoint.question}
              </p>

              {!result && (
                <>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={6}
                    placeholder="In your own words — why does it work, not what it does."
                    className="w-full bg-void border border-border-s rounded-sm px-3 py-2 font-(family-name:--font-dm) text-[12.5px] text-txt placeholder:text-txt-ghost/60 focus:outline-none focus:border-accent/40 resize-none"
                  />
                  <p className="font-(family-name:--font-dm) text-[10.5px] text-txt-ghost leading-[1.5]">
                    Pasting code counts as not answering — the code already works. Plain prose is what's being checked.
                  </p>
                  <button
                    onClick={submit}
                    disabled={grading || answer.trim().length < 40}
                    className="px-3.5 py-1.5 rounded-sm border border-accent/40 text-accent hover:bg-accent/5 disabled:opacity-40 disabled:cursor-not-allowed font-(family-name:--font-dm) text-[11px] uppercase tracking-widest cursor-pointer transition-colors"
                  >
                    {grading ? "Reading…" : "Submit"}
                  </button>
                </>
              )}

              {result && (
                <div className="space-y-2.5">
                  <div
                    className={`px-3 py-2 rounded-sm border font-(family-name:--font-dm) text-[12.5px] leading-[1.6] ${
                      result.passed
                        ? "border-success/40 bg-success/5 text-success"
                        : "border-warning/40 bg-warning/5 text-warning"
                    }`}
                  >
                    {result.feedback}
                  </div>
                  {result.missing.length > 0 && (
                    <p className="font-(family-name:--font-dm) text-[11.5px] text-txt-muted leading-[1.6]">
                      Worth revisiting: {result.missing.join(", ")}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {!result.passed && (
                      <button
                        onClick={() => setResult(null)}
                        className="px-3 py-1.5 rounded-sm border border-border-s text-txt-muted hover:text-txt font-(family-name:--font-dm) text-[11px] uppercase tracking-widest cursor-pointer"
                      >
                        Try again
                      </button>
                    )}
                    <button
                      onClick={() => setCheckpoint(null)}
                      className="px-3 py-1.5 rounded-sm border border-border-s text-txt-muted hover:text-txt font-(family-name:--font-dm) text-[11px] uppercase tracking-widest cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
