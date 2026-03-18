import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase server variables are missing." }, { status: 500 });
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "You need to sign in first." }, { status: 401 });
  }

  const { className, termLabel, sectionName, classCode, mode } = (await request.json()) as {
    className?: string;
    termLabel?: string;
    sectionName?: string;
    classCode?: string;
    mode?: "individual" | "team";
  };

  if (!className || !termLabel || !sectionName || !classCode) {
    return NextResponse.json({ ok: false, error: "Every field is required." }, { status: 400 });
  }

  const { data: createdClass, error: classError } = await supabase
    .from("classes")
    .insert({
      teacher_id: user.id,
      name: className,
      term_label: termLabel
    })
    .select("id")
    .single();

  if (classError || !createdClass) {
    return NextResponse.json({ ok: false, error: classError?.message ?? "Class creation failed." }, { status: 500 });
  }

  const { error: sectionError } = await supabase.from("sections").insert({
    class_id: (createdClass as { id: string }).id,
    name: sectionName,
    class_code: classCode.toUpperCase(),
    mode: mode ?? "individual"
  });

  if (sectionError) {
    return NextResponse.json({ ok: false, error: sectionError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
