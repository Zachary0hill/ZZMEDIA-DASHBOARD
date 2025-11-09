export type Invoice = {
  id: string;
  clientId: string;
  number: string;
  status: "draft" | "sent" | "paid" | "overdue";
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
};

export const invoices: Invoice[] = Array.from({ length: 24 }).map((_, i) => {
  const statusCycle = ["draft", "sent", "paid", "overdue"] as const;
  const status = statusCycle[i % statusCycle.length];
  const subtotal = 1000 + i * 125;
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax;
  const paid = status === "paid" ? total : Math.round(total * 0.2) * (i % 2) ;
  return {
    id: `inv${i + 1}`,
    clientId: `c${(i % 6) + 1}`,
    number: `2025-${String(i + 1).padStart(4, "0")}`,
    status,
    issueDate: "2025-01-10",
    dueDate: "2025-01-30",
    subtotal,
    tax,
    total,
    amountPaid: paid,
  };
});


