import React from "react";
import { cn } from "../utils/cn.js";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error = false, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full h-9 ps-3 pe-3 text-xs rounded-[var(--radius-sm,4px)]",
          "bg-[var(--bg-surface)] text-[var(--ink-primary)]",
          "border placeholder:text-[var(--ink-muted)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0",
          error
            ? "border-[var(--signal-negative)] focus-visible:ring-[var(--signal-negative)]"
            : "border-[var(--border-subtle)] focus-visible:border-[var(--border-strong)] focus-visible:ring-[var(--border-strong)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
