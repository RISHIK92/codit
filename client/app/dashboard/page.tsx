"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  /* Redirect to login if not authenticated */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading || !user) {
    return (
      <div className="fixed inset-0 bg-void flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void">
      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 h-[72px] flex items-center backdrop-blur-xl saturate-[1.8] bg-[rgba(7,8,10,0.7)] border-b border-border-s">
        <div className="w-full max-w-[1280px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-2xl font-semibold tracking-tight">
            <div className="w-6 h-6 bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)] rounded-[4px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
            Codit
          </div>

          <div className="flex items-center gap-4">
            <span className="font-[family-name:var(--font-dm)] text-xs text-txt-muted truncate max-w-[200px]">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="py-2 px-4 bg-elevated border border-border-s rounded-[4px] text-txt font-[family-name:var(--font-dm)] text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-all hover:border-accent hover:-translate-y-px"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="font-[family-name:var(--font-dm)] text-[11px] text-accent uppercase tracking-[0.15em] block mb-2">
            Dashboard
          </span>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-light leading-none">
            Welcome back
          </h1>
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Projects", value: "—", sub: "No projects yet" },
            { label: "Submissions", value: "—", sub: "No submissions yet" },
            { label: "Account", value: user.displayName || "—", sub: user.email || "" },
          ].map((card, i) => (
            <div
              key={i}
              className="p-6 bg-surface border border-border-s rounded-lg hover:border-border-a transition-colors"
            >
              <span className="font-[family-name:var(--font-dm)] text-[10px] text-txt-muted uppercase tracking-[0.15em] block mb-3">
                {card.label}
              </span>
              <div className="font-[family-name:var(--font-bebas)] text-4xl text-txt mb-1">
                {card.value}
              </div>
              <div className="font-[family-name:var(--font-dm)] text-xs text-txt-ghost">
                {card.sub}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
