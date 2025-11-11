-- Subscriptions (SaaS / software recurring expenses)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  vendor text not null,
  name text,
  amount numeric(12,2) not null default 0,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','quarterly','annual')),
  renew_date date,
  status text not null default 'active' check (status in ('active','paused','cancelled')),
  category text
);

create index if not exists subscriptions_created_at_idx on public.subscriptions (created_at desc);
create index if not exists subscriptions_status_idx on public.subscriptions (status);


