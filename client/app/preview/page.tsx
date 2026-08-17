/**
 * Design preview — every surface with sample data, no auth required.
 *
 * Exists so the visual system can be reviewed and screenshotted without a login
 * or a live database. Untangling "is this readable" from "can I get to this
 * screen" is worth a throwaway route.
 */
const CRITERIA = [
  { text: "index.html exists and starts with a <!DOCTYPE html> declaration", kind: "structural", passed: true, why: "Found in index.html.", ev: "index.html:1" },
  { text: "The page has header, about, projects, and contact sections", kind: "behavioral", passed: true, why: "Found in index.html.", ev: "index.html:14" },
  { text: "The contact form's inputs each have an associated label", kind: "structural", passed: false, why: "Your inputs use placeholder text but no label element is tied to them.", hint: "A placeholder is not a label. Look up how the label element is tied to an input, and why a screen reader needs that connection." },
  { text: "Navigation links point at the section IDs on this page", kind: "behavioral", passed: false, why: "Every nav link's href is '#', which goes nowhere.", hint: "To jump to an element on the same page the href has to reference that element's id." },
];

const STATS = [
  { label: "Build", value: 78, hint: "What exists because of you", cls: "text-earth" },
  { label: "Understand", value: 45, hint: "What you can explain", cls: "text-sky" },
  { label: "Explore", value: 31, hint: "How far you've looked", cls: "text-sage" },
  { label: "Show", value: 0, hint: "What others can see", cls: "text-clay" },
];

export default function Preview() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>
        <p className="label mb-2">Design preview</p>
        <h1 className="font-serif text-3xl text-txt">Reading-first interface</h1>
        <p className="text-md text-txt-muted prose-measure mt-3">
          Body copy sits at 15–16px with a 1.6–1.7 line height. Nothing drops below
          12px. This paragraph is the size explanations and grader feedback are
          actually rendered at, so it is the real test of whether this works.
        </p>
      </header>

      <section className="space-y-4">
        <p className="label">Type scale</p>
        <div className="card p-6 space-y-3">
          <p className="text-4xl font-serif text-txt">Display 48</p>
          <p className="text-3xl font-serif text-txt">Display 36</p>
          <p className="text-2xl font-serif text-txt">Heading 28</p>
          <p className="text-xl text-txt">Section heading 22</p>
          <p className="text-lg text-txt">Lead-in 18</p>
          <p className="text-md text-txt-muted">Prose read at length — 16</p>
          <p className="text-base text-txt-muted">Default UI text — 15</p>
          <p className="text-sm text-txt-muted">Dense UI — 13</p>
          <p className="text-xs text-txt-ghost">Metadata floor — 12</p>
        </div>
      </section>

      <section className="space-y-4">
        <p className="label">Growth record</p>
        <div className="card overflow-hidden">
          <div className="px-6 pt-6 pb-5 border-b border-border-s">
            <p className="label text-accent mb-2">Era 3</p>
            <h3 className="font-serif text-2xl text-txt">Working Knowledge</h3>
            <p className="text-base text-txt-muted mt-2">A finished project, and evidence you understood it.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border-s">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 py-5 border-r last:border-r-0 border-border-s">
                <div className={`font-serif text-3xl ${s.cls}`}>{s.value}</div>
                <div className="text-base font-medium text-txt mt-1">{s.label}</div>
                <div className="text-sm text-txt-ghost mt-0.5">{s.hint}</div>
              </div>
            ))}
          </div>
          <div className="px-6 py-5">
            <p className="label mb-3">To reach Load Bearing</p>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full border-2 border-success bg-success/20 shrink-0" />
                <span className="text-base text-txt-ghost line-through">Pass 3 checkpoints</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full border-2 border-border-m shrink-0" />
                <span className="text-base text-txt">Recover 5 failed review checks</span>
                <span className="text-sm text-txt-ghost ml-auto tabular-nums">2 / 5</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="label">Review result</p>
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border-s">
            <span className="px-2.5 py-1 rounded-md border border-warning/40 bg-warning/10 text-warning text-sm font-medium">Not yet</span>
            <span className="text-base text-txt-muted">2 of 4 checks passed</span>
          </div>
          <div className="p-4 space-y-3">
            {CRITERIA.map((c) => (
              <div key={c.text} className={`p-4 rounded-md border ${c.passed ? "border-border-s bg-inset" : "border-warning/25 bg-warning/[0.04]"}`}>
                <div className="flex gap-3">
                  <span className={`mt-1 w-4 h-4 rounded-full shrink-0 border-2 ${c.passed ? "border-success bg-success/25" : "border-warning"}`} />
                  <div className="space-y-1.5">
                    <p className={`text-base ${c.passed ? "text-txt-muted" : "text-txt"}`}>{c.text}</p>
                    <p className="text-sm text-txt-ghost">{c.why}</p>
                    {c.ev && <p className="text-xs font-mono text-txt-ghost">{c.ev}</p>}
                    {c.hint && <p className="text-sm text-accent/90 leading-[1.6]">{c.hint}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="label">Project cards</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { n: "Personal Portfolio Website", lvl: "Beginner", stack: "HTML · CSS · JavaScript", phases: 3, mins: 180 },
            { n: "REST API with JWT Authentication", lvl: "Intermediate", stack: "Node · Express · Prisma", phases: 4, mins: 420 },
          ].map((p) => (
            <div key={p.n} className="card card-interactive p-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-medium text-txt leading-snug">{p.n}</h3>
                <span className="label label-strong shrink-0 mt-1">{p.lvl}</span>
              </div>
              <p className="text-sm text-txt-ghost font-mono mb-4">{p.stack}</p>
              <div className="flex gap-5 text-sm text-txt-muted">
                <span>{p.phases} phases</span>
                <span>{Math.round(p.mins / 60)} hrs</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
