import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { cn } from "../utils/cn.js";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const sizeClasses = {
      sm: "h-8 ps-3 pe-3 text-xs rounded-[var(--radius-sm,4px)]",
      md: "h-9 ps-4 pe-4 text-xs rounded-[var(--radius-sm,4px)]",
      lg: "h-11 ps-6 pe-6 text-sm rounded-[var(--radius-md,6px)]",
    }[size];

    const variantClasses = {
      primary:
        "bg-[var(--bg-inverted)] text-[var(--bg-surface)] hover:opacity-90 active:opacity-95 border border-transparent",
      secondary:
        "bg-[var(--bg-subtle)] text-[var(--ink-primary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)]",
      outline:
        "bg-transparent text-[var(--ink-primary)] hover:bg-[var(--bg-subtle)] border border-[var(--border-subtle)]",
      ghost:
        "bg-transparent text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)] border border-transparent",
      destructive:
        "bg-[var(--signal-negative)] text-white hover:opacity-90 border border-transparent",
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
