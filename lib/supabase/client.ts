"use client";

import { createBrowserClient } from "@supabase/ssr";
import { hasSupabaseEnv, publicEnv } from "./env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseEnv() || !publicEnv.success) return null;

  return createBrowserClient(
    publicEnv.data.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.data.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
