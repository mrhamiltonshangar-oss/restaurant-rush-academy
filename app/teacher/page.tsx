import { AppShell } from "@/components/layout/app-shell";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { Card } from "@/components/ui/card";

export default function TeacherPage() {
  return (
    <AppShell
      title="Teacher Dashboard"
      subtitle="Manage sections, assign content, monitor where students struggle, and keep grading simple."
      nav={[
        { href: "/teacher", label: "Overview" },
        { href: "/teacher/classes", label: "Classes" },
        { href: "/teacher/assignments", label: "Assignments" },
        { href: "/teacher/content", label: "Content CMS" },
        { href: "/teacher/reports", label: "Reports" },
        { href: "/teacher/settings", label: "Settings" }
      ]}
    >
      <div className="space-y-4">
        <TeacherDashboard />
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Admin workflows included in MVP</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Create classes and sections",
              "Duplicate a class for next semester",
              "Archive old terms without deleting history",
              "Export CSV progress and grade summaries"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--border)] bg-white p-4 font-semibold">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
