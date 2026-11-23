import {
  Activity,
  AlertCircle,
  Check,
  Compass,
  FileText,
  Flame,
  Grid,
  Layers,
  Plus,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "../utils/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card.js";
import { Input } from "./input.js";
import { Textarea } from "./textarea.js";

export interface JournalEntryItem {
  id: string;
  title: string;
  engagement: number; // 0..100
  energy: number; // -100..+100
  isFlow: boolean;
  durationMinutes?: number | undefined;
  occurredAt?: number | undefined;
}

export type ReflectionTag = "TREND" | "INSIGHT" | "SURPRISE";

export interface ReflectionFindingItem {
  id: string;
  journalEntryId: string;
  tag: ReflectionTag;
  notes: string;
}

export interface AeiouItem {
  id?: string | undefined;
  reflectionFindingId: string;
  activities: string;
  environments: string;
  interactions: string;
  objects: string;
  users: string;
}

export interface GoodTimeJournalProps {
  entries: JournalEntryItem[];
  findings?: ReflectionFindingItem[];
  aeiouAnalyses?: Record<string, AeiouItem>;
  onAddEntry: (entry: Omit<JournalEntryItem, "id">) => void;
  onDeleteEntry?: (id: string) => void;
  onSaveFinding?: (finding: Omit<ReflectionFindingItem, "id">) => void;
  onSaveAeiou?: (analysis: AeiouItem) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  className?: string;
}

export function GoodTimeJournal({
  entries,
  findings = [],
  aeiouAnalyses = {},
  onAddEntry,
  onDeleteEntry,
  onSaveFinding,
  onSaveAeiou,
  t,
  className,
}: GoodTimeJournalProps): React.JSX.Element {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);

  // Stage 1 form state
  const [newTitle, setNewTitle] = useState("");
  const [newEngagement, setNewEngagement] = useState(70);
  const [newEnergy, setNewEnergy] = useState(50);
  const [newIsFlow, setNewIsFlow] = useState(false);
  const [newDuration, setNewDuration] = useState<number | undefined>(undefined);

  // Stage 2 selected entry for reflection
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(entries[0]?.id ?? null);
  const [reflectionTag, setReflectionTag] = useState<ReflectionTag>("INSIGHT");
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [findingSaved, setFindingSaved] = useState(false);

  // Stage 3 AEIOU state
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(
    findings[0]?.id ?? null,
  );
  const [aeiouActivities, setAeiouActivities] = useState("");
  const [aeiouEnvironments, setAeiouEnvironments] = useState("");
  const [aeiouInteractions, setAeiouInteractions] = useState("");
  const [aeiouObjects, setAeiouObjects] = useState("");
  const [aeiouUsers, setAeiouUsers] = useState("");
  const [aeiouSaved, setAeiouSaved] = useState(false);

  const selectedEntry = entries.find((e) => e.id === selectedEntryId);
  const selectedFinding = findings.find((f) => f.id === selectedFindingId);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddEntry({
      title: newTitle.trim(),
      engagement: newEngagement,
      energy: newEnergy,
      isFlow: newIsFlow,
      occurredAt: Date.now(),
      ...(newDuration !== undefined ? { durationMinutes: newDuration } : {}),
    });

    setNewTitle("");
    setNewEngagement(70);
    setNewEnergy(50);
    setNewIsFlow(false);
    setNewDuration(undefined);
  };

  const handleSaveReflection = () => {
    if (!selectedEntryId || !reflectionNotes.trim()) return;
    onSaveFinding?.({
      journalEntryId: selectedEntryId,
      tag: reflectionTag,
      notes: reflectionNotes.trim(),
    });
    setFindingSaved(true);
    setTimeout(() => setFindingSaved(false), 2000);
  };

  const handleSaveAeiouForm = () => {
    if (!selectedFindingId) return;
    onSaveAeiou?.({
      reflectionFindingId: selectedFindingId,
      activities: aeiouActivities.trim(),
      environments: aeiouEnvironments.trim(),
      interactions: aeiouInteractions.trim(),
      objects: aeiouObjects.trim(),
      users: aeiouUsers.trim(),
    });
    setAeiouSaved(true);
    setTimeout(() => setAeiouSaved(false), 2000);
  };

  const handleOpenAeiouForFinding = (findingId: string) => {
    setSelectedFindingId(findingId);
    const existing = aeiouAnalyses[findingId];
    if (existing) {
      setAeiouActivities(existing.activities);
      setAeiouEnvironments(existing.environments);
      setAeiouInteractions(existing.interactions);
      setAeiouObjects(existing.objects);
      setAeiouUsers(existing.users);
    } else {
      setAeiouActivities("");
      setAeiouEnvironments("");
      setAeiouInteractions("");
      setAeiouObjects("");
      setAeiouUsers("");
    }
    setActiveStage(3);
  };

  return (
    <Card className={cn("border border-[var(--border-subtle)] bg-[var(--bg-surface)]", className)}>
      {/* Studio Header & 3-Stage Workflow Navigation */}
      <CardHeader className="border-b border-[var(--border-subtle)] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--path-2)]" />
            <span className="text-xs font-semibold text-[var(--ink-primary)]">
              {activeStage === 1
                ? t("goodTimeJournal.stage1")
                : activeStage === 2
                  ? t("goodTimeJournal.stage2")
                  : t("goodTimeJournal.stage3")}
            </span>
          </div>

          {/* Stage Switcher Tabs */}
          <div className="inline-flex rounded-[var(--radius-sm,4px)] p-1 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveStage(1)}
              className={cn(
                "ps-3 pe-3 py-1.5 rounded-[var(--radius-sm,4px)] transition-colors cursor-pointer",
                activeStage === 1
                  ? "bg-[var(--bg-surface)] font-semibold text-[var(--ink-primary)] shadow-xs"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-medium",
              )}
            >
              {t("goodTimeJournal.stage1")}
            </button>
            <button
              type="button"
              onClick={() => setActiveStage(2)}
              className={cn(
                "ps-3 pe-3 py-1.5 rounded-[var(--radius-sm,4px)] transition-colors cursor-pointer",
                activeStage === 2
                  ? "bg-[var(--bg-surface)] font-semibold text-[var(--ink-primary)] shadow-xs"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-medium",
              )}
            >
              {t("goodTimeJournal.stage2")}
            </button>
            <button
              type="button"
              onClick={() => setActiveStage(3)}
              className={cn(
                "ps-3 pe-3 py-1.5 rounded-[var(--radius-sm,4px)] transition-colors cursor-pointer",
                activeStage === 3
                  ? "bg-[var(--bg-surface)] font-semibold text-[var(--ink-primary)] shadow-xs"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-medium",
              )}
            >
              {t("goodTimeJournal.stage3")}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* STAGE 1: Daily Quick Activity Logging */}
        {activeStage === 1 && (
          <div className="space-y-6">
            <form
              onSubmit={handleAddSubmit}
              className="p-4 rounded-[var(--radius-md,6px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label
                    htmlFor="gtj-activity-title"
                    className="text-xs font-medium text-[var(--ink-primary)]"
                  >
                    {t("goodTimeJournal.activityLabel")}
                  </label>
                  <Input
                    id="gtj-activity-title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t("goodTimeJournal.activityPlaceholder")}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                {/* Energy Slider: -100 to +100 */}
                <div className="space-y-2 p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--ink-secondary)] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[var(--signal-amber)]" />
                      {t("goodTimeJournal.energyLevel")}
                    </span>
                    <span
                      dir="ltr"
                      className={cn(
                        "font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded",
                        newEnergy >= 0
                          ? "bg-[var(--signal-positive)]/15 text-[var(--signal-positive)]"
                          : "bg-[var(--signal-amber)]/15 text-[var(--signal-amber)]",
                      )}
                    >
                      {newEnergy > 0 ? `+${newEnergy}` : newEnergy}
                    </span>
                  </div>
                  <input
                    type="range"
                    dir="ltr"
                    min={-100}
                    max={100}
                    step={5}
                    value={newEnergy}
                    onChange={(e) => setNewEnergy(Number(e.target.value))}
                    className="w-full accent-[var(--path-2)] cursor-pointer"
                  />
                  <div
                    dir="ltr"
                    className="flex justify-between text-[10px] font-mono text-[var(--ink-muted)] select-none"
                  >
                    <span>
                      <span className="tabular-nums">-100</span> ({t("goodTimeJournal.drainLabel")})
                    </span>
                    <span>
                      <span className="tabular-nums">0</span> ({t("goodTimeJournal.neutralLabel")})
                    </span>
                    <span>
                      <span className="tabular-nums">+100</span> ({t("goodTimeJournal.fuelLabel")})
                    </span>
                  </div>
                </div>

                {/* Engagement Slider: 0 to 100 */}
                <div className="space-y-2 p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--ink-secondary)] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[var(--path-1)]" />
                      {t("goodTimeJournal.engagementLevel")}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono tabular-nums text-xs font-semibold text-[var(--path-1)] px-2 py-0.5 rounded bg-[var(--path-1)]/15"
                    >
                      {newEngagement}%
                    </span>
                  </div>
                  <input
                    type="range"
                    dir="ltr"
                    min={0}
                    max={100}
                    step={5}
                    value={newEngagement}
                    onChange={(e) => setNewEngagement(Number(e.target.value))}
                    className="w-full accent-[var(--path-1)] cursor-pointer"
                  />
                  <div
                    dir="ltr"
                    className="flex justify-between text-[10px] font-mono text-[var(--ink-muted)] select-none"
                  >
                    <span>
                      <span className="tabular-nums">0%</span> ({t("goodTimeJournal.boredLabel")})
                    </span>
                    <span>
                      <span className="tabular-nums">50%</span> ({t("goodTimeJournal.engagedLabel")}
                      )
                    </span>
                    <span>
                      <span className="tabular-nums">100%</span> (
                      {t("goodTimeJournal.immersedLabel")})
                    </span>
                  </div>
                </div>
              </div>

              {/* Flow State Checkbox & Duration */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newIsFlow}
                    onChange={(e) => setNewIsFlow(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--signal-positive)] accent-[var(--signal-positive)] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[var(--signal-amber)]" />
                    <span className="text-xs font-medium text-[var(--ink-primary)]">
                      {t("goodTimeJournal.flowState")}
                    </span>
                  </div>
                </label>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="gtj-duration-input"
                      className="text-[11px] text-[var(--ink-muted)] whitespace-nowrap"
                    >
                      {t("goodTimeJournal.duration")}:
                    </label>
                    <Input
                      id="gtj-duration-input"
                      type="number"
                      min={1}
                      max={720}
                      value={newDuration ?? ""}
                      onChange={(e) =>
                        setNewDuration(e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="45"
                      className="w-16 h-8 text-xs font-mono"
                    />
                  </div>

                  <Button type="submit" size="sm" className="gap-1.5 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t("goodTimeJournal.addActivity")}</span>
                  </Button>
                </div>
              </div>
            </form>

            {/* List of Recent Activities */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-[var(--ink-secondary)]">
                {t("goodTimeJournal.activityLabel")} ({entries.length})
              </h4>
              {entries.length === 0 ? (
                <div className="text-center py-8 text-xs text-[var(--ink-muted)] border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-md,6px)]">
                  {t("goodTimeJournal.noActivities")}
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {entry.isFlow && (
                          <Badge
                            variant="outline"
                            className="text-[10px] text-[var(--signal-amber)] border-[var(--signal-amber)]/40 gap-1"
                          >
                            <Flame className="w-3 h-3" />
                            {t("goodTimeJournal.flowBadge")}
                          </Badge>
                        )}
                        <span className="font-medium text-[var(--ink-primary)] truncate">
                          {entry.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-[11px] text-[var(--ink-secondary)]">
                          {t("goodTimeJournal.engagementScore")}:
                        </span>
                        <span
                          dir="ltr"
                          className="font-mono tabular-nums text-[11px] font-semibold text-[var(--path-1)]"
                        >
                          {entry.engagement}%
                        </span>
                        <span className="text-[11px] text-[var(--ink-secondary)]">
                          {t("goodTimeJournal.energyScore")}:
                        </span>
                        <span
                          dir="ltr"
                          className={cn(
                            "font-mono tabular-nums text-[11px] font-semibold",
                            entry.energy >= 0
                              ? "text-[var(--signal-positive)]"
                              : "text-[var(--signal-amber)]",
                          )}
                        >
                          {entry.energy > 0 ? `+${entry.energy}` : entry.energy}
                        </span>
                        {entry.durationMinutes && (
                          <span
                            dir="ltr"
                            className="font-mono tabular-nums text-[10px] text-[var(--ink-muted)]"
                          >
                            {entry.durationMinutes}m
                          </span>
                        )}
                        {onDeleteEntry && (
                          <button
                            type="button"
                            onClick={() => onDeleteEntry(entry.id)}
                            className="text-[var(--ink-muted)] hover:text-[var(--signal-danger,red)] transition-colors p-1"
                            aria-label={t("goodTimeJournal.deleteActivity")}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE 2: 2D Energy & Engagement Matrix + Reflection Findings */}
        {activeStage === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[var(--ink-primary)]">
                  {t("goodTimeJournal.matrixTitle")}
                </h4>
                <p className="text-xs text-[var(--ink-secondary)]">
                  {t("goodTimeJournal.matrixDesc")}
                </p>
              </div>
            </div>

            {/* 2D Coordinate Grid Matrix */}
            <div className="relative w-full h-80 rounded-[var(--radius-md,6px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 overflow-hidden select-none">
              {/* Quadrant Lines */}
              {/* Zero Energy Line (Horizontal mid) */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-[var(--border-subtle)]" />
              {/* Mid Engagement Line (Vertical mid) */}
              <div className="absolute inset-y-0 start-1/2 -translate-x-1/2 border-e border-dashed border-[var(--border-subtle)]" />

              {/* Quadrant Labels */}
              <div className="absolute top-2 end-3 text-[10px] font-mono text-[var(--signal-positive)] opacity-70">
                {t("goodTimeJournal.highEnergyHighEngage")}
              </div>
              <div className="absolute top-2 start-3 text-[10px] font-mono text-[var(--ink-muted)] opacity-70">
                {t("goodTimeJournal.highEnergyLowEngage")}
              </div>
              <div className="absolute bottom-2 end-3 text-[10px] font-mono text-[var(--signal-amber)] opacity-70">
                {t("goodTimeJournal.lowEnergyHighEngage")}
              </div>
              <div className="absolute bottom-2 start-3 text-[10px] font-mono text-[var(--ink-muted)] opacity-70">
                {t("goodTimeJournal.lowEnergyLowEngage")}
              </div>

              {/* Data Points Plotted */}
              {entries.map((entry) => {
                // X: engagement (0..100) -> insetInlineStart %
                const xPercent = Math.max(5, Math.min(95, entry.engagement));
                // Y: energy (-100..+100) -> bottom %: -100 is 5%, 0 is 50%, +100 is 95%
                const yPercent = Math.max(5, Math.min(95, ((entry.energy + 100) / 200) * 100));

                const isSelected = selectedEntryId === entry.id;

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setSelectedEntryId(entry.id)}
                    style={{
                      insetInlineStart: `${xPercent}%`,
                      bottom: `${yPercent}%`,
                    }}
                    className={cn(
                      "absolute -translate-x-1/2 translate-y-1/2 p-1.5 rounded-full transition-transform focus:outline-none",
                      isSelected ? "scale-125 z-20" : "hover:scale-110 z-10",
                    )}
                    aria-label={entry.title}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shadow-sm",
                        entry.energy >= 0
                          ? "bg-[var(--signal-positive)] border-[var(--bg-surface)] text-[var(--bg-surface)]"
                          : "bg-[var(--signal-amber)] border-[var(--bg-surface)] text-[var(--bg-surface)]",
                        isSelected && "ring-2 ring-[var(--ink-primary)]",
                      )}
                    >
                      {entry.isFlow && <Flame className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Entry Reflection Panel */}
            {selectedEntry ? (
              <div className="p-4 rounded-[var(--radius-md,6px)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                  <div>
                    <span className="text-[11px] text-[var(--ink-muted)] uppercase tracking-wider font-mono">
                      {t("goodTimeJournal.activityLabel")}
                    </span>
                    <h5 className="text-sm font-semibold text-[var(--ink-primary)]">
                      {selectedEntry.title}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[var(--ink-secondary)]">
                      {t("goodTimeJournal.engagementScore")}:
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono tabular-nums font-semibold text-[var(--path-1)]"
                    >
                      {selectedEntry.engagement}%
                    </span>
                    <span className="text-[var(--ink-secondary)]">
                      {t("goodTimeJournal.energyScore")}:
                    </span>
                    <span
                      dir="ltr"
                      className={cn(
                        "font-mono tabular-nums font-semibold",
                        selectedEntry.energy >= 0
                          ? "text-[var(--signal-positive)]"
                          : "text-[var(--signal-amber)]",
                      )}
                    >
                      {selectedEntry.energy > 0 ? `+${selectedEntry.energy}` : selectedEntry.energy}
                    </span>
                  </div>
                </div>

                {/* Tag Selection */}
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-[var(--ink-secondary)]">
                    {t("goodTimeJournal.reflectionNotes")}
                  </span>
                  <div className="flex items-center gap-2">
                    {(["TREND", "INSIGHT", "SURPRISE"] as ReflectionTag[]).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setReflectionTag(tag)}
                        className={cn(
                          "px-3 py-1 rounded-[var(--radius-sm,4px)] text-xs font-mono transition-colors border",
                          reflectionTag === tag
                            ? "bg-[var(--bg-inverted)] text-[var(--bg-surface)] border-transparent font-medium"
                            : "border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]",
                        )}
                      >
                        {tag === "TREND"
                          ? t("goodTimeJournal.tagTrend")
                          : tag === "INSIGHT"
                            ? t("goodTimeJournal.tagInsight")
                            : t("goodTimeJournal.tagSurprise")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Textarea
                    value={reflectionNotes}
                    onChange={(e) => setReflectionNotes(e.target.value)}
                    placeholder={t("goodTimeJournal.reflectionNotesPlaceholder")}
                    className="text-xs h-20"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    size="sm"
                    onClick={handleSaveReflection}
                    disabled={!reflectionNotes.trim()}
                    className="gap-1.5 text-xs"
                  >
                    {findingSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                        <span>{t("common.saved")}</span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-3.5 h-3.5" />
                        <span>{t("goodTimeJournal.saveFinding")}</span>
                      </>
                    )}
                  </Button>

                  {/* Findings linked to this entry */}
                  {findings
                    .filter((f) => f.journalEntryId === selectedEntry.id)
                    .map((f) => (
                      <Button
                        key={f.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAeiouForFinding(f.id)}
                        className="gap-1.5 text-xs text-[var(--path-2)]"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{t("goodTimeJournal.runAeiou")}</span>
                      </Button>
                    ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[var(--ink-muted)] border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-md,6px)]">
                {t("goodTimeJournal.selectFindingPrompt")}
              </div>
            )}
          </div>
        )}

        {/* STAGE 3: AEIOU Deep Dive Analysis */}
        {activeStage === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[var(--border-subtle)] pb-3">
              <h4 className="text-sm font-semibold text-[var(--ink-primary)]">
                {t("goodTimeJournal.aeiouTitle")}
              </h4>
              <p className="text-xs text-[var(--ink-secondary)]">
                {t("goodTimeJournal.aeiouDesc")}
              </p>
            </div>

            {/* Finding Selector Bar */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[var(--ink-secondary)]">
                {t("goodTimeJournal.recordedFindings")}
              </span>
              <div className="flex flex-wrap gap-2">
                {findings.length === 0 ? (
                  <span className="text-xs text-[var(--ink-muted)]">
                    {t("goodTimeJournal.selectFindingPrompt")}
                  </span>
                ) : (
                  findings.map((finding) => (
                    <button
                      key={finding.id}
                      type="button"
                      onClick={() => handleOpenAeiouForFinding(finding.id)}
                      className={cn(
                        "ps-3 pe-3 py-1.5 rounded-[var(--radius-sm,4px)] text-xs border text-start transition-colors",
                        selectedFindingId === finding.id
                          ? "bg-[var(--bg-subtle)] border-[var(--path-2)] text-[var(--ink-primary)] font-medium"
                          : "border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]",
                      )}
                    >
                      <span className="font-mono text-[10px] me-1 text-[var(--path-2)]">
                        {finding.tag}
                      </span>
                      <span className="truncate max-w-[200px] inline-block align-bottom">
                        {finding.notes}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {selectedFinding ? (
              <div className="space-y-4 pt-2">
                {/* 5 Architectural Fields of AEIOU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Activities */}
                  <div className="space-y-1.5 p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/30">
                    <label
                      htmlFor="aeiou-activities-input"
                      className="text-xs font-semibold text-[var(--ink-primary)]"
                    >
                      {t("goodTimeJournal.activities")}
                    </label>
                    <p className="text-[11px] text-[var(--ink-muted)]">
                      {t("goodTimeJournal.activitiesDesc")}
                    </p>
                    <Textarea
                      id="aeiou-activities-input"
                      value={aeiouActivities}
                      onChange={(e) => setAeiouActivities(e.target.value)}
                      className="text-xs h-20"
                      placeholder={t("goodTimeJournal.activitiesPlaceholder")}
                    />
                  </div>

                  {/* Environments */}
                  <div className="space-y-1.5 p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/30">
                    <label
                      htmlFor="aeiou-environments-input"
                      className="text-xs font-semibold text-[var(--ink-primary)]"
                    >
                      {t("goodTimeJournal.environments")}
                    </label>
                    <p className="text-[11px] text-[var(--ink-muted)]">
                      {t("goodTimeJournal.environmentsDesc")}
                    </p>
                    <Textarea
                      id="aeiou-environments-input"
                      value={aeiouEnvironments}
                      onChange={(e) => setAeiouEnvironments(e.target.value)}
                      className="text-xs h-20"
                      placeholder={t("goodTimeJournal.environmentsPlaceholder")}
                    />
                  </div>

                  {/* Interactions */}
                  <div className="space-y-1.5 p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/30">
                    <label
                      htmlFor="aeiou-interactions-input"
                      className="text-xs font-semibold text-[var(--ink-primary)]"
                    >
                      {t("goodTimeJournal.interactions")}
                    </label>
                    <p className="text-[11px] text-[var(--ink-muted)]">
                      {t("goodTimeJournal.interactionsDesc")}
                    </p>
                    <Textarea
                      id="aeiou-interactions-input"
                      value={aeiouInteractions}
                      onChange={(e) => setAeiouInteractions(e.target.value)}
                      className="text-xs h-20"
                      placeholder={t("goodTimeJournal.interactionsPlaceholder")}
                    />
                  </div>

                  {/* Objects */}
                  <div className="space-y-1.5 p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/30">
                    <label
                      htmlFor="aeiou-objects-input"
                      className="text-xs font-semibold text-[var(--ink-primary)]"
                    >
                      {t("goodTimeJournal.objects")}
                    </label>
                    <p className="text-[11px] text-[var(--ink-muted)]">
                      {t("goodTimeJournal.objectsDesc")}
                    </p>
                    <Textarea
                      id="aeiou-objects-input"
                      value={aeiouObjects}
                      onChange={(e) => setAeiouObjects(e.target.value)}
                      className="text-xs h-20"
                      placeholder={t("goodTimeJournal.objectsPlaceholder")}
                    />
                  </div>

                  {/* Users (Full Width) */}
                  <div className="space-y-1.5 p-3 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/30 md:col-span-2">
                    <label
                      htmlFor="aeiou-users-input"
                      className="text-xs font-semibold text-[var(--ink-primary)]"
                    >
                      {t("goodTimeJournal.users")}
                    </label>
                    <p className="text-[11px] text-[var(--ink-muted)]">
                      {t("goodTimeJournal.usersDesc")}
                    </p>
                    <Textarea
                      id="aeiou-users-input"
                      value={aeiouUsers}
                      onChange={(e) => setAeiouUsers(e.target.value)}
                      className="text-xs h-20"
                      placeholder={t("goodTimeJournal.usersPlaceholder")}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button size="sm" onClick={handleSaveAeiouForm} className="gap-1.5 text-xs">
                    {aeiouSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                        <span>{t("common.saved")}</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>{t("goodTimeJournal.saveAeiou")}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
