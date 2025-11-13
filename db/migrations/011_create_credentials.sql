create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  org_id uuid,
  user_id uuid,
  type text not null check (type in ('openai','http','bearer','basic')),
  name text not null,
  data text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists credentials_updated_at on public.credentials;
create trigger credentials_updated_at
before update on public.credentials
for each row execute procedure public.set_updated_at();


