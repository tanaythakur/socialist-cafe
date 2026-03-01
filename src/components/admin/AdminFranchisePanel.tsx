"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { FranchiseApplication } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Eye, X } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  approved: "bg-primary/20 text-primary border-primary/30",
  rejected: "bg-destructive/20 text-destructive border-destructive/30",
};

export function AdminFranchisePanel() {
  const [applications, setApplications] = useState<FranchiseApplication[]>([]);
  const [selected, setSelected] = useState<FranchiseApplication | null>(null);
  const [notes, setNotes] = useState("");

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action, adminNotes: notes } : a))
    );
    setSelected(null);
    setNotes("");
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display font-bold text-admin text-xl">Franchise Applications</h2>
        <p className="text-admin-muted text-xs mt-0.5">
          {applications.filter((a) => a.status === "pending").length} pending review
        </p>
      </div>

      <div className="bg-admin-surface rounded-2xl border border-admin overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin">
                {["Applicant", "Location", "Submitted", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-admin-muted font-medium text-xs uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-admin/50 hover:bg-admin-surface-2 transition-colors last:border-0"
                >
                  <td className="px-4 py-3">
                    <p className="text-admin font-medium">{app.name}</p>
                    <p className="text-admin-muted text-xs">{app.email}</p>
                  </td>
                  <td className="px-4 py-3 text-admin-muted">{app.city}</td>
                  <td className="px-4 py-3 text-admin-muted text-xs">{app.submittedAt.toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full border capitalize",
                        STATUS_STYLES[app.status]
                      )}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelected(app);
                        setNotes(app.adminNotes ?? "");
                      }}
                      className="flex items-center gap-1 text-xs text-admin-muted hover:text-admin transition-colors px-2 py-1 rounded-lg hover:bg-admin-surface-2"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-admin-surface rounded-2xl border border-admin p-6 animate-fade-in shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-admin">Application Details</h3>
              <button onClick={() => setSelected(null)} className="text-admin-muted hover:text-admin">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-admin-muted">Name</p>
                  <p className="text-admin text-sm font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted">City</p>
                  <p className="text-admin text-sm font-medium">{selected.city}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted">Phone</p>
                  <p className="text-admin text-sm">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-admin-muted">Status</p>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full border capitalize",
                      STATUS_STYLES[selected.status]
                    )}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-admin-muted mb-1">Message</p>
                <p className="text-admin text-sm bg-admin-bg rounded-xl px-3 py-2.5 border border-admin">
                  {selected.message}
                </p>
              </div>
              <div>
                <label className="text-xs text-admin-muted mb-1.5 block">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this application…"
                  className="w-full px-3 py-2.5 bg-admin-bg border border-admin rounded-xl text-admin text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-admin-muted/50"
                  rows={3}
                />
              </div>
            </div>
            {selected.status === "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(selected.id, "rejected")}
                  className="flex-1 py-2.5 rounded-xl bg-destructive/20 text-destructive border border-destructive/30 text-sm font-semibold hover:bg-destructive/30 transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(selected.id, "approved")}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-pistachio hover:opacity-90 transition-all"
                >
                  Approve
                </button>
              </div>
            )}
            {selected.status !== "pending" && (
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 rounded-xl border border-admin text-admin-muted text-sm font-medium hover:bg-admin-surface-2 transition-all"
              >
                Close
              </button>
            )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
