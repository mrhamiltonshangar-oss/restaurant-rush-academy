"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useAutosave } from "@/hooks/use-autosave";
import { demoSaveState, stationConfigs } from "@/lib/game/content";
import { cn } from "@/lib/utils/cn";
import { StationType } from "@/types/game";

type Ticket = {
  id: string;
  label: string;
  guest: string;
  note: string;
  urgency: "steady" | "rush" | "critical";
};

const stationAtmosphere: Record<
  StationType,
  {
    background: string;
    foreground: string;
    drillLabel: string;
    drillHint: string;
    toolLabels: string[];
    primaryMetric: string;
  }
> = {
  prep: {
    background: "from-[#0f2a25] via-[#18463f] to-[#2f6f63]",
    foreground: "Cut board, produce bins, sanitizer bucket, labels, and chef knife in view.",
    drillLabel: "Knife rhythm",
    drillHint: "Tap in a smooth rhythm to build even cuts and keep your fingers tucked.",
    toolLabels: ["Knife", "Board", "Labels", "Sanitizer"],
    primaryMetric: "Station order"
  },
  line: {
    background: "from-[#28140f] via-[#6a2e1a] to-[#b55722]",
    foreground: "Hot pans, rail tickets, thermometer, and a bubbling saute zone ahead.",
    drillLabel: "Pan timing",
    drillHint: "Tap when the pan is in the sweet spot to avoid pale sears or charcoal tragedy.",
    toolLabels: ["Burner", "Pan", "Thermo", "Rail"],
    primaryMetric: "Heat control"
  },
  baking: {
    background: "from-[#2f2140] via-[#74508b] to-[#d38766]",
    foreground: "Mixing bowls, pastry scale, oven glass, and a cooling rack are lined up.",
    drillLabel: "Mixing cadence",
    drillHint: "Build a steady mixing cadence. Fast enough to combine, not wild enough to overwork.",
    toolLabels: ["Scale", "Mixer", "Tray", "Oven"],
    primaryMetric: "Precision"
  },
  "front-of-house": {
    background: "from-[#17332d] via-[#26695d] to-[#db9f45]",
    foreground: "Pass window, garnish tray, allergy ticket marker, and polished plates ready to fly.",
    drillLabel: "Plating polish",
    drillHint: "Tap through final polish passes so the plate leaves clean, balanced, and allergen-safe.",
    toolLabels: ["Pass", "Plate", "Marker", "Garnish"],
    primaryMetric: "Plate finish"
  }
};

const ticketDeck: Record<StationType, Ticket[]> = {
  prep: [
    { id: "prep-1", label: "Produce Sprint", guest: "Coach Vega", note: "Need diced peppers and labeled cups.", urgency: "steady" },
    { id: "prep-2", label: "Sanitation Check", guest: "Inspector Oats", note: "Fresh board before raw chicken prep.", urgency: "critical" },
    { id: "prep-3", label: "Soup Base", guest: "Tavern Prep", note: "Onions, celery, carrots, all even cuts.", urgency: "rush" }
  ],
  line: [
    { id: "line-1", label: "Brunch Combo", guest: "Table 2", note: "Eggs, toast, potatoes, all together.", urgency: "rush" },
    { id: "line-2", label: "Thermo Alert", guest: "Safety Judge", note: "Chicken must hit temp before plate-up.", urgency: "critical" },
    { id: "line-3", label: "Fire Two", guest: "Counter 5", note: "Synchronize protein and side pick-up.", urgency: "steady" }
  ],
  baking: [
    { id: "bake-1", label: "Muffin Tray", guest: "Cafe Case", note: "Even scoop sizes and no raw centers.", urgency: "steady" },
    { id: "bake-2", label: "Oven Rotation", guest: "Bake Sale Rival", note: "Hot spot left side. Rotate on time.", urgency: "rush" },
    { id: "bake-3", label: "Frosting Drama", guest: "Principal Plum", note: "Cool first. The frosting can smell fear.", urgency: "critical" }
  ],
  "front-of-house": [
    { id: "foh-1", label: "Allergy Pick-Up", guest: "Guest Rowan", note: "No dairy contact. Verify marker before handoff.", urgency: "critical" },
    { id: "foh-2", label: "Expo Push", guest: "Server Jules", note: "Three plates, clean rims, fast callout.", urgency: "rush" },
    { id: "foh-3", label: "Final Polish", guest: "Food Critic", note: "One garnish. Not a salad explosion.", urgency: "steady" }
  ]
};

const urgencyStyles: Record<Ticket["urgency"], string> = {
  steady: "border-white/20 bg-white/8 text-white",
  rush: "border-amber-300/50 bg-amber-200/15 text-amber-50",
  critical: "border-rose-300/50 bg-rose-200/15 text-rose-50"
};

