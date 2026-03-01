"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Category, MenuItem } from "@/data/mockData";
import { Plus, Search, Edit3, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";

export function AdminMenuPanel() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formAvailable, setFormAvailable] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);

  const loadMenu = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, emoji")
      .order("display_order", { ascending: true });
    const { data: itemsData } = await supabase
      .from("menu_items")
      .select("id, category_id, name, description, price, image, image_url, available, tags");
    setCategories(
      (catData ?? []).map((r: { id: string; name: string; emoji: string }) => ({
        id: r.id,
        name: r.name,
        emoji: r.emoji ?? "🍴",
      }))
    );
    setItems(
      (itemsData ?? []).map(
        (r: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          price: number;
          image?: string;
          image_url?: string | null;
          available: boolean;
          tags: string[] | null;
        }) => ({
          id: r.id,
          categoryId: r.category_id,
          name: r.name,
          description: r.description ?? "",
          price: Number(r.price),
          image: r.image_url ?? r.image ?? "",
          available: r.available ?? true,
          tags: r.tags ?? undefined,
        })
      )
    );
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const openAdd = () => {
    setEditItem(null);
    setFormName("");
    setFormDescription("");
    setFormPrice("");
    setFormCategoryId(categories[0]?.id ?? "");
    setFormImage("");
    setFormAvailable(true);
    setShowModal(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormPrice(item.price.toString());
    setFormCategoryId(item.categoryId);
    setFormImage(item.image);
    setFormAvailable(item.available);
    setShowModal(true);
  };

  const toggleAvailability = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await supabase.from("menu_items").update({ available: !item.available }).eq("id", id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
  };

  const handleSaveItem = async () => {
    const name = formName.trim();
    const price = parseFloat(formPrice);
    if (!name || Number.isNaN(price) || price < 0) return;
    const categoryId = formCategoryId || categories[0]?.id;
    if (!categoryId) return;
    setSaving(true);
    const base = {
      name,
      description: formDescription.trim(),
      price,
      category_id: categoryId,
      image_url: formImage.trim() || null,
      available: formAvailable,
    };
    if (editItem) {
      await supabase
        .from("menu_items")
        .update({ ...base, updated_at: new Date().toISOString() })
        .eq("id", editItem.id);
    } else {
      await supabase.from("menu_items").insert(base);
    }
    setSaving(false);
    setShowModal(false);
    await loadMenu(true);
  };

  const handleDeleteItem = async (id: string) => {
    await supabase.from("menu_items").delete().eq("id", id);
    setDeleteTarget(null);
    await loadMenu(true);
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div>
        <h2 className="font-display font-bold text-admin text-xl">Menu Management</h2>
        <p className="text-admin-muted text-sm mt-2">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Menu Management</h2>
          <p className="text-admin-muted text-xs mt-0.5">{items.length} items total</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
        <input
          type="text"
          placeholder="Search menu items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-admin-surface-2 border border-admin rounded-xl text-admin placeholder:text-admin-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="bg-admin-surface rounded-2xl border border-admin overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin">
                <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">
                  Item
                </th>
                <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">
                  Available
                </th>
                <th className="text-right px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-admin/50 hover:bg-admin-surface-2 transition-colors last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-admin-surface-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-admin font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-admin-muted capitalize hidden md:table-cell">
                        {categories.find((c) => c.id === item.categoryId)?.name ?? item.categoryId}
                      </td>
                  <td className="px-4 py-3 text-admin font-display font-semibold">₹{item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => void toggleAvailability(item.id)}
                      className={cn("transition-colors", item.available ? "text-primary" : "text-admin-muted")}
                      aria-label="Toggle availability"
                    >
                      {item.available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded-lg text-admin-muted hover:text-admin hover:bg-admin-surface-2 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 rounded-lg text-admin-muted hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-admin">{editItem ? "Edit Item" : "Add New Item"}</h3>
              <button onClick={() => setShowModal(false)} className="text-admin-muted hover:text-admin transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Item Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Truffle Pasta"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                />
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the dish…"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-admin-muted/50"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Category</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Image URL</label>
                <input
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://… or /image.jpg"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="form-available"
                  checked={formAvailable}
                  onChange={(e) => setFormAvailable(e.target.checked)}
                  className="rounded border-admin"
                />
                <label htmlFor="form-available" className="text-xs text-admin-muted">
                  Available (show on menu)
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSaveItem()}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Saving…" : editItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}

      {deleteTarget &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
            <div className="w-full max-w-xs bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in text-center shadow-xl">
              <h3 className="font-display font-semibold text-admin mb-1">Delete &quot;{deleteTarget.name}&quot;?</h3>
              <p className="text-admin-muted text-xs mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleDeleteItem(deleteTarget.id)}
                  className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
