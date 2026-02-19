"use client";

import { useState } from "react";
import { AdminSidebar, AdminSection } from "@/components/admin/AdminSidebar";
import { OrderCard } from "@/components/admin/OrderCard";
import {
  MOCK_ORDERS, MOCK_FRANCHISE_APPLICATIONS, MOCK_CUSTOMERS,
  MENU_ITEMS, CATEGORIES,
  Order, OrderStatus, MenuItem, FranchiseApplication, Category, Customer,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Plus, Search, Edit3, Trash2, ToggleLeft, ToggleRight, X, Eye, Menu,
  TrendingUp, ShoppingBag, DollarSign, Star, GripVertical, Users, ArrowUpRight,
} from "lucide-react";

// ─── Admin Login ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@socialist.cafe" && password === "admin123") {
      onLogin();
    } else {
      setError("Invalid credentials. Try admin@socialist.cafe / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-admin-surface rounded-2xl border border-admin p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-pistachio">
            <span className="font-display font-bold text-primary-foreground text-lg">S</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-admin text-lg">Admin Portal</h1>
            <p className="text-admin-muted text-xs">The Socialist Café</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-admin-muted mb-1.5 block uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@socialist.cafe"
              className="w-full px-4 py-3 rounded-xl bg-admin-bg border border-admin text-admin placeholder:text-admin-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-admin-muted mb-1.5 block uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-admin-bg border border-admin text-admin placeholder:text-admin-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          {error && (
            <p className="text-destructive text-xs bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-pistachio hover:opacity-90 active:scale-[0.98] transition-all mt-2"
          >
            Sign In
          </button>
        </form>
        <p className="text-admin-muted text-[10px] text-center mt-4 opacity-60">
          Hint: admin@socialist.cafe / admin123
        </p>
      </div>
    </div>
  );
}

// ─── Sales Dashboard ─────────────────────────────────────────────────────────
const MOCK_HOURLY = [
  { hour: "8am", revenue: 42 },
  { hour: "9am", revenue: 118 },
  { hour: "10am", revenue: 205 },
  { hour: "11am", revenue: 178 },
  { hour: "12pm", revenue: 290 },
  { hour: "1pm", revenue: 340 },
  { hour: "2pm", revenue: 265 },
  { hour: "3pm", revenue: 190 },
];

