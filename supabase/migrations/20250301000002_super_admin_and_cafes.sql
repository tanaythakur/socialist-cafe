-- Super admin: only super admins can pause/resume service. Pause control moves to super admin dashboard.
alter table public.admins
  add column if not exists is_super_admin boolean not null default false;

-- Cafes table: list of cafes (for super admin dashboard)
create table if not exists public.cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cafes enable row level security;

-- Only super admins can read cafes (for super admin dashboard)
create policy "Super admins can read cafes"
  on public.cafes for select
  to authenticated
  using (
    exists (
      select 1 from public.admins
      where user_id = auth.uid() and is_super_admin = true
    )
  );

-- Service role can manage cafes
create policy "Service role can manage cafes"
  on public.cafes for all
  to service_role
  using (true)
  with check (true);

-- set_service_paused: only super admins can call
create or replace function public.set_service_paused(paused boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.admins
    where user_id = auth.uid() and is_super_admin = true
  ) then
    raise exception 'Only super admins can pause or resume service';
  end if;
  update public.service_settings set service_paused = paused, updated_at = now();
end;
$$;

comment on column public.admins.is_super_admin is 'When true, user can access super admin dashboard and pause/resume service.';
comment on table public.cafes is 'List of cafes; shown on super admin dashboard.';
