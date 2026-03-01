"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Category, MenuItem } from "@/data/mockData";

type CategoryRow = {
  id: string;
  name: string;
  emoji: string;
  display_order: number;
};

type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  tags: string[] | null;
};

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, emoji, display_order")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r: CategoryRow) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji ?? "🍴",
  }));
}

async function fetchMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price, image, available, tags");
  if (error) throw error;
  return (data ?? []).map((r: MenuItemRow) => ({
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    description: r.description ?? "",
    price: Number(r.price),
    image: r.image || "",
    available: r.available ?? true,
    tags: r.tags ?? undefined,
  }));
}

export function useMenu() {
  const categoriesQuery = useQuery({
    queryKey: ["menu", "categories"],
    queryFn: fetchCategories,
  });
  const itemsQuery = useQuery({
    queryKey: ["menu", "items"],
    queryFn: fetchMenuItems,
  });

  const categories = useMemo(() => {
    const list = categoriesQuery.data ?? [];
    return [{ id: "all", name: "All Items", emoji: "🍽️" }, ...list];
  }, [categoriesQuery.data]);

  return {
    categories,
    categoriesOnly: categoriesQuery.data ?? [],
    menuItems: itemsQuery.data ?? [],
    loading: categoriesQuery.isLoading || itemsQuery.isLoading,
    error: categoriesQuery.error ?? itemsQuery.error,
    refetch: () => {
      void categoriesQuery.refetch();
      void itemsQuery.refetch();
    },
  };
}
