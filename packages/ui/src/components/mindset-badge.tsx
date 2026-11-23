import type React from "react";
import { Badge } from "./badge.js";
import { CompactTooltip } from "./compact-tooltip.js";

export type MindsetType =
  | "curiosity"
  | "bias_to_action"
  | "reframing"
  | "awareness"
  | "radical_collaboration";

export interface MindsetBadgeProps {
  type: MindsetType;
  name: string;
  description: string;
  className?: string;
  brackets?: boolean;
}

export function MindsetBadge({
  type,
  name,
  description,
  className,
  brackets = false,
}: MindsetBadgeProps): React.JSX.Element {
  const variantMap: Record<MindsetType, "neutral" | "positive" | "negative" | "amber" | "outline"> =
    {
      curiosity: "amber",
      bias_to_action: "positive",
      reframing: "outline",
      awareness: "neutral",
      radical_collaboration: "outline",
    };

  return (
    <CompactTooltip content={description}>
      <span className="inline-block cursor-help">
        <Badge variant={variantMap[type]} className={className}>
          {brackets ? `[${name}]` : name}
        </Badge>
      </span>
    </CompactTooltip>
  );
}
