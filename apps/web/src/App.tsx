import {
  type AeiouItem,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CompactTooltip,
  type CompassData,
  CompassEditor,
  ContextualNudge,
  type FeedbackItem,
  GoodTimeJournal,
  GravityBoard,
  type JournalEntryItem,
  MindsetBadge,
  type MindsetType,
  OdysseyPlansStudio,
  type OdysseySlot,
  OnboardingWizard,
  type PlanItem,
  type ProblemItem,
  type ReflectionFindingItem,
  TactileGauge,
  useDirection,
  useTheme,
} from "@odyssey/ui";
import { Check, Globe, HelpCircle, History, Lock, Moon, ShieldCheck, Sun } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function App(): React.JSX.Element {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale } = useDirection();

  // Onboarding modal state
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completed = localStorage.getItem("odyssey_onboarding_completed");
      if (completed !== "true") {
        setShowOnboarding(true);
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("odyssey_onboarding_completed", "true");
    }
    setShowOnboarding(false);
  };

  // State for Chapter 1 Gauges
  const [gaugeValues, setGaugeValues] = useState<Record<string, number>>({
    health: 80,
    work: 65,
    play: 45,
    love: 70,
  });

  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const [snapshotCount, setSnapshotCount] = useState(1);

  const updateGauge = (key: string, val: number) => {
    setGaugeValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveSnapshot = () => {
    setSnapshotCount((c) => c + 1);
    setSnapshotSaved(true);
    setTimeout(() => setSnapshotSaved(false), 2000);
  };

  // State for Chapter 1 & 4 Gravity Board
  const [problems, setProblems] = useState<ProblemItem[]>([
    {
      id: "prob-1",
      content: "قوانین ساعت کاری شرکت فعلی غیرقابل تغییر است",
      isGravity: true,
    },
    {
      id: "prob-2",
      content: "آزمودن ۳ سناریوی تدریس مستقل در کنار شغل اصلی",
      isGravity: false,
    },
  ]);

  const handleAddProblem = (content: string) => {
    const newItem: ProblemItem = {
      id: `prob-${Date.now()}`,
      content,
      isGravity: false,
    };
    setProblems((prev) => [newItem, ...prev]);
  };

  const handleToggleClassification = (id: string) => {
    setProblems((prev) => prev.map((p) => (p.id === id ? { ...p, isGravity: !p.isGravity } : p)));
  };

  const handleDeleteProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
  };

  // State for Chapter 2 Compass Studio
  const [compassData, setCompassData] = useState<CompassData>({
    workview: "",
    lifeview: "",
    coherenceComplement: "",
    coherenceConflict: "",
    coherenceGuide: "",
  });
  const [compassSaved, setCompassSaved] = useState(false);

  const handleSaveCompass = (data: CompassData) => {
    setCompassData(data);
    setCompassSaved(true);
    setTimeout(() => setCompassSaved(false), 2000);
  };

  // State for Chapter 3 Good Time Journal
  const [journalEntries, setJournalEntries] = useState<JournalEntryItem[]>([
    {
      id: "gtj-1",
      title: "معماری ماژول‌های ذخیره‌سازی محلی و طراحی قراردادها",
      engagement: 90,
      energy: 85,
      isFlow: true,
      durationMinutes: 90,
      occurredAt: Date.now() - 3600000 * 2,
    },
    {
      id: "gtj-2",
      title: "پاسخ به ایمیل‌های اداری تکراری و پرکردن فرم‌های سامانه",
      engagement: 15,
      energy: -60,
      isFlow: false,
      durationMinutes: 40,
      occurredAt: Date.now() - 3600000 * 5,
    },
  ]);

  const [reflectionFindings, setReflectionFindings] = useState<ReflectionFindingItem[]>([
    {
      id: "find-1",
      journalEntryId: "gtj-1",
      tag: "INSIGHT",
      notes: "تمرکز عمیق روی معماری تمیز بدون نوتیفیکیشن انرژی روانی را به جای فرسایش، شارژ می‌کند.",
    },
  ]);

  const [aeiouAnalyses, setAeiouAnalyses] = useState<Record<string, AeiouItem>>({
    "find-1": {
      reflectionFindingId: "find-1",
      activities: "طراحی اینترفیس‌ها و تست‌های واحد تمیز",
      environments: "اتاق آرام، میز کار بدون شلوغی با نور طبیعی",
      interactions: "تعامل فنی و گفت‌وگوی فکری سطح بالا",
      objects: "ادیتور متنی ساده و دفترچه یادداشت فیزیکی",
      users: "توسعه‌دهندگان و کاربران متمرکز",
    },
  });

  const handleAddJournalEntry = (entry: Omit<JournalEntryItem, "id">) => {
    const newEntry: JournalEntryItem = {
      ...entry,
      id: `gtj-${Date.now()}`,
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSaveFinding = (finding: Omit<ReflectionFindingItem, "id">) => {
    const newFinding: ReflectionFindingItem = {
      ...finding,
      id: `find-${Date.now()}`,
    };
    setReflectionFindings((prev) => [newFinding, ...prev]);
  };

  const handleSaveAeiou = (analysis: AeiouItem) => {
    setAeiouAnalyses((prev) => ({
      ...prev,
      [analysis.reflectionFindingId]: analysis,
    }));
  };

  // State for Chapter 5 Three Odyssey Plans
  const [plans, setPlans] = useState<Record<OdysseySlot, PlanItem>>({
    LIFE_1: {
      slot: "LIFE_1",
      sixWordTitle: "توسعه معماری سیستم و رهبری مهندسی",
      resources: 85,
      likability: 80,
      confidence: 90,
      coherence: 95,
      questions: [
        "آیا نیاز بازار به سیستم‌های محلی پایدار است؟",
        "چگونه تیم را در بالاترین انگیزه نگه دارم؟",
        "چه زمانی محصول آماده لانچ نهایی می‌شود؟",
      ],
      timelineEvents: [
        { year: 1, type: "work", description: "معماری و انتشار نسخه ۱ استودیو" },
        { year: 2, type: "work", description: "گسترش به کاربران دسکتاپ و تیم‌ها" },
        { year: 3, type: "personal", description: "سفر یک‌ماهه و تجدید قوای ذهنی" },
      ],
    },
    LIFE_2: {
      slot: "LIFE_2",
      sixWordTitle: "تدریس و استودیوی مستقل طراحی ابزار",
      resources: 60,
      likability: 90,
      confidence: 70,
      coherence: 85,
      questions: [
        "اولین دوره آموزشی برای چه جامعه‌ای باشد؟",
        "مدل درآمدی استودیو چگونه تثبیت می‌شود؟",
        "آیا استقلال کاری با امنیت مالی همخوان است؟",
      ],
      timelineEvents: [
        { year: 1, type: "work", description: "طراحی سرفصل کارگاه‌های تفکر طراحی" },
        { year: 2, type: "work", description: "تأسیس استودیوی دو نفره" },
      ],
    },
    LIFE_3: {
      slot: "LIFE_3",
      sixWordTitle: "زیست آرام و پژوهش فلسفه تاریخ",
      resources: 40,
      likability: 95,
      confidence: 60,
      coherence: 95,
      questions: [
        "کجا برای این سبک زیست مناسب‌تر است؟",
        "چگونه ارتباط علمی با دانشگاه‌ها حفظ شود؟",
        "هزینه‌های زندگی چگونه پوشش داده می‌شوند؟",
      ],
      timelineEvents: [
        { year: 1, type: "personal", description: "کوچ به اقلیم آرام و تألیف کتاب" },
      ],
    },
  });

  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackItem[]>>({});

  const handleUpdatePlan = (updatedPlan: PlanItem) => {
    setPlans((prev) => ({
      ...prev,
      [updatedPlan.slot]: updatedPlan,
    }));
  };

  const handleSavePlanFeedback = (
    slot: OdysseySlot,
    feedback: { externalFeedback: string; presenterEnergyNote: string },
  ) => {
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      odysseyPlanId: slot,
      externalFeedback: feedback.externalFeedback,
      presenterEnergyNote: feedback.presenterEnergyNote,
    };
    setFeedbacks((prev) => ({
      ...prev,
      [slot]: [...(prev[slot] ?? []), newFeedback],
    }));
  };

  const handleCreatePrototypeFromQuestion = (
    slot: OdysseySlot,
    questionIndex: number,
    questionText: string,
  ) => {
    // Bridges to Chapter 6 Prototyping Lab (F-010)
    console.log(`Bridge to prototype: ${slot} Q${questionIndex}: ${questionText}`);
  };

  const mindsets: Array<{
    type: MindsetType;
    nameKey: string;
    descKey: string;
  }> = [
    {
      type: "curiosity",
      nameKey: "mindsets.curiosity.name",
      descKey: "mindsets.curiosity.description",
    },
    {
      type: "bias_to_action",
      nameKey: "mindsets.bias_to_action.name",
      descKey: "mindsets.bias_to_action.description",
    },
    {
      type: "reframing",
      nameKey: "mindsets.reframing.name",
      descKey: "mindsets.reframing.description",
    },
    {
      type: "awareness",
      nameKey: "mindsets.awareness.name",
      descKey: "mindsets.awareness.description",
    },
    {
      type: "radical_collaboration",
      nameKey: "mindsets.radical_collaboration.name",
      descKey: "mindsets.radical_collaboration.description",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--ink-primary)]">
      {/* Onboarding Wizard Modal */}
      <OnboardingWizard
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
        t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
      />

      {/* Studio Header Bar */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] ps-6 pe-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[var(--radius-sm,4px)] bg-[var(--bg-inverted)] flex items-center justify-center text-[var(--bg-surface)] font-mono font-bold text-xs">
              Ω
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">{t("common.appName")}</h1>
              <p className="text-[11px] text-[var(--ink-muted)]">{t("common.tagline")}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reopen Onboarding / 5 Mindsets Guide */}
            <CompactTooltip content={t("onboarding.reopenOnboarding")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnboarding(true)}
                className="font-mono text-xs gap-1.5"
                aria-label={t("onboarding.reopenOnboarding")}
              >
                <HelpCircle className="w-3.5 h-3.5 text-[var(--ink-secondary)]" />
                <span className="hidden sm:inline">{t("onboarding.reopenOnboarding")}</span>
              </Button>
            </CompactTooltip>

            {/* Vault Status Indicator */}
            <CompactTooltip content={t("vault.subtitle")}>
              <div className="inline-flex items-center gap-1.5 ps-2.5 pe-2.5 py-1 rounded-[var(--radius-sm,4px)] text-xs font-mono bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--ink-secondary)] select-none cursor-help">
                <span className="w-2 h-2 rounded-full bg-[var(--signal-positive)]" />
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                <span className="text-[11px]">{t("common.offlineStatus")}</span>
              </div>
            </CompactTooltip>

            {/* Language Switcher */}
            <CompactTooltip content={t("locale.switch")}>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLocale}
                className="font-mono text-xs gap-1.5"
                aria-label={t("locale.switch")}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{locale === "fa" ? "EN" : "فا"}</span>
              </Button>
            </CompactTooltip>

            {/* Theme Switcher */}
            <CompactTooltip content={t("theme.toggle")}>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                aria-label={t("theme.toggle")}
                className="gap-1.5"
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </Button>
            </CompactTooltip>
          </div>
        </div>
      </header>

      {/* Five Mindsets Active Backbone Bar */}
      <section className="border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50 ps-6 pe-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <span className="text-[11px] text-[var(--ink-muted)] font-medium">
            {t("common.cycleIndicator", { cycle: 1 })}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            {mindsets.map((m) => (
              <MindsetBadge
                key={m.type}
                type={m.type}
                name={t(m.nameKey)}
                description={t(m.descKey)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Studio Workspace Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Module 1: Chapter 1 Life Instruments (HWPL Calibrated Gauges) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">{t("nav.dashboard")}</h2>
              <p className="text-xs text-[var(--ink-secondary)]">
                تراز چهارگانه سلامت، کار، بازی و عشق — سنجش صادقانه وضعیت فعلی بدون قضاوت
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveSnapshot}
                className="gap-1.5 text-xs font-mono"
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
              <span className="text-xs font-mono text-[var(--ink-muted)]">Ch. 01</span>
            </div>
          </div>

          {/* Contextual Nudge for HWPL (Curiosity) */}
          <ContextualNudge
            mindset="curiosity"
            mindsetName={t("mindsets.curiosity.name")}
            title={t("nudges.hwplCuriosityTitle")}
            prompt={t("nudges.hwplCuriosityPrompt")}
            dismissLabel={t("nudges.dismiss")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <TactileGauge
                  label={t("gauges.health")}
                  value={gaugeValues.health ?? 0}
                  onChange={(v) => updateGauge("health", v)}
                  signalColor="var(--signal-positive)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <TactileGauge
                  label={t("gauges.work")}
                  value={gaugeValues.work ?? 0}
                  onChange={(v) => updateGauge("work", v)}
                  signalColor="var(--path-1)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <TactileGauge
                  label={t("gauges.play")}
                  value={gaugeValues.play ?? 0}
                  onChange={(v) => updateGauge("play", v)}
                  signalColor="var(--signal-amber)"
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <TactileGauge
                  label={t("gauges.love")}
                  value={gaugeValues.love ?? 0}
                  onChange={(v) => updateGauge("love", v)}
                  signalColor="var(--path-3)"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Gravity vs. Designable Problems Board (Chapter 1 & 4) */}
        <section>
          <GravityBoard
            problems={problems}
            onAddProblem={handleAddProblem}
            onToggleClassification={handleToggleClassification}
            onDeleteProblem={handleDeleteProblem}
            t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
          />
        </section>

        {/* Module 2: Chapter 2 Building a Compass (Workview / Lifeview & Coherence) */}
        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">{t("nav.compass")}</h2>
              <p className="text-xs text-[var(--ink-secondary)]">{t("compass.desc")}</p>
            </div>
            <div className="flex items-center gap-2">
              {compassSaved && (
                <span className="inline-flex items-center gap-1 text-xs text-[var(--signal-positive)] font-mono">
                  <Check className="w-3.5 h-3.5" />
                  {t("common.saved")}
                </span>
              )}
              <span className="text-xs font-mono text-[var(--ink-muted)]">Ch. 02</span>
            </div>
          </div>

          <ContextualNudge
            mindset="awareness"
            mindsetName={t("mindsets.awareness.name")}
            title={t("nudges.compassAwarenessTitle")}
            prompt={t("nudges.compassAwarenessPrompt")}
            dismissLabel={t("nudges.dismiss")}
          />

          <CompassEditor
            initialData={compassData}
            onSave={handleSaveCompass}
            t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
          />
        </section>

        {/* Module 3: Chapter 3 Wayfinding & Good Time Journal (3-Stage Workflow + AEIOU) */}
        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">{t("nav.journal")}</h2>
              <p className="text-xs text-[var(--ink-secondary)]">
                {t("goodTimeJournal.matrixDesc")} — کشف فعالیت‌های انرژی‌بخش و فرساینده
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--ink-muted)]">Ch. 03</span>
          </div>

          <ContextualNudge
            mindset="curiosity"
            mindsetName={t("mindsets.curiosity.name")}
            title={t("nudges.journalCuriosityTitle")}
            prompt={t("nudges.journalCuriosityPrompt")}
            dismissLabel={t("nudges.dismiss")}
          />

          <GoodTimeJournal
            entries={journalEntries}
            findings={reflectionFindings}
            aeiouAnalyses={aeiouAnalyses}
            onAddEntry={handleAddJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            onSaveFinding={handleSaveFinding}
            onSaveAeiou={handleSaveAeiou}
            t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
          />
        </section>

        {/* Module 4: Chapter 5 Three Odyssey Plans Studio & Pitch Mode */}
        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          {/* Contextual Nudge for Odyssey (Bias to Action) */}
          <ContextualNudge
            mindset="bias_to_action"
            mindsetName={t("mindsets.bias_to_action.name")}
            title={t("nudges.odysseyBiasTitle")}
            prompt={t("nudges.odysseyBiasPrompt")}
            dismissLabel={t("nudges.dismiss")}
          />

          <OdysseyPlansStudio
            plans={plans}
            feedbacks={feedbacks}
            onUpdatePlan={handleUpdatePlan}
            onSaveFeedback={handleSavePlanFeedback}
            onCreatePrototype={handleCreatePrototypeFromQuestion}
            t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
          />
        </section>
      </main>

      {/* Studio Footer Bar */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] ps-6 pe-6 py-3 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[var(--ink-muted)]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Knowledge AES-256-GCM · Argon2id · OPFS SQLite</span>
          </div>
          <span className="font-mono text-[11px]">Odyssey v1.0 Core Studio</span>
        </div>
      </footer>
    </div>
  );
}
