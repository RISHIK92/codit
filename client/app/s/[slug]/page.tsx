import { getPublicArtifact } from "@/lib/api/shareApi";

/**
 * A published phase, readable by anyone with the link.
 *
 * The whole argument of this page is in its structure. A portfolio link
 * normally says "I made this" and asks you to take the code on faith. This says
 * three things instead: here is what was built, here is where each requirement
 * was independently verified in the code, and here is the author explaining in
 * their own words why it works — an explanation they had to pass before this
 * page could exist at all.
 *
 * The last part is the one that can't be faked by prompting, which is precisely
 * why it's given the most room.
 */

const KIND_LABEL: Record<string, string> = {
  behavioral: "Works",
  structural: "Built right",
  conceptual: "Understood",
};

export default async function SharedArtifactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let artifact;
  try {
    artifact = await getPublicArtifact(slug);
  } catch {
    artifact = null;
  }

  if (!artifact || !artifact.found) {
    return (
      <Shell>
        <h1 className="font-(family-name:--font-cormorant) text-3xl text-txt mb-2">
          Nothing here
        </h1>
        <p className="font-(family-name:--font-dm) text-[13px] text-txt-muted">
          This link doesn&apos;t point to anything.
        </p>
      </Shell>
    );
  }

  // Withdrawn links say so rather than 404ing — someone following an old link
  // should learn it was taken down, not that they typed it wrong.
  if (artifact.revoked) {
    return (
      <Shell>
        <h1 className="font-(family-name:--font-cormorant) text-3xl text-txt mb-2">
          No longer shared
        </h1>
        <p className="font-(family-name:--font-dm) text-[13px] text-txt-muted">
          The author has withdrawn this.
        </p>
      </Shell>
    );
  }

  const when = artifact.created_at
    ? new Date(artifact.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <Shell>
      <header className="mb-10">
        <p className="font-(family-name:--font-dm) text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
          Verified on Codit{when ? ` · ${when}` : ""}
        </p>
        <h1 className="font-(family-name:--font-cormorant) text-4xl text-txt leading-tight mb-1.5">
          {artifact.project_name}
        </h1>
        <p className="font-(family-name:--font-dm) text-[13px] text-txt-muted">
          Phase {artifact.phase_number}
          {artifact.phase_title ? ` — ${artifact.phase_title}` : ""} · by{" "}
          {artifact.author_name}
        </p>
      </header>

      {/* The explanation leads. It's the part that can't be produced by
          prompting, so it gets the position of most weight. */}
      {artifact.explanation_answer && (
        <section className="mb-10">
          <h2 className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost mb-3">
            Explained in their own words
          </h2>
          <div className="border-l-2 border-accent/40 pl-5 py-1">
            {artifact.explanation_question && (
              <p className="font-(family-name:--font-dm) text-[12.5px] text-txt-muted mb-3 italic">
                {artifact.explanation_question}
              </p>
            )}
            <p className="font-(family-name:--font-dm) text-[14px] text-txt/90 leading-[1.8] whitespace-pre-wrap">
              {artifact.explanation_answer}
            </p>
          </div>
        </section>
      )}

      {artifact.criteria.length > 0 && (
        <section className="mb-10">
          <h2 className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost mb-3">
            Independently verified
          </h2>
          <ul className="space-y-2">
            {artifact.criteria.map((c, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 p-3 rounded-sm border border-border-s bg-void/30"
              >
                <span className="font-(family-name:--font-dm) text-[12.5px] text-txt/90 flex-1 min-w-[16rem]">
                  {c.text}
                </span>
                <span className="font-(family-name:--font-dm) text-[9px] uppercase tracking-[0.15em] text-txt-ghost">
                  {KIND_LABEL[c.kind] ?? c.kind}
                </span>
                {/* Where it was checked. A badge alone proves nothing; a badge
                    plus the line it was verified against is evidence. */}
                {c.evidence_path && (
                  <span className="font-mono text-[10.5px] text-txt-ghost/80">
                    {c.evidence_path}
                    {c.evidence_lines ? `:${c.evidence_lines}` : ""}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {artifact.files.length > 0 && (
        <section>
          <h2 className="font-(family-name:--font-dm) text-[10px] uppercase tracking-widest text-txt-ghost mb-3">
            The code, as submitted
          </h2>
          <div className="space-y-4">
            {artifact.files.map((f) => (
              <details key={f.path} className="border border-border-s rounded-sm">
                <summary className="px-4 py-2.5 cursor-pointer font-mono text-[11.5px] text-txt-muted hover:text-txt">
                  {f.path}
                </summary>
                <pre className="px-4 pb-4 overflow-x-auto font-mono text-[11.5px] leading-[1.6] text-txt/80">
                  {f.content}
                </pre>
              </details>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-12 pt-6 border-t border-border-s">
        <p className="font-(family-name:--font-dm) text-[11.5px] text-txt-ghost leading-[1.6]">
          Codit doesn&apos;t let you publish a phase you haven&apos;t explained back. The
          checks above were verified against this code, and the explanation was
          graded before this page could exist.
        </p>
      </footer>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">{children}</div>
    </main>
  );
}
