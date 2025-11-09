"use client";
import { Download, Upload, Database, Calendar, FileText } from "lucide-react";

export default function BackupExportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Backup / Export Data</h1>
          <p className="text-sm text-zinc-400 mt-1">Export data for accounting, reporting, and backups</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Download className="h-7 w-7 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Export All Data</h3>
              <p className="text-xs text-zinc-500">Download complete database backup</p>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Financial Report</h3>
              <p className="text-xs text-zinc-500">Export invoices, expenses, and revenue</p>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="h-7 w-7 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Client Data Export</h3>
              <p className="text-xs text-zinc-500">Export all client and project information</p>
            </div>
          </div>
        </div>

        <div className="card p-6 hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="h-7 w-7 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">Schedule Auto-Backup</h3>
              <p className="text-xs text-zinc-500">Set up automatic daily/weekly backups</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Backups */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Backups</h3>
          <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="text-center py-8 text-zinc-500 text-sm">
            No backups yet. Create your first backup to get started.
          </div>
        </div>
      </div>

      {/* Import Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Upload className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Import Data</h3>
            <p className="text-xs text-zinc-500">Restore from backup or import existing data</p>
          </div>
        </div>
        <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-white/20 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-zinc-600 mb-3" />
          <p className="text-sm text-zinc-400">Click to upload backup file</p>
          <p className="text-xs text-zinc-600 mt-1">JSON, CSV, or ZIP (max. 50MB)</p>
        </div>
      </div>
    </div>
  );
}

