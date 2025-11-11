-- Equipment & Studio Catalog
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  category text,
  serial_number text,
  purchase_date date,
  purchase_price numeric(12,2),
  status text not null default 'available' check (status in ('available','in_use','maintenance','retired')),
  location text,
  notes text
);

create index if not exists equipment_created_at_idx on public.equipment (created_at desc);
create index if not exists equipment_status_idx on public.equipment (status);


