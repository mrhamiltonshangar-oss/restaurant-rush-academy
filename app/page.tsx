import Link from "next/link";
import { ArrowRight, ChartNoAxesColumn, ChefHat, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--accent)]">Semester-long culinary sim</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight">
            Restaurant Rush Academy turns culinary class into a goofy, high-energy restaurant adventure.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
            Chromebook-friendly, Supabase-backed, and built for short classroom sessions with exact autosave and resume.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/auth/login">
              <Button className="gap-2">
                Enter the academy
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/teacher">
              <Button variant="ghost">Preview teacher dashboard</Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {[
              "Story map with 12 scaffolded scenarios",
              "First-person-style cooking stations without heavy 3D",
              "Teacher controls for units, leaderboards, and team mode",
              "FERPA-conscious names and low-PII design"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 text-sm font-semibold">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {[
            { icon: ChefHat, title: "Cooking gameplay", body: "Prep, line, baking, and front-of-house stations with timing, sanitation, and flexible recipe outcomes." },
            { icon: ChartNoAxesColumn, title: "Teacher reporting", body: "Progress, stuck points, sanitation trends, standards, grades, CSV export, and reset/archive tools." },
            { icon: ShieldCheck, title: "School-safe by design", body: "Reduced motion, larger text mode, keyboard support, simplified instructions, and strict moderation scaffolds." },
            { icon: Sparkles, title: "Fun without chaos overload", body: "Fantasy taverns, brunch rushes, broken mixers, and helpful retries instead of harsh punishment." }
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="bg-white/85">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-orange-50 p-3 text-[var(--primary)]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black">{title}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
