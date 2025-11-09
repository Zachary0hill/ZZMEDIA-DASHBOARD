"use client";
import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import schema from "../navigation_schema.json";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/app";
import Image from "next/image";
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
  const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
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
  const [logoError, setLogoError] = useState(false);

  // Types for navigation schema imported from JSON
  type NavSingle = {
    label: string;
    path: string;
    icon?: string;
  };

  type NavChild = {
    label: string;
    path: string;
    icon?: string;
    badge?: string | number;
  };

  type NavGroup = {
    label: string;
    icon?: string;
    children: NavChild[];
  };

  type NavEntry = NavSingle | NavGroup;

  type NavigationSchema = {
    nav: NavEntry[];
  };

  const navSchema = schema as unknown as NavigationSchema;

  // Ensure client-only behaviors run after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-open the group that contains the active route (client only)
  useEffect(() => {
    if (!mounted) return;
    
    let activeGroup: string | null = null;
    navSchema.nav.forEach((item) => {
      if ("children" in item && item.children?.some((c) => c.path === pathname)) {
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
          {logoError ? (
            <div className="text-sm font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              ZZ Media
            </div>
          ) : (
            <Image
              src="/logo.png"
              alt="ZZ Media Logo"
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              onError={() => setLogoError(true)}
              priority
            />
          )}
        </div>
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1 custom-scrollbar">
        {navSchema.nav.map((item, idx: number) => {
          // Single navigation item (no children)
          if ("path" in item) {
            const active = mounted && pathname === (item as NavSingle).path;
            return (
              <Link
                key={idx}
                href={(item as NavSingle).path}
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
          const group = item as NavGroup;
          const isOpen = mounted && !!navGroupsOpen[group.label];
          const hasActiveChild = mounted && group.children?.some((c) => c.path === pathname);
          const childCount = group.children?.length || 0;
          
          return (
            <div key={idx} className="space-y-1">
              <button
                onClick={(e) => {
                  // Shift+Click allows keeping multiple groups open
                  if (e.shiftKey) {
                    setNavGroupOpen(group.label, !isOpen);
                  } else {
                    if (isOpen) {
                      setNavGroupOpen(group.label, false);
                    } else {
                      openOnlyNavGroup(group.label);
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
                  {group.children?.map((child, i: number) => {
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
