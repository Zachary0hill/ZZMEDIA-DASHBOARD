"use client";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";
import { Money } from "@/components/Money";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReportsPage() {
  const { data: invoices } = useSWR("/api/invoices", fetcher, { keepPreviousData: true });
  const { data: expenses } = useSWR("/api/expenses", fetcher, { keepPreviousData: true });
  const { data: retainers } = useSWR("/api/retainers", fetcher, { keepPreviousData: true });
  const { data: income } = useSWR("/api/income", fetcher, { keepPreviousData: true });

  // Calculate monthly revenue vs expenses data
  const revenueVsExpenses = useMemo(() => {
    const monthlyData: { [key: string]: { revenue: number, expenses: number } } = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const currentYear = now.getFullYear();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, now.getMonth() - i, 1);
      const monthKey = `${months[date.getMonth()]}`;
      monthlyData[monthKey] = { revenue: 0, expenses: 0 };
    }

    // Aggregate invoice revenue
    (invoices ?? []).forEach((inv: any) => {
      if (inv.issue_date) {
        const date = new Date(inv.issue_date);
        if (date.getFullYear() === currentYear) {
          const monthKey = months[date.getMonth()];
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].revenue += inv.total || 0;
          }
        }
      }
    });

    // Aggregate income
    (income ?? []).forEach((inc: any) => {
      if (inc.date) {
        const date = new Date(inc.date);
        if (date.getFullYear() === currentYear) {
          const monthKey = months[date.getMonth()];
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].revenue += inc.amount || 0;
          }
        }
      }
    });

    // Aggregate expenses
    (expenses ?? []).forEach((exp: any) => {
      if (exp.date) {
        const date = new Date(exp.date);
        if (date.getFullYear() === currentYear) {
          const monthKey = months[date.getMonth()];
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].expenses += exp.amount || 0;
          }
        }
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue),
      expenses: Math.round(data.expenses),
    }));
  }, [invoices, income, expenses]);

  // Calculate MRR from retainers
  const mrr = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = months[date.getMonth()] || `M${date.getMonth()}`;
      monthlyData[monthKey] = 0;
    }

    // Calculate MRR from active monthly retainers
    const activeRetainers = (retainers ?? []).filter((r: any) => r.status === "active" && r.billing_cycle === "monthly");
    const mrrValue = activeRetainers.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
    
    // Fill in the MRR for each month (assuming consistent)
    Object.keys(monthlyData).forEach(key => {
      monthlyData[key] = mrrValue;
    });

    return Object.entries(monthlyData).map(([m, v]) => ({ m, v: Math.round(v) }));
  }, [retainers]);

  // Calculate cash flow projection (13-week)
  const cashFlow = useMemo(() => {
    const currentBalance = 80000; // Starting balance (could be pulled from API)
    const weeklyData = [];
    
    // Calculate average weekly revenue and expenses
    const totalRevenue = revenueVsExpenses.reduce((sum, m) => sum + m.revenue, 0);
    const totalExpenses = revenueVsExpenses.reduce((sum, m) => sum + m.expenses, 0);
    const weeklyRevenue = totalRevenue / (revenueVsExpenses.length * 4.33);
    const weeklyExpenses = totalExpenses / (revenueVsExpenses.length * 4.33);
    const weeklyNet = weeklyRevenue - weeklyExpenses;

    let balance = currentBalance;
    for (let i = 0; i < 13; i++) {
      balance += weeklyNet;
      weeklyData.push({ w: `W${i + 1}`, balance: Math.round(balance) });
    }

    return weeklyData;
  }, [revenueVsExpenses]);

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categories: { [key: string]: { value: number, color: string } } = {
      software: { value: 0, color: "#3b82f6" },
      equipment: { value: 0, color: "#f59e0b" },
      marketing: { value: 0, color: "#8b5cf6" },
      contractor: { value: 0, color: "#ec4899" },
      travel: { value: 0, color: "#14b8a6" },
      office: { value: 0, color: "#10b981" },
      other: { value: 0, color: "#6b7280" },
    };

    (expenses ?? []).forEach((exp: any) => {
      const cat = exp.category || "other";
      if (categories[cat]) {
        categories[cat].value += exp.amount || 0;
      }
    });

    return Object.entries(categories)
      .filter(([_, data]) => data.value > 0)
      .map(([name, data]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Math.round(data.value),
        color: data.color,
      }));
  }, [expenses]);

  const currentMonth = revenueVsExpenses[revenueVsExpenses.length - 1] || { revenue: 0, expenses: 0 };
  const profit = currentMonth.revenue - currentMonth.expenses;
  const profitMargin = currentMonth.revenue > 0 ? Math.round((profit / currentMonth.revenue) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Cash Flow & Reports</h1>
          <p className="text-sm text-zinc-400 mt-1">Financial analytics and forecasting</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-300 hover:bg-blue-500/15 transition-colors font-medium">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
              +15%
            </span>
          </div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Revenue (MTD)</div>
          <div className="text-2xl font-bold text-white">
            <Money amount={currentMonth.revenue} />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <TrendingDown className="h-5 w-5 text-rose-400" />
            </div>
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full">
              +8%
            </span>
          </div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Expenses (MTD)</div>
          <div className="text-2xl font-bold text-white">
            <Money amount={currentMonth.expenses} />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
              {profitMargin}%
            </span>
          </div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Net Profit</div>
          <div className="text-2xl font-bold text-emerald-400">
            <Money amount={profit} />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Calendar className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Cash Balance</div>
          <div className="text-2xl font-bold text-white">
            <Money amount={cashFlow[cashFlow.length - 1].balance} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Revenue vs Expenses</h2>
            <p className="text-xs text-zinc-500 mt-1">Last 6 months comparison</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpenses}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Forecast */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Cash Flow (13-Week)</h2>
            <p className="text-xs text-zinc-500 mt-1">Projected balance forecast</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlow}>
                <defs>
                  <linearGradient id="cashGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="w" stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="balance" stroke="#2dd4bf" fill="url(#cashGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MRR Trend */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">MRR Trend</h2>
            <p className="text-xs text-zinc-500 mt-1">Monthly recurring revenue growth</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrr}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="m" stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="card p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">Expenses by Category</h2>
            <p className="text-xs text-zinc-500 mt-1">Current month breakdown</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {expensesByCategory.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-zinc-400">{cat.name}</span>
                <span className="text-xs font-semibold text-white ml-auto">
                  <Money amount={cat.value} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


