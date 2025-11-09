"use client";
import { Share2, TrendingUp, Users, Heart, Eye, MessageCircle } from "lucide-react";

export default function SocialMediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Social Media Overview</h1>
          <p className="text-sm text-zinc-400 mt-1">Track performance across all social platforms</p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-pink-500">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl">📸</div>
            <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full">
              Instagram
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Followers</span>
              <span className="font-semibold text-white">0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Engagement</span>
              <span className="font-semibold text-pink-400">0%</span>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl">📹</div>
            <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
              YouTube
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Subscribers</span>
              <span className="font-semibold text-white">0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Views (30d)</span>
              <span className="font-semibold text-red-400">0</span>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl">🎵</div>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
              TikTok
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Followers</span>
              <span className="font-semibold text-white">0</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Likes</span>
              <span className="font-semibold text-cyan-400">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
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
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Engagement</div>
              <div className="text-2xl font-bold text-rose-400">0%</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <Heart className="h-6 w-6 text-rose-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Total Reach</div>
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
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Comments</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <Share2 className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Social Media Overview Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Connect Instagram, YouTube, TikTok, and other platforms to track all your social metrics in one place.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <button className="inline-flex items-center gap-2 rounded-lg border border-pink-500/20 bg-pink-500/10 px-4 py-2.5 text-sm text-pink-300 hover:bg-pink-500/15 transition-colors font-medium">
            Connect Instagram
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/15 transition-colors font-medium">
            Connect YouTube
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium">
            Connect TikTok
          </button>
        </div>
      </div>
    </div>
  );
}

