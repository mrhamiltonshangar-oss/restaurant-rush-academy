import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseEnv, serverEnv } from "./env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv() || !serverEnv.success) return null;

  const cookieStore = await cookies();

  return createServerClient(
    serverEnv.data.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: "", ...options });
        }
      }
    }
  );
}
