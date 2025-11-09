export type Expense = {
  id: string;
  date: string; // YYYY-MM-DD
  category: "subscription" | "business" | "writeoff";
  vendor: string;
  amount: number; // positive numbers
};

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");

export const expenses: Expense[] = [
  { id: "e1", date: `${yyyy}-${mm}-02`, category: "subscription", vendor: "Figma", amount: 24 },
  { id: "e2", date: `${yyyy}-${mm}-03`, category: "subscription", vendor: "Notion", amount: 16 },
  { id: "e3", date: `${yyyy}-${mm}-05`, category: "subscription", vendor: "Google Workspace", amount: 36 },
  { id: "e4", date: `${yyyy}-${mm}-08`, category: "business", vendor: "Camera Rental", amount: 180 },
  { id: "e5", date: `${yyyy}-${mm}-12`, category: "business", vendor: "Contractor", amount: 850 },
  { id: "e6", date: `${yyyy}-${mm}-16`, category: "writeoff", vendor: "Travel - Uber", amount: 42 },
  { id: "e7", date: `${yyyy}-${mm}-18`, category: "writeoff", vendor: "Meals", amount: 28 },
];

export function sumExpensesForMonth(year: number, monthIndex0: number) {
  const mmStr = String(monthIndex0 + 1).padStart(2, "0");
  const filtered = expenses.filter((e) => e.date.startsWith(`${year}-${mmStr}-`));
  const totals = filtered.reduce(
    (acc, e) => {
      acc.total += e.amount;
      acc.byCategory[e.category] = (acc.byCategory[e.category] || 0) + e.amount;
      return acc;
    },
    { total: 0, byCategory: {} as Record<string, number> }
  );
  return totals;
}


