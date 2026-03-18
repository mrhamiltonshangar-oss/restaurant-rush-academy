import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function TeacherSettingsPage() {
  return (
    <AppShell
      title="Teacher Settings"
      subtitle="Toggle team mode, leaderboards, larger-text defaults, simplified instructions, and grading weights."
      nav={[
        { href: "/teacher", label: "Overview" },
        { href: "/teacher/settings", label: "Settings" }
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[
          "Enable leaderboard by section",
          "Enable team mode with shared save progress",
          "Default students to simplified instructions mode",
          "Adjust grade weighting for completion, reflection, and safety"
        ].map((setting) => (
          <Card key={setting}>
            <p className="font-semibold">{setting}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
