-- Admins table: links Supabase Auth users to admin access.
-- Add a row here for any user who should be able to log in to the admin portal.
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.admins enable row level security;

-- Users can only read their own admin row (so the app can check if current user is admin).
create policy "Users can read own admin row"
  on public.admins for select
  to authenticated
  using (auth.uid() = user_id);

-- Only service role can insert/update/delete (e.g. from dashboard or backend).
create policy "Service role can manage admins"
  on public.admins for all
  to service_role
  using (true)
  with check (true);

comment on table public.admins is 'Users who can access the admin portal. Add the auth user id here after creating a user in Supabase Auth.';
