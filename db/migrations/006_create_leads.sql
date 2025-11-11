-- Leads / Hot Prospects
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  status text not null default 'hot' check (status in ('hot','warm','cold')),
  email text,
  phone text,
  estimated_value numeric(12,2),
  source text,
  notes text,
  next_action_date date
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);


