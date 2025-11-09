export type Proposal = {
  id: string;
  client_id?: string;
  title: string;
  number: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  issue_date: string;
  expiry_date?: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  created_at: string;
};

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");

export const proposals: Proposal[] = [
  {
    id: "prop1",
    title: "Video Production Package - Acme Corp",
    number: "PROP-2025-001",
    status: "sent",
    issue_date: `${yyyy}-${mm}-10`,
    expiry_date: `${yyyy}-${mm}-25`,
    subtotal: 15000,
    tax: 1200,
    total: 16200,
    notes: "Includes 3 videos + revisions",
    created_at: `${yyyy}-${mm}-10T10:00:00Z`,
  },
  {
    id: "prop2",
    title: "Social Media Content - Beta Inc",
    number: "PROP-2025-002",
    status: "draft",
    issue_date: `${yyyy}-${mm}-15`,
    subtotal: 8500,
    tax: 680,
    total: 9180,
    created_at: `${yyyy}-${mm}-15T14:30:00Z`,
  },
  {
    id: "prop3",
    title: "Branding & Identity Package",
    number: "PROP-2025-003",
    status: "accepted",
    issue_date: `${yyyy}-${mm}-05`,
    subtotal: 12000,
    tax: 960,
    total: 12960,
    notes: "Client accepted - convert to project",
    created_at: `${yyyy}-${mm}-05T09:15:00Z`,
  },
];

