import { Button, CompactTooltip, GravityBoard, TactileGauge } from "@odyssey/ui";
import { Check, History, Layers, ShieldAlert, Sparkles } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStudio } from "../context/studio-context.js";

export function CheckInView(): React.JSX.Element {
  const { t } = useTranslation();
  const {
    gaugeValues,
    gaugeNotes,
    updateGauge,
    updateGaugeNote,
    problems,
    addProblem,
    toggleProblem,
    deleteProblem,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<"GAUGES" | "GRAVITY">("GAUGES");
  const [snapshotSaved, setSnapshotSaved] = useState(false);

  const handleSaveSnapshot = () => {
    setSnapshotSaved(true);
    setTimeout(() => setSnapshotSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Single Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-[var(--path-1)]">گام ۰۱</span>
            <span className="text-[var(--border-strong)] opacity-30">/</span>
            <h2 className="text-xl font-bold tracking-tight text-[var(--ink-primary)]">
              {t("nav.checkIn")}
            </h2>
          </div>
          <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
            تراز چهارگانه زندگی (سلامت، کار، بازی، عشق) و تفکیک مسائل گرانشی از چالش‌های قابل طراحی
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Focused Tab Segmented Control */}
          <div className="inline-flex rounded-[var(--radius-sm,4px)] p-1 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab("GAUGES")}
              className={`ps-3 pe-3 py-1.5 rounded-[var(--radius-sm,4px)] transition-colors cursor-pointer ${
                activeTab === "GAUGES"
                  ? "bg-[var(--bg-surface)] font-semibold text-[var(--ink-primary)] shadow-xs"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-medium"
              }`}
            >
              تراز چهارگانه (HWPL)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("GRAVITY")}
              className={`ps-3 pe-3 py-1.5 rounded-[var(--radius-sm,4px)] transition-colors cursor-pointer ${
                activeTab === "GRAVITY"
                  ? "bg-[var(--bg-surface)] font-semibold text-[var(--ink-primary)] shadow-xs"
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-medium"
              }`}
            >
              مسائل گرانشی ({problems.length})
            </button>
          </div>

          {activeTab === "GAUGES" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveSnapshot}
              className="text-xs font-mono gap-1.5"
            >
              {snapshotSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                  <span>{t("common.saved")}</span>
                </>
              ) : (
                <>
                  <History className="w-3.5 h-3.5 text-[var(--ink-secondary)]" />
                  <span>{t("hwpl.saveAssessment")}</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Tab 1: Calibrated Architectural Gauges */}
      {activeTab === "GAUGES" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TactileGauge
              label={t("gauges.health")}
              value={gaugeValues.health ?? 0}
              onChange={(v) => updateGauge("health", v)}
              notes={gaugeNotes.health}
              onNotesChange={(n) => updateGaugeNote("health", n)}
              notesLabel="یادداشت تأمل سلامت"
              notesPlaceholder="احوال جسمی، خواب، تغذیه و ورزش..."
              signalColor="var(--signal-positive)"
            />

            <TactileGauge
              label={t("gauges.work")}
              value={gaugeValues.work ?? 0}
              onChange={(v) => updateGauge("work", v)}
              notes={gaugeNotes.work}
              onNotesChange={(n) => updateGaugeNote("work", n)}
              notesLabel="یادداشت تأمل کار و معنا"
              notesPlaceholder="پروژه‌ها، بار فکری، درآمد و پایداری حرفه..."
              signalColor="var(--path-1)"
            />

            <TactileGauge
              label={t("gauges.play")}
              value={gaugeValues.play ?? 0}
              onChange={(v) => updateGauge("play", v)}
              notes={gaugeNotes.play}
              onNotesChange={(n) => updateGaugeNote("play", n)}
              notesLabel="یادداشت تأمل بازی و فراغت"
              notesPlaceholder="لذت بدون غایت، بازیگوشی، خلاقیت آزاد..."
              signalColor="var(--signal-amber)"
            />

            <TactileGauge
              label={t("gauges.love")}
              value={gaugeValues.love ?? 0}
              onChange={(v) => updateGauge("love", v)}
              notes={gaugeNotes.love}
              onNotesChange={(n) => updateGaugeNote("love", n)}
              notesLabel="یادداشت تأمل عشق و پیوندها"
              notesPlaceholder="روابط خانوادگی، دوستی‌های عمیق، تعلق به جمع..."
              signalColor="var(--path-3)"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Gravity vs. Designable Problems Board */}
      {activeTab === "GRAVITY" && (
        <div className="space-y-4">
          <GravityBoard
            problems={problems}
            onAddProblem={addProblem}
            onToggleClassification={toggleProblem}
            onDeleteProblem={deleteProblem}
            t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
          />
        </div>
      )}
    </div>
  );
}
