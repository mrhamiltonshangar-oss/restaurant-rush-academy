import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "Semester archived. In production this route should snapshot sections, enrollments, assignments, and progress rows into archived term tables."
  });
}
