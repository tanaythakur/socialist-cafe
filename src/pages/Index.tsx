"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, MENU_ITEMS } from "@/data/mockData";
import { CategoryTabs } from "@/components/CategoryTabs";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Leaf } from "lucide-react";
import { images } from "@/assets/images";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { itemCount, setIsOpen, setTableNumber, tableNumber } = useCart();

  useEffect(() => {
    if (!searchParams) return;
    const table = searchParams.get("table");
    if (table) setTableNumber(parseInt(table, 10));
  }, [searchParams, setTableNumber]);

  const filteredItems =
    selectedCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((i) => i.categoryId === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-pistachio">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-foreground text-sm leading-tight">
                The Socialist Café
              </h1>
              {tableNumber && (
                <p className="text-muted-foreground text-[10px]">Table {tableNumber}</p>
              )}
            </div>
          </div>

          {/* Cart button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold shadow-pistachio hover:opacity-90 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={images.heroFood}
          alt="The Socialist Café"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
            Good food,<br />shared equally.
          </h2>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[57px] z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <CategoryTabs
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Menu Grid */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="font-medium">No items in this category</p>
          </div>
        )}
      </main>

      {/* Cart FAB on mobile if no sticky header button visible */}
      <CartDrawer />
    </div>
  );
}
