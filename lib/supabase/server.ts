import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseEnv, serverEnv } from "./env";

type CookieOptions = {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none" | boolean;
  secure?: boolean;
};

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
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        }
      }
    }
  );
}
