import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser Supabase client — use in Client Components. Auth session is stored in cookies. */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/** Singleton for backward compatibility with existing imports (e.g. menu.ts). */
export const supabase = createClient();
