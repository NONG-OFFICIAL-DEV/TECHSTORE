import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const IMAGE_BUCKET = "images";

let client: SupabaseClient | null = null;

/** Lazy singleton so a missing env var only throws when an upload is
 * actually attempted, not at module load / build time. Uses the service
 * role key — bypasses Row Level Security, so this must stay server-only. */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage is not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  return client;
}
