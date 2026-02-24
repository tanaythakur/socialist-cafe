create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('super_admin', 'admin')),
  is_paused boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.admin_profiles is 'Admin users for the café dashboard. id = auth.users.id.';
comment on column public.admin_profiles.role is 'super_admin: full access + manage admins; admin: dashboard only.';
comment on column public.admin_profiles.is_paused is 'When true, this admin cannot sign in.';

-- RLS: no direct client access; all reads/writes via service role in server actions.
alter table public.admin_profiles enable row level security;

-- Policy: no one can read/write via anon key (server uses service_role which bypasses RLS).
create policy "No anon access"
  on public.admin_profiles
  for all
  to anon
  using (false)
  with check (false);

-- Optional: allow authenticated user to read only their own row (for server-side session check).
-- We do profile checks in server actions with service role, so this is optional.
create policy "Users can read own profile"
  on public.admin_profiles
  for select
  to authenticated
  using (auth.uid() = id);
