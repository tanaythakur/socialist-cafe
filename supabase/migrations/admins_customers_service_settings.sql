-- Add role to admins (admin only)
alter table public.admins
  add column if not exists role text not null default 'admin';

-- Customers table: auth users with customer role
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'customer',
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.customers enable row level security;

create policy "Users can read own customer row"
  on public.customers for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Service role can manage customers"
  on public.customers for all
  to service_role
  using (true)
  with check (true);

-- Global service state: when service_paused is true, no admin can access the app
create table if not exists public.service_settings (
  id uuid primary key default gen_random_uuid(),
  service_paused boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.service_settings enable row level security;

-- Authenticated users can read (app checks before allowing admin access)
create policy "Authenticated can read service_settings"
  on public.service_settings for select
  to authenticated
  using (true);

-- Only service role can update (use SQL in dashboard or RPC to toggle)
create policy "Service role can update service_settings"
  on public.service_settings for update
  to service_role
  using (true)
  with check (true);

insert into public.service_settings (id, service_paused, updated_at)
select gen_random_uuid(), false, now()
where not exists (select 1 from public.service_settings limit 1);

-- Single row: ensure we have exactly one settings row (optional guard)
create or replace function public.get_service_settings()
returns public.service_settings
language sql
security definer
set search_path = public
stable
as $$
  select * from public.service_settings limit 1;
$$;

-- Allow authenticated to call (so app can read service_paused)
grant execute on function public.get_service_settings() to authenticated;

-- RPC for admins to toggle pause (so dashboard can pause without service_role key in frontend)
create or replace function public.set_service_paused(paused boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.admins where user_id = auth.uid()) then
    raise exception 'Only admins can update service settings';
  end if;
  update public.service_settings set service_paused = paused, updated_at = now();
end;
$$;

grant execute on function public.set_service_paused(boolean) to authenticated;

comment on table public.admins is 'Users with admin role; can access admin portal when service is not paused.';
comment on table public.customers is 'Users with customer role; for app customer features.';
comment on table public.service_settings is 'Global app state: when service_paused is true, admins cannot access the app.';
