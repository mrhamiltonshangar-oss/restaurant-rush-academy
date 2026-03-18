import { ReactNode } from "react";
import { requireAuthenticatedRole } from "@/lib/supabase/auth";

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedRole("teacher");
  return children;
}
