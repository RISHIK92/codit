"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore, useEntranceTestStore } from "@/lib/stores";
import type {
  EntranceQuestionDTO,
  AnswerPayload,
} from "@/lib/api/entranceTestApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type LearningMode = "video" | "article";
type OnboardingStep = "modes" | "hours" | "test";

const MODE_OPTIONS: { value: LearningMode; label: string; desc: string }[] = [
  {
    value: "video",
    label: "Videos",
    desc: "Tutorials, walkthroughs, visual explanations",
  },
  {
    value: "article",
    label: "Articles",
    desc: "Docs, written guides, in-depth reads",
  },
];

const HOURS_OPTIONS = [
  { value: 2, label: "~2 hrs / week", sub: "Light pace" },
  { value: 5, label: "~5 hrs / week", sub: "Steady progress" },
  { value: 10, label: "~10 hrs / week", sub: "Focused grind" },
  { value: 20, label: "20+ hrs / week", sub: "Full throttle" },
];

const STEP_ORDER: OnboardingStep[] = ["modes", "hours", "test"];

const LEVEL_META: Record<
  string,
  { label: string; color: string; dot: string; desc: string }
> = {
  beginner: {
    label: "Beginner",
    color: "text-success border-success/40 bg-success/5",
    dot: "bg-success",
    desc: "You'll start with foundational projects and build up from there.",
  },
  intermediate: {
    label: "Intermediate",
    color: "text-warning border-warning/40 bg-warning/5",
    dot: "bg-warning",
    desc: "You'll work on real-world projects with meaningful challenges.",
  },
  advanced: {
    label: "Advanced",
    color: "text-[#b8a4e8] border-[#b8a4e8]/40 bg-[#b8a4e8]/5",
    dot: "bg-[#b8a4e8]",
    desc: "You'll tackle complex systems, architecture, and distributed problems.",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { profile, profileLoading, savePreferences } = useUserStore();
  const {
    questions,
    round,
    loading: testLoading,
    submitting,
    done,
    resultLevel,
    error: testError,
    start,
    submit,
    reset,
  } = useEntranceTestStore();

  const [step, setStep] = useState<OnboardingStep>("modes");
  const [modes, setModes] = useState<LearningMode[]>([]);
  const [hours, setHours] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Clear answers on each new round
  const prevRound = useRef(round);
  useEffect(() => {
    if (round !== prevRound.current) {
      setAnswers({});
      prevRound.current = round;
    }
  }, [round]);

  // Auth guards
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.is_new) {
      router.replace("/dashboard");
    }
  }, [profile, profileLoading, router]);

  if (authLoading || !user || profileLoading) return null;

  // ── Helpers ────────────────────────────────────────────────────────────────

  const stepIndex = STEP_ORDER.indexOf(step);

  const progress =
    step === "test"
      ? done
        ? 100
        : 67 + (round / 3) * 11
      : ((stepIndex + 1) / STEP_ORDER.length) * 100;

  const toggleMode = (m: LearningMode) =>
    setModes((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  const canAdvance = () => {
    if (step === "modes") return modes.length > 0;
    if (step === "hours") return hours !== null;
    return false;
  };

  const goNext = () => {
    if (step === "modes") setStep("hours");
    else if (step === "hours") startTest();
  };

  const startTest = async () => {
    reset();
    setStep("test");
    const token = await user.getIdToken();
    await start(token);
  };

  const handleSelectOption = (questionId: string, idx: number) =>
    setAnswers((prev) => ({ ...prev, [questionId]: idx }));

  const allAnswered =
    questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  const handleSubmitRound = async () => {
    if (!allAnswered) return;
    const payload: AnswerPayload[] = questions.map((q) => ({
      question_id: q.id,
      selected_option: answers[q.id],
    }));
    const token = await user.getIdToken();
    await submit(token, payload);
  };

  const finishOnboarding = async () => {
    if (!resultLevel) return;
    setSaving(true);
    setError("");
    try {
      const token = await user.getIdToken();
      await savePreferences(token, {
        skill_level: resultLevel,
        learning_modes: modes,
        hours_per_week: hours!,
      });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong, please try again.");
      setSaving(false);
    }
  };

  const levelMeta = resultLevel ? LEVEL_META[resultLevel] : null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-void text-txt flex flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(127,255,212,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo */}
        <div className="mt-4 mb-2 text-center">
          <span className="font-(family-name:--font-cormorant) text-[32px] font-semibold tracking-tight text-txt">
            co<span className="text-accent">dit</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              {done
                ? "Complete"
                : `Setup — ${stepIndex + 1} of ${STEP_ORDER.length}`}
            </span>
            <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost">
              {Math.round(Math.min(progress, 100))}%
            </span>
          </div>
          <div className="h-px bg-border-s rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-700 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border-s rounded-sm p-8 md:p-10">
          {/* ── Step: Learning Modes ── */}
          {step === "modes" && (
            <div>
              <h1 className="font-(family-name:--font-cormorant) text-[28px] font-semibold text-txt mb-1">
                How do you learn best?
              </h1>
              <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted mb-8">
                Pick all that apply — we'll mix formats to keep things fresh.
              </p>
              <div className="flex flex-col gap-3">
                {MODE_OPTIONS.map((opt) => {
                  const selected = modes.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleMode(opt.value)}
                      className={`w-full text-left border rounded-sm p-4 flex items-start gap-4 transition-all duration-150 ${
                        selected
                          ? "border-accent/50 bg-accent/5"
                          : "border-border-s bg-void hover:border-border-a"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-all ${
                          selected
                            ? "border-accent bg-accent/20"
                            : "border-border-a"
                        }`}
                      >
                        {selected && (
                          <span className="text-accent text-[10px] leading-none">
                            ✓
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-(family-name:--font-dm) text-[13px] text-txt font-medium">
                          {opt.label}
                        </p>
                        <p className="font-(family-name:--font-dm) text-[11px] text-txt-ghost mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step: Hours per week ── */}
          {step === "hours" && (
            <div>
              <h1 className="font-(family-name:--font-cormorant) text-[28px] font-semibold text-txt mb-1">
                How much time can you commit?
              </h1>
              <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted mb-8">
                Be honest — we'll set a realistic pace so you actually finish.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {HOURS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setHours(opt.value)}
                    className={`text-left border rounded-sm p-4 transition-all duration-150 ${
                      hours === opt.value
                        ? "border-accent/50 bg-accent/5"
                        : "border-border-s bg-void hover:border-border-a"
                    }`}
                  >
                    <p className="font-(family-name:--font-dm) text-[13px] text-txt font-medium">
                      {opt.label}
                    </p>
                    <p className="font-(family-name:--font-dm) text-[10px] text-txt-ghost mt-0.5">
                      {opt.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step: Entrance Test ── */}
          {step === "test" && (
            <div>
              {/* Loading */}
              {testLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                  <p className="font-(family-name:--font-dm) text-[12px] text-txt-ghost">
                    Preparing your assessment…
                  </p>
                </div>
              )}

              {/* Error */}
              {testError && !testLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <p className="font-(family-name:--font-dm) text-[12px] text-red-400 text-center">
                    {testError}
                  </p>
                  <button
                    onClick={startTest}
                    className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest px-4 py-2 border border-border-a rounded-sm text-txt-muted hover:text-txt transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Active questions */}
              {!testLoading && !testError && !done && questions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h1 className="font-(family-name:--font-cormorant) text-[28px] font-semibold text-txt">
                      Quick assessment
                    </h1>
                    <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost bg-border-s/40 px-2 py-1 rounded-sm">
                      Round {round}
                    </span>
                  </div>
                  <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted mb-8">
                    Answer honestly — this sets your starting level, not your
                    ceiling.
                  </p>
                  <div className="flex flex-col gap-8">
                    {questions.map((q, qi) => (
                      <QuestionBlock
                        key={q.id}
                        question={q}
                        index={qi}
                        selected={answers[q.id] ?? null}
                        onSelect={(idx) => handleSelectOption(q.id, idx)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Result screen */}
              {done && levelMeta && (
                <div className="flex flex-col items-center text-center gap-6 py-4">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 border rounded-sm ${levelMeta.color}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${levelMeta.dot}`} />
                    <span className="font-(family-name:--font-dm) text-[12px] font-medium">
                      {levelMeta.label}
                    </span>
                  </div>
                  <div>
                    <h1 className="font-(family-name:--font-cormorant) text-[28px] font-semibold text-txt mb-2">
                      You're a {levelMeta.label}
                    </h1>
                    <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted">
                      {levelMeta.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <p className="mt-4 font-(family-name:--font-dm) text-[11px] text-red-400">
              {error}
            </p>
          )}

          {/* ── Actions ── */}
          <div className="mt-8 flex items-center justify-between">
            {/* Back — only on hours step */}
            {step === "hours" ? (
              <button
                onClick={() => setStep("modes")}
                className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost hover:text-txt transition-colors"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {/* Modes / Hours: Continue */}
            {(step === "modes" || step === "hours") && (
              <button
                disabled={!canAdvance()}
                onClick={goNext}
                className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-sm border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed border-accent/40 text-accent hover:bg-accent/5"
              >
                Continue →
              </button>
            )}

            {/* Test: Submit round */}
            {step === "test" &&
              !done &&
              !testLoading &&
              !testError &&
              questions.length > 0 && (
                <button
                  disabled={!allAnswered || submitting}
                  onClick={handleSubmitRound}
                  className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-sm border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed border-accent/40 text-accent hover:bg-accent/5"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-accent/40 border-t-accent animate-spin" />
                      Evaluating…
                    </span>
                  ) : (
                    "Submit →"
                  )}
                </button>
              )}

            {/* Test done: Enter dashboard */}
            {step === "test" && done && (
              <button
                disabled={saving}
                onClick={finishOnboarding}
                className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-sm border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed border-accent/40 text-accent hover:bg-accent/5"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-accent/40 border-t-accent animate-spin" />
                    Saving…
                  </span>
                ) : (
                  "Enter codit →"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── QuestionBlock ─────────────────────────────────────────────────────────────

function QuestionBlock({
  question,
  index,
  selected,
  onSelect,
}: {
  question: EntranceQuestionDTO;
  index: number;
  selected: number | null;
  onSelect: (idx: number) => void;
}) {
  const difficultyColor =
    question.difficulty === "easy"
      ? "text-success/70"
      : question.difficulty === "intermediate"
        ? "text-warning/70"
        : "text-[#b8a4e8]/70";

  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        <span className="font-(family-name:--font-dm) text-[11px] text-txt-ghost mt-0.5 shrink-0">
          Q{index + 1}.
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`font-(family-name:--font-dm) text-[9px] uppercase tracking-widest ${difficultyColor}`}
            >
              {question.topic}
            </span>
          </div>
          <p className="font-(family-name:--font-dm) text-[13px] text-txt leading-relaxed">
            {question.question}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 pl-5">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`w-full text-left border rounded-sm px-4 py-3 flex items-center gap-3 transition-all duration-100 ${
                isSelected
                  ? "border-accent/60 bg-accent/5 text-txt"
                  : "border-border-s bg-void hover:border-border-a text-txt-muted hover:text-txt"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all ${
                  isSelected ? "border-accent bg-accent/20" : "border-border-a"
                }`}
              >
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </span>
              <span className="font-(family-name:--font-dm) text-[12px] leading-relaxed">
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
