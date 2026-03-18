import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SaveState } from "@/types/game";

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveState;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "offline-demo" });
  }

  const { error } = await supabase.from("game_saves").upsert({
    id: payload.id,
    user_id: payload.userId ?? null,
    team_id: payload.teamId ?? null,
    scenario_slug: payload.scenarioSlug,
    step_id: payload.stepId,
    station: payload.station,
    checkpoint_label: payload.checkpointLabel,
    progress_percent: payload.progressPercent,
    timer_seconds_remaining: payload.timerSecondsRemaining,
    score: payload.score,
    save_blob: payload,
    updated_at: payload.updatedAt
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "supabase" });
}
