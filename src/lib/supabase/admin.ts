import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Supabase client with service role — use ONLY in server code (Server Actions, API routes).
 * Bypasses RLS. Used for profiles and auth.admin (create/delete users).
 */
export function createAdminClient() {
  if (!serviceRoleKey || serviceRoleKey === "your_service_role_key") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set or is placeholder.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
