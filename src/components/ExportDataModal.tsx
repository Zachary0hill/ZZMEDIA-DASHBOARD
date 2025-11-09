"use client";
import { useState } from "react";
import { Modal } from "./Modal";
import { Download, CheckCircle, FileText, Users, FolderKanban, Receipt, CreditCard } from "lucide-react";

export function ExportDataModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedData, setSelectedData] = useState<string[]>([
    "clients",
    "projects",
    "invoices",
    "expenses",
  ]);
  const [format, setFormat] = useState("json");
  const [isExporting, setIsExporting] = useState(false);

  const dataTypes = [
    { id: "clients", label: "Clients & CRM", icon: Users },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "expenses", label: "Expenses", icon: CreditCard },
    { id: "proposals", label: "Proposals", icon: FileText },
    { id: "retainers", label: "Retainers", icon: Receipt },
  ];

  const toggleDataType = (id: string) => {
    setSelectedData(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`Exporting ${selectedData.length} data types as ${format.toUpperCase()}...`);
    setIsExporting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Data">
      <div className="space-y-6">
        {/* Select Data Types */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Select Data to Export</h3>
          <div className="space-y-2">
            {dataTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedData.includes(type.id);
              
              return (
                <button
                  key={type.id}
                  onClick={() => toggleDataType(type.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    isSelected 
                      ? "bg-cyan-500/10 border border-cyan-500/30" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? "bg-cyan-500/20" : "bg-white/5"
                  }`}>
                    <Icon className={`h-4 w-4 transition-colors ${
                      isSelected ? "text-cyan-400" : "text-zinc-400"
                    }`} />
                  </div>
                  <span className={`flex-1 text-sm font-medium transition-colors ${
                    isSelected ? "text-white" : "text-zinc-300"
                  }`}>
                    {type.label}
                  </span>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Export Format */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">Export Format</h3>
          <div className="grid grid-cols-3 gap-2">
            {["json", "csv", "xlsx"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  format === fmt
                    ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10"
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
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
            disabled={selectedData.length === 0 || isExporting}
            className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/15 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export Data"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

