import type React from "react";
import { useCallback, useRef } from "react";
import { cn } from "../utils/cn.js";

export interface TactileGaugeProps {
  label: string;
  value: number; // 0 to 100
  onChange?: (newValue: number) => void;
  disabled?: boolean;
  className?: string;
  signalColor?: string;
}

export function TactileGauge({
  label,
  value,
  onChange,
  disabled = false,
  className,
  signalColor,
}: TactileGaugeProps): React.JSX.Element {
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));
  const trackRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || !onChange) return;

      let next = clampedValue;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = Math.min(100, clampedValue + (e.shiftKey ? 10 : 5));
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = Math.max(0, clampedValue - (e.shiftKey ? 10 : 5));
          e.preventDefault();
          break;
        case "PageUp":
          next = Math.min(100, clampedValue + 10);
          e.preventDefault();
          break;
        case "PageDown":
          next = Math.max(0, clampedValue - 10);
          e.preventDefault();
          break;
        case "Home":
          next = 0;
          e.preventDefault();
          break;
        case "End":
          next = 100;
          e.preventDefault();
          break;
        default:
          return;
      }
      onChange(next);
    },
    [clampedValue, disabled, onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || !onChange || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const isRtl = document.dir === "rtl";
      const clientX = e.clientX;

      let ratio = (clientX - rect.left) / rect.width;
      if (isRtl) {
        ratio = 1 - ratio;
      }
      const next = Math.max(0, Math.min(100, Math.round(ratio * 100)));
      onChange(next);
    },
    [disabled, onChange],
  );

  return (
    <div className={cn("space-y-1.5 select-none", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--ink-secondary)]">{label}</span>
        <span className="tabular-nums font-mono text-[var(--ink-primary)] font-semibold text-xs">
          {clampedValue}%
        </span>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        className={cn(
          "relative h-6 w-full rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)]",
          "cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--border-strong)]",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {/* Fill bar */}
        <div
          className="absolute inset-y-0 start-0 rounded-s-[var(--radius-sm,4px)] transition-all duration-75"
          style={{
            width: `${clampedValue}%`,
            backgroundColor: signalColor ?? "var(--ink-primary)",
            opacity: 0.15,
          }}
        />

        {/* Calibrated Tick Marks: 0, 25, 50, 75, 100 */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div key={tick} className="h-full flex flex-col justify-end items-center pb-0.5">
              <span className="w-px h-1.5 bg-[var(--border-strong)] opacity-40" />
            </div>
          ))}
        </div>

        {/* Thumb needle indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[var(--ink-primary)] shadow-xs rounded-full transition-all duration-75"
          style={{
            insetInlineStart: `calc(${clampedValue}% - 2px)`,
            backgroundColor: signalColor ?? "var(--ink-primary)",
          }}
        />
      </div>
    </div>
  );
}
