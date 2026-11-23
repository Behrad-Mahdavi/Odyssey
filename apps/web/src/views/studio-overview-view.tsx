import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CompactTooltip,
} from "@odyssey/ui";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Database,
  Flame,
  Layers,
  Lightbulb,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useStudio } from "../context/studio-context.js";

export function StudioOverviewView(): React.JSX.Element {
  const { t } = useTranslation();
  const {
    gaugeValues,
    journalEntries,
    plans,
    prototypes,
    compassData,
    hasData,
    loadSampleWorkspace,
    clearWorkspace,
  } = useStudio();

  const hwplAvg = Math.round(
    ((gaugeValues.health ?? 0) +
      (gaugeValues.work ?? 0) +
      (gaugeValues.play ?? 0) +
      (gaugeValues.love ?? 0)) /
      4,
  );

  const isHwplDone = (gaugeValues.health ?? 0) > 0 || (gaugeValues.work ?? 0) > 0;
  const isCompassDone = Boolean(compassData.workview.trim());
  const isJournalDone = journalEntries.length > 0;
  const isOdysseyDone = Boolean(plans.LIFE_1.sixWordTitle.trim());
  const isPrototypeDone = prototypes.length > 0;

  // Determine recommended next step
  const nextStep = !isHwplDone
    ? {
        title: t("overview.startHwpl"),
        desc: "سنجش صادقانه وضعیت فعلی بدون قضاوت در ۴ مخزن سلامت، کار، بازی و عشق",
        href: "/check-in",
        number: "۰۱",
      }
    : !isCompassDone
      ? {
          title: t("overview.startCompass"),
          desc: "تدوین فلسفه کار و زندگی برای هدایت تصمیمات آینده در قطب‌نما",
          href: "/compass",
          number: "۰۲",
        }
      : !isJournalDone
        ? {
            title: t("overview.startJournal"),
            desc: "ثبت رویدادهای روزانه و کشف نقاط شارژ یا تخلیه انرژی",
            href: "/journal",
            number: "۰۳",
          }
        : !isOdysseyDone
          ? {
              title: t("overview.startOdyssey"),
              desc: "ترسیم ۳ سناریوی موازی ۵ ساله با عناوین ۶ کلمه‌ای و پرسش‌های کلیدی",
              href: "/odyssey",
              number: "۰۴",
            }
          : {
              title: t("overview.startPrototype"),
              desc: "طراحی مکالمات داستان‌محور و آزمون‌های تجربی ارزان در جهان واقعی",
              href: "/prototypes",
              number: "۰۵",
            };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink-primary)]">
            {t("overview.title")}
          </h2>
          <p className="text-xs text-[var(--ink-secondary)] mt-0.5">{t("overview.subtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          {hasData ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clearWorkspace}
              className="text-xs font-mono gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
              <span>{t("nav.clearWorkspace")}</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={loadSampleWorkspace}
              className="text-xs font-mono gap-1.5 bg-[var(--bg-inverted)] text-[var(--bg-surface)]"
            >
              <Database className="w-3.5 h-3.5 text-[var(--signal-amber)]" />
              <span>{t("overview.loadSampleCta")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Recommended Next Step Callout */}
      <div className="rounded-[var(--radius-md,6px)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--border-strong)]/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--ink-secondary)]">
                {t("overview.recommendedStep")}
              </span>
              <span className="font-mono text-xs font-bold text-[var(--path-1)]">
                {nextStep.number}
              </span>
            </div>
            <h3 className="text-base font-semibold text-[var(--ink-primary)]">{nextStep.title}</h3>
            <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">{nextStep.desc}</p>
          </div>

          <Link
            to={nextStep.href}
            className="inline-flex items-center justify-center font-medium transition-colors select-none h-9 ps-4 pe-4 text-xs rounded-[var(--radius-sm,4px)] bg-[var(--bg-inverted)] text-[var(--bg-surface)] hover:opacity-90 shrink-0 gap-2 cursor-pointer"
          >
            <span>ورود به بخش</span>
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
          </Link>
        </div>
      </div>

      {/* Empty State Banner if completely fresh */}
      {!hasData && (
        <div className="rounded-[var(--radius-md,6px)] border border-dashed border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-6 text-center space-y-3">
          <Sparkles className="w-6 h-6 mx-auto text-[var(--signal-amber)] opacity-80" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[var(--ink-primary)]">
              {t("overview.emptyWorkspaceNotice")}
            </h4>
            <p className="text-xs text-[var(--ink-secondary)] max-w-md mx-auto">
              {t("overview.loadSampleDesc")}
            </p>
          </div>
          <Button
            size="sm"
            onClick={loadSampleWorkspace}
            className="text-xs font-mono gap-1.5 bg-[var(--bg-inverted)] text-[var(--bg-surface)] mt-2"
          >
            <Database className="w-3.5 h-3.5 text-[var(--signal-amber)]" />
            <span>{t("overview.loadSampleCta")}</span>
          </Button>
        </div>
      )}

      {/* 4 Architectural Instruments Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. HWPL Instrument */}
        <Link to="/check-in" className="group">
          <Card className="h-full transition-all duration-150 group-hover:border-[var(--border-strong)]/40">
            <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">۰۱</span>
                <span
                  dir="ltr"
                  className="font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--ink-primary)]"
                >
                  {hwplAvg}%
                </span>
              </div>
              <CardTitle className="text-sm font-semibold text-[var(--ink-primary)] mt-1">
                {t("overview.hwplSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="flex justify-between p-1.5 rounded bg-[var(--bg-subtle)]/50">
                  <span className="text-[var(--ink-secondary)]">{t("gauges.health")}</span>
                  <span dir="ltr" className="tabular-nums font-semibold">
                    {gaugeValues.health ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-[var(--bg-subtle)]/50">
                  <span className="text-[var(--ink-secondary)]">{t("gauges.work")}</span>
                  <span dir="ltr" className="tabular-nums font-semibold">
                    {gaugeValues.work ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-[var(--bg-subtle)]/50">
                  <span className="text-[var(--ink-secondary)]">{t("gauges.play")}</span>
                  <span dir="ltr" className="tabular-nums font-semibold">
                    {gaugeValues.play ?? 0}%
                  </span>
                </div>
                <div className="flex justify-between p-1.5 rounded bg-[var(--bg-subtle)]/50">
                  <span className="text-[var(--ink-secondary)]">{t("gauges.love")}</span>
                  <span dir="ltr" className="tabular-nums font-semibold">
                    {gaugeValues.love ?? 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 2. Compass Instrument */}
        <Link to="/compass" className="group">
          <Card className="h-full transition-all duration-150 group-hover:border-[var(--border-strong)]/40">
            <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">۰۲</span>
                {isCompassDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                ) : (
                  <span className="text-[10px] font-mono text-[var(--ink-muted)]">خالی</span>
                )}
              </div>
              <CardTitle className="text-sm font-semibold text-[var(--ink-primary)] mt-1">
                {t("nav.compass")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-1.5 text-xs text-[var(--ink-secondary)]">
              <p className="line-clamp-2 text-[11px] leading-relaxed">
                {compassData.workview.trim() || t("overview.noEntriesYet")}
              </p>
              <div className="pt-1 text-[10px] font-mono text-[var(--ink-muted)] flex items-center justify-between">
                <span>هم‌راستایی قطب‌نما:</span>
                <span className="font-semibold text-[var(--ink-primary)]">
                  {compassData.coherenceGuide ? "تنظیم‌شده" : "در انتظار"}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* 3. Good Time Journal */}
        <Link to="/journal" className="group">
          <Card className="h-full transition-all duration-150 group-hover:border-[var(--border-strong)]/40">
            <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">۰۳</span>
                <span
                  dir="ltr"
                  className="font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--ink-primary)]"
                >
                  {journalEntries.length}
                </span>
              </div>
              <CardTitle className="text-sm font-semibold text-[var(--ink-primary)] mt-1">
                {t("overview.journalSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-1.5 text-xs">
              {journalEntries.length === 0 ? (
                <p className="text-[11px] text-[var(--ink-muted)]">{t("overview.journalEmpty")}</p>
              ) : (
                <div className="space-y-1 text-[11px]">
                  {journalEntries.slice(0, 2).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between truncate">
                      <span className="truncate text-[var(--ink-primary)]">{entry.title}</span>
                      <span
                        dir="ltr"
                        className="font-mono tabular-nums text-[10px] font-semibold text-[var(--path-1)] ms-1"
                      >
                        {entry.engagement}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        {/* 4. Odyssey & Prototypes */}
        <Link to="/odyssey" className="group">
          <Card className="h-full transition-all duration-150 group-hover:border-[var(--border-strong)]/40">
            <CardHeader className="pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[var(--ink-muted)]">۰۴ & ۰۵</span>
                <span
                  dir="ltr"
                  className="font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--ink-primary)]"
                >
                  {prototypes.length}
                </span>
              </div>
              <CardTitle className="text-sm font-semibold text-[var(--ink-primary)] mt-1">
                {t("overview.odysseySummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-1 text-xs">
              {(["LIFE_1", "LIFE_2", "LIFE_3"] as const).map((slot, idx) => {
                const plan = plans[slot];
                return (
                  <div key={slot} className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--ink-secondary)] font-mono">مسیر ۰{idx + 1}</span>
                    <span className="truncate max-w-[140px] text-end text-[var(--ink-primary)]">
                      {plan.sixWordTitle || "—"}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
