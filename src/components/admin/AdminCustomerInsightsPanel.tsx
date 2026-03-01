"use client";

import { useState } from "react";
import type { Customer } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Search, DollarSign, TrendingUp, Star, Users } from "lucide-react";

function formatLastVisit(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function AdminCustomerInsightsPanel() {
  const [customers] = useState<Customer[]>([]);
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
  const avgSpend = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  const topCustomer = customers.length > 0 ? [...customers].sort((a, b) => b.totalSpent - a.totalSpent)[0] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Customer Insights</h2>
          <p className="text-admin-muted text-xs mt-0.5">{totalCustomers} customers tracked</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Customers", value: totalCustomers.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Avg. Lifetime Spend", value: `$${avgSpend.toFixed(0)}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
          { label: "Top Spender", value: topCustomer ? topCustomer.name.split(" ")[0] : "—", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10" },
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

      <div className="bg-admin-surface rounded-2xl border border-admin overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin">
                {["Customer", "Contact", "Visits", "Total Spent", "Avg/Visit", "Last Visit", "Fav Item"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-admin/50 hover:bg-admin-surface-2 transition-colors last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{c.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-admin font-medium text-xs">{c.name}</p>
                        {i === 0 && (
                          <span className="text-[9px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded-full font-semibold">
                            Top
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-admin-muted text-xs">{c.phone}</p>
                    {c.email && (
                      <p className="text-admin-muted text-[10px] opacity-60 truncate max-w-[120px]">{c.email}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-admin font-bold">{c.visitCount}</span>
                      <div className="w-10 h-1 bg-admin-surface-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/60 rounded-full"
                          style={{ width: `${Math.min((c.visitCount / 31) * 100, 100)}%` }}
                        />
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
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        Date.now() - c.lastVisit.getTime() < 24 * 60 * 60000
                          ? "bg-primary/15 text-primary"
                          : "bg-admin-surface-2 text-admin-muted"
                      )}
                    >
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
