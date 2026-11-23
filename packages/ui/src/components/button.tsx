import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { cn } from "../utils/cn.js";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

/**
 * Atelier Button — 6 variants, 3 heights (28 / 36 / 44px).
 * Square-ish corners, hairline borders, 2px focus ring, no shadows.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const baseClasses =
      "inline-flex items-center justify-center gap-2 font-medium select-none whitespace-nowrap transition-colors duration-[var(--dur-micro)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:pointer-events-none disabled:opacity-45 cursor-pointer";

    const sizeClasses = {
      sm: "h-7 ps-2.5 pe-2.5 text-[11px] rounded-[var(--radius-xs)]",
      md: "h-9 ps-3.5 pe-3.5 text-[var(--text-ui)] rounded-[var(--radius-sm)]",
      lg: "h-11 ps-6 pe-6 text-[var(--text-h3)] rounded-[var(--radius-md)]",
    }[size];

    const variantClasses = {
      primary:
        "bg-[var(--bg-inverted)] text-[var(--bg-surface)] border border-transparent hover:opacity-90 active:opacity-95",
      accent:
        "bg-[var(--accent)] text-[var(--on-accent)] border border-transparent hover:bg-[var(--accent-hover)]",
      secondary:
        "bg-[var(--bg-subtle)] text-[var(--ink-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)]",
      outline:
        "bg-transparent text-[var(--ink-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] hover:border-[var(--border-strong)]",
      ghost:
        "bg-transparent text-[var(--ink-secondary)] border border-transparent hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)]",
      destructive:
        "bg-[var(--signal-negative)] text-[var(--signal-on)] border border-transparent hover:opacity-90",
    }[variant];

    return (
      <Comp
        ref={ref}
        className={cn(baseClasses, sizeClasses, variantClasses, className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
