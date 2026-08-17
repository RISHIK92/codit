"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores";

/**
 * The landing page.
 *
 * Rewritten from template boilerplate ("The Future of Your Workflow Starts
 * Here", "polished volcanic glass") that said nothing about this product and
 * advertised 124K+ active users, 99.9% uptime and a 4.9-star rating — numbers
 * that were invented. Fabricated social proof on the front door of a product
 * whose entire argument is that credentials should be earned is the worst
 * possible first impression, so it is gone rather than restyled.
 *
 * What replaces it is the actual claim, stated plainly: the assistant can read
 * your whole codebase and will not write it for you, and you don't advance
 * until you can explain what you built.
 */

const LOOP = [
  {
    n: "01",
    title: "Build something real",
    body: "Projects broken into phases, in a full editor with a terminal and live preview running in your browser. No setup, no tutorial to follow along with.",
  },
  {
    n: "02",
    title: "Get unstuck without being handed the answer",
    body: "The assistant can read every file you've written. It will tell you which line is wrong and name the concept you're missing — and it will not write the fix. You type every character yourself.",
  },
  {
    n: "03",
    title: "Prove you understood it",
    body: "Each phase is graded against specific criteria, checked against your actual code. Then you explain in your own words why it works. The code already works — that part isn't the test.",
  },
];

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-void flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 h-16 flex items-center bg-void/85 backdrop-blur-md border-b border-border-s">
        <div className="w-full max-w-5xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5 font-serif text-xl font-semibold tracking-tight">
            <div className="w-5 h-5 bg-accent rounded-[3px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
            Codit
          </div>
          <Link
            href="/login"
            className="bg-accent text-void px-4 py-2 rounded-md font-medium text-sm hover:bg-accent-strong transition-colors"
          >
            Start building
          </Link>
        </div>
      </nav>

      <main className="w-full max-w-5xl mx-auto px-6">
        {/* Hero. One claim, at a size you can read, with no animated gradient
            competing with the words. */}
        <section className="pt-24 pb-20 max-w-3xl">
          <h1 className="font-serif font-light text-4xl sm:text-[3.5rem] leading-[1.05] tracking-[-0.02em] text-txt mb-7 animate-fadeUp">
            You can ship code you don&apos;t understand.
            <br />
            <span className="text-accent">Here you can&apos;t.</span>
          </h1>
          <p className="text-md text-txt-muted prose-measure mb-9 animate-fadeUp-d1">
            Codit is a learn-by-doing IDE with an assistant that reads your entire
            project and refuses to write any of it. You build real things, you get
            unstuck on your own, and you don&apos;t move to the next phase until
            you can explain what you just made.
          </p>
          <div className="flex flex-wrap gap-3 animate-fadeUp-d2">
            <Link
              href="/login"
              className="px-6 py-3 rounded-md bg-accent text-void font-medium text-base hover:bg-accent-strong transition-colors"
            >
              Start building
            </Link>
            <Link
              href="#how"
              className="px-6 py-3 rounded-md border border-border-m text-txt font-medium text-base hover:bg-elevated transition-colors"
            >
              How it works
            </Link>
          </div>
        </section>

        {/* The honest framing of who this is for. */}
        <section className="py-14 border-t border-border-s">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <p className="label mb-3">The problem</p>
              <p className="text-md text-txt-muted leading-[1.75]">
                Getting code to work and understanding why it works used to be the
                same skill. They aren&apos;t any more. You can describe what you
                want, get something that runs, and ship it — without ever learning
                what it does.
              </p>
            </div>
            <div>
              <p className="label mb-3">What that costs</p>
              <p className="text-md text-txt-muted leading-[1.75]">
                It holds until something breaks in a way the model can&apos;t fix,
                or until someone asks why you built it that way. Most people
                feeling this already know. That&apos;s the gap this closes.
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="py-14 border-t border-border-s">
          <h2 className="font-serif text-2xl text-txt mb-9">How it works</h2>
          <div className="space-y-9">
            {LOOP.map((s) => (
              <div key={s.n} className="flex gap-5 sm:gap-7">
                <span className="font-mono text-sm text-accent pt-1 shrink-0">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-txt mb-2">{s.title}</h3>
                  <p className="text-base text-txt-muted prose-measure leading-[1.75]">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-14 border-t border-border-s">
          <div className="card p-7 sm:p-9">
            <p className="label mb-4">What makes it different</p>
            <p className="font-serif text-xl sm:text-2xl text-txt leading-[1.4] prose-measure">
              Every other AI coding tool is competing to write your code faster.
              This one is competing to make you not need it.
            </p>
          </div>
        </section>

        <section className="py-14 border-t border-border-s pb-24">
          <h2 className="font-serif text-2xl text-txt mb-3">
            Start with one project.
          </h2>
          <p className="text-base text-txt-muted prose-measure mb-7">
            One at a time, deliberately. You&apos;ll be slower than you would be
            with an assistant that just writes it. That&apos;s the whole point.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-md bg-accent text-void font-medium text-base hover:bg-accent-strong transition-colors"
          >
            Start building
          </Link>
        </section>
      </main>

      <footer className="border-t border-border-s">
        <div className="max-w-5xl mx-auto px-6 py-7 flex items-center justify-between">
          <span className="font-serif text-base text-txt-muted">Codit</span>
          <span className="text-sm text-txt-ghost">
            Built for people who want to actually know this stuff.
          </span>
        </div>
      </footer>
    </>
  );
}
