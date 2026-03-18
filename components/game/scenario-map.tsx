import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { scenarios } from "@/lib/game/content";

export function ScenarioMap() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {scenarios.map((scenario, index) => (
        <Link href={`/student/scenarios/${scenario.slug}`} key={scenario.id} className="block">
          <Card className="h-full transition hover:-translate-y-0.5 hover:border-[var(--accent)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Week {scenario.week}</p>
                <h3 className="mt-1 text-xl font-black">{scenario.title}</h3>
              </div>
              <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold">
                {scenario.mode}
              </div>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">{scenario.subtitle}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {scenario.standardTags.map((tag) => (
                <span key={tag} className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                  {tag}
                </span>
              ))}
            </div>
            <ProgressBar className="mt-4" value={Math.min(100, index * 8 + 12)} />
          </Card>
        </Link>
      ))}
    </div>
  );
}
