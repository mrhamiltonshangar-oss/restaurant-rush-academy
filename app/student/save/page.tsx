import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { demoSaveState } from "@/lib/game/content";

export default function StudentSavePage() {
  return (
    <AppShell
      title="Save and Resume"
      subtitle="Every major action creates a checkpoint so students can return next period without losing context."
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/save", label: "Save" }
      ]}
    >
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Latest checkpoint</p>
            <h2 className="mt-2 text-2xl font-black">{demoSaveState.scenarioSlug}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{demoSaveState.checkpointLabel}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-strong)] p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-orange-200">Resume data stored</div>
            <p className="mt-2 text-sm">Scenario slug, step id, station, score, timer, mistakes, and business deltas.</p>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
