"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore } from "@/lib/stores";

// ─── Types ────────────────────────────────────────────────────────────────────

type SkillLevel = "beginner" | "intermediate" | "advanced";
type LearningMode = "video" | "article";
type OnboardingStep = "skill" | "modes" | "hours";

const SKILL_OPTIONS: {
  value: SkillLevel;
  label: string;
  sub: string;
  color: string;
  dot: string;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    sub: "New to programming or picking up new languages",
    color:
      "border-success/40 bg-success/5 hover:border-success hover:bg-success/10",
    dot: "bg-success",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    sub: "Comfortable with fundamentals, building real projects",
    color:
      "border-warning/40 bg-warning/5 hover:border-warning hover:bg-warning/10",
    dot: "bg-warning",
  },
  {
    value: "advanced",
    label: "Advanced",
    sub: "Experienced — tackling complex systems & architecture",
    color:
      "border-[#b8a4e8]/40 bg-[#b8a4e8]/5 hover:border-[#b8a4e8] hover:bg-[#b8a4e8]/10",
    dot: "bg-[#b8a4e8]",
  },
];

const MODE_OPTIONS: { value: LearningMode; label: string; icon: string }[] = [
  { value: "video", label: "Video", icon: "▶" },
  { value: "article", label: "Articles", icon: "📄" },
];

const HOURS_OPTIONS = [
  { value: 2, label: "~2 hrs / week", sub: "Light pace" },
  { value: 5, label: "~5 hrs / week", sub: "Steady progress" },
  { value: 10, label: "~10 hrs / week", sub: "Focused grind" },
  { value: 20, label: "20+ hrs / week", sub: "Full throttle" },
];

const STEP_ORDER: OnboardingStep[] = ["skill", "modes", "hours"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { profile, profileLoading, savePreferences } = useUserStore();

  const [step, setStep] = useState<OnboardingStep>("skill");
  const [skill, setSkill] = useState<SkillLevel | null>(null);
  const [modes, setModes] = useState<LearningMode[]>([]);
  const [hours, setHours] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Redirect away if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  // If profile already complete, skip onboarding
  useEffect(() => {
    if (!profileLoading && profile && !profile.is_new) {
      router.replace("/dashboard");
    }
  }, [profile, profileLoading, router]);

  if (authLoading || !user || profileLoading) return null;

  // ── Helpers ────────────────────────────────────────────────────────────────

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  const toggleMode = (m: LearningMode) => {
    setModes((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  const canAdvance = () => {
    if (step === "skill") return skill !== null;
    if (step === "modes") return modes.length > 0;
    if (step === "hours") return hours !== null;
    return false;
  };

  const next = () => {
    if (step === "skill") setStep("modes");
    else if (step === "modes") setStep("hours");
  };

  const submit = async () => {
    if (!skill || modes.length === 0 || !hours) return;
    setSaving(true);
    setError("");
    try {
      const token = await user.getIdToken();
      await savePreferences(token, {
        skill_level: skill,
        learning_modes: modes,
        hours_per_week: hours,
      });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong, please try again.");
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-void text-txt flex flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_20%,rgba(127,255,212,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo / wordmark */}
        <div className="mb-10 text-center">
          <span className="font-(family-name:--font-cormorant) text-[32px] font-semibold tracking-tight text-txt">
            co<span className="text-accent">dit</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost">
              Setup — {stepIndex + 1} of {STEP_ORDER.length}
            </span>
            <span className="font-(family-name:--font-dm) text-[10px] text-txt-ghost">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-[1px] bg-border-s rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border-s rounded-sm p-8 md:p-10">
          {/* ── Step: Skill Level ── */}
          {step === "skill" && (
            <div>
              <h1 className="font-(family-name:--font-cormorant) text-[28px] font-semibold text-txt mb-1">
                What's your skill level?
              </h1>
              <p className="font-(family-name:--font-dm) text-[12px] text-txt-muted mb-8">
                We'll tailor projects and pacing to match where you are right
                now.
              </p>
              <div className="flex flex-col gap-3">
                {SKILL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSkill(opt.value)}
                    className={`w-full text-left border rounded-sm p-4 transition-all duration-150 ${
                      skill === opt.value
                        ? opt.color + " opacity-100"
                        : "border-border-s bg-void hover:border-border-s/80"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                      <span className="font-(family-name:--font-dm) text-[13px] font-medium text-txt">
                        {opt.label}
                      </span>
                    </div>
                    <p className="font-(family-name:--font-dm) text-[11px] text-txt-muted pl-4">
                      {opt.sub}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

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
                      className={`w-full text-left border rounded-sm p-4 flex items-center gap-4 transition-all duration-150 ${
                        selected
                          ? "border-accent/50 bg-accent/5"
                          : "border-border-s bg-void hover:border-border-s/80"
                      }`}
                    >
                      <span className="text-[20px] leading-none w-7 text-center">
                        {opt.icon}
                      </span>
                      <span className="font-(family-name:--font-dm) text-[13px] text-txt">
                        {opt.label}
                      </span>
                      {selected && (
                        <span className="ml-auto text-accent font-(family-name:--font-dm) text-[11px]">
                          ✓
                        </span>
                      )}
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
                        : "border-border-s bg-void hover:border-border-s/80"
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

          {/* ── Error ── */}
          {error && (
            <p className="mt-4 font-(family-name:--font-dm) text-[11px] text-red-400">
              {error}
            </p>
          )}

          {/* ── Actions ── */}
          <div className="mt-8 flex items-center justify-between">
            {/* Back */}
            {stepIndex > 0 ? (
              <button
                onClick={() => setStep(STEP_ORDER[stepIndex - 1])}
                className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost hover:text-txt transition-colors"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {/* Next / Finish */}
            {step !== "hours" ? (
              <button
                disabled={!canAdvance()}
                onClick={next}
                className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-sm border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed border-accent/40 text-accent hover:bg-accent/5"
              >
                Continue →
              </button>
            ) : (
              <button
                disabled={!canAdvance() || saving}
                onClick={submit}
                className="font-(family-name:--font-dm) text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-sm border transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed border-accent/40 text-accent hover:bg-accent/5"
              >
                {saving ? "Saving…" : "Let's go →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
