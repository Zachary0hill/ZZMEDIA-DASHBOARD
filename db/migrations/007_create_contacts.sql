-- Contacts / Email List
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  subscribed boolean not null default true,
  tags text[],
  notes text
);

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);
create index if not exists contacts_email_idx on public.contacts (email);


