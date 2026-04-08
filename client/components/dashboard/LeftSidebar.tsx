import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeftSidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "◉" },
    { name: "My Projects", href: "#", icon: "○" },
    { name: "Browse Projects", href: "#", icon: "○" },
    { name: "Resources", href: "#", icon: "○" },
  ];

  return (
    <aside className="hidden md:flex w-[240px] bg-surface border-r border-border-s p-6 flex-col gap-8 sticky top-0 h-screen overflow-y-auto no-scrollbar shadow-[inset_-1px_0_0_rgba(127,255,212,0.04)] z-40 transition-transform duration-300">
      {/* Logo */}
      <div className="flex items-center mx-auto gap-2 font-[family-name:var(--font-cormorant)] text-xl font-semibold tracking-tight text-txt cursor-pointer">
        <div className="w-6 h-6 bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)] rounded-[4px] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
        Codit
      </div>

      {/* Primary Nav */}
      <nav className="flex flex-col gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-[family-name:var(--font-dm)] text-[13px] tracking-[0.04em] relative transition-all duration-300 overflow-hidden
                ${
                  isActive
                    ? "text-accent bg-[rgba(200,240,232,0.08)]"
                    : "text-txt-muted hover:text-txt hover:bg-glass"
                }
              `}
            >
              {/* Animated active border */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent rounded-r-sm shadow-[var(--glow-primary)]" />
              )}

              {/* Status dot */}
              <div
                className={`w-1.5 h-1.5 rounded-full border-[1.5px] border-current transition-all duration-300
                ${isActive ? "bg-accent shadow-[0_0_12px_var(--accent-primary)] opacity-100" : "opacity-50"}
              `}
              />

              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Current Project */}
      <div className="group bg-elevated border border-border-s rounded-xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden hover:border-border-a hover:shadow-md">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--gradient-iris)] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
        <div className="font-[family-name:var(--font-cormorant)] text-base font-semibold text-txt mb-1">
          Invoice Generator
        </div>

        <div className="font-[family-name:var(--font-dm)] text-[10px] tracking-[0.06em] text-txt-muted mb-3">
          Week 2 · Day 9
        </div>

        <div className="w-full h-1 bg-void rounded-sm overflow-hidden relative">
          <div className="h-full bg-[var(--gradient-iris)] rounded-sm relative transition-all duration-700 w-[40%] bg-[length:200%_100%] animate-shimmer">
            <div className="absolute -top-[2px] -right-1 w-2 h-2 bg-accent rounded-full shadow-[0_0_12px_var(--accent-primary)] animate-pulseGlow" />
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Secondary Nav */}
      <div className="border-t border-border-s border-dashed pt-6 flex flex-col gap-1">
        {["Settings", "Help & Docs"].map((name) => (
          <Link
            key={name}
            href="#"
            className="px-4 py-2 rounded-lg font-[family-name:var(--font-dm)] text-[13px] tracking-[0.04em] text-txt-muted hover:text-txt hover:bg-glass transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
