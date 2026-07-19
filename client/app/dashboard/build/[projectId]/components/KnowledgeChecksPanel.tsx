"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Code2,
  Bug,
  ListChecks,
  X,
} from "lucide-react";
import {
  getPhaseKnowledgeChecks,
  submitAnswer,
  type KnowledgeCheckItemDTO,
} from "@/lib/api/knowledgeCheckApi";

interface KnowledgeChecksPanelProps {
  phaseId: string | null;
  phaseNumber?: number;
  projectId: string;
  getToken: () => Promise<string>;
}

const TYPE_META: Record<string, { icon: React.ReactNode; label: string }> = {
  multiple_choice: { icon: <ListChecks size={10} />, label: "Multiple Choice" },
  code_completion: { icon: <Code2 size={10} />, label: "Code Completion" },
  debug: { icon: <Bug size={10} />, label: "Debug" },
};

function typeMeta(type: string) {
  return TYPE_META[type] ?? { icon: <HelpCircle size={10} />, label: type };
}

// ─── Compact tab row ────────────────────────────────────────────────────────

function QuestionTab({
  check,
  onOpen,
}: {
  check: KnowledgeCheckItemDTO;
  onOpen: () => void;
}) {
  const meta = typeMeta(check.question_type);

  return (
    <button
      onClick={onOpen}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
        check.attempted
          ? check.is_correct
            ? "border-success/25 bg-success/5 hover:border-success/40"
            : "border-red-400/25 bg-red-400/5 hover:border-red-400/40"
          : "border-border-s bg-surface/60 hover:border-accent/30"
      }`}
    >
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border-s font-(family-name:--font-dm) text-[9px] uppercase tracking-widest text-txt-ghost shrink-0">
        {meta.icon}
        {meta.label}
      </span>

      <span className="flex-1 min-w-0 truncate font-(family-name:--font-dm) text-[12px] text-txt">
        {check.question}
      </span>

      <span className="shrink-0">
        {check.attempted ? (
          check.is_correct ? (
            <CheckCircle2 size={14} className="text-success" />
          ) : (
            <XCircle size={14} className="text-red-400" />
          )
        ) : (
          <span className="block w-1.5 h-1.5 rounded-full bg-border-a" />
        )}
      </span>
    </button>
  );
}

// ─── Answer modal ───────────────────────────────────────────────────────────

function QuestionModal({
  check,
  projectId,
  getToken,
  onAnswered,
  onClose,
}: {
  check: KnowledgeCheckItemDTO;
  projectId: string;
  getToken: () => Promise<string>;
  onAnswered: (
    id: string,
    result: { is_correct: boolean; explanation: string; answer: string },
  ) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(check.submitted_answer ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const meta = typeMeta(check.question_type);

  const handleSubmit = useCallback(async () => {
    if (!draft.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const idToken = await getToken();
      const result = await submitAnswer(idToken, check.id, projectId, draft);
      onAnswered(check.id, { ...result, answer: draft });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  }, [draft, submitting, check.id, projectId, getToken, onAnswered]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-surface border border-border-s rounded-sm p-6 max-w-2xl w-full shadow-[0_24px_64px_rgba(0,0,0,0.7)] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-txt-ghost hover:text-txt transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-2 mb-3 pr-6">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border-s font-(family-name:--font-dm) text-[9px] uppercase tracking-widest text-txt-ghost">
            {meta.icon}
            {meta.label}
          </span>
          {check.attempted && (
            <span
              className={`inline-flex items-center gap-1 font-(family-name:--font-dm) text-[10px] uppercase tracking-widest ${
                check.is_correct ? "text-success" : "text-red-400"
              }`}
            >
              {check.is_correct ? (
                <CheckCircle2 size={11} />
              ) : (
                <XCircle size={11} />
              )}
              {check.is_correct ? "Correct" : "Incorrect"}
            </span>
          )}
        </div>

        <p className="font-(family-name:--font-dm) text-[13px] text-txt leading-relaxed whitespace-pre-wrap mb-4">
          {check.question}
        </p>

        {check.question_type === "multiple_choice" && check.options.length > 0 ? (
          <div className="flex flex-col gap-1.5 mb-4">
            {check.options.map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded border cursor-pointer font-(family-name:--font-dm) text-[11px] transition-colors ${
                  draft === opt
                    ? "border-accent/50 bg-accent/5 text-txt"
                    : "border-border-s text-txt-muted hover:border-accent/30"
                } ${check.attempted ? "pointer-events-none opacity-70" : ""}`}
              >
                <input
                  type="radio"
                  name={`kc-${check.id}`}
                  className="accent-accent"
                  checked={draft === opt}
                  disabled={check.attempted}
                  onChange={() => setDraft(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <textarea
            value={draft}
            disabled={check.attempted}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type your answer…"
            rows={4}
            autoFocus
            className="w-full mb-4 px-2.5 py-2 rounded border border-border-s bg-void font-(family-name:--font-mono) text-[11px] text-txt resize-none focus:outline-none focus:border-accent/40 disabled:opacity-70"
          />
        )}

        {check.attempted ? (
          <p className="font-(family-name:--font-dm) text-[11px] text-txt-muted leading-relaxed">
            {check.explanation}
          </p>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || !draft.trim()}
              className="flex items-center gap-1.5 font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-accent border border-accent/40 px-4 py-2 rounded-sm hover:bg-accent/5 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {submitting && <Loader2 size={11} className="animate-spin" />}
              Submit
            </button>
            {error && (
              <span className="font-(family-name:--font-dm) text-[10px] text-red-400">
                {error}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────

export function KnowledgeChecksPanel({
  phaseId,
  phaseNumber,
  projectId,
  getToken,
}: KnowledgeChecksPanelProps) {
  const [checks, setChecks] = useState<KnowledgeCheckItemDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCheckId, setOpenCheckId] = useState<string | null>(null);

  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  });

  const fetchChecks = useCallback(async () => {
    if (!phaseId) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getTokenRef.current();
      const { checks: items } = await getPhaseKnowledgeChecks(token, phaseId);
      setChecks(items);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load knowledge checks");
    } finally {
      setLoading(false);
    }
  }, [phaseId]);

  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);

  const handleAnswered = useCallback(
    (id: string, result: { is_correct: boolean; explanation: string; answer: string }) => {
      setChecks((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                attempted: true,
                is_correct: result.is_correct,
                explanation: result.explanation,
                submitted_answer: result.answer,
              }
            : c,
        ),
      );
    },
    [],
  );

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
          Loading knowledge checks
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="font-(family-name:--font-dm) text-[13px] text-red-400">
          {error}
        </span>
        <button
          onClick={fetchChecks}
          className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-accent hover:text-txt transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (checks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-txt-ghost px-6 text-center">
        <HelpCircle size={22} className="text-border-s" />
        <span className="font-(family-name:--font-dm) text-[11px] text-txt-ghost">
          No knowledge checks for Phase {phaseNumber ?? ""}
        </span>
      </div>
    );
  }

  const correct = checks.filter((c) => c.attempted && c.is_correct).length;
  const attempted = checks.filter((c) => c.attempted).length;
  const total = checks.length;
  const openCheck = checks.find((c) => c.id === openCheckId) ?? null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-border-s shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-[0.2em] text-txt-ghost">
            {attempted}/{total} attempted
          </span>
          <span className="font-(family-name:--font-dm) text-[10px] text-accent">
            {correct}/{attempted || total} correct
          </span>
        </div>
        <div className="h-0.5 bg-border-s rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${(attempted / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {checks.map((check) => (
          <QuestionTab
            key={check.id}
            check={check}
            onOpen={() => setOpenCheckId(check.id)}
          />
        ))}
      </div>

      {openCheck && (
        <QuestionModal
          check={openCheck}
          projectId={projectId}
          getToken={() => getTokenRef.current()}
          onAnswered={handleAnswered}
          onClose={() => setOpenCheckId(null)}
        />
      )}
    </div>
  );
}
