import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export type AuthProfile = {
  id: string;
  first_name: string;
  email: string;
  role: "teacher" | "student";
};

export const getSessionContext = cache(async () => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      supabase: null,
      user: null,
      profile: null as AuthProfile | null
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      profile: null as AuthProfile | null
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    supabase,
    user,
    profile: (profile as AuthProfile | null) ?? null
  };
});

export async function requireAuthenticatedRole(role: "teacher" | "student") {
  const context = await getSessionContext();

  if (!context.user || !context.profile) {
    redirect("/auth/login");
  }

  if (context.profile.role !== role) {
    redirect(context.profile.role === "teacher" ? "/teacher" : "/student/dashboard");
  }

  return context;
}

export async function redirectAuthenticatedUser() {
  const context = await getSessionContext();

  if (!context.profile) return;

  redirect(context.profile.role === "teacher" ? "/teacher" : "/student/dashboard");
}
