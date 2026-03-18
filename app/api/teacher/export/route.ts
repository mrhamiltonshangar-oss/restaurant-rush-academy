import { NextResponse } from "next/server";
import { demoTeacherDashboard } from "@/lib/game/content";

export async function GET() {
  const lines = [
    "section,student_name,scenario,status,reason",
    ...demoTeacherDashboard.classAlerts.map(
      (alert) => `Period 2 Culinary,${alert.studentName},${alert.scenarioTitle},Needs Review,${alert.reason}`
    )
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="restaurant-rush-academy-report.csv"'
    }
  });
}
