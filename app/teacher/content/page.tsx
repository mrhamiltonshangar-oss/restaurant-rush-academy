import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function TeacherContentPage() {
  return (
    <AppShell
      title="Teacher CMS"
      subtitle="Edit recipes, scenario text, reflection prompts, and assessment weights without touching code."
      nav={[
        { href: "/teacher", label: "Overview" },
        { href: "/teacher/content", label: "Content CMS" }
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          "Recipe editor with allergens, substitutions, and pricing",
          "Scenario editor with steps, unit tags, and unlock rules",
          "Reflection prompt manager aligned to FCS 8.0",
          "Assessment weight controls for completion, safety, and challenge mode"
        ].map((item) => (
          <Card key={item}>
            <p className="font-semibold">{item}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
