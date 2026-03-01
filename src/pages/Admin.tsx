"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSidebar, type AdminSection } from "@/components/admin/AdminSidebar";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminSalesDashboard } from "@/components/admin/AdminSalesDashboard";
import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";
import { AdminCategoriesPanel } from "@/components/admin/AdminCategoriesPanel";
import { AdminMenuPanel } from "@/components/admin/AdminMenuPanel";
import { AdminCustomerInsightsPanel } from "@/components/admin/AdminCustomerInsightsPanel";
import { AdminFranchisePanel } from "@/components/admin/AdminFranchisePanel";
import { supabase } from "@/lib/supabase/client";
import { Menu } from "lucide-react";

const SECTION_TITLE: Record<AdminSection, string> = {
  dashboard: "Sales Dashboard",
  orders: "Live Orders",
  menu: "Menu Management",
  categories: "Category Management",
  customers: "Customer Insights",
  franchise: "Franchise Applications",
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionMessage, setSessionMessage] = useState<string | undefined>();

  const checkServiceAndAdmin = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return false;
    const { data: settings } = await supabase
      .from("service_settings")
      .select("service_paused")
      .limit(1)
      .maybeSingle();
    if (settings?.service_paused) return false;
    const { data: adminRow } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();
    return Boolean(adminRow);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const isAdmin = await checkServiceAndAdmin();
      if (!cancelled && isAdmin) setLoggedIn(true);
    })();
    return () => { cancelled = true; };
  }, [checkServiceAndAdmin]);

  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("service_settings")
        .select("service_paused")
        .limit(1)
        .maybeSingle();
      if (!cancelled && data?.service_paused) {
        await supabase.auth.signOut();
        setLoggedIn(false);
        setSessionMessage("Service is paused. You have been signed out.");
      }
    }, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <AdminLogin
        onLogin={() => { setSessionMessage(undefined); setLoggedIn(true); }}
        sessionMessage={sessionMessage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-admin-bg flex dark">
      <div className="hidden md:flex">
        <AdminSidebar active={section} onSelect={(s: AdminSection) => setSection(s)} />
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden">
            <AdminSidebar
              active={section}
              onSelect={(s: AdminSection) => {
                setSection(s);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-admin-surface border-b border-admin px-4 md:px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-admin-muted hover:text-admin transition-colors"
            type="button"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-admin">{SECTION_TITLE[section]}</h1>
            <p className="text-admin-muted text-xs hidden sm:block">The Socialist Café — Admin</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-admin-muted text-xs hidden sm:inline">Live</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="animate-fade-in">
            {section === "dashboard" && <AdminSalesDashboard />}
            {section === "orders" && <AdminOrdersPanel />}
            {section === "menu" && <AdminMenuPanel />}
            {section === "categories" && <AdminCategoriesPanel />}
            {section === "customers" && <AdminCustomerInsightsPanel />}
            {section === "franchise" && <AdminFranchisePanel />}
          </div>
        </main>
      </div>
    </div>
  );
}
