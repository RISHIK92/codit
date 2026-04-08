"use client";

import Link from "next/link";
import { useState } from "react";

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState("console");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  const codeString = `import React, { useState } from 'react';

export default function InvoiceForm() {
  const [company, setCompany] = useState('');
  const [client, setClient] = useState('');
  const [total, setTotal] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate API call
    console.log("Saving invoice...", { company, client, total });
  };

  return (
    <div className="p-4 border rounded">
      <h2>Create Invoice</h2>
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Company Name" 
          value={company}
          onChange={e => setCompany(e.target.value)}
        />
        {/* ... */}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}`;

  return (
    <div className="flex flex-col h-screen bg-void text-txt font-[family-name:var(--font-dm)] text-sm">
      {/* ── TOP TOOLBAR ── */}
      <div className="flex items-center justify-between p-[12px_24px] bg-surface border-b border-border-s sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/projects/1"
            className="flex items-center gap-2 p-[8px_16px] bg-elevated border border-border-s rounded-md text-[12px] text-txt-secondary transition-all hover:text-txt hover:border-border-a"
          >
            <span>←</span> Back to Phase
          </Link>
          <div className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-txt">
            Invoice Form Component
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-2 p-[10px_20px] rounded-md text-[12px] font-medium tracking-[0.06em] uppercase text-void transition-all duration-300
              ${
                isRunning
                  ? "bg-warning cursor-not-allowed"
                  : "bg-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(127,255,212,0.3)] cursor-pointer"
              }
            `}
          >
            <span>{isRunning ? "⏸" : "▶"}</span>{" "}
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE (Split layout) ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* FILE EXPLORER (Left) */}
        <div className="w-[240px] bg-surface border-r border-border-s p-[16px_12px] overflow-y-auto shrink-0 flex flex-col hidden md:flex">
          <div className="text-[10px] text-txt-ghost uppercase tracking-[0.1em] mb-4 pl-2">
            Explorer
          </div>

          <ul className="list-none p-0 flex flex-col">
            <li className="flex items-center gap-2 p-[8px_12px] rounded-md text-[12px] text-txt font-medium cursor-pointer transition-colors hover:bg-glass">
              <span className="text-[14px]">▼</span> src/
            </li>
            <ul className="list-none p-0 flex flex-col ml-4 border-l border-border-s">
              <li className="flex items-center gap-2 p-[8px_12px] ml-2 rounded-md text-[12px] text-txt-secondary cursor-pointer transition-colors hover:bg-glass hover:text-txt">
                <span className="text-[14px]">📄</span> App.jsx
              </li>
              <li className="flex items-center gap-2 p-[8px_12px] ml-2 rounded-md text-[12px] text-txt font-medium cursor-pointer transition-colors hover:bg-glass">
                <span className="text-[14px]">▼</span> components/
              </li>
              <ul className="list-none p-0 flex flex-col ml-6">
                <li className="flex items-center gap-2 p-[8px_12px] border-l-2 border-accent bg-[rgba(200,240,232,0.08)] rounded-r-md text-[12px] text-accent font-medium cursor-pointer relative">
                  <span className="text-[14px]">⚛️</span> InvoiceForm.jsx
                </li>
                <li className="flex items-center gap-2 p-[8px_12px] rounded-md text-[12px] text-txt-secondary cursor-pointer transition-colors hover:bg-glass hover:text-txt">
                  <span className="text-[14px]">⚛️</span> Button.jsx
                </li>
              </ul>
              <li className="flex items-center gap-2 p-[8px_12px] ml-2 rounded-md text-[12px] text-txt font-medium cursor-pointer transition-colors hover:bg-glass">
                <span className="text-[14px]">▶</span> styles/
              </li>
            </ul>
          </ul>
        </div>

        {/* CENTER COLUMN (Editor + Preview Split vertically) */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* CODE EDITOR */}
          <div className="flex-1 bg-void relative overflow-y-auto">
            <div className="sticky top-0 bg-surface/50 backdrop-blur border-b border-border-s flex">
              <div className="px-4 py-2 text-xs border-b border-accent text-accent">
                InvoiceForm.jsx
              </div>
              <div className="px-4 py-2 text-xs text-txt-ghost">App.jsx</div>
            </div>
            {/* Fake Monaco Editor Styling */}
            <div className="flex p-4 font-[family-name:var(--font-dm)] text-[13px] leading-[1.6]">
              {/* Line Numbers */}
              <div className="flex flex-col text-txt-ghost text-right select-none pr-4 border-r border-[#ffffff0a] mr-4">
                {codeString.split("\n").map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              {/* Code Content */}
              <pre className="text-[#eef0f5] flex-1 overflow-x-auto custom-scrollbar">
                <code
                  dangerouslySetInnerHTML={{
                    __html: codeString
                      .replace(
                        /import|from|export|default|function|const|return|async|await/g,
                        '<span class="text-[#c8f0e8]">$&</span>',
                      )
                      .replace(
                        /useState|console\.log/g,
                        '<span class="text-[#7fffd4]">$&</span>',
                      )
                      .replace(
                        /'.*?'/g,
                        '<span class="text-[#e8c4a0]">$&</span>',
                      )
                      .replace(
                        /\{|\}|\(|\)|<|>/g,
                        '<span class="text-txt-secondary">$&</span>',
                      ),
                  }}
                />
              </pre>
            </div>
          </div>

          {/* LIVE PREVIEW HORIZONTAL SPLIT */}
          <div className="h-[40%] bg-white border-t-[2px] border-border-s relative flex flex-col text-[#000]">
            <div className="flex items-center justify-between p-[8px_16px] bg-surface text-txt border-b border-border-s shrink-0">
              <div className="font-[family-name:var(--font-dm)] text-[11px] text-txt-ghost flex items-center gap-2">
                <span>🌐</span> localhost:3000
              </div>
              <div className="flex gap-2">
                <button className="text-txt-ghost hover:text-txt">⟳</button>
                <button className="text-txt-ghost hover:text-txt">↗</button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-[#f9fafb] p-8 flex justify-center">
              <div className="w-[400px] h-fit bg-white p-6 rounded-lg shadow-sm border border-[#e5e7eb]">
                <h2 className="text-lg font-semibold mb-4 text-[#111827]">
                  Create Invoice
                </h2>
                <form className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4b5563] mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-[#d1d5db] rounded text-sm p-2"
                      placeholder="Acme Inc"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4b5563] mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-[#d1d5db] rounded text-sm p-2"
                      placeholder="John Doe"
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-[#111827] text-white rounded text-sm mt-2 transition-opacity hover:opacity-90"
                  >
                    + Add Item
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONSOLE / AI TABS (Bottom drawer) ── */}
      <div className="h-[200px] bg-surface border-t border-border-s flex flex-col shrink-0">
        <div className="flex items-center gap-1 p-[8px_16px] bg-elevated border-b border-border-s">
          {[
            { id: "console", label: "Console" },
            { id: "tests", label: "Tests" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-[6px_16px] font-[family-name:var(--font-dm)] text-[11px] tracking-[0.06em] rounded-md uppercase cursor-pointer transition-all
                ${
                  activeTab === tab.id
                    ? "text-accent bg-[rgba(200,240,232,0.08)]"
                    : "text-txt-ghost hover:text-txt-secondary hover:bg-glass"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <button className="text-txt-ghost hover:text-txt px-2">✕</button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto font-[family-name:var(--font-dm)] text-[12px] leading-[1.6]">
          {activeTab === "console" && (
            <div className="flex flex-col">
              <div className="flex gap-3 py-1 text-txt-secondary">
                <span className="text-txt-ghost">14:02:44</span>
                [vite] connecting...
              </div>
              <div className="flex gap-3 py-1 text-status-complete">
                <span className="text-txt-ghost">14:02:45</span>
                [vite] connected.
              </div>
              <div className="flex gap-3 py-1 text-txt-secondary">
                <span className="text-txt-ghost">14:02:46</span>
                Server running at localhost:3000
              </div>
              {isRunning && (
                <div className="flex gap-3 py-1 text-status-complete animate-fadeUp">
                  <span className="text-txt-ghost">14:02:50</span>
                  Rebuilding App... Success
                </div>
              )}
            </div>
          )}
          {activeTab === "tests" && (
            <div className="text-txt-secondary">
              No tests configured for this project yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
