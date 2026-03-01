-- Add display_order if categories table exists without it (e.g. created by older migration)
alter table public.categories
  add column if not exists display_order int not null default 0;

-- Ensure id has a default so inserts without id work (fixes 23502 null value in column "id")
alter table public.categories
  alter column id set default gen_random_uuid();
