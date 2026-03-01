-- Run these in Supabase SQL Editor (Dashboard → SQL Editor).

-- 1) Add an admin by email (replace with your Supabase Auth user email)
insert into public.admins (user_id, role)
select id, 'admin' from auth.users where email = 'your-email@example.com'
on conflict (user_id) do update set role = 'admin';

-- 2) Make a user SUPER ADMIN (only super admins see cafe list & can pause/resume service)
-- Run after running migration 20250301000002_super_admin_and_cafes.sql
update public.admins
set is_super_admin = true
where user_id = (select id from auth.users where email = 'your-super-admin-email@example.com');

-- Alternative: add admin by user id (copy UUID from Authentication → Users)
-- insert into public.admins (user_id, role)
-- values ('YOUR_USER_UUID', 'admin')
-- on conflict (user_id) do update set role = 'admin';


-- 3) Pause service (only super admin can do this from /super-admin; or run this SQL)
update public.service_settings
set service_paused = true, updated_at = now();

-- 4) Unpause / resume service
update public.service_settings
set service_paused = false, updated_at = now();

-- 5) Check current service state
select service_paused, updated_at from public.service_settings limit 1;

-- 6) Add a cafe (for super admin dashboard list)
-- insert into public.cafes (name, slug, address, is_active)
-- values ('Main Café', 'main-cafe', '123 High Street', true);

-- 7) Add a customer (e.g. after sign-up)
-- insert into public.customers (user_id, role)
-- select id, 'customer' from auth.users where email = 'customer@example.com'
-- on conflict (user_id) do update set role = 'customer';
