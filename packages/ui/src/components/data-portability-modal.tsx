import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileCode,
  FileDown,
  FileText,
  FileUp,
  FolderArchive,
  Lock,
  RefreshCw,
  ShieldCheck,
  Upload,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "../utils/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog.js";
import { Input } from "./input.js";

export type PortabilityTab = "bundle" | "json" | "markdown";

export interface DataPortabilityViewProps {
  onExportBundle: (
    passphrase: string,
  ) => Promise<{ success: boolean; data?: string | undefined; error?: string | undefined }>;
  onImportBundle: (
    bundleString: string,
    passphrase: string,
  ) => Promise<{ success: boolean; totalRecords?: number | undefined; error?: string | undefined }>;
  onExportJson: () => Promise<{
    success: boolean;
    data?: string | undefined;
    error?: string | undefined;
  }>;
  onImportJson: (
    jsonString: string,
  ) => Promise<{ success: boolean; totalRecords?: number | undefined; error?: string | undefined }>;
  onExportMarkdown: () => Promise<{
    success: boolean;
    files?: Record<string, string> | undefined;
    error?: string | undefined;
  }>;
  t: (key: string, options?: Record<string, unknown>) => string;
  className?: string | undefined;
}

export interface DataPortabilityModalProps extends DataPortabilityViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataPortabilityView({
  onExportBundle,
  onImportBundle,
  onExportJson,
  onImportJson,
  onExportMarkdown,
  t,
  className,
}: DataPortabilityViewProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<PortabilityTab>("bundle");

  // Encrypted Bundle State
  const [bundlePassphrase, setBundlePassphrase] = useState("");
  const [bundleConfirmPass, setBundleConfirmPass] = useState("");
  const [importBundlePass, setImportBundlePass] = useState("");
  const [bundleFileContent, setBundleFileContent] = useState<string | null>(null);
  const [bundleFileName, setBundleFileName] = useState<string>("");

  // Plain JSON State
  const [jsonFileContent, setJsonFileContent] = useState<string | null>(null);
  const [jsonFileName, setJsonFileName] = useState<string>("");

  // Markdown State
  const [markdownFiles, setMarkdownFiles] = useState<Record<string, string> | null>(null);
  const [copiedMoc, setCopiedMoc] = useState(false);

  // Status & Feedback State
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const triggerDownload = (filename: string, content: string, mimeType = "application/json") => {
    if (typeof window === "undefined") return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportBundle = async () => {
    if (!bundlePassphrase) {
      setStatusMessage({ type: "error", text: "لطفاً یک رمز عبور قوی وارد کنید." });
      return;
    }
    if (bundlePassphrase !== bundleConfirmPass) {
      setStatusMessage({ type: "error", text: "رمز عبور با تکرار آن یکسان نیست." });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await onExportBundle(bundlePassphrase);
      if (res.success && res.data) {
        const dateStr = new Date().toISOString().split("T")[0];
        triggerDownload(`odyssey-backup-${dateStr}.odybundle`, res.data, "application/json");
        setStatusMessage({
          type: "success",
          text: "بسته رمزنگاری‌شده .odybundle با موفقیت تولید و دانلود شد.",
        });
        setBundlePassphrase("");
        setBundleConfirmPass("");
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "خطا در تولید بسته رمزنگاری‌شده.",
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "خطای نامشخص در خروجی بسته.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBundleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBundleFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setBundleFileContent(String(event.target?.result ?? ""));
    };
    reader.readAsText(file);
  };

  const handleImportBundle = async () => {
    if (!bundleFileContent) {
      setStatusMessage({ type: "error", text: "لطفاً ابتدا فایل .odybundle را انتخاب کنید." });
      return;
    }
    if (!importBundlePass) {
      setStatusMessage({ type: "error", text: "لطفاً رمز عبور فایل پشتیبان را وارد کنید." });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await onImportBundle(bundleFileContent, importBundlePass);
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: t("portability.restoreSuccess", { count: res.totalRecords ?? 0 }),
        });
        setBundleFileContent(null);
        setBundleFileName("");
        setImportBundlePass("");
      } else {
        setStatusMessage({
          type: "error",
          text: t("portability.restoreError", { error: res.error || "نامعتبر بودن رمز یا فایل" }),
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "خطای نامشخص در بازگردانی فایل.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportJson = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await onExportJson();
      if (res.success && res.data) {
        const dateStr = new Date().toISOString().split("T")[0];
        triggerDownload(`odyssey-export-${dateStr}.json`, res.data, "application/json");
        setStatusMessage({
          type: "success",
          text: "فایل خام JSON با موفقیت دانلود شد.",
        });
      } else {
        setStatusMessage({ type: "error", text: res.error || "خطا در خروجی JSON." });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "خطای نامشخص در خروجی JSON.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJsonFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setJsonFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonFileContent(String(event.target?.result ?? ""));
    };
    reader.readAsText(file);
  };

  const handleImportJson = async () => {
    if (!jsonFileContent) {
      setStatusMessage({ type: "error", text: "لطفاً ابتدا فایل JSON را انتخاب کنید." });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await onImportJson(jsonFileContent);
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: t("portability.restoreSuccess", { count: res.totalRecords ?? 0 }),
        });
        setJsonFileContent(null);
        setJsonFileName("");
      } else {
        setStatusMessage({
          type: "error",
          text: t("portability.restoreError", {
            error: res.error || "خطا در اعتبارسنجی اسکیمای داده",
          }),
        });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "خطای ناشناخته در بارگذاری JSON.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadMarkdown = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await onExportMarkdown();
      if (res.success && res.files) {
        setMarkdownFiles(res.files);
        setStatusMessage({
          type: "success",
          text: "آرشیو یادداشت‌های Markdown با ساختار Obsidian آماده شد.",
        });
      } else {
        setStatusMessage({ type: "error", text: res.error || "خطا در تولید فایل‌های Markdown." });
      }
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "خطا در پردازش یادداشت‌ها.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAllMarkdown = () => {
    if (!markdownFiles) return;
    for (const [path, content] of Object.entries(markdownFiles)) {
      const sanitizedName = path.replace(/\//g, "-");
      triggerDownload(sanitizedName, content, "text/markdown");
    }
  };

  const handleCopyMoc = () => {
    if (!markdownFiles?.["README.md"]) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(markdownFiles["README.md"]);
      setCopiedMoc(true);
      setTimeout(() => setCopiedMoc(false), 2000);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col space-y-1.5 text-start mb-4">
        <div className="flex items-center gap-2">
          <FolderArchive className="w-5 h-5 text-[var(--signal-positive)]" />
          <h2 className="text-base font-semibold">{t("portability.title")}</h2>
        </div>
        <p className="text-xs text-[var(--ink-secondary)]">{t("portability.subtitle")}</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] mb-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab("bundle");
            setStatusMessage(null);
          }}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-[var(--radius-sm,4px)] text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
            activeTab === "bundle"
              ? "bg-[var(--bg-surface)] text-[var(--ink-primary)] shadow-xs"
              : "text-[var(--ink-muted)] hover:text-[var(--ink-secondary)]",
          )}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{t("portability.tabBundle")}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("json");
            setStatusMessage(null);
          }}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-[var(--radius-sm,4px)] text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
            activeTab === "json"
              ? "bg-[var(--bg-surface)] text-[var(--ink-primary)] shadow-xs"
              : "text-[var(--ink-muted)] hover:text-[var(--ink-secondary)]",
          )}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>{t("portability.tabJson")}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("markdown");
            setStatusMessage(null);
            if (!markdownFiles) {
              void handleLoadMarkdown();
            }
          }}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-[var(--radius-sm,4px)] text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
            activeTab === "markdown"
              ? "bg-[var(--bg-surface)] text-[var(--ink-primary)] shadow-xs"
              : "text-[var(--ink-muted)] hover:text-[var(--ink-secondary)]",
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t("portability.tabMarkdown")}</span>
        </button>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={cn(
            "p-3 rounded-[var(--radius-sm,4px)] text-xs flex items-center gap-2 mb-4 border",
            statusMessage.type === "success"
              ? "bg-[var(--signal-positive)]/10 text-[var(--signal-positive)] border-[var(--signal-positive)]/20"
              : "bg-[var(--signal-critical)]/10 text-[var(--signal-critical)] border-[var(--signal-critical)]/20",
          )}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tab 1: Encrypted Bundle (.odybundle) */}
      {activeTab === "bundle" && (
        <div className="space-y-5 text-xs">
          {/* Security Notice */}
          <div className="p-3 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[var(--signal-positive)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              {t("portability.bundleNotice")}
            </p>
          </div>

          {/* Export Section */}
          <div className="p-4 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[var(--ink-primary)]">
                {t("portability.exportTitle")}
              </span>
              <Badge variant="positive">Argon2id + AES-256-GCM</Badge>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)]">{t("portability.exportDesc")}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label
                  htmlFor="bundle-pass"
                  className="text-[11px] text-[var(--ink-secondary)] block"
                >
                  {t("portability.bundlePassphraseLabel")}
                </label>
                <Input
                  id="bundle-pass"
                  type="password"
                  value={bundlePassphrase}
                  onChange={(e) => setBundlePassphrase(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="bundle-confirm-pass"
                  className="text-[11px] text-[var(--ink-secondary)] block"
                >
                  {t("portability.bundleConfirmPassLabel")}
                </label>
                <Input
                  id="bundle-confirm-pass"
                  type="password"
                  value={bundleConfirmPass}
                  onChange={(e) => setBundleConfirmPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleExportBundle}
              disabled={isProcessing || !bundlePassphrase}
              className="w-full gap-1.5 mt-2 font-mono text-xs"
            >
              {isProcessing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{t("portability.downloadBundle")}</span>
            </Button>
          </div>

          {/* Import / Restore Section */}
          <div className="p-4 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[var(--ink-primary)]">
                {t("portability.importTitle")}
              </span>
              <span className="text-[10px] font-mono text-[var(--ink-muted)]">
                SHA-256 Verified
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)]">{t("portability.importDesc")}</p>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="bundle-file-upload"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-xs text-[var(--ink-secondary)] transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{bundleFileName || t("portability.selectFile")}</span>
                </label>
                <input
                  id="bundle-file-upload"
                  type="file"
                  accept=".odybundle,.json"
                  onChange={handleBundleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="import-pass"
                  className="text-[11px] text-[var(--ink-secondary)] block"
                >
                  {t("portability.bundlePassphraseLabel")}
                </label>
                <Input
                  id="import-pass"
                  type="password"
                  value={importBundlePass}
                  onChange={(e) => setImportBundlePass(e.target.value)}
                  placeholder={t("portability.bundlePassphrasePlaceholder")}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleImportBundle}
              disabled={isProcessing || !bundleFileContent || !importBundlePass}
              className="w-full gap-1.5 mt-2 text-xs"
            >
              {isProcessing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileUp className="w-3.5 h-3.5" />
              )}
              <span>{t("portability.restoreAction")}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Plain JSON Backup */}
      {activeTab === "json" && (
        <div className="space-y-5 text-xs">
          {/* Warning Notice */}
          <div className="p-3 rounded-[var(--radius-sm,4px)] bg-[var(--signal-critical)]/10 text-[var(--signal-critical)] border border-[var(--signal-critical)]/20 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">{t("portability.jsonNotice")}</p>
          </div>

          {/* Export Section */}
          <div className="p-4 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[var(--ink-primary)]">
                خروجی خام ساختاریافته (JSON)
              </span>
              <span className="text-[10px] font-mono text-[var(--ink-muted)]">Schema v1.0</span>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)]">
              تمام جداول و رکوردهای پایگاه داده به صورت ساختاریافته در یک فایل JSON استخراج می‌شوند.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              disabled={isProcessing}
              className="w-full gap-1.5 font-mono text-xs mt-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t("portability.exportJson")}</span>
            </Button>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[var(--ink-primary)]">
                ورودی و بازیابی از فایل JSON
              </span>
              <Badge variant="neutral">Zod Schema Validation</Badge>
            </div>
            <p className="text-[11px] text-[var(--ink-muted)]">
              فایل ورودی پیش از اعمال در پایگاه داده، از گیت سخت‌گیرانه اعتبارسنجی Zod عبور می‌کند.
            </p>

            <div className="pt-1">
              <label
                htmlFor="json-file-upload"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface)] text-xs text-[var(--ink-secondary)] transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{jsonFileName || t("portability.selectFile")}</span>
              </label>
              <input
                id="json-file-upload"
                type="file"
                accept=".json"
                onChange={handleJsonFileSelect}
                className="hidden"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleImportJson}
              disabled={isProcessing || !jsonFileContent}
              className="w-full gap-1.5 text-xs mt-2"
            >
              {isProcessing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileUp className="w-3.5 h-3.5" />
              )}
              <span>{t("portability.restoreAction")}</span>
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Markdown / Obsidian PKM Notes */}
      {activeTab === "markdown" && (
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-[var(--radius-sm,4px)] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-[var(--path-1)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              یادداشت‌های Markdown استخراج‌شده کاملاً سازگار با ابزارهای مدیریت دانش فردی (مانند
              Obsidian و Logseq) همراه با YAML Frontmatter و پیوندهای درونی ([[Wikilinks]]) تولید
              شده‌اند.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-xs text-[var(--ink-primary)]">
              {t("portability.mdPreviewTitle")}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyMoc}
                disabled={!markdownFiles?.["README.md"]}
                className="gap-1 text-xs"
              >
                {copiedMoc ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                    <span>{t("portability.copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t("portability.copyMarkdown")}</span>
                  </>
                )}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadAllMarkdown}
                disabled={!markdownFiles}
                className="gap-1 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("portability.downloadMarkdown")}</span>
              </Button>
            </div>
          </div>

          {/* List of Generated Markdown Notes */}
          <div className="border border-[var(--border-subtle)] rounded-[var(--radius-sm,4px)] divide-y divide-[var(--border-subtle)] max-h-56 overflow-y-auto">
            {markdownFiles ? (
              Object.keys(markdownFiles).map((filePath) => (
                <div
                  key={filePath}
                  className="p-2 flex items-center justify-between text-[11px] hover:bg-[var(--bg-subtle)]/50 transition-colors"
                >
                  <span className="font-mono text-[var(--ink-secondary)]">{filePath}</span>
                  <button
                    type="button"
                    onClick={() =>
                      triggerDownload(
                        filePath.replace(/\//g, "-"),
                        markdownFiles[filePath] ?? "",
                        "text/markdown",
                      )
                    }
                    className="text-[var(--path-1)] hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <Download className="w-3 h-3" />
                    <span>دانلود</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[var(--ink-muted)]">
                در حال بارگذاری و قالب‌بندی یادداشت‌ها...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function DataPortabilityModal({
  open,
  onOpenChange,
  className,
  ...props
}: DataPortabilityModalProps): React.JSX.Element {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-2xl max-h-[90vh] overflow-y-auto p-6", className)}>
        <DataPortabilityView {...props} />
      </DialogContent>
    </Dialog>
  );
}
