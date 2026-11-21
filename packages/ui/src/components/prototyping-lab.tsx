import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Filter,
  Flame,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Plus,
  Tag,
  Trash2,
  UserCheck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
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

export type PrototypeType = "CONVERSATION" | "EXPERIENCE";
export type PrototypeStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
export type NextStepVerdict = "PROCEED" | "ITERATE" | "PIVOT" | "STOP";

export interface PrototypeItem {
  id: string;
  odysseyPlanId?: string | undefined;
  questionIndex?: number | undefined;
  type: PrototypeType;
  title: string;
  hypothesis: string;
  status: PrototypeStatus;
  outcome?: string | undefined;
  intervieweeRole?: string | undefined;
  storyQuestions?: string[] | undefined;
  conversationNotes?: string | undefined;
  referralContact?: string | undefined;
  costEstimate?: string | undefined;
  duration?: string | undefined;
  nextStepVerdict?: NextStepVerdict | undefined;
}

export interface PrototypingLabProps {
  prototypes: PrototypeItem[];
  onCreatePrototype: (item: Omit<PrototypeItem, "id">) => void;
  onUpdatePrototypeStatus?: (
    id: string,
    status: PrototypeStatus,
    outcome?: string,
    verdict?: NextStepVerdict,
    notes?: string,
    referral?: string,
  ) => void;
  onDeletePrototype?: (id: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  className?: string | undefined;
  initialPlanSlot?: string | undefined;
  initialQuestionIndex?: number | undefined;
  initialQuestionText?: string | undefined;
}

const DEFAULT_STORY_PROMPTS = [
  "چگونه وارد این مسیر شدید و نقطه آغاز چه بود؟",
  "یک روز کاری واقعی در این نقش دقیقاً چگونه می‌گذرد؟",
  "چه چالش‌ها و واقعیت‌هایی در این حرفه وجود دارد که از بیرون دیده نمی‌شود؟",
  "با چه کس دیگری در این حوزه پیشنهاد می‌کنید گفت‌وگو کنم؟",
];

export function PrototypingLab({
  prototypes,
  onCreatePrototype,
  onUpdatePrototypeStatus,
  onDeletePrototype,
  t,
  className,
  initialPlanSlot,
  initialQuestionIndex,
  initialQuestionText,
}: PrototypingLabProps): React.JSX.Element {
  const [filter, setFilter] = useState<"ALL" | "CONVERSATION" | "EXPERIENCE">("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // New prototype form state
  const [protoType, setProtoType] = useState<PrototypeType>("CONVERSATION");
  const [protoTitle, setProtoTitle] = useState("");
  const [protoHypothesis, setProtoHypothesis] = useState("");
  const [intervieweeRole, setIntervieweeRole] = useState("");
  const [costEstimate, setCostEstimate] = useState("");
  const [duration, setDuration] = useState("");
  const [linkedPlan, setLinkedPlan] = useState<string | undefined>(initialPlanSlot);
  const [linkedQuestionIdx, setLinkedQuestionIdx] = useState<number | undefined>(
    initialQuestionIndex,
  );

  // Complete prototype dialog state
  const [completingProto, setCompletingProto] = useState<PrototypeItem | null>(null);
  const [completionOutcome, setCompletionOutcome] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [completionReferral, setCompletionReferral] = useState("");
  const [completionVerdict, setCompletionVerdict] = useState<NextStepVerdict>("PROCEED");

  // Automatically open create dialog if pre-populated from Odyssey Plan question bridge
  useEffect(() => {
    if (initialQuestionText) {
      setProtoHypothesis(initialQuestionText);
      setProtoTitle(`آزمون فرضیه: ${initialQuestionText.slice(0, 35)}...`);
      setLinkedPlan(initialPlanSlot);
      setLinkedQuestionIdx(initialQuestionIndex);
      setCreateDialogOpen(true);
    }
  }, [initialQuestionText, initialPlanSlot, initialQuestionIndex]);

  const handleOpenCreate = () => {
    setProtoType("CONVERSATION");
    setProtoTitle("");
    setProtoHypothesis("");
    setIntervieweeRole("");
    setCostEstimate("");
    setDuration("");
    setLinkedPlan(undefined);
    setLinkedQuestionIdx(undefined);
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!protoTitle.trim() || !protoHypothesis.trim()) return;

    onCreatePrototype({
      type: protoType,
      title: protoTitle.trim(),
      hypothesis: protoHypothesis.trim(),
      status: "PLANNED",
      ...(linkedPlan !== undefined ? { odysseyPlanId: linkedPlan } : {}),
      ...(linkedQuestionIdx !== undefined ? { questionIndex: linkedQuestionIdx } : {}),
      ...(protoType === "CONVERSATION"
        ? {
            intervieweeRole: intervieweeRole.trim() || undefined,
            storyQuestions: DEFAULT_STORY_PROMPTS,
          }
        : {
            costEstimate: costEstimate.trim() || undefined,
            duration: duration.trim() || undefined,
          }),
    });

    setCreateDialogOpen(false);
  };

  const handleOpenComplete = (proto: PrototypeItem) => {
    setCompletingProto(proto);
    setCompletionOutcome(proto.outcome ?? "");
    setCompletionNotes(proto.conversationNotes ?? "");
    setCompletionReferral(proto.referralContact ?? "");
    setCompletionVerdict(proto.nextStepVerdict ?? "PROCEED");
  };

  const handleCompleteSubmit = () => {
    if (!completingProto || !onUpdatePrototypeStatus) return;

    if (completingProto.type === "CONVERSATION") {
      onUpdatePrototypeStatus(
        completingProto.id,
        "COMPLETED",
        completionOutcome.trim() || undefined,
        undefined,
        completionNotes.trim() || undefined,
        completionReferral.trim() || undefined,
      );
    } else {
      onUpdatePrototypeStatus(
        completingProto.id,
        "COMPLETED",
        completionOutcome.trim() || undefined,
        completionVerdict,
      );
    }

    setCompletingProto(null);
  };

  const filteredPrototypes = prototypes.filter((p) => {
    if (filter === "ALL") return true;
    return p.type === filter;
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[var(--path-2)]" />
            <h3 className="text-base font-semibold text-[var(--ink-primary)]">
              {t("prototypingLab.title")}
            </h3>
          </div>
          <p className="text-xs text-[var(--ink-secondary)]">{t("prototypingLab.desc")}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="inline-flex rounded-[var(--radius-sm,4px)] p-1 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={cn(
                "ps-2.5 pe-2.5 py-0.5 rounded transition-colors",
                filter === "ALL"
                  ? "bg-[var(--bg-surface)] font-medium text-[var(--ink-primary)] shadow-sm"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]",
              )}
            >
              {t("prototypingLab.filterAll")}
            </button>
            <button
              type="button"
              onClick={() => setFilter("CONVERSATION")}
              className={cn(
                "ps-2.5 pe-2.5 py-0.5 rounded transition-colors",
                filter === "CONVERSATION"
                  ? "bg-[var(--bg-surface)] font-medium text-[var(--ink-primary)] shadow-sm"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]",
              )}
            >
              {t("prototypingLab.filterConversations")}
            </button>
            <button
              type="button"
              onClick={() => setFilter("EXPERIENCE")}
              className={cn(
                "ps-2.5 pe-2.5 py-0.5 rounded transition-colors",
                filter === "EXPERIENCE"
                  ? "bg-[var(--bg-surface)] font-medium text-[var(--ink-primary)] shadow-sm"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)]",
              )}
            >
              {t("prototypingLab.filterExperiences")}
            </button>
          </div>

          <Button size="sm" onClick={handleOpenCreate} className="gap-1.5 text-xs font-mono">
            <Plus className="w-3.5 h-3.5" />
            <span>{t("prototypingLab.newPrototype")}</span>
          </Button>
        </div>
      </div>

      {/* Prototype Cards Grid */}
      {filteredPrototypes.length === 0 ? (
        <Card className="border border-dashed border-[var(--border-subtle)] bg-[var(--bg-subtle)]/30">
          <CardContent className="py-12 text-center space-y-3">
            <Lightbulb className="w-8 h-8 mx-auto text-[var(--ink-muted)] opacity-60" />
            <p className="text-xs text-[var(--ink-muted)] max-w-sm mx-auto">
              {t("prototypingLab.noPrototypes")}
            </p>
            <Button variant="outline" size="sm" onClick={handleOpenCreate} className="text-xs">
              {t("prototypingLab.newPrototype")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrototypes.map((proto) => {
            const isConversation = proto.type === "CONVERSATION";

            return (
              <Card
                key={proto.id}
                className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between"
              >
                <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-mono gap-1",
                        isConversation
                          ? "text-[var(--path-1)] border-[var(--path-1)]/30"
                          : "text-[var(--path-2)] border-[var(--path-2)]/30",
                      )}
                    >
                      {isConversation ? (
                        <MessageCircle className="w-3 h-3" />
                      ) : (
                        <Zap className="w-3 h-3" />
                      )}
                      <span>
                        {isConversation
                          ? t("prototypingLab.typeConversation")
                          : t("prototypingLab.typeExperience")}
                      </span>
                    </Badge>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-[var(--radius-sm,4px)] font-semibold",
                        proto.status === "COMPLETED"
                          ? "bg-[var(--signal-positive)]/15 text-[var(--signal-positive)]"
                          : proto.status === "IN_PROGRESS"
                            ? "bg-[var(--path-1)]/15 text-[var(--path-1)]"
                            : proto.status === "ABANDONED"
                              ? "bg-[var(--signal-amber)]/15 text-[var(--signal-amber)]"
                              : "bg-[var(--bg-subtle)] text-[var(--ink-secondary)]",
                      )}
                    >
                      {proto.status === "COMPLETED"
                        ? t("prototypingLab.statusCompleted")
                        : proto.status === "IN_PROGRESS"
                          ? t("prototypingLab.statusInProgress")
                          : proto.status === "ABANDONED"
                            ? t("prototypingLab.statusAbandoned")
                            : t("prototypingLab.statusPlanned")}
                    </span>
                  </div>

                  <CardTitle className="text-sm font-semibold text-[var(--ink-primary)] leading-tight">
                    {proto.title}
                  </CardTitle>

                  {proto.odysseyPlanId && (
                    <span className="font-mono text-[10px] text-[var(--path-2)] block mt-1">
                      {t("prototypingLab.linkedToPlan", {
                        slot: proto.odysseyPlanId,
                        num: (proto.questionIndex ?? 0) + 1,
                      })}
                    </span>
                  )}
                </CardHeader>

                <CardContent className="pt-3 flex-1 flex flex-col justify-between space-y-3 text-xs">
                  {/* Hypothesis */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono text-[var(--ink-muted)] block">
                      {t("prototypingLab.hypothesisLabel")}:
                    </span>
                    <p className="text-xs text-[var(--ink-primary)] leading-relaxed">
                      {proto.hypothesis}
                    </p>
                  </div>

                  {/* Conversation Target or Experience Cost */}
                  {isConversation
                    ? proto.intervieweeRole && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-secondary)] bg-[var(--bg-subtle)]/40 p-2 rounded">
                          <Users className="w-3.5 h-3.5 text-[var(--path-1)] shrink-0" />
                          <span className="truncate">{proto.intervieweeRole}</span>
                        </div>
                      )
                    : (proto.costEstimate || proto.duration) && (
                        <div className="flex items-center gap-3 text-[11px] text-[var(--ink-secondary)] bg-[var(--bg-subtle)]/40 p-2 rounded">
                          {proto.costEstimate && (
                            <span className="truncate">منابع: {proto.costEstimate}</span>
                          )}
                          {proto.duration && (
                            <span className="font-mono text-[10px]">({proto.duration})</span>
                          )}
                        </div>
                      )}

                  {/* Completed Output Summary */}
                  {proto.status === "COMPLETED" && (
                    <div className="p-2.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5 text-[11px]">
                      {proto.conversationNotes && (
                        <p className="text-[var(--ink-primary)]">
                          <strong className="text-[var(--ink-secondary)]">یادداشت: </strong>
                          {proto.conversationNotes}
                        </p>
                      )}
                      {proto.outcome && (
                        <p className="text-[var(--ink-primary)]">
                          <strong className="text-[var(--ink-secondary)]">یافته: </strong>
                          {proto.outcome}
                        </p>
                      )}
                      {proto.referralContact && (
                        <p className="text-[var(--path-1)] font-mono text-[10px]">
                          معرفی: {proto.referralContact}
                        </p>
                      )}
                      {proto.nextStepVerdict && (
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <span className="text-[var(--ink-muted)]">Verdict:</span>
                          <span className="font-bold text-[var(--signal-positive)]">
                            [{proto.nextStepVerdict}]
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    {proto.status !== "COMPLETED" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenComplete(proto)}
                        className="text-xs h-7 gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>
                          {isConversation
                            ? t("prototypingLab.completeConversationAction")
                            : t("prototypingLab.completeExperienceAction")}
                        </span>
                      </Button>
                    ) : (
                      <span className="text-[11px] text-[var(--signal-positive)] flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t("prototypingLab.statusCompleted")}</span>
                      </span>
                    )}

                    {onDeletePrototype && (
                      <button
                        type="button"
                        onClick={() => onDeletePrototype(proto.id)}
                        className="text-[var(--ink-muted)] hover:text-[var(--signal-danger,red)] p-1 transition-colors"
                        aria-label={t("prototypingLab.deletePrototype")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Prototype Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("prototypingLab.newPrototype")}</DialogTitle>
            <DialogDescription>
              طراحی یک آزمون سریع و کم‌هزینه برای پاسخ به سؤالات و فرضیه‌های مسیر
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2 text-xs">
            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProtoType("CONVERSATION")}
                className={cn(
                  "p-3 rounded-[var(--radius-sm,4px)] border text-start transition-colors",
                  protoType === "CONVERSATION"
                    ? "bg-[var(--bg-subtle)] border-[var(--path-1)] text-[var(--ink-primary)] font-medium"
                    : "border-[var(--border-subtle)] text-[var(--ink-secondary)]",
                )}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs mb-1">
                  <MessageCircle className="w-3.5 h-3.5 text-[var(--path-1)]" />
                  <span>گفت‌وگوی راهنما</span>
                </div>
                <p className="text-[10px] text-[var(--ink-muted)]">
                  مصاحبه داستانی با فردی که هم‌اکنون در این مسیر زندگی می‌کند
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProtoType("EXPERIENCE")}
                className={cn(
                  "p-3 rounded-[var(--radius-sm,4px)] border text-start transition-colors",
                  protoType === "EXPERIENCE"
                    ? "bg-[var(--bg-subtle)] border-[var(--path-2)] text-[var(--ink-primary)] font-medium"
                    : "border-[var(--border-subtle)] text-[var(--ink-secondary)]",
                )}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs mb-1">
                  <Zap className="w-3.5 h-3.5 text-[var(--path-2)]" />
                  <span>آزمون تجربه مستقیم</span>
                </div>
                <p className="text-[10px] text-[var(--ink-muted)]">
                  اجرای یک آزمون ملموس، مایکرو-تریال یا کارگاه چندساعته
                </p>
              </button>
            </div>

            {/* Non-job Reminder Alert for Conversation (Criteria 2) */}
            {protoType === "CONVERSATION" && (
              <div className="p-3 rounded-[var(--radius-sm,4px)] bg-[var(--signal-amber)]/10 border border-[var(--signal-amber)]/30 text-[11px] text-[var(--ink-primary)] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[var(--signal-amber)] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{t("prototypingLab.nonJobNotice")}</p>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label
                htmlFor="proto-title-input"
                className="font-semibold text-[var(--ink-primary)]"
              >
                {t("prototypingLab.titleLabel")}
              </label>
              <Input
                id="proto-title-input"
                value={protoTitle}
                onChange={(e) => setProtoTitle(e.target.value)}
                placeholder={t("prototypingLab.titlePlaceholder")}
                className="h-8 text-xs"
                required
              />
            </div>

            {/* Hypothesis */}
            <div className="space-y-1">
              <label
                htmlFor="proto-hypothesis-input"
                className="font-semibold text-[var(--ink-primary)]"
              >
                {t("prototypingLab.hypothesisLabel")}
              </label>
              <Textarea
                id="proto-hypothesis-input"
                value={protoHypothesis}
                onChange={(e) => setProtoHypothesis(e.target.value)}
                placeholder={t("prototypingLab.hypothesisPlaceholder")}
                className="h-16 text-xs"
                required
              />
            </div>

            {/* Conversation Specific Fields */}
            {protoType === "CONVERSATION" ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label
                    htmlFor="proto-interviewee-input"
                    className="font-semibold text-[var(--ink-primary)]"
                  >
                    {t("prototypingLab.intervieweeRoleLabel")}
                  </label>
                  <Input
                    id="proto-interviewee-input"
                    value={intervieweeRole}
                    onChange={(e) => setIntervieweeRole(e.target.value)}
                    placeholder={t("prototypingLab.intervieweeRolePlaceholder")}
                    className="h-8 text-xs"
                  />
                </div>

                {/* 4 Standard Story Questions preview */}
                <div className="p-2.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-[10px] font-mono text-[var(--ink-muted)] uppercase block">
                    {t("prototypingLab.storyPromptsTitle")}:
                  </span>
                  <ul className="list-disc ps-4 space-y-1 text-[11px] text-[var(--ink-secondary)]">
                    {DEFAULT_STORY_PROMPTS.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* Experience Specific Fields */
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="proto-cost-input"
                    className="font-semibold text-[var(--ink-primary)]"
                  >
                    {t("prototypingLab.costLabel")}
                  </label>
                  <Input
                    id="proto-cost-input"
                    value={costEstimate}
                    onChange={(e) => setCostEstimate(e.target.value)}
                    placeholder={t("prototypingLab.costPlaceholder")}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="proto-duration-input"
                    className="font-semibold text-[var(--ink-primary)]"
                  >
                    {t("prototypingLab.durationLabel")}
                  </label>
                  <Input
                    id="proto-duration-input"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder={t("prototypingLab.durationPlaceholder")}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between items-center pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCreateDialogOpen(false)}
              >
                انصراف
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>{t("prototypingLab.createButton")}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complete Prototype Notes & Verdict Dialog (Criteria 2 & 3) */}
      <Dialog
        open={completingProto !== null}
        onOpenChange={(open) => !open && setCompletingProto(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {completingProto?.type === "CONVERSATION"
                ? t("prototypingLab.completeConversationAction")
                : t("prototypingLab.completeExperienceAction")}
            </DialogTitle>
            <DialogDescription>
              ثبت یافته‌های حاصل از آزمون میدانی جهت اصلاح یا پیشبرد سناریو
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {completingProto?.type === "CONVERSATION" ? (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="proto-completion-notes"
                    className="font-semibold text-[var(--ink-primary)]"
                  >
                    یادداشت‌های داستان زیسته و نکات کلیدی
                  </label>
                  <Textarea
                    id="proto-completion-notes"
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="مخاطب درباره واقعیت‌های این حرفه چه گفت؟"
                    className="h-24 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="proto-completion-referral"
                    className="font-semibold text-[var(--ink-primary)]"
                  >
                    {t("prototypingLab.referralLabel")}
                  </label>
                  <Input
                    id="proto-completion-referral"
                    value={completionReferral}
                    onChange={(e) => setCompletionReferral(e.target.value)}
                    placeholder="نام، نقش یا راه ارتباطی نفر بعدی..."
                    className="h-8 text-xs"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="proto-completion-outcome"
                    className="font-semibold text-[var(--ink-primary)]"
                  >
                    {t("prototypingLab.outcomeLabel")}
                  </label>
                  <Textarea
                    id="proto-completion-outcome"
                    value={completionOutcome}
                    onChange={(e) => setCompletionOutcome(e.target.value)}
                    placeholder={t("prototypingLab.outcomePlaceholder")}
                    className="h-24 text-xs"
                  />
                </div>

                {/* Verdict Selector (Criteria 3) */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-[var(--ink-primary)] block">
                    {t("prototypingLab.verdictLabel")}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        {
                          id: "PROCEED",
                          label: t("prototypingLab.verdictProceed"),
                          color: "text-[var(--signal-positive)]",
                        },
                        {
                          id: "ITERATE",
                          label: t("prototypingLab.verdictIterate"),
                          color: "text-[var(--path-1)]",
                        },
                        {
                          id: "PIVOT",
                          label: t("prototypingLab.verdictPivot"),
                          color: "text-[var(--signal-amber)]",
                        },
                        {
                          id: "STOP",
                          label: t("prototypingLab.verdictStop"),
                          color: "text-[var(--ink-muted)]",
                        },
                      ] as const
                    ).map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setCompletionVerdict(v.id)}
                        className={cn(
                          "p-2 rounded text-xs border text-start font-mono transition-colors",
                          completionVerdict === v.id
                            ? "bg-[var(--bg-subtle)] border-[var(--ink-primary)] font-bold text-[var(--ink-primary)]"
                            : "border-[var(--border-subtle)] text-[var(--ink-secondary)]",
                        )}
                      >
                        <span className={v.color}>[{v.id}]</span> {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center pt-3">
            <Button variant="ghost" size="sm" onClick={() => setCompletingProto(null)}>
              بستن
            </Button>
            <Button size="sm" onClick={handleCompleteSubmit} className="gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>ثبت نتیجه و بستن</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
