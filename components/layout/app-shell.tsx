import Link from "next/link";
import { ReactNode } from "react";

export function AppShell({
  title,
  subtitle,
  nav,
  children
}: {
  title: string;
  subtitle: string;
  nav: Array<{ href: string; label: string }>;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-6">
      <header className="panel flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Restaurant Rush Academy
          </p>
          <h1 className="mt-1 text-3xl font-black">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">{subtitle}</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focus-ring rounded-full border border-[var(--border)] bg-white/80 px-3 py-2 text-sm font-semibold hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
