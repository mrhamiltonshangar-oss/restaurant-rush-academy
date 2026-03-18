import { AppShell } from "@/components/layout/app-shell";
import { MenuPlanner } from "@/components/game/menu-planner";

export default function StudentMenuPage() {
  return (
    <AppShell
      title="Menu Planning Lab"
      subtitle="Build menus from templates, track allergens, test pricing, and prepare for later menu engineering concepts."
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/menu", label: "Menu Planning" }
      ]}
    >
      <MenuPlanner />
    </AppShell>
  );
}
