import { CartItem } from "@/context/CartContext";

type OrderSummaryProps = {
  items: CartItem[];
  total: number;
  tableNumber?: number | null;
};

export function OrderSummary({ items, total, tableNumber }: OrderSummaryProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-cafe overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-display font-semibold text-foreground">Order Summary</h3>
        {tableNumber && (
          <p className="text-xs text-muted-foreground mt-0.5">Table {tableNumber}</p>
        )}
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
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
      <div className="px-5 py-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-display font-bold text-xl text-foreground">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
