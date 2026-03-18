import { AppShell } from "@/components/layout/app-shell";
import { CreateClassForm } from "@/components/teacher/create-class-form";
import { Card } from "@/components/ui/card";
import { demoSections } from "@/lib/game/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TeacherClassesPage() {
  const supabase = await createSupabaseServerClient();
  let sections = demoSections;

  if (supabase) {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("sections")
        .select("id, name, class_code, mode, classes!inner(name, teacher_id)")
        .eq("classes.teacher_id", user.id);

      if (data && data.length > 0) {
        sections = data.map((section) => ({
          id: section.id as string,
          name: section.name as string,
          className: Array.isArray(section.classes)
            ? ((section.classes[0] as { name?: string } | undefined)?.name ?? "Class")
            : ((section.classes as { name?: string } | null)?.name ?? "Class"),
          classCode: section.class_code as string,
          mode: section.mode as "individual" | "team",
          unitUnlocks: []
        }));
      }
    }
  }

  return (
    <AppShell
      title="Classes and Sections"
      subtitle="Create sections, manage class codes, switch between team and individual mode, and prepare next semester."
      nav={[
        { href: "/teacher", label: "Overview" },
        { href: "/teacher/classes", label: "Classes" }
      ]}
      showSignOut
    >
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <CreateClassForm />
        <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.id}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">{section.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">Class code: {section.classCode}</p>
              </div>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold">{section.mode}</span>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">Unlocked units: {section.unitUnlocks.join(", ")}</p>
          </Card>
        ))}
        </div>
      </div>
    </AppShell>
  );
}
