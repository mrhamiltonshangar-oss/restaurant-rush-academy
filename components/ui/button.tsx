import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]",
  secondary: "bg-[var(--secondary)] text-[var(--foreground)] hover:brightness-95",
  ghost: "bg-transparent text-[var(--foreground)] ring-1 ring-[var(--border)] hover:bg-white/70",
  danger: "bg-[var(--danger)] text-white hover:brightness-95"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "focus-ring inline-flex items-center justify-center rounded-full px-4 py-2 font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
