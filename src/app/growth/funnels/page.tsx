"use client";
import { Filter, Plus, Users, TrendingUp, Target, DollarSign } from "lucide-react";

export default function FunnelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Funnels & Offers</h1>
          <p className="text-sm text-zinc-400 mt-1">Create and track your sales funnels and offers</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          New Funnel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Active Funnels</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Filter className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Leads</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Conversion Rate</div>
              <div className="text-2xl font-bold text-emerald-400">0%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Revenue Generated</div>
              <div className="text-2xl font-bold text-white">$0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <Filter className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Funnels & Offers Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Build sales funnels, create offers, and track conversion rates from lead to client.
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Create First Funnel
        </button>
      </div>
    </div>
  );
}

