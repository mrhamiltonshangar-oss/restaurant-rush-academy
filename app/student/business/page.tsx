import { AppShell } from "@/components/layout/app-shell";
import { BusinessDashboard } from "@/components/game/business-dashboard";

export default function StudentBusinessPage() {
  return (
    <AppShell
      title="Restaurant Business View"
      subtitle="Manage cash, inventory, morale, satisfaction, and goofy surprise events without turning the game into spreadsheet overload."
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/business", label: "Business" }
      ]}
    >
      <BusinessDashboard />
    </AppShell>
  );
}
