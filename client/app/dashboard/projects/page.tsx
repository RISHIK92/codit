"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore } from "@/lib/stores";
import { useDashboardStore } from "@/lib/stores/useDashboardStore";
import {
  getAllCatalogueProjects,
  type CatalogueProjectDTO,
} from "@/lib/api/projectsApi";

type SkillLevel = "beginner" | "intermediate" | "advanced";

const SKILL_META: Record<
  SkillLevel,
  { label: string; color: string; dot: string }
> = {
  beginner: {
    label: "Beginner",
    color: "text-success border-success/30 bg-success/5",
    dot: "bg-success",
  },
  intermediate: {
    label: "Intermediate",
    color: "text-warning border-warning/30 bg-warning/5",
    dot: "bg-warning",
  },
  advanced: {
    label: "Advanced",
    color: "text-[#b8a4e8] border-[#b8a4e8]/30 bg-[#b8a4e8]/5",
    dot: "bg-[#b8a4e8]",
  },
};

const LOCK_RULES: Record<
  SkillLevel,
  { title: string; requirements: string[] } | null
> = {
  beginner: null, // always unlocked
  intermediate: {
    title: "Intermediate Locked",
    requirements: [
      "Complete at least 1 beginner project",
      "Quiz average > 80%",
    ],
  },
  advanced: {
    title: "Advanced Locked",
    requirements: [
      "Complete 2 intermediate projects",
      "Quiz average > 80%",
      "Build at least 1 custom feature in any intermediate project",
    ],
  },
};

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

type Filter = "all" | SkillLevel;

