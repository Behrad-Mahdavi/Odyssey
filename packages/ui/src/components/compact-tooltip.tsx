import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type React from "react";
import { cn } from "../utils/cn.js";

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface CompactTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

export function CompactTooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 150,
}: CompactTooltipProps): React.JSX.Element {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={4}
            className={cn(
              "z-50 max-w-[260px] rounded-[var(--radius-sm,4px)] ps-2.5 pe-2.5 py-1.5",
              "bg-[var(--bg-inverted)] text-[var(--bg-surface)] text-[11px] leading-relaxed",
              "border border-[var(--border-subtle)] shadow-xs select-none",
              "animate-in fade-in-0 zoom-in-95 duration-100",
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-[var(--bg-inverted)]" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
