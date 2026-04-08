"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div className="p-8 w-full mx-auto">
      {/* ── HERO STATS RIBBON ── */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Experience", value: "2,847 XP", trend: "120 today" },
          { label: "Current Level", value: "Level 3", trend: "85% to Level 4" },
          { label: "Active Streak", value: "12 Days", trend: "Keep it up!" },
        ].map((stat, i) => (
          <div
            key={i}
            className="group bg-[linear-gradient(135deg,var(--bg-elevated)_0%,var(--bg-surface)_100%)] border border-border-s rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-border-a hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--gradient-iris)] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            <div className="font-[family-name:var(--font-bebas)] text-5xl leading-none text-gradient-iris inline-block mb-2 animate-countUp [animation-delay:0.1s]">
              {stat.value}
            </div>
            <div className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.1em] uppercase text-txt-muted">
              {stat.label}
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] text-success mt-2">
              <span>↗</span> {stat.trend}
            </div>
          </div>
        ))}
      </div> */}

      {/* ── CURRENT PROJECT HERO CARD ── */}
      <div className="bg-elevated border border-border-s rounded-sm p-8 mb-8 relative overflow-hidden shadow-md group">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--gradient-iris)] bg-[length:200%_100%] animate-shimmer" />

        <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-txt mb-3 leading-[1.2]">
          Invoice Generator
        </h2>

        <p className="font-[family-name:var(--font-dm)] text-sm text-txt-muted mb-6">
          Week 2: Backend Integration
        </p>

        <div className="mb-6">
          <div className="w-full h-2 bg-void rounded-full relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 h-full w-[40%] bg-[var(--gradient-iris)] rounded-full transition-all duration-1000 shadow-[var(--glow-primary)] bg-[length:300%_100%] animate-shimmer">
              <div className="absolute -top-1 -right-1.5 w-4 h-4 bg-[radial-gradient(circle,var(--accent-primary)_0%,var(--accent-glow)_100%)] rounded-full animate-dropletPulse" />
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 font-[family-name:var(--font-dm)] text-[11px] tracking-[0.06em] text-txt-muted">
            <span>Overall Progress</span>
            <span className="text-accent">40%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-[rgba(200,240,232,0.04)] border border-[rgba(200,240,232,0.1)] rounded-lg mb-6 transition-all duration-200 hover:bg-[rgba(200,240,232,0.06)] hover:border-[rgba(200,240,232,0.2)]">
          <div className="w-8 h-8 rounded-md bg-accent text-void flex items-center justify-center text-base shrink-0">
            ▶
          </div>
          <div className="flex-1">
            <div className="font-[family-name:var(--font-dm)] text-[9px] tracking-[0.12em] uppercase text-txt-ghost mb-1">
              Next Up
            </div>
            <div className="font-[family-name:var(--font-dm)] text-sm text-txt">
              Build API endpoint
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/projects/1"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-void rounded-lg font-[family-name:var(--font-dm)] text-[13px] tracking-[0.06em] uppercase cursor-pointer transition-all duration-300 relative overflow-hidden group/cta hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(127,255,212,0.3)]"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent)] opacity-0 transition-opacity duration-300 group-hover/cta:opacity-100" />
          <span className="relative z-10 transition-transform duration-300">
            Continue Learning
          </span>
          <span className="relative z-10 transition-transform duration-300 group-hover/cta:translate-x-1">
            →
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative">
        <div className="hidden md:block absolute top-[44px] left-0 right-0 h-[2px] bg-border-s z-0" />

        <div className="bg-elevated border border-[rgba(168,230,207,0.3)] rounded-xl p-6 relative z-10 transition-all duration-300 cursor-pointer hover:-translate-y-1 mt-6">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-success border-2 border-success flex items-center justify-center font-[family-name:var(--font-dm)] text-xs font-semibold text-void transition-all duration-300">
            ✓
          </div>
          <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-txt mb-2 mt-3 text-center">
            Phase 1: Frontend
          </h3>
          <p className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.06em] text-txt-muted mb-4 text-center">
            UI Components & State
          </p>
          <div className="w-full h-1 bg-void rounded-sm overflow-hidden mb-2">
            <div className="h-full bg-[var(--gradient-iris)] rounded-sm w-[100%]" />
          </div>
          <div className="flex justify-between font-[family-name:var(--font-dm)] text-[10px] text-txt-ghost">
            <span className="flex items-center gap-1">⏱ Completed</span>
            <span>100%</span>
          </div>
        </div>

        {/* Phase 2 */}
        <Link
          href="/dashboard/projects/1"
          className="bg-surface border border-accent shadow-[0_0_0_1px_var(--accent-primary),var(--shadow-md),var(--glow-primary)] rounded-xl p-6 relative z-10 transition-all duration-300 cursor-pointer hover:-translate-y-1 mt-6 block"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent border-2 border-accent flex items-center justify-center font-[family-name:var(--font-dm)] text-xs font-semibold text-void shadow-[var(--glow-primary)] animate-[pulseRing_2s_ease-in-out_infinite]">
            2
          </div>
          <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-txt mb-2 mt-3 text-center">
            Phase 2: Backend
          </h3>
          <p className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.06em] text-txt-muted mb-4 text-center">
            API & Data Modeling
          </p>
          <div className="w-full h-1 bg-void rounded-sm overflow-hidden mb-2">
            <div className="h-full bg-[var(--gradient-iris)] rounded-sm w-[20%]" />
          </div>
          <div className="flex justify-between font-[family-name:var(--font-dm)] text-[10px] text-txt-ghost">
            <span className="flex items-center gap-1">⏱ Active</span>
            <span>20%</span>
          </div>
        </Link>

        {/* Phase 3 */}
        <div className="bg-elevated border border-border-s rounded-xl p-6 relative z-10 transition-all duration-300 opacity-50 cursor-not-allowed mt-6">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-elevated border-2 border-border-s flex items-center justify-center font-[family-name:var(--font-dm)] text-[10px] font-semibold text-txt-secondary transition-all duration-300">
            🔒
          </div>
          <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold text-txt mb-2 mt-3 text-center">
            Phase 3: Deploy
          </h3>
          <p className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.06em] text-txt-muted mb-4 text-center">
            Cloud Infrastructure
          </p>
          <div className="w-full h-1 bg-void rounded-sm overflow-hidden mb-2">
            <div className="h-full bg-[var(--gradient-iris)] rounded-sm w-[0%]" />
          </div>
          <div className="flex justify-between font-[family-name:var(--font-dm)] text-[10px] text-txt-ghost">
            <span className="flex items-center gap-1">⏱ Locked</span>
            <span>0%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* ── ACTIVITY FEED ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-txt">
              Recent Activity
            </h2>
            <Link
              href="#"
              className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.06em] text-txt-secondary flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              View All <span>→</span>
            </Link>
          </div>
          <div className="bg-elevated border border-border-s rounded-xl p-5">
            {[
              {
                text: 'Completed "useState with Arrays" quiz',
                time: "2h ago",
                icon: "✓",
              },
              {
                text: 'Watched "React Forms" video',
                time: "1d ago",
                icon: "▶",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-4 py-4 border-b border-border-s last:border-0 last:pb-0 transition-opacity hover:opacity-80"
              >
                <div className="w-9 h-9 rounded-lg bg-void flex items-center justify-center text-base shrink-0 relative">
                  {i === 0 && (
                    <div className="absolute -inset-1 border-2 border-accent rounded-[10px] opacity-0 animate-[pulseRing_2s_ease-out_infinite]" />
                  )}
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-[family-name:var(--font-dm)] text-[13px] leading-[1.6] text-txt mb-1">
                    {activity.text}
                  </div>
                  <div className="font-[family-name:var(--font-dm)] text-[10px] text-txt-ghost">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RESOURCE GRID ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-txt">
              Recommended
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                title: "React State Mastery",
                type: "Video",
                time: "12 min",
                emoji: "📺",
              },
              {
                title: "Advanced Endpoints",
                type: "Article",
                time: "8 min",
                emoji: "📝",
              },
            ].map((resource, i) => (
              <div
                key={i}
                className="group bg-elevated border border-border-s rounded-xl overflow-hidden cursor-pointer transition-all duration-300 relative hover:-translate-y-1 hover:border-border-a hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-surface opacity-0 transition-opacity duration-300 z-0 group-hover:opacity-50" />
                <div className="w-full h-[100px] bg-surface flex items-center justify-center text-4xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent opacity-5" />
                  <span className="relative z-10">{resource.emoji}</span>
                </div>
                <div className="p-4 relative z-10">
                  <div className="inline-block px-2.5 py-1 bg-[rgba(200,240,232,0.1)] border border-[rgba(200,240,232,0.2)] rounded font-[family-name:var(--font-dm)] text-[9px] tracking-[0.12em] uppercase text-accent mb-3">
                    {resource.type}
                  </div>
                  <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold text-txt mb-2 leading-[1.3]">
                    {resource.title}
                  </h3>
                  <div className="flex items-center gap-3 font-[family-name:var(--font-dm)] text-[11px] text-txt-secondary">
                    <span className="flex items-center gap-1">
                      ⏱ {resource.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
