import { Compass, Sparkles } from "lucide-react";
import type React from "react";
import { cn } from "../utils/cn.js";
import { CompactTooltip } from "./compact-tooltip.js";
import type { MindsetType } from "./mindset-badge.js";

export interface CompactMindsetChipProps {
  mindset: MindsetType;
  name: string;
  tip: string;
  onClick?: () => void;
  className?: string;
}

export function CompactMindsetChip({
  mindset,
  name,
  tip,
  onClick,
  className,
}: CompactMindsetChipProps): React.JSX.Element {
  const signalColors: Record<MindsetType, string> = {
    curiosity: "var(--signal-amber)",
    bias_to_action: "var(--signal-positive)",
    reframing: "var(--path-1)",
    awareness: "var(--path-2)",
    radical_collaboration: "var(--path-3)",
  };

  const buttonEl = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 ps-2.5 pe-2.5 py-1 rounded-[var(--radius-sm,4px)] text-[11px] font-medium",
        "bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--ink-secondary)]",
        "hover:text-[var(--ink-primary)] hover:border-[var(--border-strong)]/30 transition-all select-none cursor-pointer",
        className,
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: signalColors[mindset] }}
      />
      <Sparkles className="w-3 h-3 text-[var(--ink-muted)] shrink-0" />
      <span>{name}</span>
    </button>
  );

  return <CompactTooltip content={tip}>{buttonEl}</CompactTooltip>;
}
