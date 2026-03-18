import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { StationSimulator } from "@/components/game/station-simulator";
import { getScenarioBySlug } from "@/lib/data/demo";

export default async function ScenarioPage({
  params
}: {
  params: Promise<{ scenarioSlug: string }>;
}) {
  const { scenarioSlug } = await params;
  const scenario = getScenarioBySlug(scenarioSlug);

  if (!scenario) notFound();

  return (
    <AppShell
      title={scenario.title}
      subtitle={scenario.subtitle}
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/map", label: "Map" },
        { href: `/student/scenarios/${scenario.slug}`, label: "Scenario" }
      ]}
    >
      <div className="grid gap-4">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">{scenario.mode}</p>
              <h2 className="mt-1 text-2xl font-black">Scenario briefing</h2>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">{scenario.summary}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-white">
              <div className="text-xs uppercase tracking-[0.18em] text-orange-200">Estimated time</div>
              <div className="mt-1 text-lg font-bold">{scenario.estimatedMinutes} minutes</div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {scenario.steps.map((step) => (
              <div key={step.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="font-bold">{step.title}</div>
                <p className="mt-2 text-sm text-[var(--muted)]">{step.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {scenario.stationOrder.map((station) => (
          <StationSimulator key={station} station={station} scenarioSlug={scenario.slug} />
        ))}

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Reflection prompts</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {scenario.reflectionPrompts.map((prompt) => (
              <div key={prompt.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                <div className="font-bold">{prompt.standardTag}</div>
                <p className="mt-2 text-sm text-[var(--muted)]">{prompt.prompt}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
