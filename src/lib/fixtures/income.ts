export type Income = {
  id: string;
  date: string; // YYYY-MM-DD
  source: "invoice" | "retainer" | "other";
  description: string;
  amount: number; // positive numbers
};

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");

export const income: Income[] = [
  { id: "i1", date: `${yyyy}-${mm}-04`, source: "invoice", description: "INV 2025-0007", amount: 2100 },
  { id: "i2", date: `${yyyy}-${mm}-10`, source: "retainer", description: "Monthly Retainer - Acme", amount: 3500 },
  { id: "i3", date: `${yyyy}-${mm}-15`, source: "invoice", description: "INV 2025-0010", amount: 1450 },
  { id: "i4", date: `${yyyy}-${mm}-22`, source: "other", description: "Affiliate Payout", amount: 320 },
];

export function sumIncomeForMonth(year: number, monthIndex0: number) {
  const mmStr = String(monthIndex0 + 1).padStart(2, "0");
  const filtered = income.filter((e) => e.date.startsWith(`${year}-${mmStr}-`));
  const total = filtered.reduce((acc, i) => acc + i.amount, 0);
  return { total };
}


