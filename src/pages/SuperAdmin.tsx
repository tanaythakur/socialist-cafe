"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Coffee, Power, PowerOff, LogOut } from "lucide-react";

interface Cafe {
  id: string;
  name: string;
  slug: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
}

function SuperAdminLogin({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError(authError.message ?? "Invalid email or password.");
        return;
      }
      if (!authData.user?.id) {
        setError("Login failed. Please try again.");
        return;
      }
      const { data: settings } = await supabase
        .from("service_settings")
        .select("service_paused")
        .limit(1)
        .maybeSingle();
      if (settings?.service_paused) {
        await supabase.auth.signOut();
        setError("Service is paused. Please try again later.");
        return;
      }
      const { data: adminRow, error: adminError } = await supabase
        .from("admins")
        .select("user_id, is_super_admin")
        .eq("user_id", authData.user.id)
        .maybeSingle();
      if (adminError || !adminRow?.is_super_admin) {
        await supabase.auth.signOut();
        setError("This account is not a super admin.");
        return;
      }
      onLogin();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-admin-surface rounded-2xl border border-admin p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-pistachio">
            <Coffee className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-admin text-lg">Super Admin</h1>
            <p className="text-admin-muted text-xs">The Socialist Café</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-admin-muted mb-1.5 block uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="superadmin@socialist.cafe"
              className="w-full px-4 py-3 rounded-xl bg-admin-bg border border-admin text-admin placeholder:text-admin-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-admin-muted mb-1.5 block uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-admin-bg border border-admin text-admin placeholder:text-admin-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          {error && (
            <p className="text-destructive text-xs bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-pistachio hover:opacity-90 active:scale-[0.98] transition-all mt-2 disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SuperAdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [cafesLoading, setCafesLoading] = useState(false);
  const [servicePaused, setServicePaused] = useState(false);
  const [pauseLoading, setPauseLoading] = useState(false);

  const checkSuperAdmin = useCallback(async () => {
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
      .select("is_super_admin")
      .eq("user_id", session.user.id)
      .maybeSingle();
    return Boolean(adminRow?.is_super_admin);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const isSuper = await checkSuperAdmin();
      if (!cancelled && isSuper) setLoggedIn(true);
    })();
    return () => { cancelled = true; };
  }, [checkSuperAdmin]);

  useEffect(() => {
    if (!loggedIn) return;
    let cancelled = false;
    setCafesLoading(true);
    (async () => {
      const { data: settings } = await supabase
        .from("service_settings")
        .select("service_paused")
        .limit(1)
        .maybeSingle();
      const { data: cafesData } = await supabase
        .from("cafes")
        .select("id, name, slug, address, is_active, created_at")
        .order("name");
      if (!cancelled) {
        setServicePaused(Boolean(settings?.service_paused));
        setCafes((cafesData ?? []) as Cafe[]);
      }
      setCafesLoading(false);
    })();
    return () => { cancelled = true; };
  }, [loggedIn]);

  const handleToggleService = async () => {
    setPauseLoading(true);
    const newPaused = !servicePaused;
    const { error } = await supabase.rpc("set_service_paused", { paused: newPaused });
    setPauseLoading(false);
    if (!error) setServicePaused(newPaused);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  };

  if (!loggedIn) return <SuperAdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-admin-bg dark">
      <header className="bg-admin-surface border-b border-admin px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Coffee className="size-6 text-primary" />
          <div>
            <h1 className="font-display font-bold text-admin text-lg">Super Admin</h1>
            <p className="text-admin-muted text-xs">Café list & service control</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-2 text-admin-muted hover:text-admin text-sm px-3 py-2 rounded-lg border border-admin hover:bg-admin-surface-2 transition-colors"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </header>

      <main className="p-4 md:p-6 max-w-4xl mx-auto">
        <section className="bg-admin-surface border border-admin rounded-2xl p-5 mb-6">
          <h2 className="font-display font-bold text-admin text-base mb-1">Service status</h2>
          <p className="text-admin-muted text-xs mb-4">
            When paused, no admin can access the admin dashboard until you resume.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "size-3 rounded-full",
                  servicePaused ? "bg-destructive" : "bg-primary animate-pulse"
                )}
              />
              <span className="text-admin text-sm font-medium">
                Service: {servicePaused ? "Paused" : "Running"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleService}
              disabled={pauseLoading}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50",
                servicePaused
                  ? "bg-primary text-primary-foreground shadow-pistachio hover:opacity-90"
                  : "bg-destructive/15 text-destructive border border-destructive/40 hover:bg-destructive/25"
              )}
            >
              {servicePaused ? (
                <>
                  <Power className="size-4" />
                  {pauseLoading ? "Resuming…" : "Resume service"}
                </>
              ) : (
                <>
                  <PowerOff className="size-4" />
                  {pauseLoading ? "Pausing…" : "Pause service"}
                </>
              )}
            </button>
          </div>
        </section>

        <section className="bg-admin-surface border border-admin rounded-2xl p-5">
          <h2 className="font-display font-bold text-admin text-base mb-1">Cafes</h2>
          <p className="text-admin-muted text-xs mb-4">List of all cafes.</p>
          {cafesLoading ? (
            <p className="text-admin-muted text-sm">Loading…</p>
          ) : cafes.length === 0 ? (
            <p className="text-admin-muted text-sm">No cafes yet. Add cafes from Supabase Table Editor or SQL.</p>
          ) : (
            <ul className="space-y-3">
              {cafes.map((cafe) => (
                <li
                  key={cafe.id}
                  className="flex items-center justify-between gap-4 py-3 px-4 bg-admin-bg rounded-xl border border-admin"
                >
                  <div className="min-w-0">
                    <p className="text-admin font-medium text-sm truncate">{cafe.name}</p>
                    {cafe.address && (
                      <p className="text-admin-muted text-xs truncate mt-0.5">{cafe.address}</p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full shrink-0",
                      cafe.is_active ? "bg-primary/15 text-primary" : "bg-admin-muted/20 text-admin-muted"
                    )}
                  >
                    {cafe.is_active ? "Active" : "Inactive"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
