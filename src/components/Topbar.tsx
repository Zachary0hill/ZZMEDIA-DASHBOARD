"use client";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useUIStore } from "@/store/app";
import { useShallow } from "zustand/react/shallow";
import { CommandPalette } from "./CommandPalette";
import { ProfileDropdown } from "./ProfileDropdown";
import { SettingsDropdown } from "./SettingsDropdown";

export default function Topbar() {
  // Use a stable selector with zustand/react/shallow or separate selects
  const { toggleSidebar, sidebarOpen } = useUIStore(
    useShallow((s) => ({
      toggleSidebar: s.toggleSidebar,
      sidebarOpen: s.sidebarOpen,
    }))
  );
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Cmd+K / Ctrl+K to open command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/20 bg-black/40 backdrop-blur-2xl shadow-2xl shadow-black/20">
        <div className="flex h-16 items-center gap-4 px-6">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
          <button 
            onClick={() => setCommandPaletteOpen(true)}
            className="relative ml-1 flex-1 max-w-2xl group"
          >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
            <div className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-20 text-sm text-zinc-500 text-left group-hover:bg-white/10 group-hover:border-white/20 transition-all cursor-pointer">
              Search pages, features, actions...
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-zinc-400 font-mono">⌘</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] text-zinc-400 font-mono">K</kbd>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <SettingsDropdown />
            <ProfileDropdown />
          </div>
      </div>
    </header>

    {/* Command Palette Modal */}
    <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
  </>
  );
}


