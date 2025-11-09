"use client";
import { Code, Plus, Key, CheckCircle, AlertCircle, Activity } from "lucide-react";

export default function APIManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Management</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage API keys, webhooks, and automations</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          New API Key
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Active Keys</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Key className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Webhooks</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">API Calls (24h)</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Errors</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-rose-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <Code className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">API Management Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Manage webhooks for automations, connect client dashboards, and monitor API usage.
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Generate API Key
        </button>
      </div>
    </div>
  );
}

