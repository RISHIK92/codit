"use client";
import { useState } from "react";

export default function RightSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Toggle button (visible when collapsed) */}
      <button
        onClick={() => setCollapsed(false)}
        className={`fixed top-6 right-6 w-12 h-12 rounded-full bg-accent text-void flex items-center justify-center text-xl shadow-[var(--shadow-lg),var(--glow-primary)] transition-transform duration-300 z-[100] hover:scale-110 hover:rotate-12 ${
          !collapsed ? "hidden" : ""
        }`}
      >
        ✨
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 right-0 w-[320px] bg-surface border-l border-border-s p-6 flex flex-col h-screen z-50 transition-transform duration-300 overflow-hidden ${
          collapsed ? "translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-s shrink-0">
          <div className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-txt flex items-center gap-2">
            <span>✨</span> AI Assistant
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="w-8 h-8 rounded-md bg-transparent border border-border-s text-txt-muted flex items-center justify-center transition-colors hover:bg-elevated hover:border-border-a hover:text-txt"
          >
            ✕
          </button>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4 pr-2 custom-scrollbar">
          
          <div className="flex flex-col gap-2 animate-fadeUp">
            <div className="max-w-[85%] p-3.5 rounded-xl font-[family-name:var(--font-dm)] text-[13px] leading-relaxed relative bg-elevated border border-border-s text-txt rounded-bl-sm">
              Hello John! I noticed you are starting Week 2 of the Invoice Generator project. Would you like me to explain how state lifting works before we jump into the API?
            </div>
            <div className="font-[family-name:var(--font-dm)] text-[9px] text-txt-ghost tracking-[0.04em]">
              12:02 PM
            </div>
          </div>

          <div className="flex flex-col gap-2 animate-fadeUp items-end">
            <div className="max-w-[85%] p-3.5 rounded-xl font-[family-name:var(--font-dm)] text-[13px] leading-relaxed relative bg-[rgba(200,240,232,0.12)] border border-[rgba(200,240,232,0.2)] text-txt rounded-br-sm">
              Yes please, I always get confused about where to naturally place the state.
            </div>
            <div className="font-[family-name:var(--font-dm)] text-[9px] text-txt-ghost tracking-[0.04em]">
              12:04 PM
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex gap-1.5 p-3.5 bg-elevated border border-border-s rounded-xl rounded-bl-sm max-w-[85%] w-fit mt-2">
            <span className="w-2 h-2 bg-txt-ghost rounded-full animate-typingBounce" />
            <span className="w-2 h-2 bg-txt-ghost rounded-full animate-typingBounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-txt-ghost rounded-full animate-typingBounce [animation-delay:0.4s]" />
          </div>
          
        </div>

        {/* Input Area */}
        <div className="border-t border-border-s pt-4 shrink-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <button className="px-3.5 py-2 bg-elevated border border-border-s rounded-md font-[family-name:var(--font-dm)] text-[11px] text-txt-muted transition-colors hover:bg-glass hover:border-border-a hover:text-txt">
              Explain this concept
            </button>
            <button className="px-3.5 py-2 bg-elevated border border-border-s rounded-md font-[family-name:var(--font-dm)] text-[11px] text-txt-muted transition-colors hover:bg-glass hover:border-border-a hover:text-txt">
              Generate boilerplate
            </button>
          </div>
          
          <div className="relative">
            <textarea 
              placeholder="Ask me anything..."
              className="w-full py-3.5 pl-4 pr-12 bg-elevated border border-border-s rounded-lg text-txt font-[family-name:var(--font-dm)] text-[13px] outline-none resize-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,240,232,0.08)]"
              rows={2}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-accent text-void flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_4px_12px_rgba(127,255,212,0.3)]">
              &rarr;
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
