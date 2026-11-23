import { AlertCircle, BookOpen, Check, Compass, HeartHandshake, Save } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "../utils/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card.js";
import { Textarea } from "./textarea.js";

export interface CompassData {
  workview: string;
  lifeview: string;
  coherenceComplement?: string;
  coherenceConflict?: string;
  coherenceGuide?: string;
}

export interface CompassEditorProps {
  initialData?: CompassData;
  onSave: (data: CompassData) => void;
  countWords?: (text: string) => number;
  t: (key: string, options?: Record<string, unknown>) => string;
  className?: string;
  hideHeader?: boolean;
}

function defaultCountWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text
    .trim()
    .split(/[\s\p{Z}\p{C}\r\n\t]+/u)
    .filter(Boolean).length;
}

export function CompassEditor({
  initialData,
  onSave,
  countWords = defaultCountWords,
  t,
  className,
  hideHeader = true,
}: CompassEditorProps): React.JSX.Element {
  const [data, setData] = useState<CompassData>({
    workview: initialData?.workview ?? "",
    lifeview: initialData?.lifeview ?? "",
    coherenceComplement: initialData?.coherenceComplement ?? "",
    coherenceConflict: initialData?.coherenceConflict ?? "",
    coherenceGuide: initialData?.coherenceGuide ?? "",
  });

  const [saved, setSaved] = useState(false);

  const workviewCount = countWords(data.workview);
  const lifeviewCount = countWords(data.lifeview);
  const targetWords = 250;

  const handleSave = () => {
    onSave(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className={cn("space-y-6", className)}>
      {!hideHeader && (
        <CardHeader>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[var(--signal-amber)]" />
            <CardTitle className="text-sm font-semibold">{t("compass.title")}</CardTitle>
          </div>
          <CardDescription className="text-xs">{t("compass.desc")}</CardDescription>
        </CardHeader>
      )}

      <CardContent className={cn("space-y-6", hideHeader && "pt-6")}>
        {/* Dual Views: Workview and Lifeview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workview Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--path-1)]" />
                <span className="font-semibold text-xs text-[var(--ink-primary)]">
                  {t("compass.workviewTitle")}
                </span>
              </div>
              <span
                className={cn(
                  "text-[11px] font-mono tabular-nums",
                  workviewCount >= targetWords
                    ? "text-[var(--signal-positive)] font-semibold"
                    : "text-[var(--ink-muted)]",
                )}
              >
                {t("compass.wordCounter", { current: workviewCount, target: targetWords })}
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              {t("compass.workviewDesc")}
            </p>
            <Textarea
              value={data.workview}
              onChange={(e) => setData((prev) => ({ ...prev, workview: e.target.value }))}
              placeholder={t("compass.workviewPlaceholder")}
              className="min-h-[160px] max-w-[68ch] font-sans"
            />
          </div>

          {/* Lifeview Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[var(--path-3)]" />
                <span className="font-semibold text-xs text-[var(--ink-primary)]">
                  {t("compass.lifeviewTitle")}
                </span>
              </div>
              <span
                className={cn(
                  "text-[11px] font-mono tabular-nums",
                  lifeviewCount >= targetWords
                    ? "text-[var(--signal-positive)] font-semibold"
                    : "text-[var(--ink-muted)]",
                )}
              >
                {t("compass.wordCounter", { current: lifeviewCount, target: targetWords })}
              </span>
            </div>
            <p className="text-[11px] text-[var(--ink-secondary)] leading-relaxed">
              {t("compass.lifeviewDesc")}
            </p>
            <Textarea
              value={data.lifeview}
              onChange={(e) => setData((prev) => ({ ...prev, lifeview: e.target.value }))}
              placeholder={t("compass.lifeviewPlaceholder")}
              className="min-h-[160px] max-w-[68ch] font-sans"
            />
          </div>
        </div>

        {/* Coherence Integration Section */}
        <div className="rounded-[var(--radius-sm,4px)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]/40 p-4 space-y-4">
          <div>
            <span className="font-semibold text-xs text-[var(--ink-primary)] block">
              {t("compass.coherenceTitle")}
            </span>
            <span className="text-[11px] text-[var(--ink-secondary)]">
              {t("compass.coherenceDesc")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Complement */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <Badge variant="positive">{t("compass.complementLabel")}</Badge>
              </div>
              <Textarea
                value={data.coherenceComplement}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, coherenceComplement: e.target.value }))
                }
                placeholder={t("compass.complementPlaceholder")}
                className="min-h-[85px] text-[11px]"
              />
            </div>

            {/* Conflict */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <Badge variant="negative">{t("compass.conflictLabel")}</Badge>
              </div>
              <Textarea
                value={data.coherenceConflict}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, coherenceConflict: e.target.value }))
                }
                placeholder={t("compass.conflictPlaceholder")}
                className="min-h-[85px] text-[11px]"
              />
            </div>

            {/* Guide */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1">
                <Badge variant="outline">{t("compass.guideLabel")}</Badge>
              </div>
              <Textarea
                value={data.coherenceGuide}
                onChange={(e) => setData((prev) => ({ ...prev, coherenceGuide: e.target.value }))}
                placeholder={t("compass.guidePlaceholder")}
                className="min-h-[85px] text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-muted)]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t("compass.depthRecommended")}</span>
          </div>
          <Button variant="primary" size="md" onClick={handleSave} className="gap-1.5">
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--signal-positive)]" />
                <span>{t("common.saved")}</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{t("compass.saveCompass")}</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
