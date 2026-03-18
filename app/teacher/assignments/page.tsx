import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { scenarios } from "@/lib/game/content";

export default function TeacherAssignmentsPage() {
  return (
    <AppShell
      title="Assignments"
      subtitle="Assign scenarios by class section, unlock units gradually, and keep challenge modes optional."
      nav={[
        { href: "/teacher", label: "Overview" },
        { href: "/teacher/assignments", label: "Assignments" }
      ]}
      showSignOut
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scenarios.map((scenario) => (
          <Card key={scenario.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-black">{scenario.title}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{scenario.unitTag}</p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[var(--primary)]">
                {scenario.mode}
              </span>
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">{scenario.subtitle}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
