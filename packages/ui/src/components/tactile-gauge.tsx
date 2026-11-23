import { ChevronDown, FileText } from "lucide-react";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { cn } from "../utils/cn.js";

export interface TactileGaugeProps {
  label: string;
  value: number; // 0 to 100
  onChange?: (newValue: number) => void;
  disabled?: boolean;
  className?: string;
  signalColor?: string;
  notes?: string | undefined;
  onNotesChange?: (notes: string) => void;
  notesLabel?: string;
  notesPlaceholder?: string;
  statusText?: string;
}

export function TactileGauge({
  label,
  value,
  onChange,
  disabled = false,
  className,
  signalColor,
  notes,
  onNotesChange,
  notesLabel = "Notes",
  notesPlaceholder = "Observations...",
  statusText,
}: TactileGaugeProps): React.JSX.Element {
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));
  const trackRef = useRef<HTMLDivElement>(null);
  const [showNotes, setShowNotes] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || !onChange) return;
      const isRtl = typeof document !== "undefined" && document.dir === "rtl";

      let next = clampedValue;
      switch (e.key) {
        case "ArrowRight":
          next = isRtl
            ? Math.max(0, clampedValue - (e.shiftKey ? 10 : 5))
            : Math.min(100, clampedValue + (e.shiftKey ? 10 : 5));
          e.preventDefault();
          break;
        case "ArrowLeft":
          next = isRtl
            ? Math.min(100, clampedValue + (e.shiftKey ? 10 : 5))
            : Math.max(0, clampedValue - (e.shiftKey ? 10 : 5));
          e.preventDefault();
          break;
        case "ArrowUp":
          next = Math.min(100, clampedValue + (e.shiftKey ? 10 : 5));
          e.preventDefault();
          break;
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
      const isRtl = typeof document !== "undefined" && document.dir === "rtl";
      const clientX = e.clientX;

      let ratio = (clientX - rect.left) / rect.width;
      if (isRtl) {
        ratio = 1 - ratio;
      }
      const next = Math.max(0, Math.min(100, Math.round(ratio * 100)));
      onChange(next);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        let moveRatio = (moveEvent.clientX - rect.left) / rect.width;
        if (isRtl) {
          moveRatio = 1 - moveRatio;
        }
        onChange(Math.max(0, Math.min(100, Math.round(moveRatio * 100))));
      };

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [disabled, onChange],
  );

  return (
    <div
      className={cn(
        "p-4 rounded-[var(--radius-md,6px)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 select-none transition-all duration-150 hover:border-[var(--border-strong)]/40",
        className,
      )}
    >
      {/* Header: Label + Large Tabular Number */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-semibold text-sm text-[var(--ink-primary)] block tracking-tight">
            {label}
          </span>
          {statusText && (
            <span className="text-[10px] font-mono text-[var(--ink-muted)]">{statusText}</span>
          )}
        </div>
        <div className="text-end">
          <span
            dir="ltr"
            className="tabular-nums font-mono font-bold text-2xl text-[var(--ink-primary)] tracking-tight inline-block"
          >
            {clampedValue}%
          </span>
        </div>
      </div>

      {/* Calibrated Architectural Track */}
      <div className="space-y-1.5">
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
            "relative h-8 w-full rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)]",
            "cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--border-strong)] transition-all",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {/* Fill bar */}
          <div
            className="absolute inset-y-0 start-0 rounded-s-[var(--radius-sm,4px)] transition-all duration-75"
            style={{
              width: `${clampedValue}%`,
              backgroundColor: signalColor ?? "var(--ink-primary)",
              opacity: 0.16,
            }}
          />

          {/* Calibrated Tick Marks: 0, 25, 50, 75, 100 */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-1.5">
            {[0, 25, 50, 75, 100].map((tick) => (
              <div key={tick} className="h-full flex flex-col justify-between items-center py-1">
                <span className="w-px h-1.5 bg-[var(--ink-secondary)] opacity-40" />
                <span className="w-px h-1.5 bg-[var(--ink-secondary)] opacity-40" />
              </div>
            ))}
          </div>

          {/* Thumb needle indicator */}
          <div
            className="absolute top-0 bottom-0 w-1.5 rounded-full shadow-sm transition-all duration-75 pointer-events-none"
            style={{
              insetInlineStart: `calc(${clampedValue}% - 3px)`,
              backgroundColor: signalColor ?? "var(--ink-primary)",
            }}
          />
        </div>

        {/* Ruler Numerals: 0, 25, 50, 75, 100 aligned from start to end */}
        <div className="flex justify-between text-[10px] font-mono text-[var(--ink-muted)] px-1 select-none">
          <span dir="ltr" className="tabular-nums">
            0
          </span>
          <span dir="ltr" className="tabular-nums">
            25
          </span>
          <span dir="ltr" className="tabular-nums">
            50
          </span>
          <span dir="ltr" className="tabular-nums">
            75
          </span>
          <span dir="ltr" className="tabular-nums">
            100
          </span>
        </div>
      </div>

      {/* Expandable Notes Action */}
      {(onNotesChange || notes !== undefined) && (
        <div className="pt-2 border-t border-[var(--border-subtle)]/60">
          <button
            type="button"
            onClick={() => setShowNotes((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors py-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-[var(--ink-muted)]" />
              <span>{notesLabel}</span>
              {Boolean(notes?.trim()) && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal-positive)]" />
              )}
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-150",
                showNotes && "rotate-180",
              )}
            />
          </button>

          {showNotes && (
            <div className="mt-2 pt-1">
              <textarea
                value={notes ?? ""}
                onChange={(e) => onNotesChange?.(e.target.value)}
                placeholder={notesPlaceholder}
                rows={2}
                className="w-full text-xs p-2 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)]/50 border border-[var(--border-subtle)] text-[var(--ink-primary)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--border-strong)] resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
