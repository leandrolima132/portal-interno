"use client";

import { AppSidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { useIsMobile } from "@/hooks/useMobile";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <main className="p-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar>{children}</AppSidebar>
    </div>
  );
}
