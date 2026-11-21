import { Sparkles, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "../utils/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import type { MindsetType } from "./mindset-badge.js";

export interface ContextualNudgeProps {
  mindset: MindsetType;
  mindsetName: string;
  title: string;
  prompt: string;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
}

export function ContextualNudge({
  mindset,
  mindsetName,
  title,
  prompt,
  dismissLabel = "متوجه شدم",
  onDismiss,
  className,
}: ContextualNudgeProps): React.JSX.Element | null {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const mindsetVariants: Record<
    MindsetType,
    "neutral" | "positive" | "negative" | "amber" | "outline"
  > = {
    curiosity: "amber",
    bias_to_action: "positive",
    reframing: "outline",
    awareness: "neutral",
    radical_collaboration: "outline",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md,6px)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3 text-xs",
        "transition-opacity duration-150 relative",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[var(--ink-secondary)] shrink-0" />
          <Badge variant={mindsetVariants[mindset]}>[{mindsetName}]</Badge>
          <span className="font-semibold text-[var(--ink-primary)]">{title}</span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-0.5 rounded-xs transition-colors cursor-pointer"
          aria-label={dismissLabel}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="mt-2 text-[var(--ink-secondary)] leading-relaxed ps-5 pe-2">{prompt}</p>
      <div className="mt-2.5 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-[11px] h-7 ps-2.5 pe-2.5"
        >
          {dismissLabel}
        </Button>
      </div>
    </div>
  );
}
