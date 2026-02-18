import { Category } from "@/data/mockData";
import { cn } from "@/lib/utils";

type CategoryTabsProps = {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
};

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 border",
            selected === cat.id
              ? "bg-primary text-primary-foreground border-primary shadow-pistachio scale-105"
              : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground"
          )}
        >
          <span>{cat.emoji}</span>
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
