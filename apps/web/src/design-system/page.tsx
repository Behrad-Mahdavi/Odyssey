import {
  Badge,
  Button,
  CompactTooltip,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  TactileGauge,
  Textarea,
  cn,
  useDirection,
  useTheme,
} from "@odyssey/ui";
import {
  ArrowUpRight,
  Check,
  Command,
  Download,
  Info,
  Lock,
  Plus,
  Printer,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/* Local copy — this page is developer chrome, not product surface.   */
/* ------------------------------------------------------------------ */
const COPY = {
  fa: {
    kicker: "Odyssey / Design System",
    version: "نسخه ۲.۰ — Atelier",
    hero: "یک میز تحریر، نه یک داشبورد.",
    heroSub:
      "کاغذ گرم، یک مهر آجری، خطوط مویی و ابزارهای مدرج. سلسلهمراتب از وزن و اندازه میآید، نه از رنگ و سایه.",
    meta: ["Estedad Variable · ۱۰۰–۹۰۰", "Paper + Ink", "WCAG AA", "fa-IR ↔ en-US"],
    rail: "فهرست",
    sections: {
      cover: "جلد",
      principles: "اصول",
      color: "رنگ",
      type: "تایپوگرافی",
      space: "فضا و حرکت",
      components: "کامپوننتها",
      context: "در بافت واقعی",
      print: "چاپ",
      guardrails: "مرزهای ممنوع",
    },
    principlesTitle: "پنج اصلی که هر پیکسل را قضاوت میکند",
    colorTitle: "رنگ: ۹۰٪ کاغذ و مرکب، ۱۰٪ مهر",
    colorSub:
      "یک رنگ برند (مهر آجری) برای «قصد» و پنج رنگ داده برای «معنا». رنگ داده هرگز تزئینی نیست.",
    surfaces: "سطوح و مرکب",
    signals: "سیگنالها و مسیرها",
    typeTitle: "تایپوگرافی: یک خانواده، نه دو",
    typeSub:
      "Estedad هر دو خط را میپوشاند؛ تفکیک از وزن، اندازه و عرض خط میآید. اعداد همیشه tabular.",
    spaceTitle: "فضا، شعاع، ضخامت، حرکت",
    componentsTitle: "کامپوننتها: کم، اما دقیق",
    contextTitle: "در بافت واقعی: برگه ادیسه",
    contextSub: "همان سیستم، در سه ستون؛ همان چیزی که چاپ میشود.",
    printTitle: "چاپ: A4 افقی، وکتور، مرکب سیاه روی سفید",
    guardrailsTitle: "مرزهای ممنوع (Anti-Slop)",
    doTitle: "بکن",
    dontTitle: "نکن",
    printBtn: "چاپ برگه",
    dialogBtn: "باز کردن دیالوگ",
    tooltipHint: "تولتیپ فشرده",
  },
  en: {
    kicker: "Odyssey / Design System",
    version: "Version 2.0 — Atelier",
    hero: "A drafting table, not a dashboard.",
    heroSub:
      "Warm paper, one ember accent, hairline rules, calibrated instruments. Hierarchy comes from weight and size — not from colour and shadow.",
    meta: ["Estedad Variable · 100–900", "Paper + Ink", "WCAG AA", "fa-IR ↔ en-US"],
    rail: "Contents",
    sections: {
      cover: "Cover",
      principles: "Principles",
      color: "Colour",
      type: "Typography",
      space: "Space & motion",
      components: "Components",
      context: "In context",
      print: "Print",
      guardrails: "Guardrails",
    },
    principlesTitle: "Five rules that judge every pixel",
    colorTitle: "Colour: 90% paper and ink, 10% stamp",
    colorSub:
      "One brand accent (ember) for intent, five data hues for meaning. Data colour is never decorative.",
    surfaces: "Surfaces & ink",
    signals: "Signals & paths",
    typeTitle: "Typography: one family, not two",
    typeSub:
      "Estedad covers both scripts. Separation comes from weight, size and measure. Numerals are always tabular.",
    spaceTitle: "Space, radius, stroke, motion",
    componentsTitle: "Components: few, but exact",
    contextTitle: "In context: the Odyssey sheet",
    contextSub: "The same system, in three columns — and the same thing that prints.",
    printTitle: "Print: A4 landscape, vector, black on white",
    guardrailsTitle: "Guardrails (anti-slop)",
    doTitle: "Do",
    dontTitle: "Don't",
    printBtn: "Print sheet",
    dialogBtn: "Open dialog",
    tooltipHint: "Compact tooltip",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Contrast helper (live AA badges in the palette section)            */
/* ------------------------------------------------------------------ */
function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------------------------------------------ */
/* Section shell                                                      */
/* ------------------------------------------------------------------ */
function Section({
  id,
  index,
  title,
  subtitle,
  children,
  hideOnPrint = true,
}: {
  id: string;
  index: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  hideOnPrint?: boolean;
}): React.JSX.Element {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-[var(--border-subtle)] pt-10",
        hideOnPrint && "print-hide",
      )}
    >
      <div className="flex items-baseline gap-3 mb-1">
        <span className="micro-label font-mono">{index}</span>
        <h2
          className="font-semibold text-[var(--ink-primary)]"
          style={{ fontSize: "var(--text-h1)", lineHeight: "var(--lh-heading)" }}
        >
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p
          className="text-[var(--ink-secondary)] measure mb-6"
          style={{ fontSize: "var(--text-ui)" }}
        >
          {subtitle}
        </p>
      ) : null}
      <div className="pt-4">{children}</div>
    </section>
  );
}

