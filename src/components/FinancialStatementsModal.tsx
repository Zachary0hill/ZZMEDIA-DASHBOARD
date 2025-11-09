"use client";
import { useState } from "react";
import { Modal } from "./Modal";
import { Download, FileText, Calendar } from "lucide-react";

export function FinancialStatementsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const currentYear = new Date().getFullYear();
  const [dateRange, setDateRange] = useState({
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`,
  });
  const [selectedStatements, setSelectedStatements] = useState<string[]>([
    "profit-loss",
    "balance-sheet",
  ]);

  const statements = [
    { id: "profit-loss", label: "Profit & Loss Statement", description: "Revenue, expenses, and net income" },
    { id: "balance-sheet", label: "Balance Sheet", description: "Assets, liabilities, and equity" },
    { id: "cash-flow", label: "Cash Flow Statement", description: "Cash inflows and outflows" },
    { id: "invoice-summary", label: "Invoice Summary", description: "All invoices and payments" },
    { id: "expense-report", label: "Expense Report", description: "Categorized expenses breakdown" },
  ];

  const toggleStatement = (id: string) => {
    setSelectedStatements(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    // TODO: Generate and download statements
    alert(`Generating ${selectedStatements.length} financial statements...`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Financial Statements">
      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-2">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-zinc-200 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Select Statements */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Select Statements</h3>
          <div className="space-y-2">
            {statements.map((statement) => {
              const isSelected = selectedStatements.includes(statement.id);
              
              return (
                <button
                  key={statement.id}
                  onClick={() => toggleStatement(statement.id)}
                  className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                    isSelected 
                      ? "bg-cyan-500/10 border border-cyan-500/30" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                    isSelected 
                      ? "border-cyan-400 bg-cyan-400" 
                      : "border-zinc-600"
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium transition-colors ${
                      isSelected ? "text-white" : "text-zinc-300"
                    }`}>
                      {statement.label}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">{statement.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={selectedStatements.length === 0}
            className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>
    </Modal>
  );
}

