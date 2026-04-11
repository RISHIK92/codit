"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores";
import {
  getAllUserProjects,
  getAllCatalogueProjects,
  type UserProjectDTO,
  type CatalogueProjectDTO,
} from "@/lib/api/projectsApi";

type Status = "in_progress" | "completed" | "abandoned";

interface EnrichedProject {
  user: UserProjectDTO;
  catalogue: CatalogueProjectDTO;
}

const SKILL_COLOR: Record<string, string> = {
  beginner: "#7fffd4",
  intermediate: "#f0c87a",
  advanced: "#b8a4e8",
};

const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; ring: string }
> = {
  in_progress: {
    label: "Active",
    color: "text-accent",
    ring: "border-accent/40",
  },
  completed: {
    label: "Complete",
    color: "text-success",
    ring: "border-success/40",
  },
  abandoned: {
    label: "Archived",
    color: "text-txt-ghost",
    ring: "border-border-s",
  },
};

function fmtMinutes(m: number) {
  return m < 60
    ? `${m}m`
    : `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ""}`.trim();
}

function progress(current: number, total: number) {
  const pct =
    total === 0 ? 0 : Math.min(100, Math.round((current / total) * 100));
  return isNaN(pct) ? 0 : pct;
}

function HexProgress({
  pct,
  color,
  size = 72,
  pulse = false,
}: {
  pct: number;
  color: string;
  size?: number;
  pulse?: boolean;
}) {
  // Hexagon path — flat-top style
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");

  // Stroke dash for progress ring
  const perimeter = 6 * r * 1.035; // approximate hexagon perimeter
  const dashOffset = perimeter - (pct / 100) * perimeter;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={pulse ? "animate-[pulseGlow_3s_ease-in-out_infinite]" : ""}
    >
      {/* Background hex */}
      <polygon
        points={points}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1.5"
      />
      {/* Progress hex */}
      <polygon
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={perimeter}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        className="transition-all duration-1000"
        style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
      />
      {/* Center glow */}
      <circle cx={cx} cy={cy} r={r * 0.15} fill={`${color}15`} />
    </svg>
  );
}

// ─── Constellation Node ──────────────────────────────────────────────────────
// Each project rendered as a hexagonal node connected to a vertical spine.

