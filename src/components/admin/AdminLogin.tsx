"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type AdminLoginProps = {
  onLogin: () => void;
  sessionMessage?: string;
};

export function AdminLogin({ onLogin, sessionMessage }: AdminLoginProps) {
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
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();
      if (adminError || !adminRow) {
        await supabase.auth.signOut();
        setError("This account is not an admin.");
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
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-pistachio">
            <span className="font-display font-bold text-primary-foreground text-lg">S</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-admin text-lg">Admin Portal</h1>
            <p className="text-admin-muted text-xs">The Socialist Café</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-admin-muted mb-1.5 block uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@socialist.cafe"
              className="w-full px-4 py-3 rounded-xl bg-admin-bg border border-admin text-admin placeholder:text-admin-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-admin-muted mb-1.5 block uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-admin-bg border border-admin text-admin placeholder:text-admin-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          {sessionMessage && (
            <p className="text-primary text-xs bg-primary/10 px-3 py-2 rounded-lg border border-primary/20">
              {sessionMessage}
            </p>
          )}
          {error && (
            <p className="text-destructive text-xs bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
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
