import {
  Button,
  CompactMindsetChip,
  CompactTooltip,
  DataPortabilityModal,
  OnboardingWizard,
  useDirection,
  useTheme,
} from "@odyssey/ui";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FolderArchive,
  Globe,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Lock,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sun,
  Unlock,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStudio } from "../context/studio-context.js";

export function StudioShell(): React.JSX.Element {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale } = useDirection();
  const [collapsed, setCollapsed] = useState(false);

  const {
    activeCycle,
    isVaultLocked,
    lockVault,
    unlockVault,
    showPortabilityModal,
    setShowPortabilityModal,
    showOnboarding,
    setShowOnboarding,
    exportBundle,
    importBundle,
    exportJson,
    importJson,
    exportMarkdown,
  } = useStudio();

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    {
      to: "/",
      label: t("nav.overview"),
      step: "—",
      icon: LayoutDashboard,
    },
    {
      to: "/check-in",
      label: t("nav.checkIn"),
      step: "۰۱",
      icon: Activity,
      mindset: "curiosity" as const,
      mindsetName: t("mindsets.curiosity.name"),
      mindsetTip: t("mindsetChips.curiosityTip"),
    },
    {
      to: "/compass",
      label: t("nav.compass"),
      step: "۰۲",
      icon: Compass,
      mindset: "awareness" as const,
      mindsetName: t("mindsets.awareness.name"),
      mindsetTip: t("mindsetChips.awarenessTip"),
    },
    {
      to: "/journal",
      label: t("nav.journal"),
      step: "۰۳",
      icon: Clock,
      mindset: "curiosity" as const,
      mindsetName: t("mindsets.curiosity.name"),
      mindsetTip: t("mindsetChips.curiosityTip"),
    },
    {
      to: "/odyssey",
      label: t("nav.odysseyPlans"),
      step: "۰۴",
      icon: Layers,
      mindset: "bias_to_action" as const,
      mindsetName: t("mindsets.bias_to_action.name"),
      mindsetTip: t("mindsetChips.actionTip"),
    },
    {
      to: "/prototypes",
      label: t("prototyping.title"),
      step: "۰۵",
      icon: Lightbulb,
      mindset: "bias_to_action" as const,
      mindsetName: t("mindsets.bias_to_action.name"),
      mindsetTip: t("mindsetChips.actionTip"),
    },
  ];

  const currentNav = navItems.find((item) => item.to === currentPath) ?? navItems[0];

  return (
    <div className="min-h-screen flex bg-[var(--bg-canvas)] text-[var(--ink-primary)]">
      {/* Onboarding Wizard / 5 Mindsets Modal */}
      <OnboardingWizard
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={() => setShowOnboarding(false)}
        t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
      />

      {/* Data Portability Modal (F-011) */}
      <DataPortabilityModal
        open={showPortabilityModal}
        onOpenChange={setShowPortabilityModal}
        onExportBundle={exportBundle}
        onImportBundle={importBundle}
        onExportJson={exportJson}
        onImportJson={importJson}
        onExportMarkdown={exportMarkdown}
        t={(k, opt) => (opt ? String(t(k, opt)) : String(t(k)))}
      />

      {/* Collapsible Architectural Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 start-0 z-30 flex flex-col border-e border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-all duration-200 select-none ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand & Cycle Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-7 h-7 rounded-[var(--radius-sm,4px)] bg-[var(--bg-inverted)] text-[var(--bg-surface)] flex items-center justify-center font-bold text-xs shrink-0">
              Ω
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-bold text-sm tracking-tight block">
                  {t("common.appName")}
                </span>
                <span className="text-[10px] font-mono text-[var(--ink-muted)] block truncate">
                  {activeCycle} · {t("common.offlineStatus")}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-[var(--ink-muted)] hover:text-[var(--ink-primary)] p-1 rounded transition-colors cursor-pointer"
            aria-label={collapsed ? t("nav.expandSidebar") : t("nav.collapseSidebar")}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 rtl:rotate-180" />
            ) : (
              <PanelLeftClose className="w-4 h-4 rtl:rotate-180" />
            )}
          </button>
        </div>

        {/* Navigation Items (Core Methodology Flow) */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to;

            const linkContent = (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 ps-3 pe-3 py-2 rounded-[var(--radius-sm,4px)] text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[var(--bg-inverted)] text-[var(--bg-surface)] font-semibold shadow-xs"
                    : "text-[var(--ink-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--ink-primary)] font-medium"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.step !== "—" && (
                      <span
                        className={`text-[10px] font-mono ${
                          isActive ? "opacity-75" : "text-[var(--ink-muted)]"
                        }`}
                      >
                        {item.step}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );

            return collapsed ? (
              <CompactTooltip key={item.to} content={item.label}>
                {linkContent}
              </CompactTooltip>
            ) : (
              linkContent
            );
          })}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-2 text-xs">
          {/* Mindsets Guide Button */}
          {collapsed ? (
            <CompactTooltip content={t("mindsetChips.guideTitle")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOnboarding(true)}
                className="w-full justify-center p-0 h-8"
              >
                <HelpCircle className="w-4 h-4 text-[var(--signal-amber)]" />
              </Button>
            </CompactTooltip>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOnboarding(true)}
              className="w-full justify-start gap-2 text-xs h-8 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[var(--signal-amber)]" />
              <span>{t("mindsetChips.chipButton")}</span>
            </Button>
          )}

          {/* Vault Status Toggle */}
          {collapsed ? (
            <CompactTooltip
              content={isVaultLocked ? t("vault.lockedStatus") : t("vault.unlockedStatus")}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (isVaultLocked ? unlockVault() : lockVault())}
                className="w-full justify-center p-0 h-8"
              >
                {isVaultLocked ? (
                  <Lock className="w-4 h-4 text-[var(--signal-negative)]" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[var(--signal-positive)]" />
                )}
              </Button>
            </CompactTooltip>
          ) : (
            <button
              type="button"
              onClick={() => (isVaultLocked ? unlockVault() : lockVault())}
              className="w-full flex items-center justify-between p-2 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2">
                {isVaultLocked ? (
                  <Lock className="w-3.5 h-3.5 text-[var(--signal-negative)]" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                )}
                <span className="font-mono text-[11px]">
                  {isVaultLocked ? t("vault.lockedStatus") : t("vault.unlockedStatus")}
                </span>
              </div>
              <span className="text-[10px] text-[var(--ink-muted)] hover:underline">
                {isVaultLocked ? t("nav.unlockNow") : t("nav.lockNow")}
              </span>
            </button>
          )}

          {/* Backup & Portability Trigger */}
          {collapsed ? (
            <CompactTooltip content={t("portability.title")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPortabilityModal(true)}
                className="w-full justify-center p-0 h-8"
              >
                <FolderArchive className="w-4 h-4 text-[var(--path-1)]" />
              </Button>
            </CompactTooltip>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPortabilityModal(true)}
              className="w-full justify-start gap-2 text-xs h-8 font-medium"
            >
              <FolderArchive className="w-3.5 h-3.5 text-[var(--path-1)]" />
              <span>{t("nav.portability")}</span>
            </Button>
          )}

          {/* Switchers Row (Locale + Theme) */}
          <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]/60">
            {/* Language Switcher */}
            <CompactTooltip content={t("locale.switch")}>
              <button
                type="button"
                onClick={toggleLocale}
                className="p-1.5 rounded hover:bg-[var(--bg-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] font-mono text-xs flex items-center gap-1 cursor-pointer transition-colors"
                aria-label={t("locale.switch")}
              >
                <Globe className="w-3.5 h-3.5" />
                {!collapsed && <span>{locale === "fa" ? "English" : "فارسی"}</span>}
              </button>
            </CompactTooltip>

            {/* Theme Switcher */}
            <CompactTooltip content={t("theme.toggle")}>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded hover:bg-[var(--bg-subtle)] text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer transition-colors"
                aria-label={t("theme.toggle")}
              >
                {theme === "dark" ? (
                  <Sun className="w-3.5 h-3.5 text-[var(--signal-amber)]" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-[var(--ink-secondary)]" />
                )}
              </button>
            </CompactTooltip>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          collapsed ? "ms-16" : "ms-64"
        }`}
      >
        {/* Top Floating App Bar */}
        <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-xs ps-6 pe-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {currentNav?.step !== "—" ? `گام ${currentNav?.step}` : "میز طراحی"}
            </span>
            <span className="text-[var(--border-strong)] opacity-30">/</span>
            <span className="font-bold text-sm text-[var(--ink-primary)]">{currentNav?.label}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Contextual Mindset Chip */}
            {currentNav?.mindset && currentNav?.mindsetName && currentNav?.mindsetTip && (
              <CompactMindsetChip
                mindset={currentNav.mindset}
                name={currentNav.mindsetName}
                tip={currentNav.mindsetTip}
                onClick={() => setShowOnboarding(true)}
              />
            )}
          </div>
        </header>

        {/* View Content (Golden Rule of Focus: One tool per view) */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {isVaultLocked ? (
            <div className="max-w-md mx-auto text-center py-20 space-y-4">
              <Lock className="w-10 h-10 mx-auto text-[var(--signal-amber)]" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-[var(--ink-primary)]">
                  {t("vault.lockedStatus")}
                </h3>
                <p className="text-xs text-[var(--ink-secondary)]">{t("vault.subtitle")}</p>
              </div>
              <Button size="md" onClick={() => unlockVault()} className="gap-2 font-mono text-xs">
                <Unlock className="w-4 h-4" />
                <span>{t("vault.unlock")}</span>
              </Button>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
