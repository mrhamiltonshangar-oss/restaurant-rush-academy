import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function StudentTeamPage() {
  return (
    <AppShell
      title="Team Mode"
      subtitle="Pair or small-team play uses shared restaurant progress, shared scenario checkpoints, and a common resume state."
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/team", label: "Team Mode" }
      ]}
      showSignOut
    >
      <Card>
        <h2 className="text-2xl font-black">Shared progress design</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "One restaurant save shared by the team",
            "Teacher can reset team progress without touching other sections",
            "Best for paired service challenges and partner labs"
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-[var(--border)] bg-white p-4 font-semibold">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
