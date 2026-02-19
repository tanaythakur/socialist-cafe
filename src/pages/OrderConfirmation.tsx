"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusStepper } from "@/components/StatusStepper";
import { OrderItem } from "@/data/mockData";
import { CheckCircle2, Clock, Home } from "lucide-react";
import { useEffect, useState } from "react";

const ORDER_CONFIRMATION_KEY = "order-confirmation-state";

type LocationState = {
  orderId: string;
  items: OrderItem[];
  total: number;
  tableNumber: number | null;
  customerName: string;
  estimatedMinutes: number;
};

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [state, setState] = useState<LocationState | null | undefined>(undefined);
  const [currentStatus, setCurrentStatus] = useState<"received" | "preparing" | "ready" | "served">("received");

  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem(ORDER_CONFIRMATION_KEY) : null;
    if (raw) {
      try {
        setState(JSON.parse(raw) as LocationState);
        sessionStorage.removeItem(ORDER_CONFIRMATION_KEY);
      } catch {
        setState(null);
      }
    } else {
      setState(null);
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    const t1 = setTimeout(() => setCurrentStatus("preparing"), 8000);
    return () => clearTimeout(t1);
  }, [state]);

  if (state === undefined) return null;

  if (!state) {
    router.replace("/");
    return null;
  }

  const { orderId, items, total, tableNumber, estimatedMinutes } = state;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 pb-12 pt-12">
      <div className="w-full max-w-md flex flex-col gap-6 animate-fade-in">
        {/* Success Icon */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center animate-bounce-in">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Order Placed!</h1>
            <p className="text-muted-foreground text-sm mt-1">
              We'll have it ready for you soon
            </p>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-card rounded-2xl border border-border shadow-cafe p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Order ID</p>
              <p className="font-display font-bold text-xl text-foreground mt-0.5">{orderId}</p>
            </div>
            {tableNumber && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Table</p>
                <p className="font-display font-bold text-xl text-foreground mt-0.5">{tableNumber}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-4 py-3">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm font-medium text-foreground">
              Estimated time:{" "}
              <span className="text-primary font-semibold">{estimatedMinutes} minutes</span>
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-card rounded-2xl border border-border shadow-cafe overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-display font-semibold text-foreground text-sm">Items Ordered</h3>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-border bg-muted/30 flex justify-between">
            <span className="text-sm text-muted-foreground">Total Paid</span>
            <span className="font-display font-bold text-foreground text-lg">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-card rounded-2xl border border-border shadow-cafe p-5">
          <h3 className="font-display font-semibold text-foreground mb-5 text-sm">Order Status</h3>
          <StatusStepper currentStatus={currentStatus} />
          <p className="text-center text-xs text-muted-foreground mt-4">
            {currentStatus === "received" && "Your order has been received by the kitchen"}
            {currentStatus === "preparing" && "Our team is preparing your order now ✨"}
            {currentStatus === "ready" && "Your order is ready! We're bringing it over"}
            {currentStatus === "served" && "Enjoy your meal! 🍽️"}
          </p>
        </div>

        {/* Back to menu */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted/50 transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
