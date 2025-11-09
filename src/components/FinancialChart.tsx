"use client";
import { useState } from "react";
import { Money } from "./Money";
import { TrendingUp, Eye, EyeOff } from "lucide-react";

type MonthData = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
};

export function FinancialChart({ data }: { data: MonthData[] }) {
  const [showExpenses, setShowExpenses] = useState(true);

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map(m => showExpenses ? Math.max(m.revenue, m.expenses) : m.revenue)
  );

  // Nice ticks for even dollar markers
  const getNiceStep = (roughStep: number) => {
    const exponent = Math.floor(Math.log10(roughStep));
    const fraction = roughStep / Math.pow(10, exponent);
    let niceFraction = 1;
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
    return niceFraction * Math.pow(10, exponent);
  };

  const yTickSegments = 4; // 5 labels incl. zero
  const niceStep = getNiceStep(maxValue / yTickSegments || 1);
  const chartMax = Math.ceil(maxValue / niceStep) * niceStep;
  const yTicks = Array.from({ length: yTickSegments + 1 }, (_, i) => i * niceStep);

  // Calculate averages
  const avgRevenue = Math.round(data.reduce((sum, m) => sum + m.revenue, 0) / data.length);
  const avgExpenses = Math.round(data.reduce((sum, m) => sum + m.expenses, 0) / data.length);

  return (
    <div className="space-y-6">
      {/* Top Row: Averages and Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Avg Revenue</div>
            <div className="text-xl font-black text-emerald-300">
              <Money amount={avgRevenue} />
            </div>
          </div>
          {showExpenses && (
            <div>
              <div className="text-xs font-bold text-zinc-400 mb-1 uppercase tracking-wider">Avg Expenses</div>
              <div className="text-xl font-black text-rose-300">
                <Money amount={avgExpenses} />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowExpenses(!showExpenses)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur-xl px-4 py-2 text-xs text-white hover:bg-white/15 hover:border-white/30 transition-all font-bold shadow-lg"
        >
          {showExpenses ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {showExpenses ? "Hide Expenses" : "Show Expenses"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 shadow-lg shadow-emerald-500/30" />
          <span className="text-xs font-black text-zinc-200">Revenue</span>
        </div>
        {showExpenses && (
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-b from-rose-300 to-rose-500 shadow-lg shadow-rose-500/30" />
            <span className="text-xs font-black text-zinc-200">Expenses</span>
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-10 w-20 flex flex-col justify-between text-xs text-zinc-400 font-bold">
          {yTicks.slice().reverse().map((v, i) => (
            <span key={i}><Money amount={v} /></span>
          ))}
        </div>

        {/* Chart with bars */}
        <div className="ml-24 pl-6 border-l border-b border-white/10 relative">
          {/* Horizontal grid lines */}
          {yTicks.map((t, i) => (
            <div
              key={`h-${i}`}
              className="pointer-events-none absolute left-0 right-0 border-t border-white/5"
              style={{ bottom: `${(t / chartMax) * 100}%` }}
            />
          ))}
          {/* Vertical grid lines (monthly) */}
          <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none">
            <div className="relative h-full flex items-end justify-between gap-4">
              {data.map((_, i) => (
                <div key={`v-${i}`} className="w-px h-full bg-white/5 translate-x-1/2" />
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 h-80 pb-3 relative">
            {data.map((month, idx) => {
              const revenueHeight = chartMax > 0 ? (month.revenue / chartMax) * 100 : 0;
              const expensesHeight = chartMax > 0 ? (month.expenses / chartMax) * 100 : 0;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                  {/* Bars Container */}
                  <div className="relative w-full flex items-end justify-center gap-2 h-full">
                    {/* Revenue Bar */}
                    <div className="relative flex-1 flex flex-col justify-end items-center h-full">
                      <div 
                        className="w-full rounded-t-xl bg-gradient-to-b from-emerald-400/90 via-emerald-500/80 to-emerald-600 hover:from-emerald-300 hover:via-emerald-400 hover:to-emerald-500 transition-all duration-300 cursor-pointer relative group/bar backdrop-blur-sm border border-emerald-400/20"
                        style={{ 
                          height: `${revenueHeight}%`,
                          boxShadow: '0 0 20px rgba(52, 211, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {/* Glassmorphism highlight */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
                        
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-emerald-500/40 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                          <div className="text-[10px] text-zinc-400 mb-0.5 font-semibold uppercase tracking-wider">Revenue</div>
                          <div className="text-sm font-bold text-emerald-400">
                            <Money amount={month.revenue} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expenses Bar */}
                    {showExpenses && (
                      <div className="relative flex-1 flex flex-col justify-end items-center h-full">
                        <div 
                          className="w-full rounded-t-xl bg-gradient-to-b from-rose-400/90 via-rose-500/80 to-rose-600 hover:from-rose-300 hover:via-rose-400 hover:to-rose-500 transition-all duration-300 cursor-pointer relative group/bar backdrop-blur-sm border border-rose-400/20"
                          style={{ 
                            height: `${expensesHeight}%`,
                            boxShadow: '0 0 20px rgba(244, 63, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {/* Glassmorphism highlight */}
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-rose-500/40 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                            <div className="text-[10px] text-zinc-400 mb-0.5 font-semibold uppercase tracking-wider">Expenses</div>
                            <div className="text-sm font-bold text-rose-400">
                              <Money amount={month.expenses} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Month Label */}
                  <div className="mt-4 text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">
                    {month.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

