import { PrototypingLab } from "@odyssey/ui";
import type React from "react";
import { useTranslation } from "react-i18next";
import { useStudio } from "../context/studio-context.js";

export function PrototypesView(): React.JSX.Element {
  const { t } = useTranslation();
  const { prototypes, createPrototype, updatePrototypeStatus, deletePrototype, activeBridge } =
    useStudio();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Single Page Header */}
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-[var(--path-1)]">گام ۰۵</span>
          <span className="text-[var(--border-strong)] opacity-30">/</span>
          <h2 className="text-xl font-bold tracking-tight text-[var(--ink-primary)]">
            {t("prototyping.title")}
          </h2>
        </div>
        <p className="text-xs text-[var(--ink-secondary)] leading-relaxed">
          {t("prototyping.desc")}
        </p>
      </div>

      {/* Prototyping Lab Cards & Form */}
      <PrototypingLab
        prototypes={prototypes}
        onCreatePrototype={createPrototype}
        onUpdatePrototypeStatus={updatePrototypeStatus}
        onDeletePrototype={deletePrototype}
        initialPlanSlot={activeBridge?.slot}
        initialQuestionIndex={activeBridge?.questionIndex}
        initialQuestionText={activeBridge?.questionText}
        t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
      />
    </div>
  );
}
