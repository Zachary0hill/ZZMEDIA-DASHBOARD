"use client";
import { Plug, CheckCircle, XCircle, Clock, Settings } from "lucide-react";

const integrations = [
  { name: "QuickBooks", status: "connected", icon: "💼", category: "Accounting" },
  { name: "Stripe", status: "connected", icon: "💳", category: "Payments" },
  { name: "Notion", status: "disconnected", icon: "📝", category: "Productivity" },
  { name: "Google Calendar", status: "disconnected", icon: "📅", category: "Calendar" },
  { name: "Google Drive", status: "disconnected", icon: "📁", category: "Storage" },
  { name: "Frame.io", status: "disconnected", icon: "🎬", category: "Video Review" },
  { name: "Calendly", status: "disconnected", icon: "🗓️", category: "Scheduling" },
  { name: "n8n", status: "disconnected", icon: "🔄", category: "Automation" },
  { name: "Airtable", status: "disconnected", icon: "📊", category: "Database" },
  { name: "Zapier", status: "disconnected", icon: "⚡", category: "Automation" },
  { name: "Dropbox", status: "disconnected", icon: "📦", category: "Storage" },
  { name: "Slack", status: "disconnected", icon: "💬", category: "Communication" },
];

export default function IntegrationsPage() {
  const connected = integrations.filter(i => i.status === "connected").length;
  const available = integrations.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Integrations</h1>
          <p className="text-sm text-zinc-400 mt-1">Connect your favorite tools and services</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Connected</div>
              <div className="text-2xl font-bold text-emerald-400">{connected}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Available</div>
              <div className="text-2xl font-bold text-white">{available}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Plug className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-zinc-400 mb-1 font-medium">Pending Setup</div>
              <div className="text-2xl font-bold text-white">{available - connected}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Integration Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div 
              key={integration.name}
              className="card p-5 hover:bg-white/5 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{integration.name}</div>
                    <div className="text-xs text-zinc-500">{integration.category}</div>
                  </div>
                </div>
                {integration.status === "connected" ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-zinc-600" />
                )}
              </div>
              
              {integration.status === "connected" ? (
                <button className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 transition-colors font-medium flex items-center justify-center gap-2">
                  <Settings className="h-3.5 w-3.5" />
                  Configure
                </button>
              ) : (
                <button className="w-full rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-500/15 transition-colors font-medium">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

