"use client";

import { cn } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Star,
  ArrowUpRight,
} from "lucide-react";

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

export function AdminSalesDashboard() {
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
      <div>
        <h2 className="font-display font-bold text-admin text-xl">Sales Dashboard</h2>
        <p className="text-admin-muted text-xs mt-0.5">
          Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-admin-surface border border-admin rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-admin font-semibold text-sm">Hourly Revenue</p>
              <p className="text-admin-muted text-xs">Today&apos;s earnings by hour</p>
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
