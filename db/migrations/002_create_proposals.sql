-- Proposals table
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  number text,
  status text not null default 'draft' check (status in ('draft','sent','accepted','rejected','expired')),
  issue_date date,
  expiry_date date,
  subtotal numeric(12,2) not null default 0,
  tax numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proposals_client_id_idx on public.proposals(client_id);
create index if not exists proposals_status_idx on public.proposals(status);

