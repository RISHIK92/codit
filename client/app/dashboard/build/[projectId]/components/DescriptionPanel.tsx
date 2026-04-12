"use client";

import { useState } from "react";
import type { LearningPhaseDTO } from "@/lib/api/projectsApi";
import type { Tab } from "../types";
import { fmtMinutes, parseGoal } from "../utils/fileUtils";

interface DescriptionPanelProps {
  phase: LearningPhaseDTO | null;
  projectName: string;
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
              <div className="font-(family-name:--font-dm) text-[13px] text-txt-muted leading-[1.8] whitespace-pre-wrap">
                {phase.long_description}
              </div>
            ) : (
              <div className="font-(family-name:--font-dm) text-[13px] text-txt-muted leading-[1.8]">
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

        {activeTab === "goal" && goalText && (
          <div className="space-y-3">
            <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost mb-4">
              Learning objective
            </p>
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-sm">
              <p className="font-(family-name:--font-dm) text-[13px] text-accent/90 leading-[1.7] whitespace-pre-wrap">
                {goalText}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
