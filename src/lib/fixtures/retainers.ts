export type Retainer = {
  id: string;
  client_id?: string;
  name: string;
  status: "active" | "paused" | "cancelled" | "expired";
  amount: number;
  billing_cycle: "monthly" | "quarterly" | "annual";
  start_date: string;
  end_date?: string;
  hours_included?: number;
  hours_used?: number;
  auto_renew: boolean;
  next_billing_date?: string;
  created_at: string;
};

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");

export const retainers: Retainer[] = [
  {
    id: "ret1",
    name: "Acme Corp - Content Retainer",
    status: "active",
    amount: 3500,
    billing_cycle: "monthly",
    start_date: "2025-01-01",
    hours_included: 20,
    hours_used: 12,
    auto_renew: true,
    next_billing_date: `${yyyy}-${String(Number(mm) + 1).padStart(2, "0")}-01`,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "ret2",
    name: "Beta Inc - Social Media Management",
    status: "active",
    amount: 2500,
    billing_cycle: "monthly",
    start_date: "2025-02-01",
    hours_included: 15,
    hours_used: 8,
    auto_renew: true,
    next_billing_date: `${yyyy}-${String(Number(mm) + 1).padStart(2, "0")}-01`,
    created_at: "2025-02-01T00:00:00Z",
  },
  {
    id: "ret3",
    name: "Gamma LLC - Quarterly Package",
    status: "paused",
    amount: 9000,
    billing_cycle: "quarterly",
    start_date: "2025-01-15",
    hours_included: 50,
    hours_used: 22,
    auto_renew: false,
    created_at: "2025-01-15T00:00:00Z",
  },
];

