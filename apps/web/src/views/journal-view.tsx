import { GoodTimeJournal } from "@odyssey/ui";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useStudio } from "../context/studio-context.js";

export function JournalView(): React.JSX.Element {
  const { t } = useTranslation();
  const {
    journalEntries,
    reflectionFindings,
    aeiouAnalyses,
    addJournalEntry,
    deleteJournalEntry,
    saveFinding,
    saveAeiou,
  } = useStudio();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Single Page Header */}
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-[var(--path-1)]">گام ۰۳</span>
          <span className="text-[var(--border-strong)] opacity-30">/</span>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink-primary)]">
            {t("nav.journal")}
          </h2>
        </div>
        <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
          ثبت رخدادهای روزانه، ماتریس دوبعدی انرژی و غرقگی، و تحلیل ریشه‌ای عوامل مولد انرژی با
          چارچوب پنج‌گانه AEIOU
        </p>
      </div>

      {/* 3-Stage Stepper Workflow Component */}
      <GoodTimeJournal
        entries={journalEntries}
        findings={reflectionFindings}
        aeiouAnalyses={aeiouAnalyses}
        onAddEntry={addJournalEntry}
        onDeleteEntry={deleteJournalEntry}
        onSaveFinding={saveFinding}
        onSaveAeiou={saveAeiou}
        t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
      />
    </div>
  );
}
