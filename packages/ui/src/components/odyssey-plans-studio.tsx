import {
  Calendar,
  Check,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Plus,
  Printer,
  Sparkles,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "../utils/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog.js";
import { Input } from "./input.js";
import { Textarea } from "./textarea.js";

export type OdysseySlot = "LIFE_1" | "LIFE_2" | "LIFE_3";

export interface TimelineEventItem {
  year: 1 | 2 | 3 | 4 | 5;
  type: "work" | "personal";
  description: string;
}

export interface PlanItem {
  id?: string;
  slot: OdysseySlot;
  sixWordTitle: string;
  resources: number; // 0..100
  likability: number; // 0..100
  confidence: number; // 0..100
  coherence: number; // 0..100
  questions: [string, string, string];
  timelineEvents: TimelineEventItem[];
  isFinalized?: boolean;
}

export interface FeedbackItem {
  id?: string;
  odysseyPlanId: string;
  externalFeedback: string;
  presenterEnergyNote: string;
}

export interface OdysseyPlansStudioProps {
  plans: Record<OdysseySlot, PlanItem>;
  feedbacks?: Record<string, FeedbackItem[]>;
  onUpdatePlan: (plan: PlanItem) => void;
  onSaveFeedback?: (
    slot: OdysseySlot,
    feedback: { externalFeedback: string; presenterEnergyNote: string },
  ) => void;
  onCreatePrototype?: (slot: OdysseySlot, questionIndex: number, questionText: string) => void;
  countWords?: (text: string) => number;
  t: (key: string, options?: Record<string, unknown>) => string;
  className?: string;
}

function defaultCountWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text
    .trim()
    .split(/[\s\p{Z}\p{C}\r\n\t]+/u)
    .filter(Boolean).length;
}

