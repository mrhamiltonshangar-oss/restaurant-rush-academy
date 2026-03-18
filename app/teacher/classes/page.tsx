import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { demoSections } from "@/lib/game/content";

export default function TeacherClassesPage() {
  return (
    <AppShell
      title="Classes and Sections"
      subtitle="Create sections, manage class codes, switch between team and individual mode, and prepare next semester."
      nav={[
        { href: "/teacher", label: "Overview" },
        { href: "/teacher/classes", label: "Classes" }
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {demoSections.map((section) => (
          <Card key={section.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{section.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Class code: {section.classCode}</p>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold">{section.mode}</span>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">Unlocked units: {section.unitUnlocks.join(", ")}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
