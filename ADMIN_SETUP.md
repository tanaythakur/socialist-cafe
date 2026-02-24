# Admin login — flow aur setup

## Flow samajh (short)

1. **Credentials kahan:**  
   Email + password **Supabase Auth** me hote hain (Authentication → Users). Wahi login verify karta hai.  
   Hum koi alag table me password **nahi** rakhte.

2. **Admin kaise banta hai:**  
   Ek hi table **profiles** (users) — usme `id` (Auth user ka UID), `role` (admin / customer), `is_paused`.  
   Jab `role = 'admin'` (ya super_admin) aur paused nahi → woh user admin hai.

3. **Login flow:**  
   Tum email + password daalte ho → Auth check karta hai → sahi hone par `user.id` milta hai → hum **profiles** me dekhte hain ki is `id` ka `role` admin hai ya nahi → agar hai aur paused nahi → admin dashboard dikh jata hai.

**Summary:** Auth = login. **profiles** = ek table users ke liye, `role` column me admin/customer. Admin banane ke liye us user ki id ko **profiles** me insert karo with `role = 'admin'`.

---

## Step 1 — Email provider

- **Authentication → Sign In / Providers** → Email → **Enable** → Save  
- Testing ke liye "Confirm email" off kar sakte ho  

## Step 2 — Apna user (login wala)

- **Authentication → Users** → **Add user**  
- Apna email + password daal ke create karo (yehi /admin pe login me use hoga)  

## Step 3 — User dikh raha hai confirm karo

- **Authentication → Users** → list me apna user dikhna chahiye  

## Step 4 — Profiles table + apne user ko admin banao

### 4A — Table (sirf ek baar)

Agar **profiles** table pehle se nahi bani:

1. Supabase → **SQL Editor** → **New query**
2. File **supabase/migrations/20250224100000_create_profiles_table.sql** kholo — poora file copy karke SQL Editor me paste karo, **Run** karo.

Ya manually ye SQL run karo:

```sql
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
```

### 4B — Apne user ko admin insert karo

1. **Authentication → Users** → apna user kholo → **User UID** copy karo (uuid)
2. SQL Editor me **naya query** kholo
3. Neeche wale me `APNA_USER_UID_YAHAN` hata ke apna UID paste karo, phir **Run** karo:

```sql
insert into public.profiles (id, role, is_paused)
values ('APNA_USER_UID_YAHAN'::uuid, 'admin', false);
```

4. 1 row insert honi chahiye — ab woh user **admin** hai.

## Step 5 — Login test

- `npm run dev` → browser me **/admin** kholo  
- Wahi **email + password** daalo jo Step 2 me user banate waqt diya tha  
- Login hone par admin dashboard dikhna chahiye  

---

## .env

- `NEXT_PUBLIC_SUPABASE_URL` — project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key  
- `SUPABASE_SERVICE_ROLE_KEY` — service role (Settings → API). Server-side admin check ke liye chahiye.  

Credentials code/docs me mat daalo — sirf .env me rakho.