export function OdysseyPlansStudio({
  plans,
  feedbacks = {},
  onUpdatePlan,
  onSaveFeedback,
  onCreatePrototype,
  countWords = defaultCountWords,
  t,
  className,
}: OdysseyPlansStudioProps): React.JSX.Element {
  const [pitchMode, setPitchMode] = useState(false);
  const [activeFeedbackSlot, setActiveFeedbackSlot] = useState<OdysseySlot | null>(null);
  const [externalFeedbackText, setExternalFeedbackText] = useState("");
  const [presenterEnergyText, setPresenterEnergyText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Quick event adding state per slot
  const [addingEventSlot, setAddingEventSlot] = useState<OdysseySlot | null>(null);
  const [eventYear, setEventYear] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [eventType, setEventType] = useState<"work" | "personal">("work");
  const [eventDesc, setEventDesc] = useState("");

  const slotMetadata: Record<
    OdysseySlot,
    { titleKey: string; subtitleKey: string; color: string; badge: string }
  > = {
    LIFE_1: {
      titleKey: "odysseyPlans.life1Title",
      subtitleKey: "odysseyPlans.life1Subtitle",
      color: "var(--path-1)",
      badge: "Life 01",
    },
    LIFE_2: {
      titleKey: "odysseyPlans.life2Title",
      subtitleKey: "odysseyPlans.life2Subtitle",
      color: "var(--path-2)",
      badge: "Life 02",
    },
    LIFE_3: {
      titleKey: "odysseyPlans.life3Title",
      subtitleKey: "odysseyPlans.life3Subtitle",
      color: "var(--path-3)",
      badge: "Life 03",
    },
  };

  const handleTitleChange = (slot: OdysseySlot, title: string) => {
    const current = plans[slot];
    onUpdatePlan({ ...current, sixWordTitle: title });
  };

  const handleGaugeChange = (
    slot: OdysseySlot,
    gauge: "resources" | "likability" | "confidence" | "coherence",
    value: number,
  ) => {
    const current = plans[slot];
    onUpdatePlan({ ...current, [gauge]: value });
  };

  const handleQuestionChange = (slot: OdysseySlot, index: 0 | 1 | 2, text: string) => {
    const current = plans[slot];
    const newQuestions: [string, string, string] = [...current.questions];
    newQuestions[index] = text;
    onUpdatePlan({ ...current, questions: newQuestions });
  };

  const handleAddEvent = (slot: OdysseySlot) => {
    if (!eventDesc.trim()) return;
    const current = plans[slot];
    const newEvent: TimelineEventItem = {
      year: eventYear,
      type: eventType,
      description: eventDesc.trim(),
    };
    onUpdatePlan({
      ...current,
      timelineEvents: [...current.timelineEvents, newEvent],
    });
    setEventDesc("");
    setAddingEventSlot(null);
  };

  const handleOpenFeedback = (slot: OdysseySlot) => {
    setActiveFeedbackSlot(slot);
    setExternalFeedbackText("");
    setPresenterEnergyText("");
    setFeedbackSuccess(false);
  };

  const handleSaveFeedbackSubmit = () => {
    if (!activeFeedbackSlot || !onSaveFeedback) return;
    onSaveFeedback(activeFeedbackSlot, {
      externalFeedback: externalFeedbackText.trim(),
      presenterEnergyNote: presenterEnergyText.trim(),
    });
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setActiveFeedbackSlot(null);
    }, 1500);
  };

  const handleTriggerPrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Action Header: Mode Switcher & Print trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <h3 className="text-base font-semibold text-[var(--ink-primary)]">
            {t("nav.odysseyPlans")}
          </h3>
          <p className="text-xs text-[var(--ink-secondary)]">
            سه مسیر پنج‌ساله موازی و مستقل — کشف گزینه‌ها بدون مقایسه قضاوت‌گرانه
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPitchMode(!pitchMode)}
            className="text-xs font-mono gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--path-2)]" />
            <span>
              {pitchMode ? t("odysseyPlans.exitPitchMode") : t("odysseyPlans.pitchModeToggle")}
            </span>
          </Button>

          {pitchMode && (
            <Button
              size="sm"
              onClick={handleTriggerPrint}
              className="text-xs font-mono gap-1.5 bg-[var(--bg-inverted)] text-[var(--bg-surface)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t("odysseyPlans.printPdf")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* 3-Column Parallel Odyssey Canvas */}
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-3 gap-6",
          pitchMode && "grid-cols-1 lg:grid-cols-3 print:grid-cols-3 print:gap-4 print:w-full",
        )}
      >
        {(["LIFE_1", "LIFE_2", "LIFE_3"] as OdysseySlot[]).map((slot) => {
          const meta = slotMetadata[slot];
          const plan = plans[slot];
          const wordCount = countWords(plan.sixWordTitle);
          const isOverWordLimit = wordCount > 6;
          const planFeedbacks = feedbacks[plan.id ?? slot] ?? [];

          return (
            <Card
              key={slot}
              className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col border-t-4"
              style={{ borderTopColor: meta.color }}
            >
              {/* Plan Header */}
              <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center justify-between mb-1">
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] px-2 py-0.5"
                    style={{ color: meta.color }}
                  >
                    {meta.badge}
                  </Badge>
                  <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                    5-Year Trajectory
                  </span>
                </div>
                <CardTitle className="text-sm font-semibold text-[var(--ink-primary)]">
                  {t(meta.titleKey)}
                </CardTitle>
                <CardDescription className="text-[11px] leading-relaxed">
                  {t(meta.subtitleKey)}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 flex-1 flex flex-col space-y-5 text-xs">
                {/* 1. Six-Word Headline (INV-03) */}
                <div className="space-y-1.5 p-3 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)]/40 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[var(--ink-primary)]">
                      {t("odysseyPlans.sixWordTitleLabel")}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded",
                        isOverWordLimit
                          ? "bg-[var(--signal-amber)]/20 text-[var(--signal-amber)] font-bold"
                          : "text-[var(--ink-muted)]",
                      )}
                    >
                      {t("odysseyPlans.wordCountIndicator", {
                        current: wordCount,
                        max: 6,
                      })}
                    </span>
                  </div>

                  {pitchMode ? (
                    <p className="font-medium text-sm text-[var(--ink-primary)] py-1">
                      {plan.sixWordTitle || "—"}
                    </p>
                  ) : (
                    <Input
                      value={plan.sixWordTitle}
                      onChange={(e) => handleTitleChange(slot, e.target.value)}
                      placeholder={t("odysseyPlans.sixWordTitlePlaceholder")}
                      className={cn(
                        "h-8 text-xs",
                        isOverWordLimit && "border-[var(--signal-amber)]",
                      )}
                    />
                  )}
                  {isOverWordLimit && (
                    <span className="text-[10px] text-[var(--signal-amber)] block">
                      {t("odysseyPlans.headlineLimitExceeded")}
                    </span>
                  )}
                </div>

                {/* 2. Five-Year Timeline */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--ink-primary)] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[var(--ink-secondary)]" />
                      {t("odysseyPlans.timelineTitle")}
                    </span>
                    {!pitchMode && (
                      <button
                        type="button"
                        onClick={() => setAddingEventSlot(addingEventSlot === slot ? null : slot)}
                        className="text-[11px] font-mono text-[var(--path-1)] hover:underline"
                      >
                        {t("odysseyPlans.addEvent")}
                      </button>
                    )}
                  </div>

                  {/* Add Event Form */}
                  {addingEventSlot === slot && !pitchMode && (
                    <div className="p-2.5 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <select
                          value={eventYear}
                          onChange={(e) =>
                            setEventYear(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                          }
                          className="h-7 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] ps-1 pe-2"
                        >
                          {[1, 2, 3, 4, 5].map((y) => (
                            <option key={y} value={y}>
                              {t("odysseyPlans.year", { num: y })}
                            </option>
                          ))}
                        </select>
                        <select
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value as "work" | "personal")}
                          className="h-7 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] ps-1 pe-2"
                        >
                          <option value="work">{t("odysseyPlans.workEvent")}</option>
                          <option value="personal">{t("odysseyPlans.personalEvent")}</option>
                        </select>
                      </div>
                      <Input
                        value={eventDesc}
                        onChange={(e) => setEventDesc(e.target.value)}
                        placeholder="شرح رویداد..."
                        className="h-7 text-xs"
                      />
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAddingEventSlot(null)}
                          className="h-6 text-[10px]"
                        >
                          انصراف
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAddEvent(slot)}
                          className="h-6 text-[10px]"
                        >
                          ثبت رویداد
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 5-Year Event List */}
                  <div className="space-y-1.5 border border-[var(--border-subtle)] rounded-[var(--radius-sm,4px)] p-2 bg-[var(--bg-subtle)]/20">
                    {[1, 2, 3, 4, 5].map((year) => {
                      const events = plan.timelineEvents.filter((e) => e.year === year);
                      return (
                        <div
                          key={year}
                          className="flex items-start gap-2 text-[11px] py-1 border-b border-[var(--border-subtle)]/50 last:border-0"
                        >
                          <span className="font-mono text-[10px] text-[var(--ink-muted)] shrink-0 w-10">
                            Y0{year}:
                          </span>
                          <div className="flex-1 space-y-1">
                            {events.length === 0 ? (
                              <span className="text-[var(--ink-muted)] opacity-60">—</span>
                            ) : (
                              events.map((ev, i) => (
                                <div
                                  key={`event-${ev.year}-${ev.type}-${i}`}
                                  className="flex items-center gap-1.5"
                                >
                                  <span
                                    className={cn(
                                      "w-1.5 h-1.5 rounded-full shrink-0",
                                      ev.type === "work"
                                        ? "bg-[var(--path-1)]"
                                        : "bg-[var(--signal-positive)]",
                                    )}
                                  />
                                  <span className="text-[var(--ink-primary)]">
                                    {ev.description}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Four Calibrated Gauges (INV-01) */}
                <div className="space-y-2 p-3 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)]/30 border border-[var(--border-subtle)]">
                  <span className="text-[11px] font-semibold text-[var(--ink-primary)] block">
                    سنجش چهارگانه فرضیه‌ها (Gauges)
                  </span>
                  <div className="space-y-2">
                    {/* Resources */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-[var(--ink-secondary)]">
                          {t("odysseyPlans.resources")}
                        </span>
                        <span className="font-mono font-semibold">%{plan.resources}</span>
                      </div>
                      {!pitchMode ? (
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={plan.resources}
                          onChange={(e) =>
                            handleGaugeChange(slot, "resources", Number(e.target.value))
                          }
                          className="w-full accent-[var(--path-1)] cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--path-1)]"
                            style={{ width: `${plan.resources}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Likability */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-[var(--ink-secondary)]">
                          {t("odysseyPlans.likability")}
                        </span>
                        <span className="font-mono font-semibold">%{plan.likability}</span>
                      </div>
                      {!pitchMode ? (
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={plan.likability}
                          onChange={(e) =>
                            handleGaugeChange(slot, "likability", Number(e.target.value))
                          }
                          className="w-full accent-[var(--signal-amber)] cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--signal-amber)]"
                            style={{ width: `${plan.likability}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Confidence */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-[var(--ink-secondary)]">
                          {t("odysseyPlans.confidence")}
                        </span>
                        <span className="font-mono font-semibold">%{plan.confidence}</span>
                      </div>
                      {!pitchMode ? (
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={plan.confidence}
                          onChange={(e) =>
                            handleGaugeChange(slot, "confidence", Number(e.target.value))
                          }
                          className="w-full accent-[var(--path-2)] cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--path-2)]"
                            style={{ width: `${plan.confidence}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Coherence */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-[var(--ink-secondary)]">
                          {t("odysseyPlans.coherence")}
                        </span>
                        <span className="font-mono font-semibold">%{plan.coherence}</span>
                      </div>
                      {!pitchMode ? (
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={plan.coherence}
                          onChange={(e) =>
                            handleGaugeChange(slot, "coherence", Number(e.target.value))
                          }
                          className="w-full accent-[var(--path-3)] cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--path-3)]"
                            style={{ width: `${plan.coherence}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Three Core Inquiry Questions (INV-02) */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--ink-primary)] flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--ink-secondary)]" />
                    {t("odysseyPlans.keyQuestions")}
                  </span>
                  <div className="space-y-2">
                    {([0, 1, 2] as const).map((qIdx) => (
                      <div key={qIdx} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[var(--ink-muted)]">
                            Q0{qIdx + 1}:
                          </span>
                          {!pitchMode && plan.questions[qIdx]?.trim() && onCreatePrototype && (
                            <button
                              type="button"
                              onClick={() =>
                                onCreatePrototype(slot, qIdx, plan.questions[qIdx] ?? "")
                              }
                              className="text-[10px] text-[var(--path-2)] hover:underline flex items-center gap-0.5 font-mono"
                            >
                              <span>{t("odysseyPlans.convertAction")}</span>
                              <ChevronRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                        {pitchMode ? (
                          <p className="text-[11px] text-[var(--ink-primary)] p-1.5 bg-[var(--bg-subtle)]/40 rounded">
                            {plan.questions[qIdx] || "—"}
                          </p>
                        ) : (
                          <Input
                            value={plan.questions[qIdx]}
                            onChange={(e) => handleQuestionChange(slot, qIdx, e.target.value)}
                            placeholder={t("odysseyPlans.questionPlaceholder")}
                            className="h-7 text-xs"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Feedback Link & Presentation Notes (Criteria 5) */}
                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenFeedback(slot)}
                    className="text-xs text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] flex items-center gap-1.5 font-mono"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>
                      {t("odysseyPlans.openFeedback")} ({planFeedbacks.length})
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Presentation Feedback Modal (Criteria 5: Dual Fields) */}
      <Dialog
        open={activeFeedbackSlot !== null}
        onOpenChange={(open) => !open && setActiveFeedbackSlot(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("odysseyPlans.feedbackTitle")}</DialogTitle>
            <DialogDescription>
              ثبت بازخورد شنوندگان به همراه حس و انرژی بدنی خودتان در زمان ارائه این سناریو
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Field 1: External Feedback */}
            <div className="space-y-1.5">
              <label
                htmlFor="odyssey-external-feedback"
                className="font-semibold text-[var(--ink-primary)] block"
              >
                {t("odysseyPlans.externalFeedbackLabel")}
              </label>
              <Textarea
                id="odyssey-external-feedback"
                value={externalFeedbackText}
                onChange={(e) => setExternalFeedbackText(e.target.value)}
                placeholder={t("odysseyPlans.externalFeedbackPlaceholder")}
                className="h-20 text-xs"
              />
            </div>

            {/* Field 2: Presenter Felt Sense & Internal Energy */}
            <div className="space-y-1.5">
              <label
                htmlFor="odyssey-presenter-energy"
                className="font-semibold text-[var(--ink-primary)] block"
              >
                {t("odysseyPlans.presenterEnergyLabel")}
              </label>
              <Textarea
                id="odyssey-presenter-energy"
                value={presenterEnergyText}
                onChange={(e) => setPresenterEnergyText(e.target.value)}
                placeholder={t("odysseyPlans.presenterEnergyPlaceholder")}
                className="h-20 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setActiveFeedbackSlot(null)}>
              بستن
            </Button>
            <Button
              size="sm"
              onClick={handleSaveFeedbackSubmit}
              disabled={!externalFeedbackText.trim() && !presenterEnergyText.trim()}
              className="gap-1.5"
            >
              {feedbackSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                  <span>{t("common.saved")}</span>
                </>
              ) : (
                <span>{t("odysseyPlans.saveFeedback")}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
