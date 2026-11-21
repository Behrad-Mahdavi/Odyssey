import { ChevronLeft, ChevronRight, Compass, Lightbulb, PlayCircle, Wrench } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog.js";

export interface OnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

export function OnboardingWizard({
  open,
  onOpenChange,
  onComplete,
  t,
}: OnboardingWizardProps): React.JSX.Element {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      onComplete();
      onOpenChange(false);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-2 font-mono">
            <span>{t("onboarding.stepIndicator", { current: step, total: totalSteps })}</span>
            <button
              type="button"
              onClick={handleSkip}
              className="hover:text-[var(--ink-primary)] transition-colors cursor-pointer text-[11px]"
            >
              {t("onboarding.skip")}
            </button>
          </div>
          <DialogTitle className="text-base font-semibold">
            {step === 1 && t("onboarding.step1Title")}
            {step === 2 && t("onboarding.step2Title")}
            {step === 3 && t("onboarding.step3Title")}
            {step === 4 && t("onboarding.step4Title")}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {step === 1 && t("onboarding.step1Desc")}
            {step === 2 && t("onboarding.step2Desc")}
            {step === 3 && t("onboarding.step3Desc")}
            {step === 4 && t("onboarding.step4Desc")}
          </DialogDescription>
        </DialogHeader>

        {/* Step Content */}
        <div className="py-3 text-xs space-y-3 min-h-[190px]">
          {step === 1 && (
            <div className="p-3.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-2 text-[var(--ink-primary)] font-semibold">
                <Lightbulb className="w-4 h-4 text-[var(--signal-amber)]" />
                <span>{t("onboarding.step1MythTitle")}</span>
              </div>
              <p className="text-[var(--ink-secondary)] leading-relaxed text-[11px]">
                {t("onboarding.step1MythDesc")}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--ink-primary)]">
                    {t("mindsets.curiosity.name")}
                  </span>
                  <p className="text-[11px] text-[var(--ink-secondary)]">
                    {t("mindsets.curiosity.description")}
                  </p>
                </div>
                <Badge variant="amber">[{t("mindsets.curiosity.tag")}]</Badge>
              </div>

              <div className="p-2 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--ink-primary)]">
                    {t("mindsets.bias_to_action.name")}
                  </span>
                  <p className="text-[11px] text-[var(--ink-secondary)]">
                    {t("mindsets.bias_to_action.description")}
                  </p>
                </div>
                <Badge variant="positive">[{t("mindsets.bias_to_action.tag")}]</Badge>
              </div>

              <div className="p-2 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[var(--ink-primary)]">
                    {t("mindsets.reframing.name")}
                  </span>
                  <p className="text-[11px] text-[var(--ink-secondary)]">
                    {t("mindsets.reframing.description")}
                  </p>
                </div>
                <Badge variant="outline">[{t("mindsets.reframing.tag")}]</Badge>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50">
                <span className="font-semibold block text-[var(--ink-primary)]">
                  01. HWPL Dashboard
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">
                  سنجش صادقانه ۴ مخزن زندگی
                </span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50">
                <span className="font-semibold block text-[var(--ink-primary)]">
                  02. Work & Life Views
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">تنظیم قطب‌نما و تضادها</span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50">
                <span className="font-semibold block text-[var(--ink-primary)]">
                  03. Good Time Journal
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">ثبت انرژی و تحلیل AEIOU</span>
              </div>
              <div className="p-2.5 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50">
                <span className="font-semibold block text-[var(--ink-primary)]">
                  04. Three Odyssey Plans
                </span>
                <span className="text-[11px] text-[var(--ink-muted)]">۳ مسیر موازی ۵ ساله</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-4 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--bg-inverted)] flex items-center justify-center text-[var(--bg-surface)]">
                <PlayCircle className="w-5 h-5 text-[var(--signal-positive)]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-[var(--ink-primary)]">
                  چرخه ۱ (Cycle 1)
                </h4>
                <p className="text-[11px] text-[var(--ink-secondary)] mt-1">
                  میز طراحی شما آماده است. وضعیت‌ها به صورت رمزنگاری‌شده در حافظه محلی مرورگرتان ثبت
                  خواهند شد.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
          <div>
            {step > 1 && (
              <Button variant="ghost" size="sm" onClick={handlePrev} className="gap-1">
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{t("onboarding.prevStep")}</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handleNext} className="gap-1">
              <span>
                {step === totalSteps ? t("onboarding.startButton") : t("onboarding.nextStep")}
              </span>
              {step < totalSteps && <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
