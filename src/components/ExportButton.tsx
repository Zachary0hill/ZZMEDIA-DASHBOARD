"use client";
import { Download } from "lucide-react";
import { useState } from "react";

type ExportFormat = "csv" | "json";

export function ExportButton<T extends Record<string, any>>({
  data,
  filename = "export",
  label = "Export",
}: {
  data: T[];
  filename?: string;
  label?: string;
}) {
  const [isExporting, setIsExporting] = useState(false);

  function exportAsCSV() {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    setIsExporting(true);
    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers.map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value ?? "");
            if (stringValue.includes(",") || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  }

  function exportAsJSON() {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    setIsExporting(true);
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={exportAsCSV}
        disabled={isExporting}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        {isExporting ? "Exporting..." : label}
      </button>
    </div>
  );
}

