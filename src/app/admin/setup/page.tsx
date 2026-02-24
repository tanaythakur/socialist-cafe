import { SeedButton } from "./SeedButton";

export default async function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-admin-surface rounded-2xl border border-admin p-8">
        <h1 className="font-display font-bold text-admin text-lg">First-time setup</h1>
        <p className="text-admin-muted text-sm mt-2">
          Create the super admin account (email/password from SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env). Run this once after applying the{" "}
          <code className="text-xs bg-admin-bg border border-admin px-1 rounded">profiles</code> table in Supabase.
        </p>
        <div className="mt-6">
          <SeedButton />
        </div>
        <p className="text-admin-muted text-xs mt-4">
          <a href="/admin" className="text-primary hover:underline">Back to Admin login</a>
        </p>
      </div>
    </div>
  );
}
