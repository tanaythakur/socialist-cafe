import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OrderCard } from "@/components/admin/OrderCard";
import { MOCK_ORDERS, MOCK_FRANCHISE_APPLICATIONS, MENU_ITEMS, Order, OrderStatus, MenuItem, FranchiseApplication } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  Plus, Search, Edit3, Trash2, ToggleLeft, ToggleRight, X, Eye, Menu
} from "lucide-react";

type AdminSection = "orders" | "menu" | "franchise";

// === Admin Login ===
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

// === Orders Panel ===
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

// === Menu Management ===
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

      {/* Search */}
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

      {/* Items table */}
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
                      className={cn(
                        "transition-colors",
                        item.available ? "text-primary" : "text-admin-muted"
                      )}
                      aria-label="Toggle availability"
                    >
                      {item.available
                        ? <ToggleRight className="w-6 h-6" />
                        : <ToggleLeft className="w-6 h-6" />
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditItem(item); setShowModal(true); }}
                        className="p-1.5 rounded-lg text-admin-muted hover:text-admin hover:bg-admin-surface-2 transition-all"
                      >
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

      {/* Add/Edit Modal */}
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
                <input
                  defaultValue={editItem?.name}
                  placeholder="e.g. Truffle Pasta"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                />
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Description</label>
                <textarea
                  defaultValue={editItem?.description}
                  placeholder="Describe the dish…"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-admin-muted/50"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    defaultValue={editItem?.price}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Category</label>
                  <select
                    defaultValue={editItem?.categoryId}
                    className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="mains">Mains</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>
              </div>
              {/* Image upload mock */}
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Image</label>
                <div className="w-full border-2 border-dashed border-admin rounded-xl p-6 flex flex-col items-center gap-2 text-admin-muted hover:border-primary/50 hover:text-primary transition-colors cursor-pointer">
                  <Plus className="w-6 h-6" />
                  <p className="text-xs">Click to upload image</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all"
              >
                {editItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Franchise Panel ===
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
                  <th key={h} className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">
                    {h}
                  </th>
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
                  <td className="px-4 py-3 text-admin-muted text-xs">
                    {app.submittedAt.toLocaleDateString()}
                  </td>
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

      {/* Detail Modal */}
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
                <div><p className="text-xs text-admin-muted">Status</p>
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
              <button
                  onClick={() => handleAction(selected.id, "rejected")}
                  className="flex-1 py-2.5 rounded-xl bg-destructive/20 text-destructive border border-destructive/30 text-sm font-semibold hover:bg-destructive/30 transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(selected.id, "approved")}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all"
                >
                  Approve
                </button>
              </div>
            )}
            {selected.status !== "pending" && (
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// === Main Admin Page ===
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [section, setSection] = useState<AdminSection>("orders");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-admin-bg flex dark">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar active={section} onSelect={setSection} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
            <AdminSidebar active={section} onSelect={(s) => { setSection(s); setMobileMenuOpen(false); }} />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-admin-surface border-b border-admin px-4 md:px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-admin-muted hover:text-admin transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-admin capitalize">{section}</h1>
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
            {section === "orders" && <OrdersPanel />}
            {section === "menu" && <MenuPanel />}
            {section === "franchise" && <FranchisePanel />}
          </div>
        </main>
      </div>
    </div>
  );
}
