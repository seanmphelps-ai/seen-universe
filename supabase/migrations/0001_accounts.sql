create extension if not exists pgcrypto;

create table public.people (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  birth_date date not null,
  birth_time time,
  birth_location text not null,
  birth_latitude double precision,
  birth_longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name, birth_date)
);

create table public.person_locations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  location_type text not null check (location_type in ('birth', 'lived', 'current')),
  label text not null,
  latitude double precision,
  longitude double precision,
  started_on date,
  ended_on date,
  created_at timestamptz not null default now()
);

create table public.western_charts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid not null unique references public.people(id) on delete cascade,
  schema_version text not null default '1.0.0',
  chart jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.readings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  reading_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create index people_owner_id_idx on public.people(owner_id);
create index person_locations_owner_id_idx on public.person_locations(owner_id);
create index person_locations_person_id_idx on public.person_locations(person_id);
create index western_charts_owner_id_idx on public.western_charts(owner_id);
create index readings_owner_id_idx on public.readings(owner_id);
create index readings_person_id_idx on public.readings(person_id);

alter table public.people enable row level security;
alter table public.person_locations enable row level security;
alter table public.western_charts enable row level security;
alter table public.readings enable row level security;

grant select, insert, update, delete on table public.people to authenticated;
grant select, insert, update, delete on table public.person_locations to authenticated;
grant select, insert, update, delete on table public.western_charts to authenticated;
grant select, insert, update, delete on table public.readings to authenticated;

create policy "owners manage their people" on public.people
  for all to authenticated using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "owners manage their person locations" on public.person_locations
  for all to authenticated using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "owners manage their western charts" on public.western_charts
  for all to authenticated using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
create policy "owners manage their readings" on public.readings
  for all to authenticated using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