function ConstellationNode({
  ep,
  index,
  side,
}: {
  ep: EnrichedProject;
  index: number;
  side: "left" | "right";
}) {
  const [hovered, setHovered] = useState(false);
  const status = (ep.user.status as Status) ?? "in_progress";
  const cfg = STATUS_CONFIG[status];
  const accent = SKILL_COLOR[ep.catalogue.skill_level] ?? "#7fffd4";
  const pct = progress(ep.user.current_phase, ep.catalogue.phase_count);
  const isActive = status === "in_progress";

  return (
    <div
      className={`relative flex items-center gap-6 ${side === "right" ? "flex-row" : "flex-row-reverse"} animate-fadeUp`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Connector arm — horizontal line to the spine */}
      <div
        className="hidden lg:block w-16 h-px"
        style={{
          background: `linear-gradient(${side === "right" ? "90deg" : "270deg"}, ${accent}30, transparent)`,
        }}
      />

      {/* Card */}
      <Link
        href={`/dashboard/projects/${ep.catalogue.id}`}
        className="block flex-1 max-w-lg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          className={`relative bg-void border border-solid border-border-s rounded-sm overflow-hidden transition-colors duration-300 group${
            hovered ? " border-accent" : ""
          }`}
        >
          {/* Top accent edge */}
          <div
            className="absolute top-0 left-0 h-px transition-all duration-700"
            style={{
              width: isActive
                ? `${pct}%`
                : status === "completed"
                  ? "100%"
                  : "0%",
              background: `linear-gradient(90deg, transparent, ${accent})`,
            }}
          />

          <div className="flex items-start gap-5 p-5">
            {/* Hex progress */}
            <div className="relative shrink-0">
              <HexProgress pct={pct} color={accent} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-(family-name:--font-dm) text-[11px] font-medium"
                  style={{ color: accent }}
                >
                  {pct}%
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Top row — status + level */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 font-(family-name:--font-dm) text-[9px] uppercase tracking-[0.15em] ${cfg.color}`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${isActive ? "animate-pulse" : ""}`}
                    style={{
                      backgroundColor: isActive ? accent : "currentColor",
                    }}
                  />
                  {cfg.label}
                </span>
                <span className="w-px h-2.5 bg-border-s" />
                <span
                  className="font-(family-name:--font-dm) text-[9px] uppercase tracking-[0.15em]"
                  style={{ color: `${accent}99` }}
                >
                  {ep.catalogue.skill_level}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-(family-name:--font-cormorant) text-xl font-semibold text-txt leading-snug mb-1 group-hover:text-accent transition-colors truncate">
                {ep.catalogue.name}
              </h3>

              {/* Goal */}
              {ep.catalogue.goal && (
                <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost leading-relaxed line-clamp-1 mb-3">
                  {ep.catalogue.goal}
                </p>
              )}

              {/* Phase track */}
              <div className="flex items-center gap-1.5 mb-3">
                {Array.from({ length: ep.catalogue.phase_count }).map(
                  (_, i) => {
                    const done = i < ep.user.current_phase;
                    const current = i === ep.user.current_phase && isActive;
                    return (
                      <div
                        key={i}
                        className="h-1 rounded-full flex-1 transition-all duration-500"
                        style={{
                          backgroundColor: done
                            ? accent
                            : current
                              ? `${accent}50`
                              : "rgba(255,255,255,0.04)",
                          boxShadow: current ? `0 0 6px ${accent}30` : "none",
                        }}
                      />
                    );
                  },
                )}
              </div>

              {/* Bottom meta */}
              <div className="flex items-center gap-3">
                <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost">
                  Phase {ep.user.current_phase}/{ep.catalogue.phase_count}
                </span>
                <span className="w-px h-2.5 bg-border-s" />
                <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost">
                  {fmtMinutes(ep.catalogue.estimated_minutes)}
                </span>
                <span className="w-px h-2.5 bg-border-s" />
                <div className="flex gap-1">
                  {ep.catalogue.tech_stack.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="font-(family-name:--font-dm) text-[8px] text-txt-ghost border border-border-s rounded-sm px-1 py-px bg-surface"
                    >
                      {t}
                    </span>
                  ))}
                  {ep.catalogue.tech_stack.length > 2 && (
                    <span className="font-(family-name:--font-dm) text-[8px] text-txt-ghost">
                      +{ep.catalogue.tech_stack.length - 2}
                    </span>
                  )}
                </div>

                {/* Arrow */}
                <span
                  className="ml-auto font-(family-name:--font-dm) text-[10px] uppercase tracking-widest opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                  style={{ color: accent }}
                >
                  {isActive ? "Continue →" : "View →"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Nucleus (central stats) ─────────────────────────────────────────────────

function Nucleus({ projects }: { projects: EnrichedProject[] }) {
  const total = projects.length;
  const active = projects.filter((p) => p.user.status === "in_progress").length;
  const completed = projects.filter(
    (p) => p.user.status === "completed",
  ).length;
  const hrs = Math.round(
    projects.reduce((s, p) => s + p.catalogue.estimated_minutes, 0) / 60,
  );

  const cells = [
    { v: String(total), l: "Total" },
    { v: String(active), l: "Active" },
    { v: String(completed), l: "Done" },
    { v: `${hrs}h`, l: "Hours" },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center gap-4 sticky top-32">
      {/* Decorative ring */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-border-s/40" />
        <div
          className="absolute inset-2 rounded-full border border-accent/10"
          style={{
            background:
              "radial-gradient(circle, rgba(127,255,212,0.03) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex flex-col items-center">
          <span className="font-(family-name:--font-cormorant) text-4xl font-semibold text-txt leading-none">
            {total}
          </span>
          <span className="font-(family-name:--font-dm) text-[8px] uppercase tracking-[0.2em] text-txt-ghost mt-1">
            Projects
          </span>
        </div>
      </div>

      {/* Mini stat pills */}
      <div className="flex flex-col gap-2 w-full">
        {cells.slice(1).map((c) => (
          <div
            key={c.l}
            className="flex items-center justify-between bg-void border border-border-s rounded-sm px-3 py-2"
          >
            <span className="font-(family-name:--font-dm) text-[9px] uppercase tracking-[0.15em] text-txt-ghost">
              {c.l}
            </span>
            <span className="font-(family-name:--font-cormorant) text-lg text-txt">
              {c.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mobile Stats Row ────────────────────────────────────────────────────────

function MobileStats({ projects }: { projects: EnrichedProject[] }) {
  const total = projects.length;
  const active = projects.filter((p) => p.user.status === "in_progress").length;
  const completed = projects.filter(
    (p) => p.user.status === "completed",
  ).length;
  const hrs = Math.round(
    projects.reduce((s, p) => s + p.catalogue.estimated_minutes, 0) / 60,
  );

  const cells = [
    { v: String(total), l: "Total" },
    { v: String(active), l: "Active" },
    { v: String(completed), l: "Done" },
    { v: `${hrs}h`, l: "Hours" },
  ];

  return (
    <div className="grid grid-cols-4 gap-px bg-border-s rounded-sm overflow-hidden mb-8 border border-border-s lg:hidden">
      {cells.map((c) => (
        <div
          key={c.l}
          className="bg-void px-3 py-3 flex flex-col gap-0.5 items-center"
        >
          <span className="font-(family-name:--font-cormorant) text-2xl text-txt leading-none">
            {c.v}
          </span>
          <span className="font-(family-name:--font-dm) text-[8px] uppercase tracking-[0.18em] text-txt-ghost mt-0.5">
            {c.l}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Filter = "all" | "in_progress" | "completed" | "abandoned";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "abandoned", label: "Archived" },
];

export default function MyProjectsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  const [userProjects, setUserProjects] = useState<UserProjectDTO[]>([]);
  const [catalogue, setCatalogue] = useState<CatalogueProjectDTO[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    setFetching(true);
    user.getIdToken().then(async (token) => {
      try {
        const [upRes, catRes] = await Promise.all([
          getAllUserProjects(token),
          getAllCatalogueProjects(),
        ]);
        setUserProjects(upRes.user_projects ?? upRes.userProjects ?? []);
        setCatalogue(catRes.projects ?? []);
      } catch (err: any) {
        setError(err.message ?? "Failed to load");
      } finally {
        setFetching(false);
      }
    });
  }, [loading, user]);

  if (loading || !user) return null;

  // Enrich
  const enriched: EnrichedProject[] = userProjects
    .map((up) => {
      const cat = catalogue.find((c) => c.id === up.project_id);
      return cat ? { user: up, catalogue: cat } : null;
    })
    .filter(Boolean) as EnrichedProject[];

  // Sort: active first, then completed, then abandoned
  const sorted = [...enriched].sort((a, b) => {
    const order: Record<string, number> = {
      in_progress: 0,
      completed: 1,
      abandoned: 2,
    };
    return (order[a.user.status] ?? 3) - (order[b.user.status] ?? 3);
  });

  const visible =
    filter === "all"
      ? sorted
      : sorted.filter((ep) => ep.user.status === filter);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="p-8 md:p-12 w-full bg-surface min-h-screen">
        <div className="mb-10">
          <div className="h-3 w-20 bg-void rounded-sm animate-pulse mb-4" />
          <div className="h-8 w-52 bg-void rounded-sm animate-pulse mb-2" />
          <div className="h-3 w-72 bg-void rounded-sm animate-pulse" />
        </div>
        <div className="flex flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-void border border-border-s rounded-sm h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-8 md:p-12 w-full bg-surface min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-(family-name:--font-dm) text-sm text-txt-muted">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-accent border border-accent/30 px-5 py-2 rounded-sm hover:bg-accent/5 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (enriched.length === 0) {
    return (
      <div className="p-8 md:p-12 w-full bg-surface min-h-screen flex flex-col">
        <div className="mb-10">
          <div className="font-(family-name:--font-dm) text-[10px] tracking-[0.2em] uppercase text-txt-ghost mb-3">
            My Projects
          </div>
          <h1 className="font-(family-name:--font-cormorant) text-4xl font-semibold text-txt leading-none">
            Constellation
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center">
          {/* Empty constellation art */}
          <div className="relative w-48 h-48 opacity-20">
            <div className="absolute inset-0 rounded-full border border-dashed border-border-s" />
            <div className="absolute inset-6 rounded-full border border-dashed border-border-s" />
            <div className="absolute inset-12 rounded-full border border-dashed border-border-s" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/50" />
            <div className="absolute bottom-8 right-6 w-1.5 h-1.5 rounded-full bg-warning/50" />
            <div className="absolute top-1/2 left-4 w-1.5 h-1.5 rounded-full bg-[#b8a4e8]/50" />
          </div>

          <div>
            <p className="font-(family-name:--font-cormorant) text-2xl text-txt mb-2">
              Your constellation is empty
            </p>
            <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted mb-6">
              Every project you start becomes a star here.
            </p>
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 font-(family-name:--font-dm) text-[11px] uppercase tracking-widest border border-accent/40 text-accent px-6 py-2.5 rounded-sm hover:bg-accent/5 transition-colors"
            >
              Browse Projects →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 md:p-12 w-full bg-surface min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="font-(family-name:--font-dm) text-[10px] tracking-[0.2em] uppercase text-txt-ghost mb-3">
          My Projects
        </div>
        <h1 className="font-(family-name:--font-cormorant) text-4xl font-semibold text-txt leading-none mb-2">
          Constellation
        </h1>
        <p className="font-(family-name:--font-dm) text-[13px] text-txt-muted">
          Each project is a star in your learning universe — watch your
          constellation grow.
        </p>
      </div>

      {/* Mobile stats */}
      <MobileStats projects={enriched} />

      {/* Filter tabs */}
      <div className="flex gap-1 mb-8 border-b border-border-s">
        {FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? enriched.length
              : enriched.filter((ep) => ep.user.status === f.value).length;
          if (count === 0 && f.value !== "all") return null;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`relative font-(family-name:--font-dm) text-[11px] uppercase tracking-widest px-4 py-3 transition-colors cursor-pointer
                ${filter === f.value ? "text-txt" : "text-txt-ghost hover:text-txt-muted"}`}
            >
              {f.label}
              {count > 0 && (
                <span className="ml-1.5 text-[9px] opacity-40">{count}</span>
              )}
              {filter === f.value && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost">
            No {filter.replace("_", " ")} projects
          </p>
        </div>
      ) : (
        /* Constellation layout: Nucleus (left on lg) + vertical spine with alternating nodes */
        <div className="flex gap-10">
          {/* Nucleus — desktop sidebar */}
          <div className="hidden lg:block w-44 shrink-0">
            <Nucleus projects={enriched} />
          </div>

          {/* Spine + nodes */}
          <div className="flex-1 relative">
            {/* Vertical spine (desktop only) */}
            <div className="hidden lg:block absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-accent/10 via-accent/5 to-transparent" />

            {/* Node list */}
            <div className="flex flex-col gap-6 lg:pl-8">
              {visible.map((ep, i) => (
                <ConstellationNode
                  key={ep.catalogue.id}
                  ep={ep}
                  index={i}
                  side={i % 2 === 0 ? "right" : "right"}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
