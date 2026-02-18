import { Order, OrderStatus } from "@/data/mockData";
import { StatusStepper } from "@/components/StatusStepper";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

type OrderCardProps = {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  isNew?: boolean;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: "New Order",
  preparing: "Preparing",
  ready: "Ready!",
  served: "Served",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  received: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  preparing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  ready: "bg-primary/20 text-primary border-primary/30",
  served: "bg-muted/40 text-muted-foreground border-border",
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  received: "preparing",
  preparing: "ready",
  ready: "served",
  served: null,
};

const NEXT_LABEL: Record<OrderStatus, string> = {
  received: "Start Preparing",
  preparing: "Mark Ready",
  ready: "Mark Served",
  served: "Completed",
};

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1 min ago";
  return `${mins} mins ago`;
}

export function OrderCard({ order, onStatusChange, isNew }: OrderCardProps) {
  const next = NEXT_STATUS[order.status];

  return (
    <div
      className={cn(
        "bg-admin-surface rounded-2xl border p-4 flex flex-col gap-4 transition-all duration-300",
        isNew
          ? "border-primary/50 shadow-pistachio"
          : "border-admin"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-admin font-display font-semibold">{order.id}</span>
            <span className="text-xs bg-secondary/20 text-admin-muted px-2 py-0.5 rounded-full border border-admin">
              Table {order.tableNumber}
            </span>
            {isNew && (
              <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold animate-pulse">
                NEW
              </span>
            )}
          </div>
          <p className="text-admin-muted text-xs mt-0.5">{order.customerName}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full border",
              STATUS_BADGE[order.status]
            )}
          >
            {STATUS_LABELS[order.status]}
          </span>
          <div className="flex items-center gap-1 text-admin-muted text-[10px]">
            <Clock className="w-3 h-3" />
            {timeAgo(order.createdAt)}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-1">
        {order.items.map((item) => (
          <div key={item.menuItemId} className="flex justify-between text-sm">
            <span className="text-admin-muted">
              <span className="text-admin font-medium">×{item.quantity}</span> {item.name}
            </span>
            <span className="text-admin-muted tabular-nums">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm pt-1 border-t border-admin mt-1">
          <span className="text-admin-muted font-medium">Total</span>
          <span className="text-admin font-display font-semibold">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Status stepper */}
      <div className="px-2">
        <StatusStepper currentStatus={order.status} variant="admin" />
      </div>

      {/* Action button */}
      {next && (
        <button
          onClick={() => onStatusChange(order.id, next)}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-pistachio"
        >
          {NEXT_LABEL[order.status]}
        </button>
      )}
    </div>
  );
}
