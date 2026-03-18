import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "./env";

export function createSupabaseAdminClient() {
  if (!serverEnv.success || !serverEnv.data.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(
    serverEnv.data.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.data.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
