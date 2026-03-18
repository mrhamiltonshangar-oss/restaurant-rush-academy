import { cn } from "@/lib/utils/cn";

export function ProgressBar({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-3 w-full rounded-full bg-stone-200", className)}>
      <div
        className="h-3 rounded-full bg-[linear-gradient(90deg,var(--accent),var(--secondary),var(--primary))] transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
