"use client";
import { useState, useEffect, useRef } from "react";
import { Settings, Lock, Download, FileText, Bell, Palette, Database } from "lucide-react";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { ExportDataModal } from "./ExportDataModal";
import { NotificationSettingsModal } from "./NotificationSettingsModal";
import { FinancialStatementsModal } from "./FinancialStatementsModal";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFinancialStatements, setShowFinancialStatements] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const router = useRouter();

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
        className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-zinc-200 hover:bg-white/15 hover:text-white transition-all shadow-sm"
        aria-label="Settings menu"
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && mounted && createPortal(
        <div
          ref={menuRef}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className="fixed -translate-x-full w-72 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[9999] max-h-[calc(100vh-5rem)] overflow-y-auto"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 bg-white/5">
            <h3 className="text-sm font-semibold text-white">Settings</h3>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button 
              onClick={() => {
                setShowChangePassword(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Lock className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Change Password
                </div>
                <div className="text-xs text-zinc-500">Update your password</div>
              </div>
            </button>

            <button 
              onClick={() => {
                setShowExportData(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Download className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Export Data
                </div>
                <div className="text-xs text-zinc-500">Download all your data</div>
              </div>
            </button>

            <button 
              onClick={() => {
                setShowFinancialStatements(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <FileText className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Financial Statements
                </div>
                <div className="text-xs text-zinc-500">Export P&L, balance sheet</div>
              </div>
            </button>

            <button 
              onClick={() => {
                setShowNotifications(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Bell className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Notifications
                </div>
                <div className="text-xs text-zinc-500">Customize alerts & reminders</div>
              </div>
            </button>

            <button 
              onClick={() => {
                router.push("/branding/editor");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Palette className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Brand Settings
                </div>
                <div className="text-xs text-zinc-500">Logo, colors, fonts</div>
              </div>
            </button>

            <button 
              onClick={() => {
                router.push("/branding/backup");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Database className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  Backup Settings
                </div>
                <div className="text-xs text-zinc-500">Auto-backup configuration</div>
              </div>
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Modals */}
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} />
      <ExportDataModal isOpen={showExportData} onClose={() => setShowExportData(false)} />
      <NotificationSettingsModal isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
      <FinancialStatementsModal isOpen={showFinancialStatements} onClose={() => setShowFinancialStatements(false)} />
    </div>
  );
}

