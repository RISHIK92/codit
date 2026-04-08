"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProjectDetailPage() {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock quiz checking
  const handleOptionSelect = (index: number) => {
    setSelectedQuizOption(index);
    setShowExplanation(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* ── PHASE NAVIGATION (LEFT MINI-SIDEBAR) ── */}
      <aside className="w-[200px] bg-surface border-r border-border-s p-6 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto hidden md:block">
        <div className="mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-[family-name:var(--font-dm)] text-[11px] tracking-[0.06em] text-txt-secondary transition-colors hover:text-accent">
            <span>←</span> Back to Dashboard
          </Link>
          <h2 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-txt mt-4 mb-2">
            Invoice Generator
          </h2>
          <div className="font-[family-name:var(--font-dm)] text-[10px] text-txt-ghost">
            Phase 2 Progress: 40%
          </div>
        </div>

        <ul className="list-none p-0 flex flex-col gap-1">
          <li className="flex items-center gap-3 p-2 rounded-md font-[family-name:var(--font-dm)] text-xs text-status-complete cursor-pointer relative">
            <span className="w-2 h-2 rounded-full border-[1.5px] border-status-complete bg-status-complete shrink-0" />
            Introduction
          </li>
          <li className="flex items-center gap-3 p-2 rounded-md font-[family-name:var(--font-dm)] text-xs text-status-complete cursor-pointer relative">
            <span className="w-2 h-2 rounded-full border-[1.5px] border-status-complete bg-status-complete shrink-0" />
            Backend Setup
          </li>
          <li className="flex items-center gap-3 p-2 rounded-md font-[family-name:var(--font-dm)] text-xs text-accent bg-[rgba(200,240,232,0.08)] cursor-pointer relative overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-r-sm" />
            <span className="w-2 h-2 rounded-full border-[1.5px] border-accent bg-accent shadow-[0_0_12px_var(--accent-primary)] animate-[pulse_2s_ease-in-out_infinite] shrink-0" />
            API Endpoints (Current)
          </li>
          <li className="flex items-center gap-3 p-2 rounded-md font-[family-name:var(--font-dm)] text-xs text-txt-secondary hover:text-txt hover:bg-glass cursor-pointer relative">
            <span className="w-2 h-2 rounded-full border-[1.5px] border-current shrink-0" />
            Database Models
          </li>
          <li className="flex items-center gap-3 p-2 rounded-md font-[family-name:var(--font-dm)] text-xs text-txt-secondary opacity-30 cursor-not-allowed relative">
            <span className="w-2 h-2 rounded-full border-[1.5px] border-current shrink-0" />
            Testing
          </li>
          
          <div className="my-2 border-t border-border-s border-dashed" />
          
          <li className="flex items-center gap-3 p-2 rounded-md font-[family-name:var(--font-dm)] text-xs text-txt-secondary opacity-30 cursor-not-allowed relative">
            <span className="w-2 h-2 rounded-full border-[1.5px] border-current shrink-0" />
            Submit Project
          </li>
        </ul>
      </aside>

      {/* ── LEARNING CANVAS (CENTER) ── */}
      <div className="flex-1 p-[48px_64px] max-w-[1000px] mx-auto">
        <div className="mb-8 animate-fadeUp">
          <div className="flex items-center gap-2 font-[family-name:var(--font-dm)] text-[11px] text-txt-ghost mb-4">
            <span>Phase 2</span>
            <span>/</span>
            <span className="text-txt-secondary">API Endpoints</span>
          </div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] font-semibold text-txt leading-[1.2] mb-3">
            Building the Invoice API
          </h1>
          <p className="font-[family-name:var(--font-dm)] text-sm leading-[1.8] text-txt-secondary max-w-[700px]">
            In this lesson, we will implement the RESTful endpoints for invoice creation and retrieval. You&apos;ll learn advanced state lifting techniques for when our frontend connects to this API.
          </p>
        </div>

        {/* Video Player Block */}
        <div className="bg-elevated border border-border-s rounded-2xl p-8 mb-8 relative overflow-hidden animate-fadeUp [animation-delay:0.1s]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--gradient-iris)]" />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-txt flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-void flex items-center justify-center text-lg shrink-0">
                ▶
              </div>
              Core Concept Video
            </h2>
            <div className="flex items-center gap-4 font-[family-name:var(--font-dm)] text-[11px] text-txt-ghost">
              <span>⏱ 14:20</span>
            </div>
          </div>

          <div className="w-full aspect-video rounded-xl bg-void mb-5 border border-border-s relative overflow-hidden flex items-center justify-center">
            {/* Generic Video Placeholder */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(127,255,212,0.1)_0%,transparent_70%)]" />
            <button className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] backdrop-blur text-2xl flex items-center justify-center transition-transform hover:scale-110 pl-1">
              ▶
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { time: "0:00", label: "Intro" },
              { time: "3:45", label: "State vs Context" },
              { time: "8:20", label: "API Structure" },
              { time: "12:10", label: "Implementation" },
            ].map((ts, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[rgba(200,240,232,0.04)] border border-[rgba(200,240,232,0.1)] rounded-lg cursor-pointer transition-all hover:bg-[rgba(200,240,232,0.08)] hover:border-[rgba(200,240,232,0.2)] hover:translate-x-1">
                <span className="font-[family-name:var(--font-bebas)] text-lg text-accent">{ts.time}</span>
                <span className="font-[family-name:var(--font-dm)] text-xs text-txt-secondary">{ts.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Check Quiz Block */}
        <div className="bg-elevated border border-border-s rounded-2xl p-8 mb-8 relative overflow-hidden animate-fadeUp [animation-delay:0.2s]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--gradient-iris)]" />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-txt flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-void flex items-center justify-center text-lg shrink-0">
                📝
              </div>
              Knowledge Check
            </h2>
          </div>

          <div className="py-2">
            <h3 className="font-[family-name:var(--font-cormorant)] text-[22px] font-semibold text-txt mb-6 leading-[1.4]">
              Where should generic application state be kept when multiple deeply nested components need it?
            </h3>

            <div className="flex flex-col gap-3 mb-6">
              {[
                { text: "At the topmost common ancestor using useState and prop drilling", correct: false },
                { text: "In a dedicated Context API provider wrapping those components", correct: true },
                { text: "Inside standard HTML data-attributes", correct: false },
              ].map((option, i) => {
                const isSelected = selectedQuizOption === i;
                const isCorrect = showExplanation && option.correct;
                const isWrong = showExplanation && isSelected && !option.correct;

                return (
                  <div 
                    key={i} 
                    onClick={() => !showExplanation && handleOptionSelect(i)}
                    className={`flex items-start gap-4 p-5 bg-void border-2 border-border-s rounded-xl relative transition-all duration-250 cursor-pointer 
                      ${!showExplanation ? "hover:border-border-a hover:bg-[var(--bg-glass)] hover:translate-x-1" : ""}
                      ${isSelected && !showExplanation ? "border-accent bg-[rgba(200,240,232,0.06)]" : ""}
                      ${isCorrect ? "border-status-complete bg-[rgba(168,230,207,0.08)]" : ""}
                      ${isWrong ? "border-error bg-[rgba(255,107,122,0.08)]" : ""}
                    `}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                      ${!isSelected && !showExplanation ? "border-border-a" : ""}
                      ${isSelected && !showExplanation ? "bg-accent border-accent" : ""}
                      ${isCorrect ? "bg-status-complete border-status-complete text-void font-bold text-sm" : ""}
                      ${isWrong ? "bg-error border-error text-white font-bold text-sm" : ""}
                    `}>
                      {isCorrect && "✓"}
                      {isWrong && "✕"}
                    </div>
                    <div className="flex-1 font-[family-name:var(--font-dm)] text-sm leading-[1.6] text-txt">
                      {option.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-5 bg-[rgba(127,255,212,0.06)] border border-[rgba(127,255,212,0.2)] rounded-xl mt-5 font-[family-name:var(--font-dm)] text-[13px] leading-[1.7] text-txt animate-fadeUp">
                <strong>Explanation: </strong>
                Using a React Context Provider allows deeply nested components to access generic application state directly without needing to forcefully prop-drill via intermediate layers.
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center pt-12 mt-12 border-t border-border-s">
          <button className="flex items-center gap-2 px-7 py-3.5 bg-elevated border border-border-s text-txt rounded-lg font-[family-name:var(--font-dm)] text-[13px] tracking-[0.06em] uppercase cursor-pointer transition-all hover:border-border-a hover:-translate-x-1">
            <span>←</span> Backend Setup
          </button>

          <Link href="/dashboard/projects/1/sandbox" className="flex items-center gap-2 px-7 py-3.5 bg-accent text-void rounded-lg font-[family-name:var(--font-dm)] text-[13px] tracking-[0.06em] uppercase cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(127,255,212,0.25)]">
            Open Sandbox <span>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
