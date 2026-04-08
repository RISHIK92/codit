"use client";

import Link from "next/link";
import { useAuthStore, useDashboardStore } from "@/lib/stores";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const {
    currentProject,
    phases,
    activities,
    resources,
    fetchUserProjects,
    userProjects,
    projectsLoading,
  } = useDashboardStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Fetch the user's projects from the API once auth is resolved
  useEffect(() => {
    if (!loading && user) {
      user.getIdToken().then((token) => fetchUserProjects(token));
    }
  }, [loading, user, fetchUserProjects]);

  // Handle automatic centering of active phase
  useEffect(() => {
    if (activeCardRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeCard = activeCardRef.current;

      const scrollPos =
        activeCard.offsetLeft -
        container.offsetWidth / 2 +
        activeCard.offsetWidth / 2;

      container.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }
  }, [loading]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading || !user) return null;

  // ── No projects yet ───────────────────────────────────────────────────────
  if (!projectsLoading && userProjects.length === 0) {
    return (
      <div className="p-8 md:p-12 w-full bg-surface min-h-screen flex flex-col">
        {/* Loading skeleton shimmer while initial fetch resolves */}
        <div className="bg-void border border-border-s rounded-[4px] p-8 lg:p-10 mb-12 relative overflow-hidden flex flex-col items-center justify-center text-center gap-8 min-h-[280px]">
          {/* Subtle mesh glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(127,255,212,0.04)_0%,transparent_70%)] pointer-events-none" />

          {/* Icon */}
          <div className="relative z-10 w-14 h-14 rounded-[4px] border border-border-s bg-surface flex items-center justify-center text-accent">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M12 5v14M5 12h14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Copy */}
          <div className="relative z-10 max-w-sm">
            <div className="font-[family-name:var(--font-dm)] text-[10px] tracking-[0.2em] uppercase text-txt-ghost mb-3">
              No active project
            </div>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-txt mb-3 leading-tight">
              Start your first project
            </h2>
            <p className="font-[family-name:var(--font-dm)] text-[13px] text-txt-muted leading-relaxed">
              Complete the onboarding questions, and your personalised learning
              plan will appear here.
            </p>
          </div>

          {/* CTA */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-[#070810] rounded-[4px] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] transition-all hover:shadow-[0_12px_40px_rgba(127,255,212,0.25)]"
            >
              Browse Projects →
            </Link>
          </div>
        </div>

        {/* Empty states for the lower panels — keep layout stable */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Activity */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-border-s pb-4">
              <h3 className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.15em] uppercase text-txt-muted">
                Recent Activity
              </h3>
            </div>
            <div className="py-10 flex flex-col items-center gap-2 text-center">
              <div className="font-[family-name:var(--font-dm)] text-[11px] uppercase tracking-widest text-txt-ghost">
                No activity yet
              </div>
              <p className="font-[family-name:var(--font-dm)] text-[12px] text-txt-ghost/60">
                Activity will appear here once you start a project.
              </p>
            </div>
          </div>

          {/* Resources */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-border-s pb-4">
              <h3 className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.15em] uppercase text-txt-muted">
                Recommended Reference
              </h3>
            </div>
            <div className="py-10 flex flex-col items-center gap-2 text-center">
              <div className="font-[family-name:var(--font-dm)] text-[11px] uppercase tracking-widest text-txt-ghost">
                Nothing to show yet
              </div>
              <p className="font-[family-name:var(--font-dm)] text-[12px] text-txt-ghost/60">
                Resources tailored to your project will show up here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 w-full bg-surface">
      {/* ── CURRENT PROJECT HERO CARD ── */}
      <div className="bg-void border border-border-s rounded-[4px] p-8 lg:p-10 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_30%,rgba(127,255,212,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
          <div>
            <h2 className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-txt mb-2 leading-none">
              {currentProject.title}
            </h2>
            <p className="font-[family-name:var(--font-dm)] text-[13px] text-txt-muted tracking-wide">
              Phase {currentProject.phase} — {currentProject.description}
            </p>
          </div>
          <Link
            href={`/dashboard/projects/${currentProject.id}`}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-accent text-[#070810] rounded-[4px] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(127,255,212,0.25)]"
          >
            Continue Learning →
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="flex-1 flex flex-col justify-end pb-1">
            <div className="flex justify-between items-center mb-3 font-[family-name:var(--font-dm)] text-[11px] tracking-[0.1em] uppercase text-txt-muted">
              <span>Overall Progress</span>
              <span className="text-txt">{currentProject.progress}%</span>
            </div>
            <div className="w-full h-[3px] bg-surface rounded-full relative overflow-hidden flex-shrink-0">
              <div
                className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000"
                style={{ width: `${currentProject.progress}%` }}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4 p-4 bg-surface/50 border border-border-s rounded-[4px] transition-colors hover:border-accent/40">
              <div className="w-10 h-10 rounded bg-void border border-border-s shrink-0 flex items-center justify-center text-accent">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <div>
                <div className="font-[family-name:var(--font-dm)] text-[10px] tracking-[0.15em] uppercase text-txt-ghost mb-1">
                  Next Objective
                </div>
                <div className="font-[family-name:var(--font-dm)] text-sm text-txt font-medium">
                  {currentProject.nextObjective}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PHASE TRACKER ── */}
      <div className="mb-14 relative group/tracker">
        <div className="flex items-center justify-between mb-4 border-b border-border-s pb-4">
          <h3 className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.15em] uppercase text-txt-muted">
            Phase Progression
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-1 rounded-[4px] border border-border-s bg-void text-txt-ghost hover:text-accent hover:border-accent transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1 rounded-[4px] border border-border-s bg-void text-txt-ghost hover:text-accent hover:border-accent transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar gap-0 border border-border-s rounded-[4px] scroll-smooth snap-x"
        >
          {phases.map((phase) => {
            const isCompleted = phase.status === "completed";
            const isActive = phase.status === "active";
            const isLocked = phase.status === "locked";

            const CardWrapper = ({ children, className }: any) =>
              isLocked ? (
                <div className={className}>{children}</div>
              ) : (
                <Link
                  href={`/dashboard/projects/${currentProject.id}`}
                  className={className}
                >
                  {children}
                </Link>
              );

            return (
              <div
                key={phase.id}
                ref={isActive ? activeCardRef : null}
                className="min-w-[300px] flex-shrink-0 snap-center"
              >
                <CardWrapper
                  className={`block p-6 lg:p-8 relative h-full border-r border-border-s last:border-r-0 transition-colors
                    ${isCompleted ? "bg-[rgba(13,15,18,0.4)]" : ""}
                    ${isActive ? "bg-void border-accent group cursor-pointer" : ""}
                    ${isLocked ? "bg-surface/30 cursor-not-allowed opacity-60" : ""}
                  `}
                >
                  <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
                    {isCompleted && (
                      <div className="text-success">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-accent animate-[pulseRing_2s_ease-out_infinite]" />
                    )}
                    {isLocked && (
                      <div className="text-txt-ghost">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    )}
                  </div>

                  <div
                    className={`font-[family-name:var(--font-dm)] text-[10px] tracking-[0.15em] uppercase mb-3 flex items-center gap-2
                      ${isActive ? "text-accent" : "text-txt-ghost"}
                    `}
                  >
                    Phase {phase.id}
                    {isActive && (
                      <span className="px-1.5 py-0.5 bg-accent/10 rounded-[2px] text-[8px] leading-none">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <h3
                    className={`font-[family-name:var(--font-cormorant)] text-2xl font-medium mb-2 transition-colors
                      ${isLocked ? "text-txt-muted" : "text-txt"}
                      ${isActive ? "group-hover:text-accent" : ""}
                    `}
                  >
                    {phase.title}
                  </h3>

                  <p
                    className={`font-[family-name:var(--font-dm)] text-xs mb-6 ${isLocked ? "text-txt-ghost" : "text-txt-muted"}`}
                  >
                    {phase.description}
                  </p>

                  <div className="w-full h-[2px] bg-surface relative overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-700
                        ${isCompleted ? "bg-success" : "bg-accent"}
                      `}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </CardWrapper>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ── ACTIVITY FEED ── */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-border-s pb-4">
            <h3 className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.15em] uppercase text-txt-muted">
              Recent Activity
            </h3>
          </div>
          <div className="flex flex-col">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-5 py-4 border-b border-border-s last:border-0"
              >
                <div
                  className={`w-8 h-8 rounded shrink-0 flex items-center justify-center bg-void border mt-0.5
                    ${activity.type === "quiz" ? "border-success/30 text-success" : "border-border-s text-txt-muted"}
                  `}
                >
                  {activity.type === "quiz" ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-[family-name:var(--font-dm)] text-[13px] leading-relaxed text-txt mb-1.5">
                    {activity.text}
                  </div>
                  <div className="font-[family-name:var(--font-dm)] text-[10px] tracking-[0.05em] text-txt-ghost">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RESOURCE GRID ── */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-border-s pb-4">
            <h3 className="font-[family-name:var(--font-dm)] text-[11px] tracking-[0.15em] uppercase text-txt-muted">
              Recommended Reference
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {resources.map((resource, i) => (
              <div
                key={i}
                className="group bg-void border border-border-s rounded-[4px] p-5 cursor-pointer transition-all duration-200 hover:border-accent hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex justify-between items-center"
              >
                <div>
                  <div className="font-[family-name:var(--font-dm)] text-[9px] tracking-[0.15em] uppercase text-txt-ghost mb-2.5">
                    {resource.type}
                  </div>
                  <h4 className="font-[family-name:var(--font-cormorant)] text-[20px] font-medium text-txt mb-0.5 group-hover:text-accent transition-colors">
                    {resource.title}
                  </h4>
                </div>
                <div className="font-[family-name:var(--font-dm)] text-[11px] text-txt-muted tracking-wide flex items-center gap-2">
                  {resource.time}
                  <span className="text-accent opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
