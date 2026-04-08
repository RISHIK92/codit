"use client";

import { useAuth } from "@/lib/AuthContext";
import { Bell, User } from "lucide-react";

export default function TopBar() {
  const { user } = useAuth();

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-[#1e293b] text-accent border-[#1e293b]", // Slate
      "bg-[#312e81] text-[#b8a4e8] border-[#312e81]", // Indigo
      "bg-[#451a03] text-[#e8c4a0] border-[#451a03]", // Amber
      "bg-[#0f766e] text-[#a8e6cf] border-[#0f766e]", // Teal
      "bg-[#9f1239] text-[#ff6b7a] border-[#9f1239]", // Rose
    ];
    let hash = 0;
    const identifier = name || "Guest User";
    for (let i = 0; i < identifier.length; i++) {
      hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const displayName = user?.displayName || user?.email || "Guest User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-border-s bg-[rgba(13,15,18,0.7)] sticky top-0 z-[100] backdrop-blur-[20px] saturate-[180%]">
      <div className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-txt flex items-center gap-2"></div>

      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer relative transition-all duration-200 hover:bg-glass hover:border-border-a group after:absolute after:top-1 after:right-2 after:w-2.5 after:h-2.5 after:bg-[var(--accent-warm)] after:border-2 after:border-surface after:rounded-full after:shadow-[0_0_8px_var(--accent-warm)]">
          <Bell
            size={20}
            className="text-txt-muted transition-colors group-hover:text-txt"
          />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-border-s">
          <button className="group relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-glow)] to-[var(--accent-violet)] rounded-full opacity-0 blur-md transition-opacity duration-500"></div>

            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-[family-name:var(--font-dm)] text-[13px] font-bold tracking-tighter cursor-pointer relative transition-all duration-300 border-2 border-surface shadow-[var(--shadow-sm)] ${getAvatarColor(
                displayName,
              )}`}
            >
              {initials}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
