import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!supabase || !admin) {
    return NextResponse.json(
      { ok: false, error: "Supabase server variables are missing." },
      { status: 500 }
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "You need to sign in first." }, { status: 401 });
  }

  const { classCode } = (await request.json()) as { classCode?: string };

  if (!classCode) {
    return NextResponse.json({ ok: false, error: "Class code is required." }, { status: 400 });
  }

  const normalizedCode = classCode.trim().toUpperCase();

  const { data: section, error: sectionError } = await admin
    .from("sections")
    .select("id")
    .eq("class_code", normalizedCode)
    .maybeSingle();

  if (sectionError || !section) {
    return NextResponse.json({ ok: false, error: "That class code was not found." }, { status: 404 });
  }

  const { error: enrollmentError } = await admin.from("enrollments").upsert(
    {
      section_id: (section as { id: string }).id,
      student_id: user.id,
      status: "active"
    },
    {
      onConflict: "section_id,student_id"
    }
  );

  if (enrollmentError) {
    return NextResponse.json(
      { ok: false, error: enrollmentError.message },
      { status: 500 }
    );
  }

  const { error: profileError } = await admin
    .from("student_profiles")
    .update({ current_section_id: (section as { id: string }).id })
    .eq("user_id", user.id);

  if (profileError) {
    return NextResponse.json({ ok: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
