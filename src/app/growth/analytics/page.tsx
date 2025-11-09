"use client";
import { PieChart, TrendingUp, Eye, Heart, Share2, Users } from "lucide-react";

export default function MarketingAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Marketing Analytics</h1>
          <p className="text-sm text-zinc-400 mt-1">Track social media performance and campaign metrics</p>
        </div>
      </div>

      {/* Social Media Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Followers</div>
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
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Reach</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Eye className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Engagement</div>
              <div className="text-2xl font-bold text-white">0%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <Heart className="h-6 w-6 text-rose-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Growth Rate</div>
              <div className="text-2xl font-bold text-emerald-400">+0%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <PieChart className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Marketing Analytics Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Track Instagram, YouTube, TikTok performance including followers, reach, engagement, and campaign ROI.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <button className="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300 hover:bg-rose-500/15 transition-colors font-medium">
            <Share2 className="h-4 w-4" />
            Connect Instagram
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/15 transition-colors font-medium">
            <Share2 className="h-4 w-4" />
            Connect YouTube
          </button>
        </div>
      </div>
    </div>
  );
}

