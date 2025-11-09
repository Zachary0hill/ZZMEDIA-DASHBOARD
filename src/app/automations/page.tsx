"use client";
import { automations } from "@/lib/fixtures/automations";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";

export default function AutomationsPage() {
  const data = automations;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-white">Automations</h1>
      <DataTable
        columns={[
          { key: "name", header: "Name" },
          { key: "trigger", header: "Trigger" },
          { key: "status", header: "Status", format: (v) => <StatusBadge status={String(v)} /> },
          { key: "lastRunAt", header: "Last Run" },
          { key: "errorCount", header: "Errors" },
        ]}
        rows={data as any}
      />
    </div>
  );
}


