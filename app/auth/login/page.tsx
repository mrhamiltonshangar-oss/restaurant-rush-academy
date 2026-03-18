import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <AppShell
      title="Sign in"
      subtitle="Use school email plus class code for students, or school email only for teachers."
      nav={[{ href: "/", label: "Home" }]}
    >
      <div className="mx-auto grid max-w-4xl gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black">Student login</h2>
          <div className="mt-4 grid gap-3">
            <input className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3" placeholder="School email" />
            <input className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3" placeholder="Class code" />
            <Link href="/student/dashboard">
              <Button className="w-full">Enter as student</Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">For production, connect this form to Supabase Auth and a section enrollment lookup.</p>
        </Card>
        <Card>
          <h2 className="text-2xl font-black">Teacher login</h2>
          <div className="mt-4 grid gap-3">
            <input className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3" placeholder="School email" />
            <Link href="/teacher">
              <Button className="w-full" variant="secondary">
                Enter as teacher
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">Teachers create classes, assign scenarios, track progress, and archive semesters from the dashboard.</p>
        </Card>
      </div>
    </AppShell>
  );
}