function SalesDashboard() {
  const totalOrders = 48;
  const revenueToday = 1847.5;
  const avgOrderValue = revenueToday / totalOrders;
  const topItem = "Avocado Toast";
  const maxRevenue = Math.max(...MOCK_HOURLY.map((h) => h.revenue));

  const KPI_CARDS = [
    {
      label: "Total Orders Today",
      value: totalOrders.toString(),
      sub: "+12% vs yesterday",
      icon: ShoppingBag,
      color: "text-primary",
      bg: "bg-primary/10",
      up: true,
    },
    {
      label: "Revenue Today",
      value: `$${revenueToday.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      sub: "+8.4% vs yesterday",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      up: true,
    },
    {
      label: "Avg. Order Value",
      value: `$${avgOrderValue.toFixed(2)}`,
      sub: "+2.1% vs yesterday",
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      up: true,
    },
    {
      label: "Most Ordered",
      value: topItem,
      sub: "Ordered 14 times",
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      up: null,
    },
  ];

  const TOP_ITEMS = [
    { name: "Avocado Toast", orders: 14, revenue: 203.0 },
    { name: "Flat White", orders: 12, revenue: 60.0 },
    { name: "Iced Matcha Latte", orders: 10, revenue: 65.0 },
    { name: "Eggs Benedict", orders: 9, revenue: 152.1 },
    { name: "Harvest Grain Bowl", orders: 7, revenue: 129.5 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-admin text-xl">Sales Dashboard</h2>
        <p className="text-admin-muted text-xs mt-0.5">
          Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-admin-surface border border-admin rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", kpi.bg)}>
                  <Icon className={cn("w-4.5 h-4.5", kpi.color)} />
                </div>
                {kpi.up !== null && (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                    <ArrowUpRight className="w-3 h-3" />
                    {kpi.sub.split(" ")[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="text-admin font-display font-bold text-xl leading-none">{kpi.value}</p>
                <p className="text-admin-muted text-xs mt-1">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue chart + Top items */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Hourly Revenue Bar Chart */}
        <div className="xl:col-span-2 bg-admin-surface border border-admin rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-admin font-semibold text-sm">Hourly Revenue</p>
              <p className="text-admin-muted text-xs">Today's earnings by hour</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {MOCK_HOURLY.map((h) => {
              const pct = (h.revenue / maxRevenue) * 100;
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] text-admin-muted opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    ${h.revenue}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-primary/30 hover:bg-primary/60 transition-colors cursor-default relative overflow-hidden"
                    style={{ height: `${pct}%`, minHeight: "8px" }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all"
                      style={{ height: "40%" }}
                    />
                  </div>
                  <span className="text-[9px] text-admin-muted">{h.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-admin-surface border border-admin rounded-2xl p-5">
          <div className="mb-4">
            <p className="text-admin font-semibold text-sm">Top Items</p>
            <p className="text-admin-muted text-xs">By order count today</p>
          </div>
          <div className="flex flex-col gap-3">
            {TOP_ITEMS.map((item, i) => {
              const pct = (item.orders / TOP_ITEMS[0].orders) * 100;
              return (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-admin-muted w-3">#{i + 1}</span>
                      <span className="text-xs text-admin font-medium truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-admin-muted">{item.orders}x</span>
                      <span className="text-xs font-semibold text-primary">${item.revenue.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-admin-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order status breakdown */}
      <div className="bg-admin-surface border border-admin rounded-2xl p-5">
        <p className="text-admin font-semibold text-sm mb-4">Order Status Breakdown</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Received", count: 8, color: "bg-yellow-400" },
            { label: "Preparing", count: 15, color: "bg-blue-400" },
            { label: "Ready", count: 6, color: "bg-primary" },
            { label: "Served", count: 19, color: "bg-admin-muted" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 bg-admin-bg rounded-xl px-4 py-3">
              <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", s.color)} />
              <div>
                <p className="text-admin font-bold text-lg leading-none">{s.count}</p>
                <p className="text-admin-muted text-xs mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Orders Panel ─────────────────────────────────────────────────────────────
function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Live Orders</h2>
          <p className="text-admin-muted text-xs mt-0.5">{orders.filter(o => o.status !== 'served').length} active orders</p>
        </div>
        <div className="flex gap-2 text-xs">
          {(["received", "preparing", "ready", "served"] as OrderStatus[]).map((s) => (
            <span key={s} className="text-admin-muted capitalize hidden md:inline">
              {orders.filter(o => o.status === s).length} {s}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            isNew={order.status === "received"}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Category Management ──────────────────────────────────────────────────────
function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>(
    CATEGORIES.filter((c) => c.id !== "all")
  );
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmoji, setFormEmoji] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const openAdd = () => { setEditCat(null); setFormName(""); setFormEmoji(""); setShowModal(true); };
  const openEdit = (c: Category) => { setEditCat(c); setFormName(c.name); setFormEmoji(c.emoji); setShowModal(true); };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editCat) {
      setCategories((prev) => prev.map((c) => c.id === editCat.id ? { ...c, name: formName.trim(), emoji: formEmoji || c.emoji } : c));
    } else {
      const newCat: Category = { id: formName.toLowerCase().replace(/\s+/g, "-"), name: formName.trim(), emoji: formEmoji || "🍴" };
      setCategories((prev) => [...prev, newCat]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteTarget(null);
  };

  // Drag-to-reorder (HTML5 drag API)
  const handleDragStart = (i: number) => setDragIndex(i);
  const handleDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    const updated = [...categories];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(i, 0, moved);
    setCategories(updated);
    setDragIndex(null);
  };

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

      {/* Category list */}
      <div className="flex flex-col gap-2">
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className={cn(
              "bg-admin-surface border border-admin rounded-2xl px-4 py-3.5 flex items-center gap-4 cursor-grab active:cursor-grabbing transition-all select-none",
              dragIndex === i && "opacity-40 scale-[0.98]"
            )}
          >
            <GripVertical className="w-4 h-4 text-admin-muted/50 flex-shrink-0" />
            <span className="text-2xl leading-none">{cat.emoji}</span>
            <div className="flex-1">
              <p className="text-admin font-semibold text-sm">{cat.name}</p>
              <p className="text-admin-muted text-xs">{MENU_ITEMS.filter((m) => m.categoryId === cat.id).length} items</p>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in">
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
              {/* Preview */}
              {(formName || formEmoji) && (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-admin-bg rounded-xl border border-admin">
                  <span className="text-xl">{formEmoji || "🍴"}</span>
                  <span className="text-admin text-sm font-medium">{formName || "Category name"}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all">
                {editCat ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-xs bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in text-center">
            <div className="text-4xl mb-3">{deleteTarget.emoji}</div>
            <h3 className="font-display font-semibold text-admin mb-1">Delete "{deleteTarget.name}"?</h3>
            <p className="text-admin-muted text-xs mb-5">
              This will remove the category. Existing menu items won't be deleted.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteTarget.id)} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Menu Management ──────────────────────────────────────────────────────────
function MenuPanel() {
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState("");

  const toggleAvailability = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, available: !i.available } : i));
  };

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Menu Management</h2>
          <p className="text-admin-muted text-xs mt-0.5">{items.length} items total</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
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
                <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Item</th>
                <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Price</th>
                <th className="text-center px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Available</th>
                <th className="text-right px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-admin/50 hover:bg-admin-surface-2 transition-colors last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-admin-surface-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-admin font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-admin-muted capitalize hidden md:table-cell">{item.categoryId}</td>
                  <td className="px-4 py-3 text-admin font-display font-semibold">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={cn("transition-colors", item.available ? "text-primary" : "text-admin-muted")}
                      aria-label="Toggle availability"
                    >
                      {item.available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditItem(item); setShowModal(true); }} className="p-1.5 rounded-lg text-admin-muted hover:text-admin hover:bg-admin-surface-2 transition-all">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-admin-muted hover:text-destructive hover:bg-destructive/10 transition-all">
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

      {showModal && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-admin">{editItem ? "Edit Item" : "Add New Item"}</h3>
              <button onClick={() => setShowModal(false)} className="text-admin-muted hover:text-admin transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Item Name</label>
                <input defaultValue={editItem?.name} placeholder="e.g. Truffle Pasta" className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50" />
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Description</label>
                <textarea defaultValue={editItem?.description} placeholder="Describe the dish…" className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-admin-muted/50" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Price ($)</label>
                  <input type="number" step="0.5" defaultValue={editItem?.price} placeholder="0.00" className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50" />
                </div>
                <div>
                  <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Category</label>
                  <select defaultValue={editItem?.categoryId} className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="breakfast">Breakfast</option>
                    <option value="mains">Mains</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Image</label>
                <div className="w-full border-2 border-dashed border-admin rounded-xl p-6 flex flex-col items-center gap-2 text-admin-muted hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                  <Plus className="w-6 h-6" />
                  <p className="text-xs">Click to upload image</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all">Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all">
                {editItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Customer Insights ────────────────────────────────────────────────────────
function formatLastVisit(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function CustomerInsightsPanel() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"visits" | "spent" | "recent">("spent");

  const filtered = customers
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone || "").includes(search))
    .sort((a, b) => {
      if (sortBy === "visits") return b.visitCount - a.visitCount;
      if (sortBy === "spent") return b.totalSpent - a.totalSpent;
      return b.lastVisit.getTime() - a.lastVisit.getTime();
    });

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgSpend = totalRevenue / totalCustomers;
  const topCustomer = [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Customer Insights</h2>
          <p className="text-admin-muted text-xs mt-0.5">{totalCustomers} customers tracked</p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Customers", value: totalCustomers.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Avg. Lifetime Spend", value: `$${avgSpend.toFixed(0)}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Top Spender", value: topCustomer.name.split(" ")[0], icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-admin-surface border border-admin rounded-2xl p-4">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-2", kpi.bg)}>
                <Icon className={cn("w-4 h-4", kpi.color)} />
              </div>
              <p className="text-admin font-bold text-lg leading-none">{kpi.value}</p>
              <p className="text-admin-muted text-xs mt-1">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-muted" />
          <input
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-admin-surface-2 border border-admin rounded-xl text-admin placeholder:text-admin-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2.5 bg-admin-surface-2 border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="spent">Sort: Total Spent</option>
          <option value="visits">Sort: Visit Count</option>
          <option value="recent">Sort: Most Recent</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="bg-admin-surface rounded-2xl border border-admin overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin">
                {["Customer", "Contact", "Visits", "Total Spent", "Avg/Visit", "Last Visit", "Fav Item"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="border-b border-admin/50 hover:bg-admin-surface-2 transition-colors last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{c.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-admin font-medium text-xs">{c.name}</p>
                        {i === 0 && <span className="text-[9px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">Top</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-admin-muted text-xs">{c.phone}</p>
                    {c.email && <p className="text-admin-muted text-[10px] opacity-60 truncate max-w-[120px]">{c.email}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-admin font-bold">{c.visitCount}</span>
                      <div className="w-10 h-1 bg-admin-surface-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${Math.min((c.visitCount / 31) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-primary font-display font-bold">${c.totalSpent.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-admin-muted">${(c.totalSpent / c.visitCount).toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      Date.now() - c.lastVisit.getTime() < 24 * 60 * 60000
                        ? "bg-primary/15 text-primary"
                        : "bg-admin-surface-2 text-admin-muted"
                    )}>
                      {formatLastVisit(c.lastVisit)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-admin-muted text-xs">{c.favoriteItem ?? "—"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Franchise Panel ──────────────────────────────────────────────────────────
const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  approved: "bg-primary/20 text-primary border-primary/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};

function FranchisePanel() {
  const [applications, setApplications] = useState<FranchiseApplication[]>(MOCK_FRANCHISE_APPLICATIONS);
  const [selected, setSelected] = useState<FranchiseApplication | null>(null);
  const [notes, setNotes] = useState("");

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: action, adminNotes: notes } : a)
    );
    setSelected(null);
    setNotes("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display font-bold text-admin text-xl">Franchise Applications</h2>
        <p className="text-admin-muted text-xs mt-0.5">
          {applications.filter(a => a.status === 'pending').length} pending review
        </p>
      </div>

      <div className="bg-admin-surface rounded-2xl border border-admin overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin">
                {["Applicant", "Location", "Submitted", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-admin/50 hover:bg-admin-surface-2 transition-colors last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-admin font-medium">{app.name}</p>
                    <p className="text-admin-muted text-xs">{app.email}</p>
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{app.city}</td>
                  <td className="px-4 py-3 text-admin-muted text-xs">{app.submittedAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border capitalize", STATUS_STYLES[app.status])}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelected(app); setNotes(app.adminNotes ?? ""); }}
                      className="flex items-center gap-1 text-xs text-admin-muted hover:text-admin transition-colors px-2 py-1 rounded-lg hover:bg-admin-surface-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-admin">Application Details</h3>
              <button onClick={() => setSelected(null)} className="text-admin-muted hover:text-admin">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-admin-muted">Name</p><p className="text-admin text-sm font-medium">{selected.name}</p></div>
                <div><p className="text-xs text-admin-muted">City</p><p className="text-admin text-sm font-medium">{selected.city}</p></div>
                <div><p className="text-xs text-admin-muted">Phone</p><p className="text-admin text-sm">{selected.phone}</p></div>
                <div>
                  <p className="text-xs text-admin-muted">Status</p>
                  <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border capitalize", STATUS_STYLES[selected.status])}>
                    {selected.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Message</p>
                <p className="text-admin text-sm bg-admin-bg rounded-xl px-3 py-2.5 border border-admin">{selected.message}</p>
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this application…"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                  rows={3}
                />
              </div>
            </div>
            {selected.status === "pending" && (
              <div className="flex gap-3">
                <button onClick={() => handleAction(selected.id, "rejected")} className="flex-1 py-2.5 rounded-xl bg-destructive/20 text-destructive border border-destructive/30 text-sm font-semibold hover:bg-destructive/30 transition-all">Reject</button>
                <button onClick={() => handleAction(selected.id, "approved")} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all">Approve</button>
              </div>
            )}
            {selected.status !== "pending" && (
              <button onClick={() => setSelected(null)} className="w-full py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all">Close</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const SECTION_TITLE: Record<AdminSection, string> = {
    dashboard: "Sales Dashboard",
    orders: "Live Orders",
    menu: "Menu Management",
    categories: "Category Management",
    customers: "Customer Insights",
    franchise: "Franchise Applications",
  };

  return (
    <div className="min-h-screen bg-admin-bg flex dark">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar active={section} onSelect={(s: AdminSection) => setSection(s)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
            <AdminSidebar active={section} onSelect={(s: AdminSection) => { setSection(s); setMobileMenuOpen(false); }} />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-admin-surface border-b border-admin px-4 md:px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-admin-muted hover:text-admin transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-admin">{SECTION_TITLE[section]}</h1>
            <p className="text-admin-muted text-xs hidden sm:block">The Socialist Café — Admin</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-admin-muted text-xs hidden sm:inline">Live</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="animate-fade-in">
            {section === "dashboard" && <SalesDashboard />}
            {section === "orders" && <OrdersPanel />}
            {section === "menu" && <MenuPanel />}
            {section === "categories" && <CategoriesPanel />}
            {section === "customers" && <CustomerInsightsPanel />}
            {section === "franchise" && <FranchisePanel />}
          </div>
        </main>
      </div>
    </div>
  );
}
