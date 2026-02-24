"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { seedSuperAdmin } from "../actions";

export function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSeed = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await seedSuperAdmin();
      if (result.ok) {
        setMessage({ type: "ok", text: result.message });
        router.refresh();
      } else {
        setMessage({ type: "err", text: result.error });
      }
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create Super Admin"}
      </button>
      {message && (
        <p
          className={
            message.type === "ok"
              ? "text-primary text-sm mt-3"
              : "text-destructive text-sm mt-3 bg-destructive/10 px-3 py-2 rounded-lg"
          }
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
