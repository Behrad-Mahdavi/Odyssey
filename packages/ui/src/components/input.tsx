import React from "react";
import { cn } from "../utils/cn.js";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

/**
 * Atelier Field — a single hairline, no inner glow, no shadow.
 * Focus is signalled by a 2px ring + a stronger rule.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full h-9 ps-3 pe-3 text-[var(--text-ui)] rounded-[var(--radius-sm)]",
          "bg-[var(--bg-surface)] text-[var(--ink-primary)]",
          "border placeholder:text-[var(--ink-muted)]",
          "transition-colors duration-[var(--dur-micro)] ease-[var(--ease-standard)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]",
          error
            ? "border-[var(--signal-negative)] focus-visible:ring-[var(--signal-negative)]"
            : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]/60 focus-visible:border-[var(--border-strong)] focus-visible:ring-[var(--ring)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
