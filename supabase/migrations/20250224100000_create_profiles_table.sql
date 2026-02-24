-- Ek hi table: users/profiles. id = auth user, role = 'admin' | 'customer' etc.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'customer', 'super_admin')),
  is_paused boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Users: id = auth.users.id, role = admin/customer. Admin login checks role in (admin, super_admin).';
comment on column public.profiles.role is 'admin = dashboard access, customer = normal user, super_admin = full access.';

alter table public.profiles enable row level security;

drop policy if exists "No anon access" on public.profiles;
create policy "No anon access"
  on public.profiles for all to anon
  using (false) with check (false);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = id);

-- Purani admin_profiles se data copy karo (agar table hai), phir drop
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'admin_profiles') then
    insert into public.profiles (id, role, is_paused, created_at)
    select id, role, is_paused, created_at from public.admin_profiles
    on conflict (id) do nothing;
    drop table public.admin_profiles;
  end if;
end $$;
