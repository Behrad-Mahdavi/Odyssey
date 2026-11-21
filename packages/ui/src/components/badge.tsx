import React from "react";
import { cn } from "../utils/cn.js";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "positive" | "negative" | "amber" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => {
    const variantClasses = {
      neutral: "bg-[var(--bg-subtle)] text-[var(--ink-secondary)] border-[var(--border-subtle)]",
      positive:
        "bg-[var(--bg-subtle)] text-[var(--signal-positive)] border-[var(--signal-positive)]/30",
      negative:
        "bg-[var(--bg-subtle)] text-[var(--signal-negative)] border-[var(--signal-negative)]/30",
      amber: "bg-[var(--bg-subtle)] text-[var(--signal-amber)] border-[var(--signal-amber)]/30",
      outline: "bg-transparent text-[var(--ink-primary)] border-[var(--border-strong)]",
    }[variant];

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center text-[11px] font-medium ps-2 pe-2 py-0.5 rounded-[var(--radius-sm,4px)] border select-none",
          variantClasses,
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
