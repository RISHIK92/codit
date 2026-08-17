"use client";

import { useState } from "react";
import type { LearningPhaseDTO } from "@/lib/api/projectsApi";
import type { Tab } from "../types";
import { fmtMinutes, parseGoal } from "../utils/fileUtils";

interface DescriptionPanelProps {
  phase: LearningPhaseDTO | null;
  projectName: string;
}

// Build and Understand are tracked separately by design, and a criterion's kind
// is where that split originates — so it's labelled here rather than flattened
// into an undifferentiated checklist.
const KIND_META: Record<string, { label: string; className: string; title: string }> = {
  behavioral: {
    label: "Works",
    className: "text-success/70",
    title: "Behavioural — the thing does what it should",
  },
  structural: {
    label: "Built right",
    className: "text-accent/70",
    title: "Structural — it's built the way this phase teaches, not just made to work",
  },
  conceptual: {
    label: "Understood",
    className: "text-[#b8a4e8]/70",
    title: "Conceptual — you can explain why it works",
  },
};

// ── Minimal markdown renderer for long_description ──────────────────────────
// Authored phase content uses a small, fixed markdown subset — "## " headings,
// **bold**, `inline code`, and blank-line paragraph breaks — so a full
// markdown library would be overkill. This covers exactly that subset.

function renderInlineMd(text: string, keyPrefix: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={key}
          className="px-1 py-0.5 bg-void rounded text-[12px] font-mono text-accent/80 border border-border-s"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-txt">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={key} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

function renderLongDescription(text: string) {
  const blocks = text.split(/\n\n+/);
  return blocks.map((block, i) => {
    const key = `b${i}`;
    if (block.startsWith("## ")) {
      return (
        <h3
          key={key}
          className="font-(family-name:--font-dm) text-[13px] font-semibold uppercase tracking-wider text-txt mt-2"
        >
          {renderInlineMd(block.slice(3), key)}
        </h3>
      );
    }
    const lines = block.split("\n");
    return (
      <p key={key}>
        {lines.map((line, li) => (
          <span key={`${key}-l${li}`}>
            {renderInlineMd(line, `${key}-l${li}`)}
            {li < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export function DescriptionPanel({
  phase,
  projectName: _projectName,
}: DescriptionPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  if (!phase) {
    return (
      <div className="flex-1 flex items-center justify-center text-txt-ghost">
        <span className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest">
          Select a phase
        </span>
      </div>
    );
  }

  const goalText = parseGoal(phase.goal);
  const criteria = [...(phase.criteria ?? [])].sort((a, b) => a.order - b.order);

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "Description" },
    { id: "concepts", label: "Concepts" },
    { id: "goal", label: "Goal" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Phase header */}
      <div className="px-6 pt-6 pb-4 border-b border-border-s shrink-0">
        <div className="font-(family-name:--font-dm) text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
          Phase {phase.phase_number} · {fmtMinutes(phase.estimated_minutes)}
        </div>
        <h2 className="font-(family-name:--font-cormorant) text-2xl font-semibold text-txt leading-tight mb-1">
          {phase.title}
        </h2>
        <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted">
          {phase.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border-s shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 font-(family-name:--font-dm) text-[11px] uppercase tracking-widest transition-colors cursor-pointer border-b-2
              ${
                activeTab === tab.id
                  ? "text-accent border-accent"
                  : "text-txt-ghost border-transparent hover:text-txt"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {activeTab === "description" && (
          <div className="space-y-4">
            {phase.long_description ? (
              <div className="font-(family-name:--font-dm) text-[13px] text-txt/85 leading-[1.8] space-y-3">
                {renderLongDescription(phase.long_description)}
              </div>
            ) : (
              <div className="font-(family-name:--font-dm) text-[13px] text-txt/85 leading-[1.8]">
                {phase.description}
              </div>
            )}
          </div>
        )}

        {activeTab === "concepts" && (
          <div className="space-y-2">
            <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost mb-4">
              Key concepts for this phase
            </p>
            <div className="font-(family-name:--font-dm) text-[12px] text-txt-ghost italic">
              Concepts will appear here once they are loaded.
            </div>
          </div>
        )}

        {activeTab === "goal" && (
          <div className="space-y-5">
            {goalText && (
              <div className="space-y-3">
                <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost">
                  Learning objective
                </p>
                <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm">
                  <p className="font-(family-name:--font-dm) text-[13px] text-accent/90 leading-[1.7] whitespace-pre-wrap">
                    {goalText}
                  </p>
                </div>
              </div>
            )}

            {/* The rubric, shown before submitting rather than revealed on
                failure. Withholding it wouldn't make the phase harder in any
                way that teaches something — it would just make a demanding
                gate feel arbitrary. */}
            {criteria.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost">
                    What this phase is graded on
                  </p>
                  <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost/70">
                    {criteria.length} {criteria.length === 1 ? "check" : "checks"}
                  </span>
                </div>

                <ul className="space-y-2">
                  {criteria.map((c) => (
                    <li
                      key={c.id}
                      className="flex gap-3 p-3 rounded-sm border border-border-s bg-void/40"
                    >
                      <span className="shrink-0 mt-[3px] w-3.5 h-3.5 rounded-[3px] border border-border-s" />
                      <div className="min-w-0 space-y-1">
                        <p className="font-(family-name:--font-dm) text-[12.5px] text-txt/90 leading-[1.6]">
                          {c.text}
                        </p>
                        <span
                          className={`inline-block font-(family-name:--font-dm) text-[9px] uppercase tracking-[0.15em] ${KIND_META[c.kind]?.className ?? "text-txt-ghost"}`}
                          title={KIND_META[c.kind]?.title}
                        >
                          {KIND_META[c.kind]?.label ?? c.kind}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost leading-[1.6] italic">
                  Every check has to pass before the next phase unlocks. You can
                  resubmit as many times as you need.
                </p>
              </div>
            )}

            {!goalText && criteria.length === 0 && (
              <p className="font-(family-name:--font-dm) text-[12px] text-txt-ghost italic">
                No objective recorded for this phase.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
