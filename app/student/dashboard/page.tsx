import { AppShell } from "@/components/layout/app-shell";
import { BusinessDashboard } from "@/components/game/business-dashboard";
import { MenuPlanner } from "@/components/game/menu-planner";
import { RestaurantSetup } from "@/components/game/restaurant-setup";
import { ScenarioMap } from "@/components/game/scenario-map";
import { AccessibilityPanel } from "@/components/game/accessibility-panel";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getStudentDashboardData } from "@/lib/data/demo";
import { formatMinutes } from "@/lib/utils/format";

export default function StudentDashboardPage() {
  const data = getStudentDashboardData();

  return (
    <AppShell
      title={`Welcome back, ${data.student.firstName}`}
      subtitle="Resume exactly where you left off, explore the semester map, and keep your restaurant growing one service at a time."
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/map", label: "Scenario Map" },
        { href: "/student/menu", label: "Menu Planning" },
        { href: "/student/business", label: "Business" },
        { href: "/student/team", label: "Team Mode" },
        { href: "/student/save", label: "Save" },
        { href: "/student/reflection", label: "Reflection" },
        { href: "/teacher", label: "Teacher Preview" }
      ]}
      showSignOut
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Resume state</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black">{data.currentScenario.title}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{data.saveState.checkpointLabel}</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-orange-200">Play time</div>
                <div className="mt-1 text-lg font-bold">{formatMinutes(94)}</div>
              </div>
            </div>
            <ProgressBar className="mt-4" value={data.saveState.progressPercent} />
            <p className="mt-3 text-sm text-[var(--muted)]">
              Autosave checkpoints happen after every major action, so 10-minute Chromebook sessions still feel useful.
            </p>
          </Card>
          <RestaurantSetup />
          <ScenarioMap />
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Achievements</p>
            <div className="mt-4 grid gap-3">
              {data.achievements.map((achievement) => (
                <div key={achievement.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold">{achievement.title}</div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${achievement.unlocked ? "bg-teal-50 text-[var(--accent)]" : "bg-stone-100 text-[var(--muted)]"}`}>
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{achievement.description}</p>
                </div>
              ))}
            </div>
          </Card>
          <MenuPlanner />
          <AccessibilityPanel />
          <BusinessDashboard />
        </div>
      </div>
    </AppShell>
  );
}
