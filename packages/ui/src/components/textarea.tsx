import React from "react";
import { cn } from "../utils/cn.js";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[80px] p-3 text-xs rounded-[var(--radius-sm,4px)]",
          "bg-[var(--bg-surface)] text-[var(--ink-primary)]",
          "border placeholder:text-[var(--ink-muted)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0",
          "leading-relaxed resize-y",
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

Textarea.displayName = "Textarea";