function SpecCard({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-2.5">
        <span className="micro-label font-mono">{title}</span>
        {note ? (
          <span className="text-[var(--ink-muted)] font-mono text-[11px]">{note}</span>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export function DesignSystemPage(): React.JSX.Element {
  const { locale, toggleLocale, direction } = useDirection();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const c = COPY[locale];
  const [dialogOpen, setDialogOpen] = useState(false);

  const lightTokens = [
    { name: "بوم / Canvas", token: "--bg-canvas", hex: "#F4F1EA" },
    { name: "سطح / Surface", token: "--bg-surface", hex: "#FBF9F4" },
    { name: "زیرین / Subtle", token: "--bg-subtle", hex: "#E9E4D8" },
    { name: "مرکب / Ink", token: "--ink-primary", hex: "#14161A" },
    { name: "مرکب ۲ / Secondary", token: "--ink-secondary", hex: "#4B4F57" },
    { name: "خط مویی / Rule", token: "--border-subtle", hex: "#DCD5C7" },
    { name: "مهر / Accent", token: "--accent", hex: "#B23A24" },
    { name: "مهرِ کم / Accent soft", token: "--accent-soft", hex: "#F6E2DA" },
    { name: "مثبت / Positive", token: "--signal-positive", hex: "#2C6E4E" },
    { name: "منفی / Negative", token: "--signal-negative", hex: "#A8382C" },
    { name: "کهربا / Amber", token: "--signal-amber", hex: "#8A5A10" },
    { name: "مسیر ۱ / Path 1", token: "--path-1", hex: "#2E5E8C" },
    { name: "مسیر ۲ / Path 2", token: "--path-2", hex: "#2F6B57" },
    { name: "مسیر ۳ / Path 3", token: "--path-3", hex: "#9C4F26" },
  ];

  const darkTokens = [
    { name: "بوم / Canvas", token: "--bg-canvas", hex: "#0C0E12" },
    { name: "سطح / Surface", token: "--bg-surface", hex: "#12151B" },
    { name: "زیرین / Subtle", token: "--bg-subtle", hex: "#1A1E26" },
    { name: "مرکب / Ink", token: "--ink-primary", hex: "#F2EFE7" },
    { name: "مرکب ۲ / Secondary", token: "--ink-secondary", hex: "#A2A8B3" },
    { name: "خط مویی / Rule", token: "--border-subtle", hex: "#232833" },
    { name: "مهر / Accent", token: "--accent", hex: "#E8705A" },
    { name: "مهرِ کم / Accent soft", token: "--accent-soft", hex: "#2A1A16" },
    { name: "مثبت / Positive", token: "--signal-positive", hex: "#62C79A" },
    { name: "منفی / Negative", token: "--signal-negative", hex: "#F08A7C" },
    { name: "کهربا / Amber", token: "--signal-amber", hex: "#E8B45C" },
    { name: "مسیر ۱ / Path 1", token: "--path-1", hex: "#7FA9D6" },
    { name: "مسیر ۲ / Path 2", token: "--path-2", hex: "#6FC2A6" },
    { name: "مسیر ۳ / Path 3", token: "--path-3", hex: "#E0A171" },
  ];

  const palette = resolvedTheme === "dark" ? darkTokens : lightTokens;
  const pageBg = resolvedTheme === "dark" ? "#0C0E12" : "#F4F1EA";

  const typeRows: Array<{
    role: string;
    token: string;
    size: string;
    weight: string;
    lh: string;
    text: string;
    latin: string;
  }> = [
    {
      role: "Display",
      token: "--text-display",
      size: "40px",
      weight: "700",
      lh: locale === "fa" ? "1.34" : "1.2",
      text: "زندگی، پروژهای برای طراحی",
      latin: "Life, designed.",
    },
    {
      role: "H1",
      token: "--text-h1",
      size: "28px",
      weight: "650",
      lh: locale === "fa" ? "1.45" : "1.3",
      text: "قطبنمای کار و زندگی",
      latin: "Building a compass",
    },
    {
      role: "H2",
      token: "--text-h2",
      size: "20px",
      weight: "600",
      lh: locale === "fa" ? "1.5" : "1.35",
      text: "برنامههای سهگانه ادیسه",
      latin: "Three Odyssey plans",
    },
    {
      role: "H3",
      token: "--text-h3",
      size: "16px",
      weight: "600",
      lh: locale === "fa" ? "1.6" : "1.45",
      text: "میزان انرژی و اشتیاق",
      latin: "Energy and engagement",
    },
    {
      role: "Body",
      token: "--text-body",
      size: "15px",
      weight: "400",
      lh: locale === "fa" ? "1.8" : "1.65",
      text: "کار برای شما چه معنایی دارد؟ چرا کار میکنید و چه چیزی به آن ارزش میبخشد؟",
      latin: "What does work mean to you, and what gives it worth?",
    },
    {
      role: "Editor",
      token: "--text-editor",
      size: "16px",
      weight: "400",
      lh: locale === "fa" ? "1.85" : "1.7",
      text: "دفترچه اوقات خوش: فعالیتی که انرژی روانی را شارژ میکند، نه فرسایش.",
      latin: "The Good Time Journal: notice what recharges you.",
    },
    {
      role: "UI / Meta",
      token: "--text-ui",
      size: "13px",
      weight: "500",
      lh: locale === "fa" ? "1.55" : "1.45",
      text: "ثبت وضعیت · ویرایش قطب نما · ذخیره",
      latin: "Save · Cancel · Edit",
    },
    {
      role: "Micro",
      token: "--text-micro",
      size: "11.5px",
      weight: "500",
      lh: locale === "fa" ? "1.5" : "1.4",
      text: "چرخه ۱ · فصل ۰۳ · ۱۲ دقیقه",
      latin: "CYCLE 01 · CH. 03 · 12 MIN",
    },
    {
      role: "Data",
      token: "--text-data",
      size: "13px",
      weight: "600",
      lh: "1.25",
      text: "۸۵٪  ·  ‎+۶۵  ·  ۰۳:۰۰",
      latin: "85% · +65 · 03:00",
    },
  ];

  const spaceSteps = [
    { n: 1, px: 4 },
    { n: 2, px: 8 },
    { n: 3, px: 12 },
    { n: 4, px: 16 },
    { n: 6, px: 24 },
    { n: 7, px: 32 },
    { n: 8, px: 40 },
    { n: 9, px: 48 },
    { n: 10, px: 64 },
    { n: 12, px: 96 },
  ];

  const principles =
    locale === "fa"
      ? [
          ["۰۱", "کاغذ، نه شیشه", "سطح را با تُن عوض میکنیم، نه با blur و شیشهمحوری."],
          ["۰۲", "یک مهر آجری", "حداکثر ۵٪ پیکسل صفحه؛ فقط برای قصد و اقدام."],
          ["۰۳", "خط مویی", "۱px کار میکند؛ ۲px یعنی «فعال». سایه فقط برای لایه شناور."],
          ["۰۴", "عددِ صادق", "همه اعداد tabular؛ تایمر و گیج نباید بلرزند."],
          ["۰۵", "حرکت کوتاه", "۹۰ / ۱۶۰ / ۲۴۰ میلیثانیه، یک منحنی، بدون فنریت."],
        ]
      : [
          [
            "01",
            "Paper, not glass",
            "Separate surfaces with tone, never with blur or glassmorphism.",
          ],
          ["02", "One ember stamp", "At most 5% of the screen. Reserved for intent and action."],
          ["03", "The hairline", "1px does the work; 2px means active. Shadows float only."],
          ["04", "Honest numbers", "Tabular everywhere, so timers and gauges never jitter."],
          ["05", "Short motion", "90 / 160 / 240ms, one curve, no springiness."],
        ];

  const dos =
    locale === "fa"
      ? [
          "یک رنگ accent در هر نمای صفحه",
          "جدا کردن بخشها با ۱px، نه با کارت روی کارت",
          "عدد با tabular-nums و ارقام فارسی در fa",
          "عرض خط خوانش حداکثر ۶۶ch در ادیتورها",
          "حلقه فوکوس ۲px روی هر عنصر تعاملی",
          "فاصله خطوط فارسی ۰٫۱۵ بیشتر از انگلیسی",
        ]
      : [
          "One accent colour per screen",
          "Separate blocks with 1px rules, not nested cards",
          "Tabular numerals, Persian digits in fa",
          "Reading measure capped at 66ch in editors",
          "A 2px focus ring on every interactive element",
          "Persian leading roughly +0.15 over Latin",
        ];

  const donts =
    locale === "fa"
      ? [
          "گرادیان، شیشه، درخشش نئونی",
          "سایههای چندلایه برای «عمق»",
          "شعاع بیشتر از ۶px روی کانتینر",
          "ایموجی در رابط کاربری",
          "آیکون داخل مربع رنگی کنار تیتر",
          "letter-spacing در RTL",
        ]
      : [
          "Gradients, glass, neon glow",
          "Layered shadow stacks for fake depth",
          "Radii above 6px on containers",
          "Emoji in product chrome",
          "Icons inside coloured squares next to titles",
          "Letter-spacing in RTL",
        ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--ink-primary)]">
      {/* Top bar */}
      <header className="print-hide sticky top-0 z-10 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]">
        <div className="page-shell flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid place-items-center border border-[var(--border-strong)] font-mono font-bold"
              style={{
                inlineSize: 28,
                blockSize: 28,
                borderRadius: "var(--radius-xs)",
                fontSize: 12,
              }}
            >
              Ω
            </span>
            <div className="leading-tight">
              <p className="font-semibold" style={{ fontSize: "var(--text-ui)" }}>
                Odyssey <span className="text-[var(--ink-muted)]">/ Atelier</span>
              </p>
              <p className="micro-label font-mono">{c.version}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="micro-label hidden sm:inline font-mono">
              {direction.toUpperCase()} · {theme}
            </span>
            <Button variant="ghost" size="sm" onClick={toggleLocale} className="font-mono">
              {locale === "fa" ? "EN" : "فا"}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{resolvedTheme === "dark" ? "Paper" : "Ink"}</span>
            </Button>
            <Button variant="accent" size="sm" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" />
              <span>{c.printBtn}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="page-shell py-10">
        <div className="lg:grid lg:grid-cols-[var(--rail)_1fr] lg:gap-12">
          {/* Rail */}
          <aside className="print-hide hidden lg:block">
            <div className="sticky top-24">
              <p className="micro-label font-mono mb-3">{c.rail}</p>
              <nav className="flex flex-col">
                {Object.entries(c.sections).map(([key, label], i) => (
                  <a
                    key={key}
                    href={`#ds-${key}`}
                    className="group flex items-center gap-3 border-b border-[var(--border-subtle)] py-2 text-[var(--ink-secondary)] transition-colors duration-[var(--dur-micro)] hover:text-[var(--ink-primary)]"
                    style={{ fontSize: "var(--text-ui)" }}
                  >
                    <span className="font-mono text-[11px] text-[var(--ink-muted)] group-hover:text-[var(--accent)]">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span>{label}</span>
                  </a>
                ))}
              </nav>
              <div className="mt-6 border border-[var(--border-subtle)] p-3 rounded-[var(--radius-md)]">
                <p className="micro-label font-mono mb-1">Estedad</p>
                <p
                  className="text-[var(--ink-secondary)]"
                  style={{ fontSize: "var(--text-micro)" }}
                >
                  OFL-1.1 · self-hosted
                  <br />
                  wght 100–900
                </p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0 space-y-14">
            {/* Cover */}
            <section id="ds-cover" className="scroll-mt-24 reg-mark print-hide">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <p className="micro-label font-mono mb-4">{c.kicker}</p>
                  <h1
                    className="font-bold text-[var(--ink-primary)]"
                    style={{
                      fontSize: "var(--text-display)",
                      lineHeight: "var(--lh-display)",
                      letterSpacing: "var(--tracking-display)",
                    }}
                  >
                    {c.hero}
                  </h1>
                  <p
                    className="mt-5 measure text-[var(--ink-secondary)]"
                    style={{ fontSize: "var(--text-body)" }}
                  >
                    {c.heroSub}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {c.meta.map((m) => (
                      <Badge key={m} variant="outline" className="font-mono">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
                  <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-4">
                    <span className="micro-label font-mono">Instrument / 01</span>
                    <span className="font-mono text-[11px] text-[var(--ink-muted)]">Ch. 01</span>
                  </div>
                  <div className="space-y-5">
                    <TactileGauge label="سلامت" value={72} signalColor="var(--signal-positive)" />
                    <TactileGauge label="کار و معنا" value={64} signalColor="var(--path-1)" />
                    <TactileGauge
                      label="بازی و فراغت"
                      value={38}
                      signalColor="var(--signal-amber)"
                    />
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                    <span className="micro-label font-mono">HWPL · 0–100</span>
                    <span className="font-mono text-[11px] text-[var(--ink-muted)] tabular-nums">
                      174 / 300
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <Section id="ds-principles" index="01" title={c.principlesTitle}>
              <div className="grid gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden sm:grid-cols-2 lg:grid-cols-5">
                {principles.map(([num, title, body]) => (
                  <div key={num} className="bg-[var(--bg-surface)] p-4">
                    <p className="font-mono text-[11px] text-[var(--accent)] mb-2">{num}</p>
                    <h3 className="font-semibold mb-1" style={{ fontSize: "var(--text-h3)" }}>
                      {title}
                    </h3>
                    <p
                      className="text-[var(--ink-secondary)]"
                      style={{ fontSize: "var(--text-ui)" }}
                    >
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="ds-color" index="02" title={c.colorTitle} subtitle={c.colorSub}>
              <div className="flex items-center justify-between mb-3">
                <span className="micro-label font-mono">{c.surfaces}</span>
                <span className="micro-label font-mono">{resolvedTheme} · contrast vs canvas</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {palette.map((t) => {
                  const ratio = contrast(t.hex, pageBg);
                  return (
                    <div
                      key={`${t.token}-${t.hex}`}
                      className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-surface)]"
                    >
                      <div
                        aria-hidden
                        className="h-14 border-b border-[var(--border-subtle)]"
                        style={{ backgroundColor: t.hex }}
                      />
                      <div className="p-2.5">
                        <p className="font-medium" style={{ fontSize: "var(--text-ui)" }}>
                          {t.name}
                        </p>
                        <p className="font-mono text-[10.5px] text-[var(--ink-muted)] mt-0.5">
                          {t.hex}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <code className="font-mono text-[10px] text-[var(--ink-secondary)]">
                            {t.token}
                          </code>
                          <span className="font-mono text-[10px] tabular-nums text-[var(--ink-muted)]">
                            {ratio.toFixed(1)}:1
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[var(--ink-muted)]" style={{ fontSize: "var(--text-micro)" }}>
                {locale === "fa"
                  ? "رنگ داده فقط برای معنا: مسیر ۱/۲/۳ برای سه زندگی، مثبت/منفی برای انرژی، کهربا برای غافلگیری و Flow."
                  : "Data hues carry meaning only: paths 1–3 for the three lives, positive/negative for energy, amber for surprise and flow."}
              </p>
            </Section>

            <Section id="ds-type" index="03" title={c.typeTitle} subtitle={c.typeSub}>
              <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] overflow-hidden">
                {typeRows.map((row, i) => (
                  <div
                    key={row.role}
                    className={cn(
                      "grid gap-2 sm:grid-cols-[8rem_1fr_10rem] sm:items-baseline p-4",
                      i > 0 && "border-t border-[var(--border-subtle)]",
                      i % 2 === 1 && "bg-[var(--bg-surface)]",
                    )}
                  >
                    <div>
                      <p className="font-mono text-[11px] text-[var(--ink-primary)]">{row.role}</p>
                      <p className="font-mono text-[10px] text-[var(--ink-muted)]">
                        {row.size} · {row.weight}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-[var(--ink-primary)]"
                        style={{
                          fontSize: `var(${row.token})`,
                          fontWeight: Number(row.weight),
                          lineHeight: row.lh,
                          letterSpacing:
                            row.role === "Micro" && locale === "en"
                              ? "var(--tracking-micro)"
                              : row.role === "Display" || row.role === "H1"
                                ? "var(--tracking-display)"
                                : undefined,
                          textTransform:
                            row.role === "Micro" && locale === "en" ? "uppercase" : undefined,
                          maxWidth:
                            row.role === "Body" || row.role === "Editor" ? "66ch" : undefined,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {locale === "fa" ? row.text : row.latin}
                      </p>
                    </div>
                    <div className="font-mono text-[10px] text-[var(--ink-muted)] sm:text-end">
                      <p>{row.token}</p>
                      <p>lh {row.lh}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="ds-space" index="04" title={c.spaceTitle}>
              <div className="grid gap-4 lg:grid-cols-2">
                <SpecCard title="Spacing · 4px grid">
                  <div className="space-y-2">
                    {spaceSteps.map((s) => (
                      <div key={s.n} className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[var(--ink-muted)] w-10 tabular-nums">
                          {s.px}
                        </span>
                        <span
                          className="block h-2 bg-[var(--bg-inverted)]"
                          style={{ inlineSize: s.px, borderRadius: "var(--radius-xs)" }}
                        />
                        <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                          --space-{s.n}
                        </span>
                      </div>
                    ))}
                  </div>
                </SpecCard>

                <div className="space-y-4">
                  <SpecCard title="Radius · max 6px">
                    <div className="flex flex-wrap gap-3">
                      {[
                        ["0", "var(--radius-none)"],
                        ["2", "var(--radius-xs)"],
                        ["3", "var(--radius-sm)"],
                        ["6", "var(--radius-md)"],
                      ].map(([label, radius]) => (
                        <div key={label} className="text-center">
                          <div
                            className="border border-[var(--border-strong)] bg-[var(--bg-subtle)]"
                            style={{
                              inlineSize: 56,
                              blockSize: 40,
                              borderRadius: radius,
                            }}
                          />
                          <p className="font-mono text-[10px] text-[var(--ink-muted)] mt-1">
                            {label}px
                          </p>
                        </div>
                      ))}
                    </div>
                  </SpecCard>

                  <SpecCard title="Stroke & focus">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="h-px w-12 bg-[var(--border-strong)]" />
                        <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                          1px hairline
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-0.5 w-12 bg-[var(--ink-primary)]" />
                        <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                          2px active
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block h-6 w-12 rounded-[var(--radius-xs)]"
                          style={{
                            outline: "var(--focus-width) solid var(--ring)",
                            outlineOffset: "var(--focus-offset)",
                          }}
                        />
                        <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                          2px focus ring
                        </span>
                      </div>
                    </div>
                  </SpecCard>

                  <SpecCard title="Motion · one curve">
                    <div className="space-y-2">
                      {[
                        ["micro", "90ms"],
                        ["panel", "160ms"],
                        ["ritual", "240ms"],
                      ].map(([name, ms]) => (
                        <div key={name} className="flex items-center gap-3">
                          <span className="font-mono text-[10px] text-[var(--ink-muted)] w-10">
                            {ms}
                          </span>
                          <span
                            className="block h-2 bg-[var(--accent)]"
                            style={{
                              inlineSize: ms === "90ms" ? 18 : ms === "160ms" ? 32 : 48,
                              borderRadius: "var(--radius-xs)",
                            }}
                          />
                          <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                            --dur-{name}
                          </span>
                        </div>
                      ))}
                      <p className="font-mono text-[10px] text-[var(--ink-muted)] pt-1">
                        cubic-bezier(0.2, 0, 0, 1)
                      </p>
                    </div>
                  </SpecCard>
                </div>
              </div>
            </Section>

            <Section id="ds-components" index="05" title={c.componentsTitle}>
              <div className="grid gap-4 lg:grid-cols-2">
                <SpecCard title="Actions" note="28 / 36 / 44">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="primary" size="md">
                      ذخیره چرخه
                    </Button>
                    <Button variant="accent" size="md">
                      <Plus className="h-3.5 w-3.5" />
                      ساخت مسیر
                    </Button>
                    <Button variant="outline" size="md">
                      Edit
                    </Button>
                    <Button variant="secondary" size="md">
                      Duplicate
                    </Button>
                    <Button variant="ghost" size="md">
                      Cancel
                    </Button>
                    <Button variant="destructive" size="md">
                      Archive
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="md" disabled>
                      Disabled
                    </Button>
                    <Button size="md" variant="outline" aria-label="Reset">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </SpecCard>

                <SpecCard title="Fields" note="1px · 2px focus">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="ds-title" className="micro-label font-mono block">
                        عنوان ششکلمهای
                      </label>
                      <Input id="ds-title" defaultValue="زیستن آرام و پژوهش فلسفه" />
                      <p
                        className="text-[var(--ink-muted)]"
                        style={{ fontSize: "var(--text-micro)" }}
                      >
                        ۶ / ۶ کلمه
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="ds-error" className="micro-label font-mono block">
                        خطا
                      </label>
                      <Input id="ds-error" error defaultValue="بیش از شش کلمه" />
                      <p
                        className="text-[var(--signal-negative)]"
                        style={{ fontSize: "var(--text-micro)" }}
                      >
                        عنوان نباید از ۶ کلمه بیشتر شود.
                      </p>
                    </div>
                    <Textarea
                      defaultValue="کار برای شما چه معنایی دارد؟ کمی بنویسید، نه برای کسی، برای خودتان."
                      className="min-h-[72px]"
                    />
                  </div>
                </SpecCard>

                <SpecCard title="Stamps" note="micro label · 1px">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Draft</Badge>
                    <Badge variant="positive">Growth</Badge>
                    <Badge variant="negative">Conflict</Badge>
                    <Badge variant="amber">Surprise</Badge>
                    <Badge variant="neutral">Gravity</Badge>
                    <Badge
                      variant="outline"
                      className="text-[var(--accent)] border-[var(--accent)]"
                    >
                      Accent
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="micro-label font-mono">[ Reframing ]</span>
                    <CompactTooltip content="مسئلهی لنگرشده را به پرسش باز تبدیل کنید.">
                      <button
                        type="button"
                        className="inline-flex items-center text-[var(--ink-muted)] hover:text-[var(--ink-primary)]"
                        aria-label="Reframing hint"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </CompactTooltip>
                    <span
                      className="text-[var(--ink-muted)]"
                      style={{ fontSize: "var(--text-micro)" }}
                    >
                      {c.tooltipHint}
                    </span>
                  </div>
                </SpecCard>

                <SpecCard title="Calibrated meters" note="0–100 / −100..+100">
                  <div className="space-y-4">
                    <TactileGauge label="Resources" value={68} signalColor="var(--path-1)" />
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--ink-secondary)] text-[11px]">
                          Energy
                        </span>
                        <span className="font-mono text-[11px] text-[var(--signal-positive)] tabular-nums">
                          +45
                        </span>
                      </div>
                      <div className="relative h-6 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
                        <span className="absolute inset-y-0 start-1/2 w-px bg-[var(--border-strong)] opacity-40" />
                        <span
                          className="absolute top-0 bottom-0 w-0.5 bg-[var(--signal-positive)]"
                          style={{ insetInlineStart: "72.5%" }}
                        />
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-[var(--ink-muted)]">
                        <span>−100 drain</span>
                        <span>0</span>
                        <span>+100 fuel</span>
                      </div>
                    </div>
                  </div>
                </SpecCard>

                <SpecCard title="Segmented control" note="2px active rule">
                  <div className="flex items-center gap-1 border-b border-[var(--border-subtle)]">
                    {["Log", "Reflect", "AEIOU"].map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        className={cn(
                          "relative px-3 py-2 font-mono text-[11px] transition-colors duration-[var(--dur-micro)]",
                          i === 1
                            ? "text-[var(--ink-primary)]"
                            : "text-[var(--ink-muted)] hover:text-[var(--ink-primary)]",
                        )}
                      >
                        {label}
                        {i === 1 ? (
                          <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--accent)]" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="micro-label font-mono">Shortcuts</span>
                    {["Tab", "Enter", "⌘K"].map((k) => (
                      <kbd
                        key={k}
                        className="rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--ink-secondary)]"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </SpecCard>

                <SpecCard title="Data table" note="40px rows">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-strong)]">
                        <th className="micro-label font-mono text-start py-2">Activity</th>
                        <th className="micro-label font-mono text-end py-2">Engage</th>
                        <th className="micro-label font-mono text-end py-2">Energy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["معماری ماژولهای محلی", "90", "+85"],
                        ["ایمیلهای اداری تکراری", "15", "−60"],
                        ["مطالعه و یادداشتبرداری", "72", "+30"],
                      ].map(([name, engage, energy], i) => (
                        <tr
                          key={name}
                          className={cn(
                            "border-b border-[var(--border-subtle)]",
                            i === 2 && "border-b-0",
                          )}
                        >
                          <td className="py-2.5" style={{ fontSize: "var(--text-ui)" }}>
                            {name}
                          </td>
                          <td
                            className="py-2.5 text-end font-mono tabular-nums"
                            style={{ fontSize: "var(--text-ui)" }}
                          >
                            {engage}%
                          </td>
                          <td
                            className={cn(
                              "py-2.5 text-end font-mono tabular-nums",
                              (energy ?? "").startsWith("−")
                                ? "text-[var(--signal-negative)]"
                                : "text-[var(--signal-positive)]",
                            )}
                            style={{ fontSize: "var(--text-ui)" }}
                          >
                            {energy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </SpecCard>

                <SpecCard title="Sheet anatomy" note="header rule · footer meta">
                  <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-3 py-2">
                      <span className="micro-label font-mono">Life 02</span>
                      <span className="font-mono text-[10px] text-[var(--ink-muted)]">Path 2</span>
                    </div>
                    <div className="p-3">
                      <p className="font-semibold" style={{ fontSize: "var(--text-h3)" }}>
                        تدریس و استودیوی مستقل طراحی ابزار
                      </p>
                      <p
                        className="mt-1 text-[var(--ink-secondary)]"
                        style={{ fontSize: "var(--text-ui)" }}
                      >
                        پنج سال، سه پرسش، چهار سنجه.
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-3 py-2">
                      <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                        3 inquiries
                      </span>
                      <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                        4 gauges
                      </span>
                    </div>
                  </div>
                </SpecCard>

                <SpecCard title="Overlays & empty states" note="floating only">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="md" onClick={() => setDialogOpen(true)}>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {c.dialogBtn}
                    </Button>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--ink-muted)]">
                      <Command className="h-3 w-3" /> K
                    </span>
                  </div>
                  <div className="mt-4 grid place-items-center rounded-[var(--radius-md)] border border-dashed border-[var(--border-subtle)] px-4 py-8 text-center">
                    <Lock className="h-4 w-4 text-[var(--ink-muted)] mb-2" />
                    <p
                      className="text-[var(--ink-secondary)]"
                      style={{ fontSize: "var(--text-ui)" }}
                    >
                      هنوز چیزی اینجا نیست.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Plus className="h-3.5 w-3.5" />
                      افزودن اولین مورد
                    </Button>
                  </div>
                </SpecCard>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>ثبت بازخورد ارائه</DialogTitle>
                    <DialogDescription>
                      دو فیلد جدا: آنچه دیگران دیدند، و آنچه شما در بدن خود حس کردید.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="نقاط کور و سؤالات شنوندگان" />
                    <Textarea
                      placeholder="انرژی درونی شما هنگام توضیح این مسیر"
                      className="min-h-[80px]"
                    />
                  </div>
                  <DialogFooter className="mt-5">
                    <Button variant="ghost" size="md" onClick={() => setDialogOpen(false)}>
                      <X className="h-3.5 w-3.5" />
                      بستن
                    </Button>
                    <Button variant="accent" size="md" onClick={() => setDialogOpen(false)}>
                      <Check className="h-3.5 w-3.5" />
                      ثبت
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Section>

            {/* In-context sheet (print target) */}
            <Section
              id="ds-context"
              index="06"
              title={c.contextTitle}
              subtitle={c.contextSub}
              hideOnPrint={false}
            >
              <div className="flex items-center justify-between mb-3 print-hide">
                <span className="micro-label font-mono">Odyssey sheet · 3 × 5y</span>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="h-3.5 w-3.5" />
                  {c.printBtn}
                </Button>
              </div>

              <div className="print-sheet rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
                <div className="flex items-center justify-between border-b border-[var(--border-strong)] pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span className="font-semibold" style={{ fontSize: "var(--text-ui)" }}>
                      Odyssey — Odyssey Sheet
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                    Cycle 01 · 1404/09/01
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      slot: "Life 01",
                      color: "var(--path-1)",
                      title: "توسعه معماری سیستم و رهبری مهندسی",
                      gauges: [85, 80, 90, 95],
                    },
                    {
                      slot: "Life 02",
                      color: "var(--path-2)",
                      title: "تدریس و استودیوی مستقل طراحی ابزار",
                      gauges: [60, 90, 70, 85],
                    },
                    {
                      slot: "Life 03",
                      color: "var(--path-3)",
                      title: "زیست آرام و پژوهش فلسفه تاریخ",
                      gauges: [40, 95, 60, 95],
                    },
                  ].map((plan) => (
                    <div
                      key={plan.slot}
                      className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
                      style={{ borderBlockStart: `2px solid ${plan.color}` }}
                    >
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="micro-label font-mono">{plan.slot}</span>
                          <span className="font-mono text-[10px] text-[var(--ink-muted)]">5y</span>
                        </div>
                        <p className="mt-2 font-semibold" style={{ fontSize: "var(--text-h3)" }}>
                          {plan.title}
                        </p>
                        <div className="mt-3 space-y-1.5">
                          {["Resources", "Likability", "Confidence", "Coherence"].map(
                            (label, i) => (
                              <div key={label} className="flex items-center gap-2">
                                <span className="w-20 font-mono text-[9.5px] text-[var(--ink-muted)]">
                                  {label}
                                </span>
                                <span className="relative h-1.5 flex-1 bg-[var(--bg-subtle)]">
                                  <span
                                    className="absolute inset-y-0 start-0"
                                    style={{
                                      inlineSize: `${plan.gauges[i] ?? 0}%`,
                                      backgroundColor: plan.color,
                                    }}
                                  />
                                </span>
                                <span className="w-7 text-end font-mono text-[9.5px] tabular-nums text-[var(--ink-secondary)]">
                                  {plan.gauges[i]}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="mt-3 border-t border-[var(--border-subtle)] pt-2 space-y-1">
                          {[1, 2, 3].map((q) => (
                            <div key={q} className="flex items-start gap-2">
                              <span className="font-mono text-[9px] text-[var(--ink-muted)]">
                                Q0{q}
                              </span>
                              <span
                                className="h-px flex-1 bg-[var(--border-subtle)]"
                                style={{ marginBlockStart: 7 }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-2">
                  <span className="font-mono text-[9.5px] text-[var(--ink-muted)]">
                    3 paths · 4 gauges · 3 inquiries each
                  </span>
                  <span className="font-mono text-[9.5px] text-[var(--ink-muted)]">
                    odyssey.local · v2.0
                  </span>
                </div>
              </div>
            </Section>

            <Section id="ds-print" index="07" title={c.printTitle}>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["@page", "A4 landscape · 12mm"],
                  ["Rules", "0.75pt solid #111317"],
                  ["Ink", "#111317 on #FFFFFF"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
                  >
                    <p className="micro-label font-mono mb-1">{k}</p>
                    <p className="font-mono" style={{ fontSize: "var(--text-ui)" }}>
                      {v}
                    </p>
                  </div>
                ))}
              </div>
              <p
                className="mt-3 text-[var(--ink-muted)] measure"
                style={{ fontSize: "var(--text-micro)" }}
              >
                {locale === "fa"
                  ? "تمام سایهها در چاپ حذف میشوند، تم به سفید خالص سوئیچ میکند و فونت Estedad بهصورت وکتور در PDF تعبیه میشود."
                  : "Shadows are stripped in print, the theme switches to pure white, and Estedad is embedded as vector in the exported PDF."}
              </p>
            </Section>

            <Section id="ds-guardrails" index="08" title={c.guardrailsTitle}>
              <div className="grid gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden sm:grid-cols-2">
                <div className="bg-[var(--bg-surface)] p-4">
                  <p className="micro-label font-mono mb-3 text-[var(--signal-positive)]">
                    {c.doTitle}
                  </p>
                  <ul className="space-y-2">
                    {dos.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2"
                        style={{ fontSize: "var(--text-ui)" }}
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--signal-positive)]" />
                        <span className="text-[var(--ink-secondary)]">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[var(--bg-surface)] p-4">
                  <p className="micro-label font-mono mb-3 text-[var(--signal-negative)]">
                    {c.dontTitle}
                  </p>
                  <ul className="space-y-2">
                    {donts.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2"
                        style={{ fontSize: "var(--text-ui)" }}
                      >
                        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--signal-negative)]" />
                        <span className="text-[var(--ink-secondary)]">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>

            <footer className="print-hide border-t border-[var(--border-subtle)] pt-4 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                Odyssey · Atelier 2.0 · Estedad Variable · OFL-1.1
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Download className="h-3.5 w-3.5" />
                top
              </Button>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
