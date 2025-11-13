-- Workflows and execution tables
create extension if not exists "pgcrypto";

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  created_by uuid,
  org_id uuid,
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_versions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  version int not null,
  graph jsonb not null default '{}'::jsonb,
  note text,
  created_at timestamptz not null default now()
);

create unique index if not exists workflow_versions_workflow_version_idx
  on public.workflow_versions (workflow_id, version);

create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  version int not null,
  status text not null check (status in ('queued','running','succeeded','failed','cancelled')),
  started_at timestamptz default now(),
  finished_at timestamptz,
  duration_ms int,
  error text
);

create index if not exists workflow_executions_workflow_idx
  on public.workflow_executions (workflow_id, started_at desc);

create table if not exists public.workflow_node_logs (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.workflow_executions(id) on delete cascade,
  node_id uuid not null,
  status text not null check (status in ('queued','running','succeeded','failed')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  duration_ms int,
  input jsonb,
  output jsonb,
  error text
);

create index if not exists workflow_node_logs_run_idx
  on public.workflow_node_logs (run_id, started_at asc);

-- Triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists workflows_updated_at on public.workflows;
create trigger workflows_updated_at
before update on public.workflows
for each row execute procedure public.set_updated_at();



