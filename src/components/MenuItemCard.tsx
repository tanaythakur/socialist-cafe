import { MenuItem } from "@/data/mockData";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

type MenuItemCardProps = {
  item: MenuItem;
};

const TAG_STYLES: Record<string, string> = {
  vegan: "bg-green-100 text-green-700",
  vegetarian: "bg-lime-100 text-lime-700",
  "gluten-free": "bg-amber-100 text-amber-700",
};

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartQty = items.find((i) => i.menuItemId === item.id)?.quantity ?? 0;

  const handleAdd = () => {
    if (!item.available) return;
    addItem(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl overflow-hidden shadow-cafe border border-border transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        !item.available && "opacity-70"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="bg-card text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        {cartQty > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-pistachio animate-bounce-in">
            {cartQty}
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                  TAG_STYLES[tag] ?? "bg-secondary text-secondary-foreground"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground leading-tight">
            {item.name}
          </h3>
          <p className="text-muted-foreground text-xs leading-relaxed mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-foreground">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!item.available}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
              item.available
                ? justAdded
                  ? "bg-green-500 text-white scale-95"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95 shadow-pistachio"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
