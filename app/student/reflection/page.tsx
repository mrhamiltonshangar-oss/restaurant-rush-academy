import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { scenarios } from "@/lib/game/content";

export default function StudentReflectionPage() {
  const prompts = scenarios[0].reflectionPrompts;

  return (
    <AppShell
      title="Reflection Lab"
      subtitle="Teach before assess by using short prompts that connect gameplay choices to real culinary practice."
      nav={[
        { href: "/student/dashboard", label: "Dashboard" },
        { href: "/student/reflection", label: "Reflection" }
      ]}
      showSignOut
    >
      <div className="grid gap-4 md:grid-cols-2">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <div className="font-bold">{prompt.standardTag}</div>
            <p className="mt-2 text-sm text-[var(--muted)]">{prompt.prompt}</p>
            <textarea
              className="focus-ring mt-4 min-h-32 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
              placeholder="Write a short reflection..."
            />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
