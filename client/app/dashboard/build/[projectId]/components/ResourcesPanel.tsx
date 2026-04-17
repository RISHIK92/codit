"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Clock,
  Star,
  BookOpen,
  Video,
  FileText,
  Loader2,
} from "lucide-react";
import {
  getPhaseResources,
  markCompleted,
  type ResourceItemDTO,
} from "@/lib/api/resourceProgressApi";

interface ResourcesPanelProps {
  phaseId: string | null;
  phaseNumber?: number;
  projectId: string;
  getToken: () => Promise<string>;
}

const TYPE_META: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  video: {
    icon: <Video size={10} />,
    label: "Video",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  article: {
    icon: <FileText size={10} />,
    label: "Article",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  docs: {
    icon: <BookOpen size={10} />,
    label: "Docs",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
};

function typeMeta(type: string) {
  return (
    TYPE_META[type.toLowerCase()] ?? {
      icon: <BookOpen size={10} />,
      label: type,
      color: "text-txt-muted bg-surface border-border-s",
    }
  );
}

function StarRating({ score }: { score: number }) {
  const filled = Math.round(score * 5);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={9}
          className={
            i < filled ? "text-accent fill-accent" : "text-border-s fill-none"
          }
        />
      ))}
    </div>
  );
}

export function ResourcesPanel({
  phaseId,
  phaseNumber,
  projectId,
  getToken,
}: ResourcesPanelProps) {
  const [resources, setResources] = useState<ResourceItemDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<Set<string>>(new Set());

  // Keep a ref to getToken so it never triggers re-fetches when the parent
  // re-renders and passes a new inline arrow function.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  });

  const fetchResources = useCallback(async () => {
    if (!phaseId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getTokenRef.current();
      const { resources: items } = await getPhaseResources(
        token,
        phaseId,
        projectId,
      );
      setResources(items);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, [phaseId, projectId]); // getToken intentionally excluded via ref

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleToggle = useCallback(
    async (resource: ResourceItemDTO) => {
      if (toggling.has(resource.id)) return;
      setToggling((prev) => new Set(prev).add(resource.id));

      // Optimistic update
      setResources((prev) =>
        prev.map((r) =>
          r.id === resource.id
            ? {
                ...r,
                completed: !r.completed,
                completed_at: !r.completed ? new Date().toISOString() : "",
              }
            : r,
        ),
      );

      try {
        const token = await getTokenRef.current();
        await markCompleted(token, resource.id, projectId, !resource.completed);
      } catch {
        // Roll back on error
        setResources((prev) =>
          prev.map((r) => (r.id === resource.id ? { ...resource } : r)),
        );
      } finally {
        setToggling((prev) => {
          const next = new Set(prev);
          next.delete(resource.id);
          return next;
        });
      }
    },
    [toggling, projectId], // getToken excluded via ref
  );

  // ── Empty / loading / error states ───────────────────────────────────────
  if (!phaseId) {
    return (
      <div className="flex-1 flex items-center justify-center text-txt-ghost">
        <span className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest">
          Select a phase
        </span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center gap-2 text-txt-ghost">
        <Loader2 size={14} className="animate-spin text-accent" />
        <span className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest">
          Loading resources
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="font-(family-name:--font-dm) text-[11px] text-red-400">
          {error}
        </span>
        <button
          onClick={fetchResources}
          className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-accent hover:text-txt transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-txt-ghost px-6 text-center">
        <BookOpen size={22} className="text-border-s" />
        <span className="font-(family-name:--font-dm) text-[11px] text-txt-ghost">
          No resources for Phase {phaseNumber ?? ""}
        </span>
        <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost/50">
          Resources will appear here once added by an admin
        </span>
      </div>
    );
  }

  const completed = resources.filter((r) => r.completed).length;
  const total = resources.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Progress bar header */}
      <div className="px-5 pt-4 pb-3 border-b border-border-s shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-[0.2em] text-txt-ghost">
            {completed}/{total} completed
          </span>
          <span className="font-(family-name:--font-dm) text-[10px] text-accent">
            {pct}%
          </span>
        </div>
        <div className="h-0.5 bg-border-s rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Resource list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {resources.map((resource) => {
          const meta = typeMeta(resource.type);
          const isBusy = toggling.has(resource.id);

          return (
            <div
              key={resource.id}
              className={`rounded-lg border transition-all duration-200 ${
                resource.completed
                  ? "border-border-s bg-surface/30 opacity-70"
                  : "border-border-s bg-surface/60 hover:border-accent/30"
              }`}
            >
              <div className="p-3">
                {/* Type badge + duration */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-(family-name:--font-dm) text-[9px] uppercase tracking-widest ${meta.color}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                  {resource.duration_minutes > 0 && (
                    <span className="flex items-center gap-1 font-(family-name:--font-dm) text-[10px] text-txt-ghost">
                      <Clock size={9} />
                      {resource.duration_minutes}m
                    </span>
                  )}
                  {resource.quality_score > 0 && (
                    <StarRating score={resource.quality_score} />
                  )}
                </div>

                {/* Title */}
                <p
                  className={`font-(family-name:--font-dm) text-[12px] leading-snug mb-1 ${
                    resource.completed
                      ? "line-through text-txt-ghost"
                      : "text-txt"
                  }`}
                >
                  {resource.title}
                </p>

                {/* Provider */}
                {resource.provider && (
                  <p className="font-(family-name:--font-dm) text-[10px] text-txt-ghost mb-2">
                    {resource.provider}
                  </p>
                )}

                {/* Actions: link + complete toggle */}
                <div className="flex items-center justify-between gap-2 mt-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-accent hover:text-txt transition-colors"
                  >
                    Open
                    <ExternalLink size={9} />
                  </a>

                  <button
                    onClick={() => handleToggle(resource)}
                    disabled={isBusy}
                    title={
                      resource.completed ? "Mark incomplete" : "Mark complete"
                    }
                    className="flex items-center gap-1.5 font-(family-name:--font-dm) text-[10px] uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isBusy ? (
                      <Loader2 size={13} className="animate-spin text-accent" />
                    ) : resource.completed ? (
                      <>
                        <CheckCircle2
                          size={13}
                          className="text-accent fill-accent/20"
                        />
                        <span className="text-accent">Done</span>
                      </>
                    ) : (
                      <>
                        <Circle size={13} className="text-txt-ghost" />
                        <span className="text-txt-ghost hover:text-txt">
                          Mark done
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
