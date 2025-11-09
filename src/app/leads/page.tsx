"use client";
import { useState } from "react";
import { Flame, Plus, Mail, Phone, DollarSign, Calendar, Trash2, Edit } from "lucide-react";

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads / Hot Prospects</h1>
          <p className="text-sm text-zinc-400 mt-1">Track and manage your sales pipeline</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Lead
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Hot Leads</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Flame className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Warm Leads</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Pipeline Value</div>
              <div className="text-2xl font-bold text-emerald-400">$0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Conversion Rate</div>
              <div className="text-2xl font-bold text-white">0%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table Placeholder */}
      <div className="card p-8 text-center">
        <Flame className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Lead Management Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Track hot prospects, manage your sales pipeline, and convert leads into clients.
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Your First Lead
        </button>
      </div>
    </div>
  );
}

