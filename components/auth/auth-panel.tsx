"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AuthMode = "sign-in" | "sign-up";
type AuthRole = "student" | "teacher";

const initialMessages: Record<AuthRole, string> = {
  student: "Use your school email, password, and class code to join the right section.",
  teacher: "Use your school email and password to create or access your teacher dashboard."
};

export function AuthPanel() {
  const router = useRouter();
  const [studentMode, setStudentMode] = useState<AuthMode>("sign-in");
  const [teacherMode, setTeacherMode] = useState<AuthMode>("sign-in");
  const [studentMessage, setStudentMessage] = useState(initialMessages.student);
  const [teacherMessage, setTeacherMessage] = useState(initialMessages.teacher);
  const [isPending, startTransition] = useTransition();

  async function handleStudentAuth(formData: FormData) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStudentMessage("Supabase environment variables are missing in production.");
      return;
    }

    const firstName = String(formData.get("firstName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const classCode = String(formData.get("classCode") ?? "").trim().toUpperCase();

    if (!email || !password || !classCode) {
      setStudentMessage("School email, password, and class code are required.");
      return;
    }

    setStudentMessage("Checking your student account...");

    const authResult =
      studentMode === "sign-up"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName || email.split("@")[0],
                role: "student"
              }
            }
          })
        : await supabase.auth.signInWithPassword({
            email,
            password
          });

    if (authResult.error) {
      setStudentMessage(authResult.error.message);
      return;
    }

    if (studentMode === "sign-up" && !authResult.data.session) {
      setStudentMessage("Account created. Check your email confirmation settings in Supabase or disable email confirmation for classroom use.");
      return;
    }

    const enrollResponse = await fetch("/api/auth/student-enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ classCode })
    });

    const enrollPayload = (await enrollResponse.json()) as { ok: boolean; error?: string };

    if (!enrollResponse.ok || !enrollPayload.ok) {
      setStudentMessage(enrollPayload.error ?? "We could not connect your account to that class code.");
      await supabase.auth.signOut();
      return;
    }

    setStudentMessage("Student login complete. Opening your dashboard...");
    router.replace("/student/dashboard");
    router.refresh();
  }

  async function handleTeacherAuth(formData: FormData) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setTeacherMessage("Supabase environment variables are missing in production.");
      return;
    }

    const firstName = String(formData.get("firstName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setTeacherMessage("School email and password are required.");
      return;
    }

    setTeacherMessage("Checking your teacher account...");

    const authResult =
      teacherMode === "sign-up"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName || email.split("@")[0],
                role: "teacher"
              }
            }
          })
        : await supabase.auth.signInWithPassword({
            email,
            password
          });

    if (authResult.error) {
      setTeacherMessage(authResult.error.message);
      return;
    }

    if (teacherMode === "sign-up" && !authResult.data.session) {
      setTeacherMessage("Account created. Check your email confirmation settings in Supabase or disable email confirmation for classroom use.");
      return;
    }

    setTeacherMessage("Teacher login complete. Opening your dashboard...");
    router.replace("/teacher");
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-2">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Student access</h2>
          <div className="flex rounded-full bg-stone-100 p-1">
            {(["sign-in", "sign-up"] as AuthMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setStudentMode(mode)}
                className={`focus-ring rounded-full px-3 py-1 text-sm font-semibold ${
                  studentMode === mode ? "bg-white text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]"
                }`}
              >
                {mode === "sign-in" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
        </div>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              await handleStudentAuth(formData);
            });
          }}
        >
          {studentMode === "sign-up" ? (
            <input
              name="firstName"
              className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
              placeholder="First name"
            />
          ) : null}
          <input
            name="email"
            type="email"
            className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
            placeholder="School email"
          />
          <input
            name="password"
            type="password"
            className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
            placeholder="Password"
          />
          <input
            name="classCode"
            className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
            placeholder="Class code"
          />
          <Button className="w-full" disabled={isPending}>
            {isPending ? "Working..." : studentMode === "sign-in" ? "Sign in as student" : "Create student account"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-[var(--muted)]">{studentMessage}</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black">Teacher access</h2>
          <div className="flex rounded-full bg-stone-100 p-1">
            {(["sign-in", "sign-up"] as AuthMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTeacherMode(mode)}
                className={`focus-ring rounded-full px-3 py-1 text-sm font-semibold ${
                  teacherMode === mode ? "bg-white text-[var(--foreground)] shadow-sm" : "text-[var(--muted)]"
                }`}
              >
                {mode === "sign-in" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>
        </div>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              await handleTeacherAuth(formData);
            });
          }}
        >
          {teacherMode === "sign-up" ? (
            <input
              name="firstName"
              className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
              placeholder="First name"
            />
          ) : null}
          <input
            name="email"
            type="email"
            className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
            placeholder="School email"
          />
          <input
            name="password"
            type="password"
            className="focus-ring rounded-2xl border border-[var(--border)] bg-white px-4 py-3"
            placeholder="Password"
          />
          <Button className="w-full" variant="secondary" disabled={isPending}>
            {isPending ? "Working..." : teacherMode === "sign-in" ? "Sign in as teacher" : "Create teacher account"}
          </Button>
        </form>
        <p className="mt-3 text-sm text-[var(--muted)]">{teacherMessage}</p>
      </Card>
    </div>
  );
}
