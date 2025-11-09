"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ArrowRight, 
  Home,
  Users,
  FolderKanban,
  Flame,
  Mail,
  Calendar,
  Receipt,
  CreditCard,
  BarChart3,
  RefreshCcw,
  Repeat,
  Camera,
  UserCheck,
  Workflow,
  FileCheck,
  Users2,
  PieChart,
  Target,
  Filter,
  Share2,
  Handshake,
  Award,
  Bot,
  Plug,
  Code,
  Paintbrush,
  Download,
  Plus,
  FileText,
  UserPlus
} from "lucide-react";

const iconMap: any = {
  Home, Users, FolderKanban, Flame, Mail, Calendar, Receipt, CreditCard, 
  BarChart3, RefreshCcw, Repeat, Camera, UserCheck, Workflow, FileCheck,
  Users2, PieChart, Target, Filter, Share2, Handshake, Award, Bot, Plug,
  Code, Paintbrush, Download, Plus, FileText, UserPlus
};

// All searchable pages and actions
const searchableItems = [
  // Home
  { title: "Dashboard Overview", path: "/", icon: "Home", category: "Navigation", keywords: ["home", "dashboard", "overview"] },
  
  // Clients & Work
  { title: "CRM", path: "/crm", icon: "Users", category: "Clients & Work", keywords: ["clients", "crm", "contacts", "customers"] },
  { title: "Projects", path: "/projects", icon: "FolderKanban", category: "Clients & Work", keywords: ["projects", "work", "jobs"] },
  { title: "Leads / Hot Prospects", path: "/leads", icon: "Flame", category: "Clients & Work", keywords: ["leads", "prospects", "sales", "pipeline"] },
  { title: "Contact List", path: "/contacts", icon: "Mail", category: "Clients & Work", keywords: ["contacts", "email", "list", "subscribers"] },
  { title: "Calendar", path: "/calendar", icon: "Calendar", category: "Clients & Work", keywords: ["calendar", "schedule", "meetings", "shoots"] },
  
  // Finances
  { title: "Invoices", path: "/finance/invoices", icon: "Receipt", category: "Finances", keywords: ["invoices", "billing", "payments", "revenue"] },
  { title: "Expenses", path: "/finance/expenses", icon: "CreditCard", category: "Finances", keywords: ["expenses", "costs", "spending"] },
  { title: "Reports", path: "/finance/reports", icon: "BarChart3", category: "Finances", keywords: ["reports", "analytics", "financials", "profit"] },
  { title: "Subscriptions", path: "/finance/subscriptions", icon: "RefreshCcw", category: "Finances", keywords: ["subscriptions", "saas", "recurring"] },
  { title: "Recurring Clients", path: "/finance/retainers", icon: "Repeat", category: "Finances", keywords: ["retainers", "recurring", "mrr"] },
  
  // Operations
  { title: "Equipment & Studio", path: "/ops/equipment", icon: "Camera", category: "Operations", keywords: ["equipment", "gear", "studio", "cameras"] },
  { title: "Client Onboarding SOPs", path: "/ops/onboarding", icon: "UserCheck", category: "Operations", keywords: ["onboarding", "sop", "process"] },
  { title: "Workflow Templates", path: "/ops/workflows", icon: "Workflow", category: "Operations", keywords: ["workflows", "templates", "sop"] },
  { title: "Legal Documents", path: "/ops/legal", icon: "FileCheck", category: "Operations", keywords: ["legal", "contracts", "documents"] },
  { title: "Team Management", path: "/ops/team", icon: "Users2", category: "Operations", keywords: ["team", "staff", "contractors"] },
  
  // Growth
  { title: "Marketing Analytics", path: "/growth/analytics", icon: "PieChart", category: "Marketing", keywords: ["analytics", "marketing", "social", "metrics"] },
  { title: "Content Planner", path: "/growth/content-planner", icon: "Calendar", category: "Marketing", keywords: ["content", "planner", "social", "posts"] },
  { title: "Ad Campaigns", path: "/growth/ad-campaigns", icon: "Target", category: "Marketing", keywords: ["ads", "campaigns", "advertising", "roas"] },
  { title: "Funnels & Offers", path: "/growth/funnels", icon: "Filter", category: "Marketing", keywords: ["funnels", "offers", "sales"] },
  { title: "Social Media", path: "/growth/social", icon: "Share2", category: "Marketing", keywords: ["social", "instagram", "youtube", "tiktok"] },
  { title: "Partnerships", path: "/growth/partnerships", icon: "Handshake", category: "Marketing", keywords: ["partnerships", "affiliates", "referrals"] },
  { title: "Portfolio", path: "/growth/portfolio", icon: "Award", category: "Marketing", keywords: ["portfolio", "case studies", "work"] },
  
  // Automations
  { title: "AI Assistants", path: "/automations", icon: "Bot", category: "Automations", keywords: ["ai", "agents", "assistants", "automation"] },
  { title: "Integrations", path: "/integrations", icon: "Plug", category: "Automations", keywords: ["integrations", "connect", "apps"] },
  { title: "API Management", path: "/api-management", icon: "Code", category: "Automations", keywords: ["api", "webhooks", "developer"] },
  
  // Branding
  { title: "Brand Editor", path: "/branding/editor", icon: "Paintbrush", category: "Branding", keywords: ["brand", "logo", "colors", "fonts"] },
  { title: "Backup & Export", path: "/branding/backup", icon: "Download", category: "Branding", keywords: ["backup", "export", "data"] },
  
  // Quick Actions
  { title: "Add Client", path: "/crm", icon: "UserPlus", category: "Quick Actions", keywords: ["add", "new", "client", "create"], action: "add-client" },
  { title: "New Project", path: "/projects", icon: "Plus", category: "Quick Actions", keywords: ["new", "project", "create"], action: "new-project" },
  { title: "New Invoice", path: "/finance/invoices", icon: "FileText", category: "Quick Actions", keywords: ["invoice", "new", "create"], action: "new-invoice" },
  { title: "Add Expense", path: "/finance/expenses", icon: "CreditCard", category: "Quick Actions", keywords: ["expense", "add", "create"], action: "add-expense" },
];

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return searchableItems.slice(0, 8); // Show first 8 items when no query
    }

    const lowerQuery = query.toLowerCase();
    return searchableItems.filter(item => {
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.keywords.some(k => k.includes(lowerQuery))
      );
    }).slice(0, 12); // Limit results
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Navigate to item
  const navigateTo = (item: typeof searchableItems[0]) => {
    router.push(item.path);
    onClose();
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="relative border-b border-white/10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pages, features, or actions..."
            className="w-full bg-transparent px-12 py-4 text-base text-zinc-100 placeholder:text-zinc-500 outline-none"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-medium">
            ESC to close
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filteredItems.length > 0 ? (
            <div className="p-2">
              {Object.entries(
                filteredItems.reduce((acc, item) => {
                  if (!acc[item.category]) acc[item.category] = [];
                  acc[item.category].push(item);
                  return acc;
                }, {} as Record<string, typeof searchableItems>)
              ).map(([category, items]) => (
                <div key={category} className="mb-3 last:mb-0">
                  <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {items.map((item, idx) => {
                      const Icon = iconMap[item.icon];
                      return (
                        <button
                          key={idx}
                          onClick={() => navigateTo(item)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 transition-colors group"
                        >
                          {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                              <Icon className="h-4 w-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                              {item.title}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-500">No results found for "{query}"</p>
              <p className="text-xs text-zinc-600 mt-1">Try searching for pages, clients, or features</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-3 bg-white/5">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 text-zinc-400 font-mono">↑</kbd>
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 text-zinc-400 font-mono">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 text-zinc-400 font-mono">⏎</kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 rounded bg-white/10 border border-white/10 text-zinc-400 font-mono">ESC</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

