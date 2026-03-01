-- Categories for menu (display order for drag-and-drop in admin)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text not null default '🍴',
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Public can read categories"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()))
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

-- Menu items (belong to a category)
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  image text not null default '',
  available boolean not null default true,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_menu_items_category_id on public.menu_items (category_id);

alter table public.menu_items enable row level security;

create policy "Public can read menu_items"
  on public.menu_items for select
  to anon, authenticated
  using (true);

create policy "Admins can manage menu_items"
  on public.menu_items for all
  to authenticated
  using (exists (select 1 from public.admins where user_id = auth.uid()))
  with check (exists (select 1 from public.admins where user_id = auth.uid()));

comment on table public.categories is 'Menu categories; order by display_order in admin.';
comment on table public.menu_items is 'Menu items; category_id references categories.';
