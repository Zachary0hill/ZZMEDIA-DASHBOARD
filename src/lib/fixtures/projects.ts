export const projects = Array.from({ length: 12 }).map((_, i) => ({
  id: `p${i + 1}`,
  clientId: `c${(i % 6) + 1}`,
  name: `Project ${i + 1}`,
  status: ["active", "planned", "blocked", "complete"][i % 4],
  budgetHours: 120 + i * 10,
  hoursUsed: 40 + i * 8,
  startDate: "2024-05-01",
  dueDate: "2024-12-01",
}));


