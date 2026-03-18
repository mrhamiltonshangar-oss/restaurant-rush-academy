import { AppShell } from "@/components/layout/app-shell";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";

export default function TeacherReportsPage() {
  return (
    <AppShell
      title="Reporting and Grades"
      subtitle="Standards-aligned progress, stuck-point review, sanitation trends, time played, and CSV-ready grade support."
      nav={[
        { href: "/teacher", label: "Overview" },
        { href: "/teacher/reports", label: "Reports" }
      ]}
      showSignOut
    >
      <TeacherDashboard />
    </AppShell>
  );
}
