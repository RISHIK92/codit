"use client";

import { useAuthStore } from "@/lib/stores";
import { Bell, User } from "lucide-react";

export default function TopBar() {
  const { user } = useAuthStore();

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
    <div className="flex items-center justify-between py-3 px-6 lg:px-12 border-b border-border-s bg-surface sticky top-0 z-[100]">
      <div className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-txt flex items-center gap-2"></div>

      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-[4px] flex items-center justify-center cursor-pointer relative transition-all duration-200 hover:bg-glass border border-transparent hover:border-border-s group">
          <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-surface" />
          <Bell
            size={18}
            className="text-txt-muted transition-colors group-hover:text-txt"
          />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border-s">
          <button className="group relative flex items-center justify-center">
            <div
              className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-[family-name:var(--font-dm)] text-[11px] font-bold tracking-tighter cursor-pointer transition-colors border border-border-s ${getAvatarColor(
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
