import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface UIState {
  sidebarOpen: boolean;
  theme: ThemeMode;
  navGroupsOpen: Record<string, boolean>;
  toggleSidebar: () => void;
  setTheme: (mode: ThemeMode) => void;
  toggleNavGroup: (label: string) => void;
  setNavGroupOpen: (label: string, open: boolean) => void;
  openOnlyNavGroup: (label: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: (typeof window !== "undefined" && (localStorage.getItem("theme") as ThemeMode)) || "dark",
  navGroupsOpen:
    (typeof window !== "undefined" && JSON.parse(localStorage.getItem("navGroupsOpen") || "{}")) || {},
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setTheme: (mode) => {
    if (typeof window !== "undefined") localStorage.setItem("theme", mode);
    set({ theme: mode });
  },
  toggleNavGroup: (label) =>
    set((state) => {
      const updated = { ...state.navGroupsOpen, [label]: !state.navGroupsOpen?.[label] };
      if (typeof window !== "undefined") localStorage.setItem("navGroupsOpen", JSON.stringify(updated));
      return { navGroupsOpen: updated } as Partial<UIState> as UIState;
    }),
  setNavGroupOpen: (label, open) =>
    set((state) => {
      const updated = { ...state.navGroupsOpen, [label]: open };
      if (typeof window !== "undefined") localStorage.setItem("navGroupsOpen", JSON.stringify(updated));
      return { navGroupsOpen: updated } as Partial<UIState> as UIState;
    }),
  openOnlyNavGroup: (label) =>
    set((state) => {
      // Close all groups and only open the specified one
      const updated = Object.keys(state.navGroupsOpen).reduce((acc, key) => {
        acc[key] = key === label;
        return acc;
      }, {} as Record<string, boolean>);
      updated[label] = true; // Ensure the target is open
      if (typeof window !== "undefined") localStorage.setItem("navGroupsOpen", JSON.stringify(updated));
      return { navGroupsOpen: updated } as Partial<UIState> as UIState;
    }),
}));


