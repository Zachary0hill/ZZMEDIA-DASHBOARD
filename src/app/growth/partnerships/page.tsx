"use client";
import { Handshake, Plus, Users, DollarSign, TrendingUp } from "lucide-react";

export default function PartnershipsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Partnerships & Affiliates</h1>
          <p className="text-sm text-zinc-400 mt-1">Track referrals, partnerships, and collaboration opportunities</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Partnership
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Active Partners</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Referrals</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Handshake className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Revenue Generated</div>
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
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <Handshake className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Partnerships & Affiliates Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Track who brings in new clients, manage referral programs, and collaboration opportunities.
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add First Partner
        </button>
      </div>
    </div>
  );
}

