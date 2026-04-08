"use client";

import { usePathname } from "next/navigation";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSandbox = pathname?.includes("/sandbox");
  const isProjectPage = pathname?.includes("/projects/") && !isSandbox;

  if (isSandbox) {
    return <div className="bg-void min-h-screen text-txt">{children}</div>;
  }

  return (
    <div className="flex bg-void min-h-screen text-txt">
      {!isProjectPage && <LeftSidebar />}
      <div className="flex-1 min-w-[600px] flex flex-col relative overflow-hidden">
        {/* <TopBar /> */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