// ─── Lock icon SVG ────────────────────────────────────────────────────────────
function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ─── Lock Modal ───────────────────────────────────────────────────────────────
function LockModal({
  level,
  onClose,
}: {
  level: SkillLevel;
  onClose: () => void;
}) {
  const rule = LOCK_RULES[level];
  if (!rule) return null;

  const levelMeta = SKILL_META[level];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="relative bg-surface border border-border-s rounded-sm p-8 max-w-sm w-full shadow-[0_24px_64px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(127,255,212,0.04)_0%,transparent_70%)] pointer-events-none rounded-sm" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-txt-ghost hover:text-txt transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Lock icon */}
        <div className="relative z-10 mb-5 flex items-center justify-center w-12 h-12 rounded-sm border border-border-s bg-void mx-auto">
          <LockIcon className="w-5 h-5 text-txt-ghost" />
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-1">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-(family-name:--font-dm) text-[10px] uppercase tracking-widest ${levelMeta.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${levelMeta.dot}`} />
            {levelMeta.label}
          </span>
        </div>
        <h2 className="relative z-10 font-(family-name:--font-cormorant) text-[22px] font-semibold text-txt text-center mt-3 mb-2">
          Unlock Requirements
        </h2>
        <p className="relative z-10 font-(family-name:--font-dm) text-[11px] text-txt-muted text-center mb-6">
          Complete all of the following to access {levelMeta.label} projects.
        </p>

        {/* Requirements list */}
        <ul className="relative z-10 flex flex-col gap-3">
          {rule.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 w-4 h-4 rounded-sm border border-border-s bg-void flex items-center justify-center shrink-0">
                <LockIcon className="w-2.5 h-2.5 text-txt-ghost" />
              </span>
              <span className="font-(family-name:--font-dm) text-[12px] text-txt-muted leading-relaxed">
                {req}
              </span>
            </li>
          ))}
        </ul>

        {/* Dismiss */}
        <button
          onClick={onClose}
          className="relative z-10 mt-7 w-full py-2.5 border border-border-s rounded-sm font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost hover:text-txt hover:border-border-a transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectsBrowsePage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { profile, profileLoading } = useUserStore();
  const { userProjects, fetchUserProjects } = useDashboardStore();

  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<CatalogueProjectDTO[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(true);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);
  const [lockedModal, setLockedModal] = useState<SkillLevel | null>(null);

  // Fetch catalogue
  useEffect(() => {
    setCatalogueLoading(true);
    getAllCatalogueProjects()
      .then((data) => {
        setProjects(data.projects ?? []);
        setCatalogueLoading(false);
      })
      .catch((err) => {
        setCatalogueError(err.message ?? "Failed to load projects");
        setCatalogueLoading(false);
      });
  }, []);

  // Fetch user projects (needed for lock logic)
  useEffect(() => {
    if (!loading && user) {
      user.getIdToken().then((token) => fetchUserProjects(token));
    }
  }, [loading, user, fetchUserProjects]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  if (catalogueLoading) {
    return (
      <div className="p-8 md:p-12 w-full bg-surface min-h-screen">
        <div className="mb-8">
          <div className="h-8 w-48 bg-void rounded-sm animate-pulse mb-2" />
          <div className="h-4 w-72 bg-void rounded-sm animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-void border border-border-s rounded-sm p-6 h-52 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (catalogueError) {
    return (
      <div className="p-8 md:p-12 w-full bg-surface min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="font-(family-name:--font-dm) text-[13px] text-txt-muted">
          {catalogueError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-accent border border-accent/30 px-4 py-2 rounded-sm hover:bg-accent/5 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Lock logic ─────────────────────────────────────────────────────────────
  const userSkill = (profile?.skill_level as SkillLevel) || "beginner";

  const completedByLevel = {
    beginner: userProjects.filter(
      (p) => p.status === "completed" && /* level looked up below */ true,
    ).length,
    intermediate: 0,
    advanced: 0,
  };
  // We don't have skill_level on UserProjectDTO yet, so approximate:
  // A project is "beginner-completed" if the user has ANY completed project.
  const completedProjectCount = userProjects.filter(
    (p) => p.status === "completed",
  ).length;

  // Count completed projects per catalogue level by joining with projects list
  const completedBeginnerCount = userProjects.filter((up) => {
    if (up.status !== "completed") return false;
    const catalogueProject = projects.find((p) => p.id === up.project_id);
    return catalogueProject?.skill_level === "beginner";
  }).length;

  const completedIntermediateCount = userProjects.filter((up) => {
    if (up.status !== "completed") return false;
    const catalogueProject = projects.find((p) => p.id === up.project_id);
    return catalogueProject?.skill_level === "intermediate";
  }).length;

  function isLocked(projectLevel: string): boolean {
    const level = projectLevel as SkillLevel;
    if (userSkill === "advanced") return false; // advanced users unlock everything
    if (userSkill === "intermediate") {
      if (level === "beginner") return false;
      if (level === "intermediate") return false;
      if (level === "advanced") return true;
    }
    // beginner users: only beginner unlocked
    if (userSkill === "beginner") {
      return level !== "beginner";
    }
    return false;
  }

  // ── Filter / search ────────────────────────────────────────────────────────
  const visible = projects.filter((p: CatalogueProjectDTO) => {
    const matchesLevel = filter === "all" || p.skill_level === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tech_stack.some((t: string) => t.toLowerCase().includes(q));
    return matchesLevel && matchesSearch;
  });

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <>
      {/* Lock modal */}
      {lockedModal && (
        <LockModal level={lockedModal} onClose={() => setLockedModal(null)} />
      )}

      <div className="p-8 md:p-12 w-full bg-surface min-h-screen">
        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="font-(family-name:--font-dm) text-[10px] tracking-[0.2em] uppercase text-txt-ghost mb-3">
            Catalogue
          </div>
          <h1 className="font-(family-name:--font-cormorant) text-4xl font-semibold text-txt mb-2 leading-none">
            Browse Projects
          </h1>
          <p className="font-(family-name:--font-dm) text-[13px] text-txt-muted">
            Pick a project, answer a few questions, and your personalised
            learning plan is ready.
          </p>
        </div>

        {/* ── CONTROLS ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-txt-ghost pointer-events-none"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or tech…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-void border border-border-s rounded-sm font-(family-name:--font-dm) text-[12px] text-txt placeholder:text-txt-ghost focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>

          {/* Level filter pills */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-sm font-(family-name:--font-dm) text-[11px] uppercase tracking-widest border transition-colors cursor-pointer
                  ${
                    filter === f.value
                      ? "bg-void border-border-a text-txt"
                      : "border-border-s text-txt-ghost hover:text-txt hover:border-border-a"
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── GRID ──────────────────────────────────────────────────────── */}
        {visible.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-3 text-center">
            <div className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost">
              No projects match
            </div>
            <p className="font-(family-name:--font-dm) text-[12px] text-txt-ghost/60">
              Try a different search term or filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((project: CatalogueProjectDTO) => {
              const skill =
                SKILL_META[project.skill_level as SkillLevel] ??
                SKILL_META.beginner;
              const locked = isLocked(project.skill_level);

              if (locked) {
                return (
                  <div
                    key={project.id}
                    className="group relative bg-void border border-border-s rounded-sm p-6 flex flex-col gap-5 overflow-hidden cursor-pointer"
                    onClick={() =>
                      setLockedModal(project.skill_level as SkillLevel)
                    }
                  >
                    {/* Blurred content underneath */}
                    <div className="flex flex-col gap-5 select-none pointer-events-none blur-[2px] opacity-60">
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-(family-name:--font-dm) text-[10px] uppercase tracking-widest ${skill.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${skill.dot}`}
                          />
                          {skill.label}
                        </span>
                        <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost">
                          {formatTime(project.estimated_minutes)}
                        </span>
                      </div>
                      <h3 className="font-(family-name:--font-cormorant) text-[22px] font-semibold text-txt leading-tight">
                        {project.name}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-surface border border-border-s rounded-sm font-(family-name:--font-dm) text-[10px] text-txt-ghost"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border-s">
                        <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
                          {project.phase_count} phases
                        </span>
                      </div>
                    </div>

                    {/* Lock overlay — centred */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-void/40 transition-colors group-hover:bg-void/50">
                      <div className="w-10 h-10 rounded-sm border border-border-s bg-surface/80 flex items-center justify-center group-hover:border-accent/40 transition-colors">
                        <LockIcon className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors" />
                      </div>
                      <div className="text-center px-4">
                        <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-gray-300 group-hover:text-txt transition-colors">
                          Locked
                        </p>
                        <p className="font-(family-name:--font-dm) text-[10px] text-gray-300/50 mt-1 group-hover:text-txt-ghost transition-colors">
                          Tap to view requirements
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              // ── Unlocked card ──
              return (
                <div
                  key={project.id}
                  className="group bg-void border border-border-s rounded-sm p-6 flex flex-col gap-5 transition-all duration-200 hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer relative overflow-hidden"
                  onClick={() =>
                    router.push(`/dashboard/projects/${project.id}`)
                  }
                >
                  {/* Ambient glow on hover */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(127,255,212,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Top row: skill badge + time */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-(family-name:--font-dm) text-[10px] uppercase tracking-widest ${skill.color}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${skill.dot}`}
                      />
                      {skill.label}
                    </span>
                    <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost tracking-wide">
                      {formatTime(project.estimated_minutes)}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="relative z-10 flex-1">
                    <h3 className="font-(family-name:--font-cormorant) text-[22px] font-semibold text-txt mb-2 group-hover:text-accent transition-colors leading-tight">
                      {project.name}
                    </h3>
                  </div>

                  {/* Tech stack tags */}
                  <div className="relative z-10 flex flex-wrap gap-1.5">
                    {project.tech_stack.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-surface border border-border-s rounded-sm font-(family-name:--font-dm) text-[10px] text-txt-ghost tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer: phases + CTA arrow */}
                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-border-s">
                    <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
                      {project.phase_count} phases
                    </span>
                    <span className="font-(family-name:--font-dm) text-[12px] text-accent opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Start →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── COUNT ─────────────────────────────────────────────────────── */}
        {visible.length > 0 && (
          <div className="mt-8 font-(family-name:--font-dm) text-[11px] text-txt-ghost tracking-wide">
            {visible.length} project{visible.length !== 1 ? "s" : ""}
            {filter !== "all" && ` · ${filter}`}
            {search && ` · "${search}"`}
          </div>
        )}
      </div>
    </>
  );
}
