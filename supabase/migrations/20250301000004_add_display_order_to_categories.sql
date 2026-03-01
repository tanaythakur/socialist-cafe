-- Add display_order if categories table exists without it (e.g. created by older migration)
alter table public.categories
  add column if not exists display_order int not null default 0;

-- Ensure id has a default so inserts without id work (fixes 23502 null value in column "id")
alter table public.categories
  alter column id set default gen_random_uuid();

-- Add missing columns to menu_items if table was created without them
alter table public.menu_items
  add column if not exists image text not null default '';
alter table public.menu_items
  add column if not exists image_url text default null;
alter table public.menu_items
  add column if not exists updated_at timestamptz not null default now();

-- Make image_url optional so items can be added/edited without image
alter table public.menu_items
  alter column image_url drop not null;

-- Ensure menu_items.id has a default so inserts without id work (fixes 23502)
alter table public.menu_items
  alter column id set default gen_random_uuid();

-- When a category is deleted, delete all menu items in that category (ON DELETE CASCADE)
alter table public.menu_items
  drop constraint if exists menu_items_category_id_fkey;
alter table public.menu_items
  add constraint menu_items_category_id_fkey
  foreign key (category_id) references public.categories (id) on delete cascade;
