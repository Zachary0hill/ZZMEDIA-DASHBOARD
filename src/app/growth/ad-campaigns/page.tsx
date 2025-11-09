"use client";
import { Target, Plus, DollarSign, TrendingUp, MousePointer, Eye } from "lucide-react";

export default function AdCampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Ad Campaigns & Ad Planner</h1>
          <p className="text-sm text-zinc-400 mt-1">Track paid advertising performance and ROI</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Spend</div>
              <div className="text-2xl font-bold text-white">$0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-rose-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">ROAS</div>
              <div className="text-2xl font-bold text-emerald-400">0x</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">CTR</div>
              <div className="text-2xl font-bold text-white">0%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <MousePointer className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Impressions</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <Target className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Ad Campaigns Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Track ROAS, CTR, spend, and conversions for paid ads (Facebook, Google, TikTok).
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Create First Campaign
        </button>
      </div>
    </div>
  );
}

