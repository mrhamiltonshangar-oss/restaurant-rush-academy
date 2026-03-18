import { AppShell } from "@/components/layout/app-shell";
import { AuthPanel } from "@/components/auth/auth-panel";
import { redirectAuthenticatedUser } from "@/lib/supabase/auth";

export default async function LoginPage() {
  await redirectAuthenticatedUser();

  return (
    <AppShell
      title="Sign in"
      subtitle="Students use school email, password, and class code. Teachers use school email and password."
      nav={[{ href: "/", label: "Home" }]}
    >
      <AuthPanel />
    </AppShell>
  );
}
