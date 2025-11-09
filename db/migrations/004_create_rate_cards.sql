-- Rate Cards table
create table if not exists public.rate_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null default 'other',
  unit_type text not null default 'hour',
  rate numeric(12,2) not null default 0,
  cost numeric(12,2),
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now()
);

create index if not exists rate_cards_category_idx on public.rate_cards(category);
create index if not exists rate_cards_status_idx on public.rate_cards(status);

