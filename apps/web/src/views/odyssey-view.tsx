import type { OdysseySlot } from "@odyssey/ui";
import { OdysseyPlansStudio } from "@odyssey/ui";
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useStudio } from "../context/studio-context.js";

export function OdysseyView(): React.JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { plans, feedbacks, updatePlan, saveFeedback, createPrototypeFromQuestion } = useStudio();

  const handleCreatePrototypeBridge = (
    slot: OdysseySlot,
    questionIndex: number,
    questionText: string,
  ) => {
    createPrototypeFromQuestion(slot, questionIndex, questionText);
    navigate({ to: "/prototypes" });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Single Page Header */}
      <div className="border-b border-[var(--border-subtle)] pb-4 print:hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-[var(--path-1)]">گام ۰۴</span>
          <span className="text-[var(--border-strong)] opacity-30">/</span>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink-primary)]">
            {t("nav.odysseyPlans")}
          </h2>
        </div>
        <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
          سه سناریوی پنج‌ساله موازی و مستقل بدون قضاوت و پیش‌داوری، با تایم‌لاین ۵ ساله و سنجش چهارگانه
        </p>
      </div>

      {/* 3-Column Parallel Odyssey Canvas & Pitch Mode */}
      <OdysseyPlansStudio
        plans={plans}
        feedbacks={feedbacks}
        onUpdatePlan={updatePlan}
        onSaveFeedback={saveFeedback}
        onCreatePrototype={handleCreatePrototypeBridge}
        t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
      />
    </div>
  );
}
