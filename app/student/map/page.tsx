import { AppShell } from "@/components/layout/app-shell";
import { ScenarioMap } from "@/components/game/scenario-map";

export default function StudentMapPage() {
  return (
    <AppShell
      title="Semester Story Map"
      subtitle="Twelve scenarios move from onboarding to championship service, with guided difficulty and unit unlocks."
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/map", label: "Map" }
      ]}
      showSignOut
    >
      <ScenarioMap />
    </AppShell>
  );
}
