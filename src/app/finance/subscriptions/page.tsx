"use client";
import { RefreshCcw, Plus, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-zinc-400 mt-1">Track recurring SaaS tools and software expenses</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Subscription
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Monthly Total</div>
              <div className="text-2xl font-bold text-white">$0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <RefreshCcw className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Annual Spend</div>
              <div className="text-2xl font-bold text-white">$0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Active Subs</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Renewing Soon</div>
              <div className="text-2xl font-bold text-white">0</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="card p-8 text-center">
        <RefreshCcw className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Subscription Tracking Coming Soon</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Automatically track all your SaaS tools, software subscriptions, and recurring expenses.
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Add Your First Subscription
        </button>
      </div>
    </div>
  );
}