export function StationSimulator({
  station,
  scenarioSlug
}: {
  station: StationType;
  scenarioSlug: string;
}) {
  const config = stationConfigs[station];
  const mood = stationAtmosphere[station];
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [funnyFeedback, setFunnyFeedback] = useState("The station is humming. You can almost hear the spatulas judging.");
  const [focus, setFocus] = useState(78);
  const [cleanliness, setCleanliness] = useState(88);
  const [heat, setHeat] = useState(station === "line" ? 64 : station === "baking" ? 58 : 32);
  const [drillProgress, setDrillProgress] = useState(0);
  const [combo, setCombo] = useState(0);
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);
  const [mistakeLog, setMistakeLog] = useState<string[]>([]);
  const [eventLog, setEventLog] = useState<string[]>([
    "Station camera synced.",
    "Rush music is imaginary but emotionally real.",
    config.successTip
  ]);
  const { saveState, persist, lastSaved } = useAutosave({
    ...demoSaveState,
    scenarioSlug,
    station,
    stepId: `${scenarioSlug}-${station}`
  });

  const tickets = ticketDeck[station];
  const activeTicket = tickets[activeTicketIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFocus((current) => Math.max(45, current - 1));
      setCleanliness((current) =>
        selectedActions.includes("wash") || selectedActions.includes("allergy")
          ? current
          : Math.max(40, current - 1)
      );
      setHeat((current) => {
        if (station === "line") return Math.max(35, Math.min(96, current + (current < 70 ? 2 : -1)));
        if (station === "baking") return Math.max(42, Math.min(88, current + (current < 62 ? 1 : -1)));
        return current;
      });
    }, 4000);

    return () => window.clearInterval(interval);
  }, [selectedActions, station]);

  const score = useMemo(() => {
    const actionPoints = config.actions
      .filter((action) => selectedActions.includes(action.id))
      .reduce((total, action) => total + action.points, 0);

    return actionPoints + drillProgress * 2 + combo * 4 + Math.round((focus + cleanliness) / 10);
  }, [cleanliness, combo, config.actions, drillProgress, focus, selectedActions]);

  const stationProgress = useMemo(() => {
    const actionProgress = selectedActions.length / config.actions.length;
    const drillRatio = Math.min(1, drillProgress / 100);
    return Math.round((actionProgress * 0.7 + drillRatio * 0.3) * 100);
  }, [config.actions.length, drillProgress, selectedActions.length]);

  async function persistSnapshot(nextState: {
    nextActions?: string[];
    nextFocus?: number;
    nextCleanliness?: number;
    nextHeat?: number;
    nextDrill?: number;
    nextMistakes?: string[];
    checkpointLabel?: string;
  }) {
    const nextActions = nextState.nextActions ?? selectedActions;
    const nextFocus = nextState.nextFocus ?? focus;
    const nextCleanliness = nextState.nextCleanliness ?? cleanliness;
    const nextHeat = nextState.nextHeat ?? heat;
    const nextDrill = nextState.nextDrill ?? drillProgress;
    const nextMistakes = nextState.nextMistakes ?? mistakeLog;

    await persist({
      ...saveState,
      station,
      scenarioSlug,
      stepId: `${scenarioSlug}-${station}`,
      checkpointLabel:
        nextState.checkpointLabel ??
        `${config.title}: ${nextActions.length}/${config.actions.length} actions, ${nextDrill}% drill`,
      progressPercent: Math.round(
        ((nextActions.length / config.actions.length) * 0.7 + Math.min(1, nextDrill / 100) * 0.3) * 100
      ),
      timerSecondsRemaining: Math.max(45, saveState.timerSecondsRemaining - 12),
      score:
        config.actions
          .filter((action) => nextActions.includes(action.id))
          .reduce((total, action) => total + action.points, 0) +
        nextDrill * 2 +
        combo * 4 +
        Math.round((nextFocus + nextCleanliness) / 10),
      updatedAt: new Date().toISOString(),
      mistakes: nextMistakes
    });
  }

  async function toggleAction(actionId: string) {
    const exists = selectedActions.includes(actionId);
    const nextActions = exists
      ? selectedActions.filter((id) => id !== actionId)
      : [...selectedActions, actionId];
    const nextCombo = exists ? Math.max(0, combo - 1) : combo + 1;
    const nextFocus = Math.min(100, focus + (exists ? -4 : 6));
    const nextCleanliness =
      actionId === "wash" || actionId === "allergy" || actionId === "wipe"
        ? Math.min(100, cleanliness + (exists ? -6 : 10))
        : cleanliness;

    setSelectedActions(nextActions);
    setCombo(nextCombo);
    setFocus(nextFocus);
    setCleanliness(nextCleanliness);
    setFunnyFeedback(
      exists
        ? "You backed up the move. The ticket rail groans, but respectfully."
        : `${config.actions.find((action) => action.id === actionId)?.label} locked in. ${config.successTip}`
    );
    setEventLog((current) => [
      `${config.actions.find((action) => action.id === actionId)?.label} ${exists ? "undone" : "completed"}.`,
      ...current.slice(0, 4)
    ]);

    await persistSnapshot({
      nextActions,
      nextFocus,
      nextCleanliness,
      checkpointLabel: `${config.title}: ${nextActions.length}/${config.actions.length} actions complete`
    });
  }

  async function runTechniqueDrill() {
    const sweetSpot = station === "line" ? heat >= 62 && heat <= 78 : station === "baking" ? heat >= 56 && heat <= 68 : focus >= 70;
    const cleanlinessPenalty = cleanliness < 58;
    const progressGain = sweetSpot ? 18 : 10;
    const nextDrill = Math.min(100, drillProgress + progressGain);
    const nextCombo = combo + 1;
    const nextFocus = Math.max(35, Math.min(100, focus + (sweetSpot ? 4 : -2)));
    const nextCleanliness = Math.max(35, cleanliness - (station === "prep" ? 2 : 1));
    const nextHeat =
      station === "line"
        ? Math.min(95, heat + 3)
        : station === "baking"
          ? Math.min(84, heat + 2)
          : heat;

    const newMistake =
      !sweetSpot || cleanlinessPenalty
        ? station === "line"
          ? "Pan timing slipped. The sear got stage fright."
          : station === "baking"
            ? "Mixing drifted off rhythm. The batter is gossiping."
            : station === "front-of-house"
              ? "Plate finish got rushed. The parsley union filed a complaint."
              : "Knife rhythm got jagged. The carrot cubes look rebellious."
        : null;
    const nextMistakes = newMistake ? [newMistake, ...mistakeLog].slice(0, 3) : mistakeLog;

    setDrillProgress(nextDrill);
    setCombo(nextCombo);
    setFocus(nextFocus);
    setCleanliness(nextCleanliness);
    setHeat(nextHeat);
    setMistakeLog(nextMistakes);
    setFunnyFeedback(
      sweetSpot
        ? `${mood.drillLabel} is dialed in. The station finally trusts you.`
        : `Close, but not magical. ${mood.drillHint}`
    );
    setEventLog((current) => [
      sweetSpot ? `${mood.drillLabel} hit the sweet spot.` : `${mood.drillLabel} drifted off target.`,
      ...current.slice(0, 4)
    ]);

    if (nextDrill >= 100) {
      setActiveTicketIndex((current) => (current + 1) % tickets.length);
      setFunnyFeedback("Ticket cleared. Somewhere, a tiny scoreboard announcer screams your name.");
    }

    await persistSnapshot({
      nextFocus,
      nextCleanliness,
      nextHeat,
      nextDrill,
      nextMistakes,
      checkpointLabel: `${mood.drillLabel}: ${nextDrill}% complete`
    });
  }

  async function adjustHeat(delta: number) {
    const nextHeat = Math.max(0, Math.min(100, heat + delta));
    setHeat(nextHeat);
    setEventLog((current) => [`Heat adjusted to ${nextHeat}%.`, ...current.slice(0, 4)]);
    await persistSnapshot({
      nextHeat,
      checkpointLabel: `${config.title}: heat adjusted to ${nextHeat}%`
    });
  }

  async function resetStation() {
    setSelectedActions([]);
    setFunnyFeedback("Station reset. Fresh start, clean slate, same dramatic customers.");
    setFocus(78);
    setCleanliness(88);
    setHeat(station === "line" ? 64 : station === "baking" ? 58 : 32);
    setDrillProgress(0);
    setCombo(0);
    setMistakeLog([]);
    setEventLog(["Station reset.", config.successTip]);
    await persist({
      ...saveState,
      station,
      scenarioSlug,
      stepId: `${scenarioSlug}-${station}`,
      checkpointLabel: `${config.title}: reset`,
      progressPercent: 0,
      timerSecondsRemaining: demoSaveState.timerSecondsRemaining,
      score: 0,
      updatedAt: new Date().toISOString(),
      mistakes: []
    });
  }

  return (
    <Card className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
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

        <div className={cn("overflow-hidden rounded-[30px] border border-[var(--border)] bg-gradient-to-br p-4 text-white", mood.background)}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">POV station cam</span>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                {saveState.timerSecondsRemaining}s left
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                Combo x{Math.max(1, combo)}
              </span>
            </div>
            <div className="text-xs uppercase tracking-[0.22em] text-orange-100">{mood.foreground}</div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-white/12 bg-black/12 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Focus", value: focus },
                  { label: "Sanitation", value: cleanliness },
                  { label: mood.primaryMetric, value: station === "prep" ? focus : heat }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/8 p-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-orange-100">
                      <span>{stat.label}</span>
                      <span>{stat.value}%</span>
                    </div>
                    <ProgressBar className="mt-2 bg-white/20" value={stat.value} />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),rgba(0,0,0,0.14))] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-100">{mood.drillLabel}</p>
                    <h4 className="mt-1 text-xl font-black">Technique drill</h4>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{drillProgress}%</span>
                </div>
                <p className="mt-2 text-sm text-white/80">{mood.drillHint}</p>
                <ProgressBar className="mt-4 bg-white/20" value={drillProgress} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={runTechniqueDrill}>
                    Perform {mood.drillLabel}
                  </Button>
                  {station === "line" || station === "baking" ? (
                    <>
                      <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20" onClick={() => adjustHeat(-8)}>
                        Lower heat
                      </Button>
                      <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20" onClick={() => adjustHeat(8)}>
                        Raise heat
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {mood.toolLabels.map((toolLabel, index) => (
                  <button
                    type="button"
                    key={toolLabel}
                    onClick={() => {
                      setEventLog((current) => [`${toolLabel} checked from the station view.`, ...current.slice(0, 4)]);
                      setFunnyFeedback(
                        index % 2 === 0
                          ? `${toolLabel} is ready. The kitchen spirits approve.`
                          : `${toolLabel} checked. No smoke, no panic, strong start.`
                      );
                    }}
                    className="focus-ring rounded-2xl border border-white/12 bg-white/8 p-3 text-left transition hover:bg-white/14"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-orange-100">Hotspot</div>
                    <div className="mt-1 font-bold">{toolLabel}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[26px] border border-white/12 bg-black/14 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-100">Ticket rail</p>
                    <h4 className="mt-1 text-xl font-black">{activeTicket.label}</h4>
                  </div>
                  <span className={cn("rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]", urgencyStyles[activeTicket.urgency])}>
                    {activeTicket.urgency}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/80">{activeTicket.guest}</p>
                <p className="mt-2 text-sm text-white/90">{activeTicket.note}</p>
                <div className="mt-3 grid gap-2">
                  {tickets.map((ticket, index) => (
                    <button
                      type="button"
                      key={ticket.id}
                      onClick={() => setActiveTicketIndex(index)}
                      className={cn(
                        "focus-ring rounded-2xl border px-3 py-2 text-left text-sm transition",
                        index === activeTicketIndex
                          ? "border-white/30 bg-white/18"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      {ticket.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/12 bg-black/14 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-100">Action deck</p>
                <div className="mt-3 grid gap-2">
                  {config.actions.map((action) => {
                    const active = selectedActions.includes(action.id);
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => toggleAction(action.id)}
                        className={cn(
                          "focus-ring rounded-2xl border p-3 text-left transition",
                          active
                            ? "border-orange-200 bg-orange-50 text-[var(--foreground)]"
                            : "border-white/10 bg-white/6 hover:bg-white/12"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold">{action.label}</div>
                            <p className={cn("mt-1 text-sm", active ? "text-[var(--muted)]" : "text-white/80")}>
                              {action.description}
                            </p>
                          </div>
                          <span className={cn("rounded-full px-2 py-1 text-xs font-bold uppercase", active ? "bg-teal-50 text-[var(--accent)]" : "bg-white/10 text-orange-100")}>
                            {action.impact}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="bg-white/90">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Station progress</span>
            <span className="text-sm font-black">{stationProgress}%</span>
          </div>
          <ProgressBar className="mt-3" value={stationProgress} />
          <p className="mt-3 text-sm text-[var(--muted)]">{funnyFeedback}</p>
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Live callouts</p>
          <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {eventLog.map((item) => (
              <div key={item} className="rounded-2xl bg-stone-50 px-3 py-2">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Mistakes and coaching</p>
          <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {mistakeLog.length > 0 ? (
              mistakeLog.map((mistake) => (
                <div key={mistake} className="rounded-2xl bg-rose-50 px-3 py-2 text-rose-900">
                  {mistake}
                </div>
              ))
            ) : (
              <p>No major mistakes logged. The station remains dramatically competent.</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Current score</span>
            <span className="text-2xl font-black">{score}</span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Score blends action quality, technique drill completion, focus, sanitation, and combo flow.
          </p>
          <Button className="mt-4 w-full" onClick={resetStation}>
            Retry Station
          </Button>
        </Card>
      </div>
    </Card>
  );
}
