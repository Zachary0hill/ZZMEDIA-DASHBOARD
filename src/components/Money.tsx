export function Money({ amount }: { amount: number }) {
  return (
    <span>
      {amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
    </span>
  );
}


