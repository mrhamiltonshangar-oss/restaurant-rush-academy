import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { demoTeacherDashboard } from "@/lib/game/content";
import { formatMinutes } from "@/lib/utils/format";

export function TeacherDashboard() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Class overview</p>
              <h2 className="mt-1 text-2xl font-black">Simple, fast teacher snapshot</h2>
            </div>
            <div className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-white">
              <div className="text-xs uppercase tracking-[0.18em] text-orange-200">FERPA-conscious display</div>
              <div className="mt-1 text-sm font-semibold">First names only on student-facing surfaces</div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {demoTeacherDashboard.sections.map((section) => (
              <div key={section.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{section.name}</div>
                    <p className="mt-1 text-sm text-[var(--muted)]">{section.activeStudents} active students</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[var(--accent)]">
                    {section.avgCompletion}% complete
                  </span>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Average progress</span>
                    <span className="font-bold">{section.avgCompletion}%</span>
                  </div>
                  <ProgressBar value={section.avgCompletion} />
                </div>
                <p className="mt-3 text-sm text-[var(--muted)]">Average play time: {formatMinutes(section.avgMinutes)}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Stuck points: {section.sanitationHotspots.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Students who may need support</p>
          <div className="mt-4 grid gap-3">
            {demoTeacherDashboard.classAlerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold">{alert.studentName}</div>
                    <p className="text-sm text-[var(--muted)]">{alert.scenarioTitle}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[var(--primary)]">
                    Needs review
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{alert.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Standards snapshot</p>
          <div className="mt-4 space-y-4">
            {demoTeacherDashboard.standardsSnapshot.map((item) => (
              <div key={item.standard}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{item.standard}</span>
                  <span className="font-bold">{item.proficiency}%</span>
                </div>
                <ProgressBar value={item.proficiency} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Teacher controls</p>
          <div className="mt-3 grid gap-3 text-sm text-[var(--muted)]">
            <p>Create classes and sections, duplicate last semester, and archive prior terms.</p>
            <p>Assign scenarios by unit, toggle team mode, and enable or disable leaderboards.</p>
            <p>Export CSV grades, review sanitation logs, and reset a student or team when needed.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
