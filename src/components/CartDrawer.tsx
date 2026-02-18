import { useCart } from "@/context/CartContext";
import { CartItemRow } from "@/components/CartItemRow";
import { X, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function CartDrawer() {
  const { isOpen, setIsOpen, items, total, itemCount } = useCart();
  const navigate = useNavigate();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer — slides up on mobile, sidebar on desktop */}
      <div className="fixed z-50 bottom-0 left-0 right-0 md:right-0 md:left-auto md:top-0 md:bottom-0 md:w-96 flex flex-col bg-card animate-slide-up md:animate-none md:shadow-[-4px_0_30px_rgba(0,0,0,0.1)] rounded-t-3xl md:rounded-none">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground text-lg">
              Your Order
            </h2>
            {itemCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 max-h-[50vh] md:max-h-full">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">Your cart is empty</p>
              <p className="text-muted-foreground text-xs">Add items from the menu to get started</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItemRow key={item.menuItemId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-border flex flex-col gap-3 flex-shrink-0 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span className="font-display font-semibold text-foreground text-lg">
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-base shadow-pistachio hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
