"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore, useUserStore } from "@/lib/stores";
import {
  getProjectWithPhases,
  createUserProject,
  type CatalogueProjectDTO,
  type LearningPhaseDTO,
} from "@/lib/api/projectsApi";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function calcEndDate(
  estimatedMinutes: number,
  hoursPerWeek: number | null | undefined,
): string {
  if (!hoursPerWeek || hoursPerWeek <= 0) return "Set weekly hours in profile";
  const totalHours = estimatedMinutes / 60;
  const daysNeeded = Math.ceil((totalHours / hoursPerWeek) * 7);
  const end = new Date();
  end.setDate(end.getDate() + daysNeeded);
  return end.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Phase Accordion Item ─────────────────────────────────────────────────────

function PhaseItem({
  phase,
  index,
}: {
  phase: LearningPhaseDTO;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  // Parse goal — DB stores it as a JSON string or plain string
  let goalText = "";
  try {
    const parsed = JSON.parse(phase.goal);
    if (typeof parsed === "string") goalText = parsed;
    else if (typeof parsed === "object" && parsed !== null) {
      goalText = Object.values(parsed).join(" · ");
    }
  } catch {
    goalText = phase.goal ?? "";
  }

  return (
    <div
      className={`border border-border-s rounded-sm bg-void transition-all duration-200 ${open ? "border-border-a/30" : "hover:border-border-a/20"}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <span className="shrink-0 w-7 h-7 rounded border border-border-s bg-surface flex items-center justify-center font-(family-name:--font-dm) text-[11px] text-gray-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-(family-name:--font-cormorant) text-[18px] font-medium text-white leading-tight">
          {phase.title}
        </span>
        <span className="shrink-0 font-(family-name:--font-dm) text-[11px] text-txt-ghost">
          {fmtMinutes(phase.estimated_minutes)}
        </span>
        <span
          className={`shrink-0 transition-transform duration-200 text-txt-ghost text-xs ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 flex flex-col gap-4 border-t border-border-s">
          {phase.description && (
            <div className="pt-4">
              <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost mb-2">
                Description
              </p>
              <p className="font-(family-name:--font-dm) text-sm leading-relaxed text-white/80">
                {phase.description}
              </p>
            </div>
          )}
          {goalText && (
            <div>
              <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost mb-2">
                Learning Goal
              </p>
              <p className="font-(family-name:--font-dm) text-sm leading-relaxed text-accent/80">
                {goalText}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const { user } = useAuthStore();
  const { profile } = useUserStore();

  const [project, setProject] = useState<CatalogueProjectDTO | null>(null);
  const [phases, setPhases] = useState<LearningPhaseDTO[]>([]);
  const [locked, setLocked] = useState(false);
  const [alreadyStarted, setAlreadyStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Fetch project detail on mount — auth-protected so backend computes lock state
  useEffect(() => {
    if (!projectId || !user) return;
    setLoading(true);
    user.getIdToken().then((token) =>
      getProjectWithPhases(token, projectId)
        .then((data) => {
          setProject(data.project ?? null);
          setPhases(data.phases ?? []);
          setLocked(data.locked ?? false);
          setAlreadyStarted(data.already_started ?? false);
          setLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setLoading(false);
        }),
    );
  }, [projectId, user]);

  const handleContinue = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      const token = await user.getIdToken();
      await createUserProject(token, projectId);
      router.push("/dashboard");
    } catch (err: any) {
      setAddError(err.message ?? "Failed to add project");
      setAdding(false);
    }
  };

  const skill = (project?.skill_level ?? "beginner") as SkillLevel;
  const meta = SKILL_META[skill] ?? SKILL_META.beginner;
  const endDate = calcEndDate(
    project?.estimated_minutes ?? 0,
    profile?.hours_per_week,
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost tracking-widest uppercase">
            Loading project
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !project) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="font-(family-name:--font-cormorant) text-2xl text-txt mb-2">
            Project not found
          </p>
          <p className="font-(family-name:--font-dm) text-sm text-txt-muted mb-6">
            {error}
          </p>
          <Link
            href="/dashboard/projects"
            className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-accent border border-accent/30 px-5 py-2 rounded-sm hover:bg-accent/5 transition-colors"
          >
            ← Browse Projects
          </Link>
        </div>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost hover:text-txt-muted transition-colors mb-10"
        >
          ← Browse Projects
        </Link>

        {/* Header card */}
        <div className="bg-void border border-border-s rounded-sm p-8 mb-6 relative overflow-hidden">
          {/* Subtle gradient line top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/20 to-transparent" />

          {/* Skill badge */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border font-(family-name:--font-dm) text-[10px] uppercase tracking-widest ${meta.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-gray-400 hover:text-accent transition-colors border border-border-s px-2.5 py-0.5 rounded-sm"
              >
                View Demo ↗
              </a>
            )}
          </div>

          {/* Title */}
          <h1 className="font-(family-name:--font-cormorant) text-4xl font-semibold text-txt leading-tight mb-4">
            {project.name}
          </h1>

          {/* Goal */}
          {project.goal && (
            <p className="font-(family-name:--font-dm) text-sm leading-relaxed text-txt-muted mb-6 max-w-2xl">
              {project.goal}
            </p>
          )}

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((t) => (
              <span
                key={t}
                className="font-(family-name:--font-dm) text-[10px] text-txt-ghost border border-border-s rounded-sm px-2 py-0.5 bg-surface"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-void border border-border-s rounded-sm p-4 flex flex-col gap-1">
            <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              Total Time
            </p>
            <p className="font-(family-name:--font-cormorant) text-2xl text-txt">
              {fmtMinutes(project.estimated_minutes)}
            </p>
          </div>
          <div className="bg-void border border-border-s rounded-sm p-4 flex flex-col gap-1">
            <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              Phases
            </p>
            <p className="font-(family-name:--font-cormorant) text-2xl text-txt">
              {phases.length || project.phase_count}
            </p>
          </div>
          <div className="bg-void border border-border-s rounded-sm p-4 flex flex-col gap-1">
            <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              {profile?.hours_per_week ? "Est. Completion" : "Completion Date"}
            </p>
            <p
              className={`font-(family-name:--font-cormorant) text-xl leading-tight ${profile?.hours_per_week ? "text-txt" : "text-txt-ghost italic text-base"}`}
            >
              {endDate}
            </p>
          </div>
        </div>

        {/* Learning Phases */}
        {phases.length > 0 && (
          <div className="mb-8">
            <h2 className="font-(family-name:--font-cormorant) text-2xl text-txt mb-4">
              Learning Phases
            </h2>
            <div className="flex flex-col gap-3">
              {phases.map((phase, i) => (
                <PhaseItem key={phase.id} phase={phase} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-void border border-border-s rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-(family-name:--font-cormorant) text-xl text-txt mb-1">
              {alreadyStarted
                ? "Continue your journey"
                : locked
                  ? "Project slot occupied"
                  : "Ready to start?"}
            </p>
            <p className="font-(family-name:--font-dm) text-xs text-txt-muted">
              {alreadyStarted
                ? "This project is already in your workspace."
                : locked
                  ? "Complete or archive your current project before starting a new one."
                  : "Add this project to your workspace and start building."}
            </p>
            {addError && (
              <p className="font-(family-name:--font-dm) text-[11px] text-error mt-2">
                {addError}
              </p>
            )}
          </div>

          {alreadyStarted ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="shrink-0 font-(family-name:--font-dm) cursor-pointer text-[11px] uppercase tracking-widest border border-accent/40 text-accent px-6 py-2.5 rounded-sm hover:bg-accent/5 transition-colors"
            >
              Go to Dashboard
            </button>
          ) : locked ? (
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <button
                disabled
                className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest border border-border-s text-txt-ghost px-6 py-2.5 rounded-sm cursor-not-allowed opacity-50"
              >
                Locked
              </button>
              <p className="font-(family-name:--font-dm) text-[10px] text-txt-ghost">
                Finish your current project first
              </p>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              disabled={adding}
              className="shrink-0 font-(family-name:--font-dm) text-[11px] cursor-pointer uppercase tracking-widest border border-accent/40 text-accent px-6 py-2.5 rounded-sm hover:bg-accent/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {adding ? (
                <>
                  <span className="w-3 h-3 rounded-full border border-accent/40 border-t-accent animate-spin" />
                  Adding…
                </>
              ) : (
                "Continue with this project →"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
