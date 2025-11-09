import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { Money } from "@/components/Money";
import nextDynamic from "next/dynamic";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FolderKanban, 
  ArrowUpRight,
  UserPlus,
  Plus,
  FileText,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const FinancialChart = nextDynamic(
  () => import("@/components/FinancialChart").then((m) => m.FinancialChart),
  { loading: () => <div className="glass-card p-6 border-white/20 h-80 animate-pulse" /> }
);

type Invoice = {
  id: string;
  status: "draft" | "sent" | "paid" | "overdue";
  issue_date?: string | null;
  due_date?: string | null;
  total?: number | null;
  amount_paid?: number | null;
};

type Expense = {
  id: string;
  date?: string | null;
  amount?: number | null;
};

type Project = {
  id: string;
  name: string;
  status: string;
  budget_hours?: number | null;
  hours_used?: number | null;
  due_date?: string | null;
};

type Client = {
  id: string;
  status: string;
};

type Retainer = {
  id: string;
  name: string;
  status: string;
  billing_cycle?: string | null;
  next_billing_date?: string | null;
  amount?: number | null;
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchArray<T>(endpoint: string, label: string): Promise<T[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}${endpoint}`, {
      cache: "no-store",
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Accept': 'application/json',
      }
    });
    if (!res.ok) {
      console.error(`${label} API returned:`, res.status);
      return [];
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Avoid throwing on HTML/other responses (e.g., redirects)
      const snippet = (await res.text().catch(() => '')).slice(0, 120);
      console.error(`${label} API returned non-JSON:`, contentType, snippet);
      return [];
    }
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch (e) {
    console.error(`Error fetching ${label.toLowerCase()}:`, e);
    return [];
  }
}

async function getProjects(): Promise<Project[]> {
  return fetchArray<Project>('/api/projects', 'Projects');
}

async function getClients(): Promise<Client[]> {
  return fetchArray<Client>('/api/clients', 'Clients');
}

async function getInvoices(): Promise<Invoice[]> {
  return fetchArray<Invoice>('/api/invoices', 'Invoices');
}

async function getExpenses(): Promise<Expense[]> {
  return fetchArray<Expense>('/api/expenses', 'Expenses');
}

async function getRetainers(): Promise<Retainer[]> {
  return fetchArray<Retainer>('/api/retainers', 'Retainers');
}

export default async function Home() {
  const [projects, clients, invoices, expenses, retainers] = await Promise.all([
    getProjects(),
    getClients(),
    getInvoices(),
    getExpenses(),
    getRetainers(),
  ]);
  
  const now = new Date();
  const year = now.getFullYear();
  const monthIndex0 = now.getMonth();
  
  // Revenue: sum of paid invoices in the current month
  const startOfMonth = new Date(year, monthIndex0, 1);
  const startIso = startOfMonth.toISOString().slice(0, 10);
  const nextMonthIso = new Date(year, monthIndex0 + 1, 1).toISOString().slice(0, 10);
  const revenue = invoices
    .filter((i) => i.status === 'paid')
    .filter((i) => {
      const d = (i.issue_date || '').slice(0, 10);
      return d >= startIso && d < nextMonthIso;
    })
    .reduce((sum: number, i) => sum + (Number(i.amount_paid ?? 0) || Number(i.total ?? 0) || 0), 0);
  const spend = expenses
    .filter((e) => {
      const d = (e.date || '').slice(0, 10);
      return d >= startIso && d < nextMonthIso;
    })
    .reduce((sum: number, e) => sum + (Number(e.amount) || 0), 0);
  const net = revenue - spend;
  
  // Project stats
  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "planned" || p.status === "blocked");
  const totalProjects = projects.length;
  
  // Overdue invoices
  const overdueInvoices = invoices.filter((i) => {
    if (i.status === 'paid' || !i.due_date) return false;
    return new Date(i.due_date) < now;
  });
  
  // Outstanding invoice amount
  // (not displayed in UI) kept if needed later:
  // const outstanding = invoices
  //   .filter((i) => i.status === 'sent' || i.status === 'overdue')
  //   .reduce((sum: number, i) => sum + ((i.total || 0) - (i.amount_paid || 0)), 0);
  
  // MRR from active retainers
  // (not displayed in UI) kept if needed later:
  // const mrr = retainers
  //   .filter((r) => r.status === 'active' && r.billing_cycle === 'monthly')
  //   .reduce((sum: number, r) => sum + (r.amount || 0), 0);
  
  // Calculate 6-month financial data for chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const financialData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(year, monthIndex0 - i, 1);
    const monthKey = months[date.getMonth()];
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().slice(0, 10);
    
    const monthRevenue = invoices
      .filter((i) => i.status === 'paid')
      .filter((i) => {
        const d = (i.issue_date || '').slice(0, 10);
        return d >= monthStart && d < monthEnd;
      })
      .reduce((sum: number, i) => sum + (i.total || 0), 0);
    
    const monthExpenses = expenses
      .filter((e) => {
        const d = (e.date || '').slice(0, 10);
        return d >= monthStart && d < monthEnd;
      })
      .reduce((sum: number, e) => sum + (e.amount || 0), 0);
    
    financialData.push({
      month: monthKey,
      revenue: Math.round(monthRevenue),
      expenses: Math.round(monthExpenses),
      profit: Math.round(monthRevenue - monthExpenses)
    });
  }
  
  // Upcoming subscription renewals (next 30 days)
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingRenewals = retainers.filter((r: any) => {
    if (r.status !== 'active' || !r.next_billing_date) return false;
    const renewalDate = new Date(r.next_billing_date);
    return renewalDate >= now && renewalDate <= thirtyDaysFromNow;
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
            Dashboard Overview
          </h1>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <Link 
            href="/crm"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Add Client
          </Link>
          <Link 
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all font-medium"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
          <Link 
            href="/finance/invoices"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all font-medium"
          >
            <FileText className="h-4 w-4" />
            New Invoice
          </Link>
          <Link 
            href="/finance/expenses"
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm text-cyan-400 hover:bg-cyan-400/15 transition-all font-medium"
          >
            <CreditCard className="h-4 w-4" />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Revenue Card */}
        <div className="glass-card gradient-emerald p-5 relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 transition-all border-emerald-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-400/20 backdrop-blur-xl border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-300" />
              </div>
              <span className="text-xs font-black text-emerald-300 bg-emerald-400/20 px-3 py-1.5 rounded-full border border-emerald-400/30 backdrop-blur-xl">
                +12.5%
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Revenue This Month</div>
              <div className="text-2xl font-black text-white">
                <Money amount={revenue} />
              </div>
            </div>
          </div>
        </div>

        {/* Spend Card */}
        <div className="glass-card gradient-rose p-5 relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/20 transition-all border-rose-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-rose-400/20 backdrop-blur-xl border border-rose-400/30 shadow-lg shadow-rose-500/20">
                <TrendingDown className="h-5 w-5 text-rose-300" />
              </div>
              <span className="text-xs font-black text-rose-300 bg-rose-400/20 px-3 py-1.5 rounded-full border border-rose-400/30 backdrop-blur-xl">
                +8.2%
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Spend This Month</div>
              <div className="text-2xl font-black text-white">
                <Money amount={spend} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="glass-card gradient-cyan p-5 relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-400/20 transition-all border-cyan-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-400/20 backdrop-blur-xl border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
                <FolderKanban className="h-5 w-5 text-cyan-300" />
              </div>
              <Link href="/projects" className="text-xs font-bold text-zinc-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                View <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Projects</div>
              <div className="text-2xl font-black text-white flex items-baseline gap-2">
                {activeProjects.length}
                <span className="text-sm font-semibold text-zinc-500">of {totalProjects}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="glass-card gradient-blue p-5 relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 transition-all border-blue-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-400/20 backdrop-blur-xl border border-blue-400/30 shadow-lg shadow-blue-500/20">
                <DollarSign className="h-5 w-5 text-blue-300" />
              </div>
              <span className="text-xs font-black text-blue-300 bg-blue-400/20 px-3 py-1.5 rounded-full border border-blue-400/30 backdrop-blur-xl">
                {revenue > 0 ? Math.round((net / revenue) * 100) : 0}%
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Net Profit</div>
              <div className={`text-2xl font-black ${net >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                <Money amount={net} />
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Invoices Card */}
        <div className="glass-card gradient-amber p-5 relative overflow-hidden group hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 transition-all border-amber-400/30">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-400/20 backdrop-blur-xl border border-amber-400/30 shadow-lg shadow-amber-500/20">
                <AlertTriangle className="h-5 w-5 text-amber-300" />
              </div>
              <Link href="/finance/invoices" className="text-xs font-bold text-zinc-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                View <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Overdue Invoices</div>
              <div className="text-2xl font-black text-amber-300">{overdueInvoices.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Financial Chart - Takes 2 columns */}
        <section className="xl:col-span-2">
          <div className="glass-card p-6 border-white/20">
            <FinancialChart data={financialData} />
          </div>
        </section>

        {/* Right Sidebar */}
        <section className="space-y-6">
          {/* Active Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">Active Projects</h2>
              <Link href="/projects" className="text-xs font-bold text-zinc-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {activeProjects.slice(0, 5).map((p: any) => {
                const used = Number(p.hours_used ?? 0);
                const budget = Number(p.budget_hours ?? 0);
                const progress = budget > 0 ? Math.min(100, Math.round((used / budget) * 100)) : 0;
                
                return (
                  <div key={p.id} className="glass-card p-4 hover:bg-zinc-800/70 hover:border-cyan-400/30 transition-all border-white/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{p.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {p.due_date ? new Date(p.due_date).toLocaleDateString() : "No deadline"}
                        </div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
                            progress >= 90 ? "bg-rose-500" :
                            progress >= 70 ? "bg-amber-500" :
                            "bg-cyan-400"
                          }`}
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                      <span className="text-xs text-zinc-400 font-medium">{progress}%</span>
                    </div>
                  </div>
                );
              })}
              {activeProjects.length === 0 && (
                <div className="glass-card p-5 text-center text-zinc-400 text-sm font-medium border-white/20">
                  No active projects. <Link href="/projects" className="text-cyan-300 hover:text-cyan-200 font-bold">Create one</Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Subscription Renewals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">Upcoming Renewals</h2>
              <Link href="/finance/retainers" className="text-xs font-bold text-zinc-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {upcomingRenewals.slice(0, 4).map((r: any) => {
                const daysUntil = Math.ceil((new Date(r.next_billing_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={r.id} className="glass-card p-4 hover:bg-zinc-800/70 hover:border-emerald-400/30 transition-all border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{r.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5 font-medium">
                          {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                        </div>
                      </div>
                      <div className="text-sm font-black text-emerald-300">
                        <Money amount={r.amount} />
                      </div>
                    </div>
                  </div>
                );
              })}
              {upcomingRenewals.length === 0 && (
                <div className="glass-card p-5 text-center text-zinc-400 text-sm font-medium border-white/20">
                  No renewals in the next 30 days
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
