"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminProfile } from "@/lib/supabase/admin-types";

type AdminRow = { id: string; email: string; role: "super_admin" | "admin"; is_paused: boolean; created_at: string };

export type AdminManagementActions = {
  listAdmins: () => Promise<AdminRow[]>;
  createAdmin: (email: string, password: string, name?: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  deleteAdmin: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  togglePauseAdmin: (id: string) => Promise<{ ok: true } | { ok: false; error: string }>;
};

type AdminManagementPanelProps = {
  currentProfile: AdminProfile;
  actions: AdminManagementActions;
};

export function AdminManagementPanel({ currentProfile, actions }: AdminManagementPanelProps) {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createName, setCreateName] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await actions.listAdmins();
      setAdmins(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, [actions]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSubmitting(true);
    const result = await actions.createAdmin(createEmail.trim(), createPassword, createName.trim() || undefined);
    setCreateSubmitting(false);
    if (result.ok) {
      setShowCreate(false);
      setCreateEmail("");
      setCreatePassword("");
      setCreateName("");
      loadAdmins();
    } else {
      setCreateError(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this admin? They will no longer be able to log in.")) return;
    setActionError("");
    const result = await actions.deleteAdmin(id);
    if (result.ok) loadAdmins();
    else setActionError(result.error);
  };

  const handleTogglePause = async (id: string) => {
    setActionError("");
    const result = await actions.togglePauseAdmin(id);
    if (result.ok) loadAdmins();
    else setActionError(result.error);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-admin text-xl">Admin Management</h2>
          <p className="text-admin-muted text-xs mt-0.5">
            Create, pause, or remove admins. Only super admins can access this section.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Admin
        </button>
      </div>

      {actionError && (
        <p className="text-destructive text-xs bg-destructive/10 px-3 py-2 rounded-lg mb-4">{actionError}</p>
      )}

      {loading ? (
        <p className="text-admin-muted text-sm">Loading admins…</p>
      ) : error ? (
        <p className="text-destructive text-sm">{error}</p>
      ) : (
        <div className="bg-admin-surface rounded-2xl border border-admin overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin">
                  <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-b border-admin/50 hover:bg-admin-surface-2 transition-colors last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-admin font-medium">{a.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full border",
                          a.role === "super_admin"
                            ? "bg-amber-500/20 text-amber-600 border-amber-500/30"
                            : "bg-admin-surface-2 text-admin-muted border-admin"
                        )}
                      >
                        {a.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          a.is_paused ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                        )}
                      >
                        {a.is_paused ? "Paused" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {a.id !== currentProfile.id && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePause(a.id)}
                            className="p-2 rounded-lg text-admin-muted hover:text-admin hover:bg-admin-surface-2 transition-all"
                            title={a.is_paused ? "Unpause" : "Pause"}
                          >
                            {a.is_paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(a.id)}
                            className="p-2 rounded-lg text-admin-muted hover:text-destructive hover:bg-destructive/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-admin">Create Admin</h3>
              <button type="button" onClick={() => setShowCreate(false)} className="text-admin-muted hover:text-admin">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block uppercase tracking-wider">Name (optional)</label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Display name"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {createError && (
                <p className="text-destructive text-xs bg-destructive/10 px-3 py-2 rounded-lg">{createError}</p>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
                >
                  {createSubmitting ? "Creating…" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
