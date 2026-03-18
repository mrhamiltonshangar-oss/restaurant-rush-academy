import { ReactNode } from "react";
import { requireAuthenticatedRole } from "@/lib/supabase/auth";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedRole("student");
  return children;
}
