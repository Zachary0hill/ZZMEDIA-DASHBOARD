"use client";
import { create } from "zustand";

export type UserProfile = {
  name: string;
  email: string;
  company?: string;
  title?: string;
  phone?: string;
  avatarUrl?: string | null;
};

type UserState = {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
};

const defaultProfile: UserProfile = {
  name: "Admin User",
  email: "admin@zzmedia.com",
  company: "ZZ Media",
  title: "Owner",
  phone: "",
  avatarUrl: null,
};

export const useUserStore = create<UserState>((set) => ({
  profile:
    (typeof window !== "undefined" &&
      (() => {
        try {
          const raw = localStorage.getItem("userProfile");
          return raw ? (JSON.parse(raw) as UserProfile) : defaultProfile;
        } catch {
          return defaultProfile;
        }
      })()) || defaultProfile,
  updateProfile: (updates) =>
    set((state) => {
      const next = { ...state.profile, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem("userProfile", JSON.stringify(next));
      }
      return { profile: next };
    }),
  resetProfile: () =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
      }
      return { profile: defaultProfile };
    }),
}));


