import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 h-[72px] flex items-center backdrop-blur-xl saturate-[1.8] bg-[rgba(7,8,10,0.7)] border-b border-border-s">
        <div className="w-full max-w-[1280px] mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-2xl font-semibold tracking-tight">
            <div className="w-6 h-6 bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)] rounded-[4px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
            Codit
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8">
            {["Features", "Platform", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="font-[family-name:var(--font-dm)] text-xs uppercase tracking-[0.1em] text-txt-muted hover:text-txt transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/login"
            className="bg-accent text-[#070810] px-5 py-2 rounded-full font-[family-name:var(--font-dm)] text-xs uppercase tracking-[0.1em] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(200,240,232,0.4)] transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="w-full max-w-[1280px] mx-auto px-6">
        {/* ── Hero ── */}
        <section className="pt-36 pb-20 flex flex-col items-center text-center relative">
          <h1 className="font-[family-name:var(--font-cormorant)] font-light text-[clamp(56px,9vw,128px)] leading-[0.9] tracking-[-0.03em] flex flex-col mb-8">
            <span className="text-txt animate-fadeUp">The Future of</span>
            <span className="text-gradient-iris animate-fadeUp-d1">Your Workflow</span>
            <span className="text-outline animate-fadeUp-d2">Starts Here.</span>
          </h1>
          <p className="text-txt-muted max-w-[480px] mb-13 text-base animate-fadeUp-d3">
            A dark, ultra-refined interface that feels like polished volcanic glass. Experience the next generation of digital workspaces.
          </p>
          <div className="flex gap-4 animate-fadeUp-d4">
            <Link
              href="#features"
              className="px-8 py-4 border border-border-s rounded-[4px] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] text-txt bg-transparent hover:border-accent hover:bg-glass transition-all"
            >
              Explore Platform
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-accent text-[#070810] rounded-[4px] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(127,255,212,0.2)] transition-all"
            >
              Initialize System
            </Link>
          </div>
        </section>

        {/* ── Features Bento Grid ── */}
        <section id="features" className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[280px_280px] gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-surface border border-border-s rounded-lg p-8 relative overflow-hidden flex flex-col justify-end group hover:border-border-a hover:shadow-[0_0_0_1px_var(--color-border-a),0_8px_40px_rgba(127,255,212,0.08)] hover:-translate-y-1 transition-all duration-400">
              <svg className="absolute top-8 left-8 w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="absolute top-8 right-8 font-[family-name:var(--font-dm)] text-2xl text-txt-ghost rotate-90 origin-[center_right]">01</div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light mb-2">Liquid Dynamics</h3>
              <p className="text-txt-muted text-[13px] max-w-[80%]">Fluid organic shapes bleeding into rigid geometric structures, offering a seamless user experience.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-surface border border-border-s rounded-lg p-8 relative overflow-hidden flex flex-col justify-end group hover:border-border-a hover:shadow-[0_0_0_1px_var(--color-border-a),0_8px_40px_rgba(127,255,212,0.08)] hover:-translate-y-1 transition-all duration-400">
              <svg className="absolute top-8 left-8 w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="absolute top-8 right-8 font-[family-name:var(--font-dm)] text-2xl text-txt-ghost rotate-90 origin-[center_right]">02</div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light mb-2">Obsidian Security</h3>
              <p className="text-txt-muted text-[13px] max-w-[80%]">Bank-grade encryption wrapped in an elegant interface.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-surface border border-border-s rounded-lg p-8 relative overflow-hidden flex flex-col justify-end group hover:border-border-a hover:shadow-[0_0_0_1px_var(--color-border-a),0_8px_40px_rgba(127,255,212,0.08)] hover:-translate-y-1 transition-all duration-400">
              <svg className="absolute top-8 left-8 w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="absolute top-8 right-8 font-[family-name:var(--font-dm)] text-2xl text-txt-ghost rotate-90 origin-[center_right]">03</div>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-light mb-2">Deep Insights</h3>
              <p className="text-txt-muted text-[13px] max-w-[80%]">Analytics that illuminate the darkest corners of your data.</p>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="py-20 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { num: "124K+", label: "Active Users" },
            { num: "99.9%", label: "System Uptime" },
            { num: "4.9★", label: "Average Rating" },
          ].map(({ num, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="font-[family-name:var(--font-bebas)] text-[80px] leading-none mb-1 text-gradient-iris">{num}</div>
              <div className="text-txt-muted text-[11px] uppercase tracking-[0.1em]">{label}</div>
            </div>
          ))}
        </section>

        {/* ── CTA Banner ── */}
        <section className="my-13 mb-36 py-20 px-6 bg-elevated relative overflow-hidden rounded-2xl text-center border border-border-s">
          {/* Mesh overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(127,255,212,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_100%_100%,rgba(184,164,232,0.08)_0%,transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="font-[family-name:var(--font-cormorant)] text-5xl font-light mb-6">Ready to dive in?</h2>
            <Link
              href="/login"
              className="inline-block px-8 py-4 bg-accent text-[#070810] rounded-[4px] font-[family-name:var(--font-dm)] text-[13px] uppercase tracking-[0.1em] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(127,255,212,0.2)] transition-all"
            >
              Get Started Now
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-border-s py-13">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { title: "Platform", links: ["Features", "Security", "Pricing"] },
              { title: "Resources", links: ["Documentation", "API Reference", "Blog"] },
              { title: "Company", links: ["About", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div className="font-[family-name:var(--font-dm)] text-[11px] uppercase tracking-[0.15em] text-txt mb-5">{title}</div>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-txt-muted text-[13px] hover:text-accent transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-13 pt-6 border-t border-border-s flex justify-between items-center font-[family-name:var(--font-dm)] text-[11px] text-txt-ghost">
            <div className="flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-lg font-semibold text-txt">
              <div className="w-4 h-4 bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)] rounded-[3px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
              Codit
            </div>
            <div>© {new Date().getFullYear()} Liquid Obsidian Inc.</div>
          </div>
        </footer>
      </main>
    </>
  );
}
