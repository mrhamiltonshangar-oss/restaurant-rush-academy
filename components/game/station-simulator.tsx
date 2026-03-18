"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAutosave } from "@/hooks/use-autosave";
import { demoSaveState, stationConfigs } from "@/lib/game/content";
import { StationType } from "@/types/game";

export function StationSimulator({
  station,
  scenarioSlug
}: {
  station: StationType;
  scenarioSlug: string;
}) {
  const config = stationConfigs[station];
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [funnyFeedback, setFunnyFeedback] = useState("Your station is quiet. Suspiciously quiet.");
  const { saveState, persist, lastSaved } = useAutosave({ ...demoSaveState, scenarioSlug, station, stepId: `${scenarioSlug}-${station}` });

  const score = useMemo(
    () =>
      config.actions
        .filter((action) => selectedActions.includes(action.id))
        .reduce((total, action) => total + action.points, 0),
    [config.actions, selectedActions]
  );

  async function toggleAction(actionId: string) {
    const exists = selectedActions.includes(actionId);
    const nextActions = exists
      ? selectedActions.filter((id) => id !== actionId)
      : [...selectedActions, actionId];
    const nextScore = config.actions
      .filter((action) => nextActions.includes(action.id))
      .reduce((total, action) => total + action.points, 0);

    setSelectedActions(nextActions);
    setFunnyFeedback(
      exists
        ? "You rewound the station a bit. The sauce judges quietly."
        : config.successTip
    );

    await persist({
      ...saveState,
      station,
      scenarioSlug,
      stepId: `${scenarioSlug}-${station}`,
      checkpointLabel: `${config.title}: ${nextActions.length}/${config.actions.length} actions`,
      progressPercent: Math.round((nextActions.length / config.actions.length) * 100),
      score: nextScore,
      updatedAt: new Date().toISOString(),
      mistakes: nextActions.length < 2 ? ["Station setup still incomplete"] : []
    });
  }

  return (
    <Card className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--accent)]">{config.cameraLabel}</p>
            <h3 className="mt-1 text-2xl font-black">{config.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{config.objective}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-right ring-1 ring-[var(--border)]">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Autosave</div>
            <div className="mt-1 text-sm font-semibold">{new Date(lastSaved).toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(145deg,#17332d,#254c45)] p-5 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">First-person-style panel</p>
            <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold">{saveState.timerSecondsRemaining}s left</span>
          </div>
          <div className="mt-4 grid min-h-64 gap-4 rounded-[24px] border border-white/10 bg-white/6 p-4 md:grid-cols-2">
            {config.actions.map((action) => {
              const active = selectedActions.includes(action.id);
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => toggleAction(action.id)}
                  className={`focus-ring rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-orange-300 bg-orange-100 text-[var(--foreground)]"
                      : "border-white/20 bg-black/10 hover:bg-white/10"
                  }`}
                >
                  <div className="font-bold">{action.label}</div>
                  <p className={`mt-1 text-sm ${active ? "text-[var(--muted)]" : "text-white/80"}`}>{action.description}</p>
                  <div className={`mt-3 text-xs font-semibold uppercase tracking-[0.18em] ${active ? "text-[var(--accent)]" : "text-orange-200"}`}>
                    {action.impact} +{action.points}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="bg-white/90">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Station progress</span>
            <span className="text-sm font-black">{saveState.progressPercent}%</span>
          </div>
          <ProgressBar className="mt-3" value={saveState.progressPercent} />
          <p className="mt-3 text-sm text-[var(--muted)]">{funnyFeedback}</p>
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">What this teaches first</p>
          <div className="mt-2 space-y-2 text-sm text-[var(--muted)]">
            <p>Safety and sequencing are scored alongside speed.</p>
            <p>Retry is always allowed, so mistakes become coaching moments instead of hard failure.</p>
            <p>Each action updates a save-state checkpoint for exact resume behavior.</p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Current score</span>
            <span className="text-2xl font-black">{score}</span>
          </div>
          <Button className="mt-4 w-full">Retry Station</Button>
        </Card>
      </div>
    </Card>
  );
}
