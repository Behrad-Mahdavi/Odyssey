import React from "react";
import { cn } from "../utils/cn.js";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

/**
 * Atelier Editor field — same hairline language as Input, but tuned for long
 * reading: 66ch measure, generous leading, tabular numerals.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[96px] p-3 text-[var(--text-editor)] rounded-[var(--radius-sm)]",
          "bg-[var(--bg-surface)] text-[var(--ink-primary)]",
          "border placeholder:text-[var(--ink-muted)]",
          "leading-[var(--lh-body)] resize-y",
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

Textarea.displayName = "Textarea";
