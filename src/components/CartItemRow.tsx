import { CartItem } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem, updateInstructions } = useCart();

  return (
    <div className="flex flex-col gap-2 py-4 border-b border-border last:border-0 animate-fade-in">
      <div className="flex gap-3">
        {/* Image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display text-sm font-semibold text-foreground leading-tight">
              {item.name}
            </h4>
            <button
              onClick={() => removeItem(item.menuItemId)}
              className="text-muted-foreground hover:text-destructive transition-colors p-0.5 flex-shrink-0"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            ${item.price.toFixed(2)} each
          </p>

          {/* Quantity stepper */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-semibold w-5 text-center tabular-nums">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <span className="font-display font-semibold text-sm text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Special instructions */}
      <textarea
        placeholder="Special instructions (optional)…"
        value={item.specialInstructions}
        onChange={(e) => updateInstructions(item.menuItemId, e.target.value)}
        className="w-full text-xs bg-muted/60 border border-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground text-foreground"
        rows={2}
      />
    </div>
  );
}
