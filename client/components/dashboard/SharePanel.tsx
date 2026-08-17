"use client";

import { useCallback, useEffect, useState } from "react";
import { Share2, Eye, Link2, Lock } from "lucide-react";
import {
  listMyArtifacts,
  shareArtifact,
  revokeArtifact,
  type MyArtifactsDTO,
} from "@/lib/api/shareApi";

/**
 * Publishing controls.
 *
 * Only phases that have been completed AND explained back appear as
 * publishable, so the list itself carries the rule: what's worth showing is
 * that you understood something, not that you finished it.
 *
 * Publishing exposes the author's own code, so the choice is per-phase,
 * explicit about what goes public, and undoable in one click from the same
 * place it was made.
 */
export function SharePanel({
  getToken,
  onChanged,
}: {
  getToken: () => Promise<string>;
  /** Publishing moves the Show stat, so the growth record needs refreshing. */
  onChanged?: () => void;
}) {
  const [data, setData] = useState<MyArtifactsDTO | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setData(await listMyArtifacts(await getToken()));
    } catch {
      // Non-fatal — the rest of the dashboard shouldn't depend on this.
    }
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  async function publish(projectId: string, phaseNumber: number, includeCode: boolean) {
    const key = `${projectId}:${phaseNumber}`;
    setBusy(key);
    setError("");
    try {
      await shareArtifact(await getToken(), projectId, phaseNumber, includeCode);
      await load();
      onChanged?.();
    } catch (e: any) {
      setError(e.message ?? "Couldn't publish that.");
    } finally {
      setBusy(null);
    }
  }

  async function withdraw(slug: string) {
    setBusy(slug);
    setError("");
    try {
      await revokeArtifact(await getToken(), slug);
      await load();
      onChanged?.();
    } catch (e: any) {
      setError(e.message ?? "Couldn't withdraw that.");
    } finally {
      setBusy(null);
    }
  }

  function copyLink(slug: string) {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(slug);
        setTimeout(() => setCopied(null), 2000);
      },
      () => setError("Couldn't copy — the link is /s/" + slug),
    );
  }

  if (!data) return null;
  if (data.shared.length === 0 && data.shareable.length === 0) return null;

  return (
    <div className="border border-border-s rounded-sm">
      <div className="px-5 pt-4 pb-3 border-b border-border-s flex items-center gap-2">
        <Share2 size={13} className="text-txt-muted" />
        <h3 className="font-sans text-xs uppercase tracking-[0.07em] text-txt-ghost">
          Published work
        </h3>
      </div>

      {data.shared.length > 0 && (
        <ul className="divide-y divide-border-s">
          {data.shared.map((a) => (
            <li key={a.slug} className="px-5 py-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex-1 min-w-[12rem]">
                <p className="font-sans text-base text-txt/90">
                  {a.project_name} · Phase {a.phase_number}
                </p>
                <p className="font-sans text-xs text-txt-ghost">
                  {a.phase_title}
                  {a.include_code ? " · code included" : " · explanation only"}
                </p>
              </div>
              <span className="flex items-center gap-1 font-sans text-xs text-txt-ghost">
                <Eye size={10} />
                {a.view_count}
              </span>
              <button
                onClick={() => copyLink(a.slug)}
                className="flex items-center gap-1 px-2 py-1 rounded-sm border border-border-s hover:border-accent/40 font-sans text-xs text-txt-muted hover:text-accent transition-colors cursor-pointer"
              >
                <Link2 size={10} />
                {copied === a.slug ? "Copied" : "Copy link"}
              </button>
              <button
                onClick={() => withdraw(a.slug)}
                disabled={busy === a.slug}
                className="px-2 py-1 rounded-sm font-sans text-xs text-txt-ghost hover:text-warning disabled:opacity-40 transition-colors cursor-pointer"
              >
                {busy === a.slug ? "…" : "Withdraw"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {data.shareable.length > 0 && (
        <div className="px-5 py-4 border-t border-border-s">
          <p className="font-sans text-xs uppercase tracking-[0.07em] text-txt-ghost mb-1.5">
            Ready to publish
          </p>
          <p className="font-sans text-sm text-txt-muted leading-[1.6] mb-3">
            You&apos;ve built these and explained them back. A published phase shows the
            checks that were verified against your code and your own explanation of why it works.
          </p>
          <div className="space-y-1.5">
            {data.shareable.map((p) => {
              const key = `${p.project_id}:${p.phase_number}`;
              return (
                <div key={key} className="flex flex-wrap items-center gap-2">
                  <span className="flex-1 min-w-[12rem] font-sans text-base text-txt/85">
                    {p.project_name} · Phase {p.phase_number}
                    {p.phase_title ? ` — ${p.phase_title}` : ""}
                  </span>
                  <button
                    onClick={() => publish(p.project_id, p.phase_number, true)}
                    disabled={busy === key}
                    className="px-2.5 py-1 rounded-sm border border-accent/40 text-accent hover:bg-accent/5 disabled:opacity-40 font-sans text-xs uppercase tracking-[0.07em] cursor-pointer transition-colors"
                  >
                    {busy === key ? "…" : "Publish with code"}
                  </button>
                  <button
                    onClick={() => publish(p.project_id, p.phase_number, false)}
                    disabled={busy === key}
                    className="px-2.5 py-1 rounded-sm border border-border-s text-txt-muted hover:text-txt disabled:opacity-40 font-sans text-xs uppercase tracking-[0.07em] cursor-pointer transition-colors"
                  >
                    Explanation only
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!data.profile_unlocked && data.profile_locked_reason && (
        <div className="px-5 py-3 border-t border-border-s flex items-start gap-2">
          <Lock size={11} className="text-txt-ghost shrink-0 mt-[2px]" />
          <p className="font-sans text-sm text-txt-ghost leading-[1.5]">
            {data.profile_locked_reason}
          </p>
        </div>
      )}

      {error && (
        <p className="px-5 pb-3 font-sans text-sm text-warning">{error}</p>
      )}
    </div>
  );
}
