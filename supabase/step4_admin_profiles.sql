-- STEP 4A — profiles table (ek hi table users ke liye, role column me admin)
-- Supabase → SQL Editor → New query → ye poora block run karo

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'customer', 'super_admin')),
  is_paused boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "No anon access" on public.profiles;
create policy "No anon access"
  on public.profiles for all to anon using (false) with check (false);

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated using (auth.uid() = id);

-- STEP 4B — Apne user ko admin banao
-- 1. Supabase → Authentication → Users → apne user pe click karo
-- 2. "User UID" copy karo (uuid)
-- 3. Neeche wale INSERT me YOUR_USER_ID_HERE hata ke woh UID paste karo, phir sirf ye INSERT run karo

-- insert into public.profiles (id, role, is_paused)
-- values ('YOUR_USER_ID_HERE'::uuid, 'admin', false);
