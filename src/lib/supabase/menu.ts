import { supabase } from "@/lib/supabase/client";

export type Category = {
  id: string;
  name: string;
  emoji: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  tags?: string[];
};

/** Fetch categories from Supabase (excludes "all" which is UI-only). */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, emoji")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    emoji: row.emoji,
  }));
}

/** Fetch all menu items from Supabase. */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price, image_url, available, tags")
    .order("id");

  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    image: row.image_url ?? "",
    available: Boolean(row.available),
    tags: Array.isArray(row.tags) ? row.tags : undefined,
  }));
}
