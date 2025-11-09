-- Retainers table
create table if not exists public.retainers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  status text not null default 'active' check (status in ('active','paused','cancelled','expired')),
  amount numeric(12,2) not null default 0,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','quarterly','annual')),
  start_date date,
  end_date date,
  hours_included integer,
  hours_used integer default 0,
  auto_renew boolean not null default true,
  next_billing_date date,
  created_at timestamptz not null default now()
);

create index if not exists retainers_client_id_idx on public.retainers(client_id);
create index if not exists retainers_status_idx on public.retainers(status);

