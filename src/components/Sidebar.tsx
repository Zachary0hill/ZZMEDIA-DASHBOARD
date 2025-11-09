"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import schema from "../navigation_schema.json";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/app";
import {
  Home,
  Briefcase,
  Users,
  FolderKanban,
  Flame,
  Mail,
  Calendar,
  Wallet,
  Receipt,
  CreditCard,
  BarChart3,
  RefreshCcw,
  Repeat,
  Settings,
  Camera,
  UserCheck,
  Workflow,
  FileCheck,
  Users2,
  TrendingUp,
  PieChart,
  Target,
  Filter,
  Share2,
  Handshake,
  Award,
  Zap,
  Bot,
  Plug,
  Code,
  Palette,
  Paintbrush,
  Download,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Icon component mapper
const IconComponent = ({ name, className }: { name?: string; className?: string }) => {
  if (!name) return null;
  const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Home,
    Briefcase,
    Users,
    FolderKanban,
    Flame,
    Mail,
    Calendar,
    Wallet,
    Receipt,
    CreditCard,
    BarChart3,
    RefreshCcw,
    Repeat,
    Settings,
    Camera,
    UserCheck,
    Workflow,
    FileCheck,
    Users2,
    TrendingUp,
    PieChart,
    Target,
    Filter,
    Share2,
    Handshake,
    Award,
    Zap,
    Bot,
    Plug,
    Code,
    Palette,
    Paintbrush,
    Download,
    ChevronDown,
    ChevronRight,
  };
  const IconCmp = ICON_MAP[name];
  if (!IconCmp) return null;
  return <IconCmp className={className} />;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, navGroupsOpen, setNavGroupOpen, openOnlyNavGroup } = useUIStore();
  const [mounted, setMounted] = useState(false);

  // Ensure client-only behaviors run after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-open the group that contains the active route (client only)
  useEffect(() => {
    if (!mounted) return;
    
    let activeGroup: string | null = null;
    schema.nav.forEach((item: any) => {
      if (!item.path && item.children?.some((c: any) => c.path === pathname)) {
        activeGroup = item.label;
      }
    });

    // Open the active group on mount
    if (activeGroup) {
      setNavGroupOpen(activeGroup, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, mounted]);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-black/60 backdrop-blur-2xl border-r border-white/20 transition-[width] duration-300 flex flex-col shadow-2xl shadow-black/50",
        sidebarOpen ? "w-72" : "w-16"
      )}
      aria-label="Primary"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-6 border-b border-white/10">
        <div className="flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="ZZ Media Logo" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              // Fallback to text if image fails to load
              e.currentTarget.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'text-sm font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent';
              fallback.textContent = 'ZZ Media';
              e.currentTarget.parentElement!.appendChild(fallback);
            }}
          />
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 custom-scrollbar">
        {schema.nav.map((item: any, idx: number) => {
          // Single navigation item (no children)
          if (item.path) {
            const active = mounted && pathname === item.path;
            return (
              <Link
                key={idx}
                href={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all relative overflow-hidden backdrop-blur-xl border",
                  active 
                    ? "bg-gradient-to-br from-cyan-400/25 to-teal-500/15 text-white shadow-2xl shadow-cyan-400/20 border-cyan-400/30" 
                    : "text-zinc-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/10"
                )}
              >
                {mounted && active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/15 to-transparent opacity-70" />
                )}
                <div className={cn(
                  "relative z-10 flex items-center justify-center w-9 h-9 rounded-lg transition-all backdrop-blur-xl",
                  active 
                    ? "bg-gradient-to-br from-cyan-400/40 to-teal-500/30 text-cyan-300 shadow-lg shadow-cyan-500/30" 
                    : "bg-white/5 text-zinc-400 group-hover:bg-white/15 group-hover:text-zinc-200"
                )}>
                  <IconComponent name={item.icon} className="h-4 w-4" />
                </div>
                {sidebarOpen && (
                  <span className="relative z-10 truncate">{item.label}</span>
                )}
              </Link>
            );
          }
          
          // Navigation group (with children)
          const isOpen = mounted && !!navGroupsOpen[item.label];
          const hasActiveChild = mounted && item.children?.some((c: any) => c.path === pathname);
          const childCount = item.children?.length || 0;
          
          return (
            <div key={idx} className="space-y-1">
              <button
                onClick={(e) => {
                  // Shift+Click allows keeping multiple groups open
                  if (e.shiftKey) {
                    setNavGroupOpen(item.label, !isOpen);
                  } else {
                    if (isOpen) {
                      setNavGroupOpen(item.label, false);
                    } else {
                      openOnlyNavGroup(item.label);
                    }
                  }
                }}
                className={cn(
                  "group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs uppercase tracking-wider font-bold transition-all",
                  hasActiveChild 
                    ? "text-teal-400 bg-teal-400/10" 
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                )}
                aria-expanded={isOpen ? true : false}
                aria-controls={`nav-group-${idx}`}
              >
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-all",
                  hasActiveChild
                    ? "bg-teal-400/20 text-teal-400"
                    : "bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-zinc-200"
                )}>
                  <IconComponent name={item.icon} className="h-4 w-4" />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded">
                        {childCount}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                    </div>
                  </>
                )}
              </button>
              
              {isOpen && sidebarOpen && (
                <div 
                  id={`nav-group-${idx}`} 
                  className="space-y-0.5 pl-3 animate-in slide-in-from-top-2 duration-200"
                >
                  {item.children?.map((child: any, i: number) => {
                    const active = mounted && pathname === child.path;
                    return (
                      <Link
                        key={i}
                        href={child.path}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all relative",
                          active 
                            ? "bg-white/5 text-teal-400 font-medium" 
                            : "text-zinc-300 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-md transition-all flex-shrink-0",
                          active 
                            ? "bg-teal-400/20 text-teal-400" 
                            : "bg-transparent text-zinc-400 group-hover:bg-white/5 group-hover:text-zinc-200"
                        )}>
                          <IconComponent name={child.icon} className="h-3.5 w-3.5" />
                        </div>
                        <span className="flex-1 truncate">{child.label}</span>
                        {child.badge && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded-full px-1.5">
                            {child.badge}
                          </span>
                        )}
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-teal-400 rounded-r-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
