"use client";

import { useState } from "react";
import { OrderCard } from "@/components/admin/OrderCard";
import type { Order, OrderStatus } from "@/data/mockData";

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Live Orders</h2>
          <p className="text-admin-muted text-xs mt-0.5">
            {orders.filter((o) => o.status !== "served").length} active orders
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          {(["received", "preparing", "ready", "served"] as OrderStatus[]).map((s) => (
            <span key={s} className="text-admin-muted capitalize hidden md:inline">
              {orders.filter((o) => o.status === s).length} {s}
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
