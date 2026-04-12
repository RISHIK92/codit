"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Lock } from "lucide-react";
import type { LearningPhaseDTO } from "@/lib/api/projectsApi";
import { fmtMinutes } from "../utils/fileUtils";

interface PhaseSelectorProps {
  phases: LearningPhaseDTO[];
  activeIdx: number;
  currentPhaseNum: number;
  onSelect: (i: number) => void;
}

export function PhaseSelector({
  phases,
  activeIdx,
  currentPhaseNum,
  onSelect,
}: PhaseSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border-s rounded-sm font-(family-name:--font-dm) text-[11px] text-txt-muted hover:text-txt hover:border-accent/40 transition-colors cursor-pointer"
      >
        <span className="text-accent">
          Phase {phases[activeIdx]?.phase_number ?? activeIdx + 1}
        </span>
        <span className="text-txt-ghost truncate max-w-35">
          {phases[activeIdx]?.title}
        </span>
        {open ? (
          <ChevronUp size={12} className="shrink-0" />
        ) : (
          <ChevronDown size={12} className="shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-void border border-border-s rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
          {phases.map((ph, i) => {
            const isLocked = ph.phase_number > currentPhaseNum;
            return (
              <button
                key={ph.id}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) {
                    onSelect(i);
                    setOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                  ${i !== phases.length - 1 ? "border-b border-border-s" : ""}
                  ${
                    isLocked
                      ? "opacity-40 cursor-not-allowed text-txt-ghost"
                      : i === activeIdx
                        ? "bg-accent/10 text-accent cursor-pointer"
                        : "text-txt-muted hover:bg-surface hover:text-txt cursor-pointer"
                  }
                `}
              >
                <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost shrink-0 w-5">
                  {String(ph.phase_number).padStart(2, "0")}
                </span>
                <span className="font-(family-name:--font-dm) text-[11px] flex-1 truncate">
                  {ph.title}
                </span>
                {isLocked ? (
                  <Lock size={10} className="text-txt-ghost shrink-0" />
                ) : (
                  <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost shrink-0">
                    {fmtMinutes(ph.estimated_minutes)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
