export type RateCard = {
  id: string;
  name: string;
  description?: string;
  category: "video" | "photo" | "design" | "consulting" | "other";
  unit_type: "hour" | "day" | "project" | "per_video" | "per_asset";
  rate: number;
  cost?: number; // internal cost
  status: "active" | "archived";
  created_at: string;
};

export const rateCards: RateCard[] = [
  {
    id: "rc1",
    name: "Video Production - Standard",
    description: "Full video production with 2 revisions",
    category: "video",
    unit_type: "per_video",
    rate: 2500,
    cost: 800,
    status: "active",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "rc2",
    name: "Video Production - Premium",
    description: "Premium video with unlimited revisions",
    category: "video",
    unit_type: "per_video",
    rate: 4500,
    cost: 1200,
    status: "active",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "rc3",
    name: "Photography - Half Day",
    category: "photo",
    unit_type: "day",
    rate: 800,
    cost: 200,
    status: "active",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "rc4",
    name: "Photography - Full Day",
    category: "photo",
    unit_type: "day",
    rate: 1500,
    cost: 400,
    status: "active",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "rc5",
    name: "Graphic Design - Hourly",
    category: "design",
    unit_type: "hour",
    rate: 125,
    cost: 40,
    status: "active",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "rc6",
    name: "Strategy Consulting",
    category: "consulting",
    unit_type: "hour",
    rate: 200,
    cost: 60,
    status: "active",
    created_at: "2025-01-01T00:00:00Z",
  },
];

