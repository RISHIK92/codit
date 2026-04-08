"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardStore } from "@/lib/stores";
import { signOutUser } from "@/lib/authActions";

export default function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentProject } = useDashboardStore();

  async function handleSignOut() {
    await signOutUser();
    router.replace("/login");
  }

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "◉" },
    { name: "My Projects", href: "#", icon: "○" },
    { name: "Browse Projects", href: "#", icon: "○" },
    { name: "Resources", href: "#", icon: "○" },
  ];

  return (
    <aside className="hidden md:flex w-60 bg-surface border-r border-border-s p-6 flex-col gap-8 sticky top-0 h-screen overflow-y-auto no-scrollbar z-40">
      {/* Logo */}
      <div className="flex items-center mx-auto gap-2 font-(family-name:--font-cormorant) text-xl font-semibold tracking-tight text-txt cursor-pointer">
        <div className="w-6 h-6 bg-[linear-gradient(135deg,#c8f0e8,#b8a4e8,#e8c4a0,#7fffd4)] rounded-sm [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]" />
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
              className={`flex items-center gap-3 px-4 py-3 rounded-sm font-(family-name:--font-dm) text-[12px] uppercase tracking-widest border transition-colors
                ${
                  isActive
                    ? "text-txt border-border-s bg-void"
                    : "text-gray-500 border-transparent hover:text-txt hover:border-border-s hover:bg-void"
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Current Project */}
      <div className="group bg-void border border-border-s rounded-sm p-5 cursor-pointer transition-colors hover:border-accent">
        <div className="font-(family-name:--font-dm) text-[9px] tracking-[0.15em] uppercase text-txt-ghost mb-2">
          Phase {currentProject.phase} · Day 9
        </div>
        <div className="font-(family-name:--font-cormorant) text-xl font-medium text-txt mb-4 group-hover:text-accent transition-colors flex items-center justify-between">
          {currentProject.title}
        </div>
        <div className="w-full h-0.5 bg-surface relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-accent transition-all duration-700"
            style={{ width: `${currentProject.progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Secondary Nav */}
      <div className="border-t border-border-s border-dashed pt-6 flex flex-col gap-1">
        {["Settings", "Help & Docs"].map((name) => (
          <Link
            key={name}
            href="#"
            className="px-4 py-2 font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-txt-ghost hover:text-txt transition-colors"
          >
            {name}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="px-4 py-2 font-(family-name:--font-dm) text-[11px] uppercase tracking-widest text-left text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
