import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Student or team progress reset. In production this route should update game_saves, assignments, and analytics snapshots."
  });
}
