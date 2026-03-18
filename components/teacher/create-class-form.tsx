"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CreateClassForm() {
  const router = useRouter();
  const [message, setMessage] = useState("Create a class and section here so students have a real class code to use.");
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <h2 className="text-xl font-black">Create class and section</h2>
      <form
        className="mt-4 grid gap-3"
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);

          startTransition(async () => {
            const response = await fetch("/api/teacher/classes", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                className: String(formData.get("className") ?? "").trim(),
                termLabel: String(formData.get("termLabel") ?? "").trim(),
                sectionName: String(formData.get("sectionName") ?? "").trim(),
                classCode: String(formData.get("classCode") ?? "").trim().toUpperCase(),
                mode: String(formData.get("mode") ?? "individual")
              })
            });

            const payload = (await response.json()) as { ok: boolean; error?: string };

            if (!response.ok || !payload.ok) {
              setMessage(payload.error ?? "We could not create that class right now.");
              return;
            }

            setMessage("Class created. Students can now use that class code on the login page.");
            form.reset();
            router.refresh();
          });
        }}
      >
        <input
          name="className"
          className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          placeholder="Class name"
          defaultValue="Restaurant Rush Academy"
        />
        <input
          name="termLabel"
          className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          placeholder="Term label"
          defaultValue="Fall 2026"
        />
        <input
          name="sectionName"
          className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          placeholder="Section name"
          defaultValue="Period 2 Culinary"
        />
        <input
          name="classCode"
          className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          placeholder="Class code"
          defaultValue="RRA-101"
        />
        <select
          name="mode"
          className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
          defaultValue="individual"
        >
          <option value="individual">Individual mode</option>
          <option value="team">Team mode</option>
        </select>
        <Button disabled={isPending}>{isPending ? "Creating..." : "Create class"}</Button>
      </form>
      <p className="mt-3 text-sm text-[var(--muted)]">{message}</p>
    </Card>
  );
}
