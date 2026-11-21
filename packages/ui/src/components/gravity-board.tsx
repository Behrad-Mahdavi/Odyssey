import { ArrowLeftRight, Plus, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "../utils/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import { Input } from "./input.js";

export interface ProblemItem {
  id: string;
  content: string;
  isGravity: boolean;
}

export interface GravityBoardProps {
  problems: ProblemItem[];
  onAddProblem: (content: string) => void;
  onToggleClassification: (id: string) => void;
  onDeleteProblem?: (id: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  className?: string;
}

export function GravityBoard({
  problems,
  onAddProblem,
  onToggleClassification,
  onDeleteProblem,
  t,
  className,
}: GravityBoardProps): React.JSX.Element {
  const [newContent, setNewContent] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onAddProblem(newContent.trim());
    setNewContent("");
  };

  const designableProblems = problems.filter((p) => !p.isGravity);
  const gravityProblems = problems.filter((p) => p.isGravity);

  return (
    <Card className={cn("space-y-4", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{t("hwpl.gravityBoardTitle")}</CardTitle>
          <span className="text-[11px] font-mono text-[var(--ink-muted)]">Ch. 01 & 04</span>
        </div>
        <p className="text-xs text-[var(--ink-secondary)] mt-1">{t("hwpl.gravityBoardDesc")}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Problem Input */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={t("hwpl.addProblemPlaceholder")}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" size="md" className="gap-1.5 shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span>{t("hwpl.addProblemButton")}</span>
          </Button>
        </form>

        {/* Two-Column Board: Designable vs Gravity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Designable Column */}
          <div className="rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-3 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                <span className="font-semibold text-xs text-[var(--ink-primary)]">
                  {t("hwpl.designableColumn")}
                </span>
              </div>
              <Badge variant="positive">{designableProblems.length}</Badge>
            </div>

            {designableProblems.length === 0 ? (
              <p className="text-[11px] text-[var(--ink-muted)] py-4 text-center">
                {t("hwpl.emptyDesignable")}
              </p>
            ) : (
              designableProblems.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs space-y-2 transition-all duration-150"
                >
                  <p className="font-medium text-[var(--ink-primary)] leading-relaxed">
                    {p.content}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]/60 text-[11px]">
                    <Badge variant="positive">[{t("hwpl.designableBadge")}]</Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleClassification(p.id)}
                        className="h-6 text-[11px] ps-2 pe-2 text-[var(--gravity-muted)] gap-1"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>{t("hwpl.makeGravity")}</span>
                      </Button>
                      {onDeleteProblem && (
                        <button
                          type="button"
                          onClick={() => onDeleteProblem(p.id)}
                          className="text-[var(--ink-muted)] hover:text-[var(--signal-negative)] p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Gravity Column (Accepted Realities) */}
          <div className="rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-3 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[var(--gravity-muted)]" />
                <span className="font-semibold text-xs text-[var(--ink-primary)]">
                  {t("hwpl.gravityColumn")}
                </span>
              </div>
              <Badge variant="neutral">{gravityProblems.length}</Badge>
            </div>

            {gravityProblems.length === 0 ? (
              <p className="text-[11px] text-[var(--ink-muted)] py-4 text-center">
                {t("hwpl.emptyGravity")}
              </p>
            ) : (
              gravityProblems.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs space-y-2 opacity-80 transition-all duration-150"
                >
                  <p className="line-through text-[var(--gravity-muted)] leading-relaxed">
                    {p.content}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]/60 text-[11px]">
                    <Badge variant="neutral">[{t("hwpl.gravityBadge")}]</Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleClassification(p.id)}
                        className="h-6 text-[11px] ps-2 pe-2 text-[var(--signal-positive)] gap-1"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>{t("hwpl.makeDesignable")}</span>
                      </Button>
                      {onDeleteProblem && (
                        <button
                          type="button"
                          onClick={() => onDeleteProblem(p.id)}
                          className="text-[var(--ink-muted)] hover:text-[var(--signal-negative)] p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
