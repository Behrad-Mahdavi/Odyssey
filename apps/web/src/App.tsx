import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CompactTooltip,
  MindsetBadge,
  type MindsetType,
  TactileGauge,
  useDirection,
  useTheme,
} from "@odyssey/ui";
import { Globe, Lock, Moon, ShieldCheck, Sun } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function App(): React.JSX.Element {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale } = useDirection();

  // State for Chapter 1 Gauges
  const [gaugeValues, setGaugeValues] = useState<Record<string, number>>({
    health: 80,
    work: 65,
    play: 45,
    love: 70,
  });

  const updateGauge = (key: string, val: number) => {
    setGaugeValues((prev) => ({ ...prev, [key]: val }));
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
            <span className="text-xs font-mono text-[var(--ink-muted)]">Ch. 01</span>
          </div>

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

        {/* Module 2: Chapter 5 Three Odyssey Plans Overview */}
        <section className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight">{t("nav.odysseyPlans")}</h2>
              <p className="text-xs text-[var(--ink-secondary)]">
                سه مسیر پنج‌ساله کاملاً مستقل — نه یک مسیر ایده‌آل و دو نسخه پشتیبان
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--ink-muted)]">Ch. 05</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plan 1 */}
            <Card className="border-t-2" style={{ borderTopColor: "var(--path-1)" }}>
              <CardHeader>
                <CardTitle className="text-sm">{t("odysseyPlans.life1Title")}</CardTitle>
                <CardDescription>{t("odysseyPlans.life1Subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-2.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <span className="block text-[11px] text-[var(--ink-muted)] mb-1">
                    {t("odysseyPlans.sixWordTitleLabel")}
                  </span>
                  <p className="font-medium text-[var(--ink-primary)]">
                    توسعه معماری سیستم و رهبری مهندسی
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-xs text-[var(--path-1)]">
                    {t("odysseyPlans.convertAction")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Plan 2 */}
            <Card className="border-t-2" style={{ borderTopColor: "var(--path-2)" }}>
              <CardHeader>
                <CardTitle className="text-sm">{t("odysseyPlans.life2Title")}</CardTitle>
                <CardDescription>{t("odysseyPlans.life2Subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-2.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <span className="block text-[11px] text-[var(--ink-muted)] mb-1">
                    {t("odysseyPlans.sixWordTitleLabel")}
                  </span>
                  <p className="font-medium text-[var(--ink-primary)]">
                    تدریس و استودیوی مستقل طراحی ابزار
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-xs text-[var(--path-2)]">
                    {t("odysseyPlans.convertAction")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Plan 3 */}
            <Card className="border-t-2" style={{ borderTopColor: "var(--path-3)" }}>
              <CardHeader>
                <CardTitle className="text-sm">{t("odysseyPlans.life3Title")}</CardTitle>
                <CardDescription>{t("odysseyPlans.life3Subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-2.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <span className="block text-[11px] text-[var(--ink-muted)] mb-1">
                    {t("odysseyPlans.sixWordTitleLabel")}
                  </span>
                  <p className="font-medium text-[var(--ink-primary)]">
                    زیست آرام و پژوهش فلسفه تاریخ
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-xs text-[var(--path-3)]">
                    {t("odysseyPlans.convertAction")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
