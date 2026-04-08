"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import { useAuthStore, useUserStore } from "@/lib/stores";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const { profile, profileLoading, fetchProfile } = useUserStore();

  const isSandbox = pathname?.includes("/sandbox");
  // Hide sidebar only on individual project detail pages, not the browse page
  const isProjectDetailPage =
    pathname?.match(/\/dashboard\/projects\/[^/]+/) != null && !isSandbox;

  // Fetch user profile once auth resolves
  useEffect(() => {
    if (!authLoading && user && !profile && !profileLoading) {
      user.getIdToken().then((token) => fetchProfile(token));
    }
  }, [authLoading, user, profile, profileLoading, fetchProfile]);

  // Redirect to onboarding if the user is new (missing preferences)
  useEffect(() => {
    if (!authLoading && !profileLoading && profile?.is_new) {
      router.replace("/onboarding");
    }
  }, [authLoading, profileLoading, profile, router]);

  if (isSandbox) {
    return <div className="bg-void min-h-screen text-txt">{children}</div>;
  }

  return (
    <div className="flex bg-surface min-h-screen text-txt">
      {!isProjectDetailPage && <LeftSidebar />}
      <div className="flex-1 min-w-[600px] flex flex-col relative overflow-hidden">
        {/* <TopBar /> */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
