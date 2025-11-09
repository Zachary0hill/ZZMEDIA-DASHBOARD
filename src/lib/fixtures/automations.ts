export type Automation = {
  id: string;
  name: string;
  trigger: string;
  status: "active" | "disabled" | "error";
  lastRunAt: string;
  errorCount: number;
};

export const automations: Automation[] = [
  { id: "a1", name: "Sync CRM to Mailer", trigger: "nightly", status: "active", lastRunAt: "2025-10-02T02:00:00Z", errorCount: 0 },
  { id: "a2", name: "Auto-generate Invoices", trigger: "1st of month", status: "active", lastRunAt: "2025-10-01T00:05:00Z", errorCount: 0 },
  { id: "a3", name: "Failed Payment Alerts", trigger: "webhook", status: "error", lastRunAt: "2025-10-02T14:10:00Z", errorCount: 3 },
  { id: "a4", name: "Upload to S3 Archive", trigger: "on publish", status: "disabled", lastRunAt: "2025-09-29T09:00:00Z", errorCount: 0 }
];


