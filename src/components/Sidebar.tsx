"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  Settings, 
  Stethoscope as StethoscopeIcon,
  Cog as CogIcon
} from "lucide-react";
import Image from "next/image";


// Mapeamento de ícones
const iconMap = {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope: StethoscopeIcon,
  Bell,
  Settings,
  Clock,
  Cog: CogIcon,
} as const;

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
//   const { items: sidebarItems, isLoading, error } = useSidebar();

  const sidebarItems = [
      { href: "/dashboard", name: "Home", icon: "LayoutDashboard" },
      { href: "/dashboard/services", name: "Serviços", icon: "Cog" },
      { href: "/dashboard/messages", name: "Mensagens", icon: "Bell" },
      { href: "/dashboard/audit", name: "Auditoria", icon: "Clock" },
    ];

  const currentItem = useMemo(() => {
    return sidebarItems.find((item) => item.href === pathname);
  }, [pathname, sidebarItems]);

  const handleLogout = async () => {
    // await logout();
  };

  return (
    <SidebarProvider>
      <div
        className={cn(
          "transition-width duration-300 flex flex-col border-r shadow-sm fixed left-0 top-0 h-full z-50",
          "w-64 bg-[#202AD0]"
        )}
      >
        {/* HEADER */}
        <SidebarHeader className="p-4 ">

          <div className="flex items-center justify-start">
              <Image src="/logo-dm-white.png" alt="Logo" width={50} height={100} />
          </div>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <SidebarMenu>
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;

              return (
                <SidebarMenuItem key={item.href}>

                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium border-l-4 rounded-none w-full text-left",
                        isActive
                          ? "text-white font-bold"
                          : "border-transparent text-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          isActive ? "text-white" : "text-white"
                        )}
                      />
                      {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            </SidebarMenu>
          </nav>
        </SidebarContent>

        {/* FOOTER */}
      </div>
      <SidebarInset className={cn(
        "bg-[#C2C2C240] flex items-center min-h-screen transition-all duration-300",
       "ml-64"
      )}>
         <div className="w-full h-16 bg-white" />
        <main className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
       
          {/* Conteúdo centralizado */}
          <div className="w-full">
            
            {children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
