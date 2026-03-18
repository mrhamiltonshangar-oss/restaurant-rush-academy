import { NextResponse } from "next/server";
import { scenarios } from "@/lib/game/content";

export async function GET() {
  return NextResponse.json({ scenarios });
}
