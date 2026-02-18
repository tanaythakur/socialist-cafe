import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  LogOut,
  ChevronRight,
  BarChart3,
  Users,
  Tag,
} from "lucide-react";

export type AdminSection = "dashboard" | "orders" | "menu" | "categories" | "customers" | "franchise";

type AdminSidebarProps = {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
};

const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "dashboard", label: "Sales Dashboard", icon: BarChart3 },
  { id: "orders", label: "Live Orders", icon: LayoutDashboard, badge: 3 },
  { id: "menu", label: "Menu Management", icon: UtensilsCrossed },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "customers", label: "Customer Insights", icon: Users },
  { id: "franchise", label: "Franchise Apps", icon: Store, badge: 1 },
];

export function AdminSidebar({ active, onSelect }: AdminSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 bg-admin-surface border-r border-admin flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-admin">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <div>
            <p className="font-display font-semibold text-admin text-sm leading-tight">The Socialist</p>
            <p className="text-admin-muted text-[10px]">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-admin-muted hover:bg-admin-surface-2 hover:text-admin"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-admin">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-admin-muted hover:text-destructive hover:bg-destructive/10 transition-all">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
