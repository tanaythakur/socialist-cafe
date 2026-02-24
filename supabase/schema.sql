
-- Categories (for menu filtering)
create table if not exists public.categories (
  id text primary key,
  name text not null,
  emoji text not null,
  sort_order int not null default 0
);

-- Menu items
create table if not exists public.menu_items (
  id text primary key,
  category_id text not null references public.categories(id) on delete restrict,
  name text not null,
  description text not null,
  price decimal(10,2) not null,
  image_url text not null,
  available boolean not null default true,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

-- Allow public read for menu (customers)
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;

-- Policies: drop if exists so schema can be run again without error
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

drop policy if exists "Menu items are viewable by everyone" on public.menu_items;
create policy "Menu items are viewable by everyone"
  on public.menu_items for select using (true);

-- Seed categories (id must match menu_data categoryId)
insert into public.categories (id, name, emoji, sort_order) values
  ('all', 'All Items', '🍽️', 0),
  ('breakfast', 'Breakfast', '🌅', 1),
  ('mains', 'Mains', '🥗', 2),
  ('beverages', 'Beverages', '☕', 3),
  ('desserts', 'Desserts', '🍰', 4)
on conflict (id) do update set name = excluded.name, emoji = excluded.emoji, sort_order = excluded.sort_order;

-- Seed menu items (image_url = path under /images/ in your app)
insert into public.menu_items (id, category_id, name, description, price, image_url, available, tags) values
  ('m1', 'breakfast', 'Avocado Toast', 'Sourdough toast with smashed avocado, poached eggs, chili flakes & microgreens', 14.50, '/images/food-avocado-toast.jpg', true, '{vegetarian}'),
  ('m2', 'breakfast', 'Eggs Benedict', 'English muffin with smoked salmon, poached eggs & house hollandaise', 16.90, '/images/food-eggs-benedict.jpg', true, '{}'),
  ('m3', 'breakfast', 'Butter Croissant', 'Freshly baked all-butter croissant, served warm with jam & cultured butter', 5.50, '/images/food-croissant.jpg', true, '{vegetarian}'),
  ('m4', 'breakfast', 'Green Smoothie Bowl', 'Spirulina & spinach base, granola, fresh berries, coconut flakes & chia seeds', 12.00, '/images/food-smoothie-bowl.jpg', true, '{vegan,gluten-free}'),
  ('m5', 'mains', 'Harvest Grain Bowl', 'Roasted seasonal vegetables, feta, olives, fresh herbs & lemon tahini dressing', 18.50, '/images/food-salad.jpg', true, '{vegetarian}'),
  ('m6', 'beverages', 'Flat White', 'Double ristretto with velvety micro-foam steamed milk, served in ceramic', 5.00, '/images/food-coffee.jpg', true, '{}'),
  ('m7', 'beverages', 'Iced Matcha Latte', 'Ceremonial grade matcha, oat milk, served over ice. Sweetened or unsweetened', 6.50, '/images/food-matcha.jpg', true, '{vegan}'),
  ('m8', 'desserts', 'Pistachio Tart', 'House-made pistachio cream in a buttery pastry shell, dusted with icing sugar', 8.00, '/images/food-pistachio-tart.jpg', false, '{vegetarian}')
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  available = excluded.available,
  tags = excluded.tags;
