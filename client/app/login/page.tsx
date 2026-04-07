"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  authenticateWithEmail,
  signInWithGoogle,
  sendPasswordReset,
  resendVerification,
} from "@/lib/authActions";
import { useAuth } from "@/lib/AuthContext";

type Step = "email" | "password" | "verification_pending" | "forgot_password";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  /* ── Redirect if already logged in ── */
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  /* ── Toast auto-dismiss ── */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ── Resend cooldown ticker ── */
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  /* ── Step transition (fade) ── */
  const animateStep = useCallback((next: Step) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setError("");
      setTransitioning(false);
    }, 200);
  }, []);

  const handleBack = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setStep("email");
      setError("");
      setPassword("");
      setTransitioning(false);
    }, 200);
  }, []);

  /* If auth is loading or user is logged in, show spinner */
  if (authLoading || user) {
    return (
      <div className="fixed inset-0 z-[100] bg-void flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Main form handler ── */
  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Step 1 — email entry
    if (step === "email") {
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      // No pre-check here as per user request — just move to password
      animateStep("password");
      return;
    }

    // Step 2 — authentication (Sign-in or Sign-up)
    if (step === "password") {
      if (!password) {
        setError("Password is required.");
        return;
      }
      setLoading(true);
      const result = await authenticateWithEmail(email, password);
      setLoading(false);

      if (!result.success) {
        setError(result.message);
        return;
      }

      if (result.isNew) {
        animateStep("verification_pending");
      } else {
        router.push("/dashboard");
      }
      return;
    }

    // Forgot password — send reset link
    if (step === "forgot_password") {
      setLoading(true);
      const result = await sendPasswordReset(email);
      setLoading(false);
      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });
      if (result.success) setTimeout(() => animateStep("password"), 3000);
      return;
    }
  };

  /* ── Google sign in ── */
  const handleGoogle = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (!result.success) {
      if (result.message) setToast({ message: result.message, type: "error" });
      return;
    }
    router.push("/dashboard");
  };

  /* ── Resend verification email ── */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const result = await resendVerification();
    if (result.success) {
      setResendCooldown(60);
      setToast({ message: result.message, type: "success" });
    } else {
      setToast({ message: result.message, type: "error" });
    }
  };

  /* ── Shared class helpers ── */
  const inputCls = (hasErr: boolean) =>
    `w-full py-3.5 px-4 bg-void border rounded-[4px] text-txt font-[family-name:var(--font-dm)] text-sm outline-none transition-all ${
      hasErr
        ? "border-err shadow-[0_0_0_3px_rgba(255,107,122,0.08)]"
        : "border-border-s focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,240,232,0.08)]"
    }`;

  const labelCls =
    "font-[family-name:var(--font-dm)] text-[10px] tracking-[0.15em] uppercase text-txt-muted block mb-2";

  /* ── Dynamic header text ── */
  const eyebrowText =
    step === "email"
      ? "Welcome"
      : step === "password"
        ? "Identity Verification"
        : step === "forgot_password"
          ? "Account Recovery"
          : "Almost there";

  const titleText =
    step === "forgot_password"
      ? "Reset Password"
      : step === "password"
        ? "Authenticate"
        : "Sign in";

  const subText =
    step === "forgot_password"
      ? `We'll send a reset link to ${email}`
      : step === "password"
        ? "Sign in or join — accounts are created automatically upon password submission."
        : "Enter your email to continue to the Liquid Obsidian platform.";

  /* ── Verification pending screen ── */
  if (step === "verification_pending") {
    return (
      <div className="fixed inset-0 z-[100] bg-void flex items-center justify-center px-6">
        <div className="bg-elevated border border-border-s rounded-lg p-8 text-center max-w-md animate-fadeUp-fast">
          <div className="text-4xl mb-4">✉</div>
          <h2 className="font-[family-name:var(--font-cormorant)] text-[32px] font-light mb-4">
            Check your inbox
          </h2>
          <p className="text-txt-muted mb-2">We sent a verification link to</p>
          <p className="text-txt font-medium mb-6">{email}</p>
          <p className="text-[13px] text-txt-ghost mb-8">
            Click it to activate your account, then come back here to sign in.
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`px-6 py-3 rounded-[4px] bg-accent text-[#070810] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(127,255,212,0.25)] ${
              resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend link"}
          </button>
          <div className="mt-6">
            <button
              onClick={handleBack}
              className="text-txt-muted font-[family-name:var(--font-dm)] text-[11px] uppercase tracking-[0.1em] hover:text-txt transition-colors bg-transparent border-none cursor-pointer"
            >
              ← Start over
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-8 right-8 bg-elevated border rounded-lg py-3.5 px-5 font-[family-name:var(--font-dm)] text-xs text-txt shadow-[0_24px_64px_rgba(0,0,0,0.6)] z-[1000] animate-toastIn ${
              toast.type === "success"
                ? "border-[rgba(127,255,212,0.3)]"
                : "border-[rgba(255,107,122,0.3)]"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-void flex">
      {/* ── Mobile top bar ── */}
      <div className="md:hidden absolute top-0 left-0 w-full h-12 flex items-center px-6 bg-surface border-b border-border-s z-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-2xl font-semibold"
        >
          <div className="w-[18px] h-[18px] bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)] rounded-[3px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
          Codit
        </Link>
      </div>

      {/* ── Left Panel ── */}
      <div className="hidden md:flex flex-1 bg-surface relative overflow-hidden flex-col justify-between p-16">
        {/* Animated mesh */}
        <div className="absolute inset-0 animate-meshDrift bg-[radial-gradient(ellipse_80%_60%_at_20%_30%,rgba(127,255,212,0.15)_0%,transparent_70%),radial-gradient(ellipse_60%_80%_at_80%_70%,rgba(184,164,232,0.12)_0%,transparent_70%)] pointer-events-none" />

        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-2xl font-semibold relative z-10"
        >
          <div className="w-[18px] h-[18px] bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)] rounded-[3px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
          Codit
        </Link>

        <div className="relative z-10 max-w-[80%]">
          <div className="font-[family-name:var(--font-cormorant)] text-[32px] italic text-white/80 leading-[1.2] mb-4">
            &quot;Design is not just what it looks like and feels like. Design
            is how it works.&quot;
          </div>
          <div className="font-[family-name:var(--font-dm)] text-[11px] text-txt-muted uppercase tracking-[0.1em]">
            — Component Library
          </div>
        </div>

        <div className="font-[family-name:var(--font-dm)] text-[11px] text-txt-ghost flex items-center gap-2 relative z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)]" />
          Secure Identity Infrastructure
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-12">
        <div className="w-full max-w-[420px]">
          {/* Header */}
          <div className="mb-8">
            <span
              className={`font-[family-name:var(--font-dm)] text-[11px] text-accent uppercase tracking-[0.1em] block mb-2 transition-opacity duration-200 ${
                transitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {eyebrowText}
            </span>
            <h1
              className={`font-[family-name:var(--font-cormorant)] text-5xl font-light mb-3 leading-none transition-opacity duration-200 ${
                transitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {titleText}
            </h1>
            <p
              className={`text-txt-muted text-xl mt-8 transition-opacity duration-200 ${
                transitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {subText}
            </p>
          </div>

          <form onSubmit={handleContinue}>
            {step === "forgot_password" ? (
              <div className="flex gap-4">
                <button
                  type="submit"
                  className={`flex-1 py-4 bg-accent text-[#070810] rounded-[4px] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(127,255,212,0.25)] ${
                    loading ? "btn-loading" : ""
                  }`}
                >
                  Send Link
                </button>
                <button
                  type="button"
                  onClick={() => animateStep("password")}
                  className="py-4 px-6 bg-transparent border border-border-s rounded-[4px] text-txt font-[family-name:var(--font-dm)] text-[13px] cursor-pointer hover:border-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {/* Email field */}
                <div className="relative mb-5 input-accent">
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email"
                    className={inputCls(!!error && step === "email")}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={step !== "email"}
                    autoComplete="email"
                  />
                  {step !== "email" && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="mt-2 text-txt-muted font-[family-name:var(--font-dm)] text-[11px] uppercase tracking-[0.1em] hover:text-txt transition-colors bg-transparent border-none cursor-pointer"
                    >
                      ← Edit email
                    </button>
                  )}
                </div>

                {/* Password / Authenticate */}
                <div
                  className={`field-reveal ${
                    step === "password" ? "visible" : ""
                  }`}
                >
                  <div className="relative mb-5 input-accent">
                    <div className="flex justify-between items-center">
                      <label className={labelCls}>Password</label>
                      <button
                        type="button"
                        onClick={() => animateStep("forgot_password")}
                        className="text-txt-muted font-[family-name:var(--font-dm)] text-[10px] hover:text-accent transition-colors bg-transparent border-none cursor-pointer mb-2"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input
                      type="password"
                      className={inputCls(!!error && step === "password")}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {/* Inline error */}
                {error && (
                  <div className="font-[family-name:var(--font-dm)] text-[11px] text-err tracking-[0.04em] mt-1.5 mb-3 flex items-center gap-1.5 animate-fadeUp-fast">
                    <span className="w-3.5 h-3.5 border border-err rounded-full text-[9px] flex items-center justify-center shrink-0">
                      !
                    </span>
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className={`w-full py-4 mt-2 bg-accent text-[#070810] rounded-[4px] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] relative overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(127,255,212,0.25)] ${
                    loading ? "btn-loading" : ""
                  }`}
                >
                  {step === "email" ? "Continue" : "Sign in"}
                </button>

                {/* Divider + Google — only on email step */}
                {step === "email" && (
                  <>
                    <div className="flex items-center gap-4 my-5">
                      <span className="flex-1 h-px bg-border-s" />
                      <span className="font-[family-name:var(--font-dm)] text-[11px] text-txt-ghost tracking-[0.1em] whitespace-nowrap">
                        or continue with
                      </span>
                      <span className="flex-1 h-px bg-border-s" />
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogle}
                      disabled={loading}
                      className={`w-full py-3.5 px-5 bg-elevated border border-border-s rounded-lg text-txt font-[family-name:var(--font-dm)] text-[13px] tracking-[0.06em] flex items-center justify-center gap-3 cursor-pointer transition-all hover:bg-glass hover:border-border-a hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden ${
                        loading ? "btn-loading" : ""
                      }`}
                    >
                      <GoogleIcon />
                      Conitnue With Google
                    </button>
                  </>
                )}
              </>
            )}
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 bg-elevated border rounded-lg py-3.5 px-5 font-[family-name:var(--font-dm)] text-xs text-txt shadow-[0_24px_64px_rgba(0,0,0,0.6)] z-[1000] animate-toastIn ${
            toast.type === "success"
              ? "border-[rgba(127,255,212,0.3)]"
              : "border-[rgba(255,107,122,0.3)]"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.71 17.59V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
        fill="#4285F4"
      />
      <path
        d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.59C14.72 18.25 13.48 18.66 12 18.66C9.13 18.66 6.71 16.73 5.84 14.13H2.15V16.98C3.97 20.59 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.13C5.61 13.47 5.49 12.75 5.49 12C5.49 11.25 5.61 10.53 5.84 9.87V7.02H2.15C1.4 8.52 1 10.21 1 12C1 13.79 1.4 15.48 2.15 16.98L5.84 14.13Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.38 3.8C17.45 2.01 14.96 1 12 1C7.7 1 3.97 3.41 2.15 7.02L5.84 9.87C6.71 7.27 9.13 5.34 12 5.34Z"
        fill="#EA4335"
      />
    </svg>
  );
}
