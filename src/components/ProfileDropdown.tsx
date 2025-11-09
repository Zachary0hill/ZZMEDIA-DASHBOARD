"use client";
import { useState, useEffect, useRef } from "react";
import { User, UserCircle, LogOut, Camera } from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";
import { ChangePhotoModal } from "./ChangePhotoModal";
import { createPortal } from "react-dom";
import { useUserStore } from "@/store/user";
import { signOut, useSession } from "next-auth/react";

export function ProfileDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const { profile } = useUserStore();

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideTrigger = dropdownRef.current?.contains(target);
      const clickedInsideMenu = menuRef.current?.contains(target);
      if (!clickedInsideTrigger && !clickedInsideMenu) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // position the menu relative to the trigger button
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setCoords({ top: Math.round(rect.bottom + 8), left: Math.round(rect.right) });
      }
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/*
        To avoid hydration mismatches (server renders default profile while client
        may load a customized profile from localStorage), we render a stable
        placeholder until mounted, then show the actual user data.
      */}
      {(() => {
        const displayAvatarUrl = mounted ? profile.avatarUrl : null;
        const displayName = mounted ? (profile.name || "Admin User") : "Admin User";
        return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
        className="inline-flex items-center gap-3 h-12 rounded-xl border border-white/20 bg-white/10 pl-2 pr-4 text-zinc-200 hover:bg-white/15 hover:border-white/30 transition-all shadow-sm"
        aria-label="Profile menu"
      >
        {displayAvatarUrl ? (
          <img src={displayAvatarUrl} alt={displayName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-white" />
          </div>
        )}
        <span className="text-base font-medium text-zinc-200">
          {displayName}
        </span>
      </button>
        );
      })()}

      {isOpen && mounted && createPortal(
        <div
          ref={menuRef}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className="fixed -translate-x-full w-64 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[9999] max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          {/* Profile Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/5">
            <div className="flex items-center gap-3">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{profile.name || "Admin User"}</div>
                <div className="text-xs text-zinc-400">{profile.email || "admin@zzmedia.com"}</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button 
              onClick={() => {
                setShowEditProfile(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <UserCircle className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Edit Profile
                </div>
                <div className="text-xs text-zinc-500">Update name and details</div>
              </div>
            </button>

            <button 
              onClick={() => {
                setShowChangePhoto(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Camera className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Change Photo
                </div>
                <div className="text-xs text-zinc-500">Upload profile picture</div>
              </div>
            </button>
          </div>

          {/* Sign Out */}
          <div className="p-2 border-t border-white/10">
            <button 
              onClick={() => {
                signOut({ callbackUrl: "/signin" });
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-rose-500/10 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                <LogOut className="h-4 w-4 text-rose-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-rose-400">
                  {session ? "Sign Out" : "Signed Out"}
                </div>
              </div>
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Modals */}
      <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
      <ChangePhotoModal isOpen={showChangePhoto} onClose={() => setShowChangePhoto(false)} />
    </div>
  );
}

