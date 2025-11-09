-- Expenses table
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  category text not null,
  vendor text not null,
  description text,
  amount numeric(12,2) not null default 0,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create index if not exists expenses_date_idx on public.expenses(date);
create index if not exists expenses_category_idx on public.expenses(category);

