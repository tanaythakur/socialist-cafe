"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Category } from "@/data/mockData";
import { Plus, Edit3, Trash2, GripVertical, X } from "lucide-react";

export function AdminCategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemCountByCategoryId, setItemCountByCategoryId] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmoji, setFormEmoji] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const loadCategories = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    const { data: catData } = await supabase
      .from("categories")
      .select("id, name, emoji, display_order")
      .order("display_order", { ascending: true });
    const { data: itemsData } = await supabase.from("menu_items").select("category_id");
    const countMap: Record<string, number> = {};
    (itemsData ?? []).forEach((r: { category_id: string }) => {
      countMap[r.category_id] = (countMap[r.category_id] ?? 0) + 1;
    });
    setCategories(
      (catData ?? []).map((r: { id: string; name: string; emoji: string }) => ({
        id: r.id,
        name: r.name,
        emoji: r.emoji ?? "🍴",
      }))
    );
    setItemCountByCategoryId(countMap);
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openAdd = () => {
    setEditCat(null);
    setFormName("");
    setFormEmoji("");
    setShowModal(true);
  };
  const openEdit = (c: Category) => {
    setEditCat(c);
    setFormName(c.name);
    setFormEmoji(c.emoji);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    if (editCat) {
      await supabase
        .from("categories")
        .update({ name: formName.trim(), emoji: formEmoji || "🍴" })
        .eq("id", editCat.id);
    } else {
      await supabase
        .from("categories")
        .insert({ name: formName.trim(), emoji: formEmoji || "🍴", display_order: categories.length });
    }
    setSaving(false);
    setShowModal(false);
    await loadCategories(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setDeleteTarget(null);
    await loadCategories(true);
  };

  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDrop = async (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    const updated = [...categories];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(i, 0, moved);
    setCategories(updated);
    setDragIndex(null);
    for (let idx = 0; idx < updated.length; idx++) {
      await supabase.from("categories").update({ display_order: idx }).eq("id", updated[idx].id);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="font-display font-bold text-admin text-xl">Category Management</h2>
        <p className="text-admin-muted text-sm mt-2">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Category Management</h2>
          <p className="text-admin-muted text-xs mt-0.5">{categories.length} categories • drag to reorder</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => void handleDrop(i)}
            className={cn(
              "bg-admin-surface border border-admin rounded-2xl px-4 py-3.5 flex items-center gap-4 cursor-grab active:cursor-grabbing transition-all select-none",
              dragIndex === i && "opacity-40 scale-[0.98]"
            )}
          >
            <GripVertical className="w-4 h-4 text-admin-muted/50 flex-shrink-0" />
            <span className="text-2xl leading-none">{cat.emoji}</span>
            <div className="flex-1">
              <p className="text-admin font-semibold text-sm">{cat.name}</p>
              <p className="text-admin-muted text-xs">{itemCountByCategoryId[cat.id] ?? 0} items</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEdit(cat)}
                className="p-2 rounded-lg text-admin-muted hover:text-admin hover:bg-admin-surface-2 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(cat)}
                className="p-2 rounded-lg text-admin-muted hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-admin">{editCat ? "Edit Category" : "Add Category"}</h3>
              <button onClick={() => setShowModal(false)} className="text-admin-muted hover:text-admin transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Category Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Sandwiches"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                />
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Emoji Icon</label>
                <input
                  value={formEmoji}
                  onChange={(e) => setFormEmoji(e.target.value)}
                  placeholder="e.g. 🥪"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                />
              </div>
              {(formName || formEmoji) && (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-admin-bg rounded-xl border border-admin">
                  <span className="text-xl">{formEmoji || "🍴"}</span>
                  <span className="text-admin text-sm font-medium">{formName || "Category name"}</span>
                </div>
              )}
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
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving ? "Saving…" : editCat ? "Save Changes" : "Add Category"}
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
              <div className="text-4xl mb-3">{deleteTarget.emoji}</div>
              <h3 className="font-display font-semibold text-admin mb-1">Delete &quot;{deleteTarget.name}&quot;?</h3>
              <p className="text-admin-muted text-xs mb-5">
                This will remove the category. Existing menu items won&apos;t be deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleDelete(deleteTarget.id)}
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
