import { createSupabaseAdminClient } from "../lib/supabase/admin";
import { scenarios } from "../lib/game/content";

async function main() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Missing Supabase environment variables. Copy .env.example to .env.local and fill in Supabase values.");
  }

  const teacherEmail = process.env.DEMO_TEACHER_EMAIL ?? "chef.teacher@school.edu";
  const studentEmail = process.env.DEMO_STUDENT_EMAIL ?? "jamie.student@school.edu";

  const teacherResult = await supabase.auth.admin.createUser({
    email: teacherEmail,
    password: "Password123!",
    email_confirm: true,
    user_metadata: { first_name: "Chef Avery", role: "teacher" }
  });

  const studentResult = await supabase.auth.admin.createUser({
    email: studentEmail,
    password: "Password123!",
    email_confirm: true,
    user_metadata: { first_name: "Jamie", role: "student" }
  });

  if (teacherResult.error && !teacherResult.error.message.includes("already been registered")) {
    throw teacherResult.error;
  }

  if (studentResult.error && !studentResult.error.message.includes("already been registered")) {
    throw studentResult.error;
  }

  await supabase.from("scenarios").upsert(
    scenarios.map((scenario) => ({
      id: scenario.id,
      slug: scenario.slug,
      week_number: scenario.week,
      title: scenario.title,
      subtitle: scenario.subtitle,
      summary: scenario.summary,
      difficulty: scenario.difficulty,
      estimated_minutes: scenario.estimatedMinutes,
      mode: scenario.mode,
      unit_tag: scenario.unitTag,
      standard_tags: scenario.standardTags,
      station_order: scenario.stationOrder
    }))
  );

  console.log("Seeded demo users and scenarios.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
