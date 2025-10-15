"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Stethoscope, LogOut, Clock } from "lucide-react";
// import { useSession } from "@/shared/hooks/useSession";
// import { useSidebar } from "@/shared/hooks/useSidebar";
import { cn } from "@/lib/utils";
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

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // const { logout } = useSession(false);
  // const { items: sidebarItems, isLoading, error } = useSidebar();

  const sidebarItems = [
    { href: "/dashboard", name: "Home", icon: "LayoutDashboard" },
    { href: "/dashboard/services", name: "Serviços", icon: "Cog" },
    { href: "/dashboard/messages", name: "Mensagens", icon: "Bell" },
    { href: "/dashboard/audit", name: "Auditoria", icon: "Clock" },
  ];

  const handleLogout = async () => {
    // await logout();
  };

  return (
    <>
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#202AD0] border-b border-gray-200 md:hidden">
        <div className="flex items-end justify-end px-4 py-3">
         
          {/* Botão do menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Overlay do menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Menu lateral */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header do menu */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="bg-[#202AD0] p-2 rounded-lg">
                <Image src="/logo-dm-white.png" alt="Logo" width={40} height={100} />
              </div>
              <span className="font-bold text-gray-900">DM Conta</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {
                sidebarItems.map((item: any) => {
                  const isActive = pathname === item.href;
                  const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-[#202AD0] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {/* <Icon className="h-5 w-5" /> */}
                      <Icon   name={item.icon} className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
                 })}
            </ul>
          </nav>

          {/* Footer com logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Espaçamento para o header fixo */}
      <div className="h-16 md:hidden" />
    </>
  );
}
