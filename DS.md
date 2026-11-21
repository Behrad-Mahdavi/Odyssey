# DESIGN_SYSTEM.md — Odyssey Visual & Interaction Specification
**Version:** 1.0.0
**Aesthetic Direction:** Classical Engraving × Precision Archival Drafting Studio
**Primary Typeface:** Estedad Variable (Self-Hosted WOFF2 — Persian & Latin)
**Layout Engine:** 100% CSS Logical Properties (Native `fa-IR` RTL & `en-US` LTR)

---

## 1. Visual Identity & Anti-AI-Slop Constitution

Odyssey یک ابزار تفکر عمیق است، نه یک داشبورد SaaS پرزرق‌وبرق. تمام کامپوننت‌های `@odyssey/ui` و صفحات `apps/web` باید این قواعد را به‌صورت غیرقابل‌تخطی رعایت کنند:

### قوانین ممنوعه (Strict Bans — Zero AI Slop)
1. **NO Gradients:** استفاده از `bg-gradient-*` روی دکمه‌ها، کارت‌ها، تیترها و پس‌زمینه‌ها ممنوع است (تنها استثنا: نوار طیفی انرژی در مقیاس `-100..+100` در صورت نیاز داده).
2. **NO Heavy Drop Shadows:** استفاده از `shadow-md`, `shadow-lg`, `shadow-xl` برای جدا کردن کارت‌ها ممنوع است. تفکیک سطوح صرفاً با **خطوط مرزی `1px`** (`border-border-subtle` / `border-border-strong`) و **تغییر تُن پس‌زمینه** انجام می‌شود. سایه ملایم تنها برای لایه‌های شناور (`Popover`, `Tooltip`, `Command Palette`) مجاز است.
3. **NO Pill Soup / Over-Rounding:** شعاع انحنای حداکثری برای کانتینرها `6px` (`--radius-md`) و برای دکمه‌ها/ورودی‌ها `4px` (`--radius-sm`) است. استفاده از `rounded-2xl` یا `rounded-3xl` در کل پروژه ممنوع است.
4. **NO Decorative Icon Boxes:** قرار دادن آیکون درون مربع رنگی کنار تیتر کارت‌ها ممنوع است.
5. **NO Subtext Walls:** زیر تیتر بخش‌ها حداکثر یک خط بسیار کوتاه (یا صفر خط + یک آیکون `Info` متصل به `Compact Tooltip`) مجاز است.
6. **NO Emojis in UI Chrome:** استفاده از ایموجی به جای آیکون یا وضعیت در رابط کاربری ممنوع است (تنها کاربر مجاز است درون متن‌های شخصی خود ایموجی تایپ کند).
7. **NO External Font CDNs:** فونت‌ها ۱۰۰٪ Self-Hosted از `packages/ui/src/fonts/` لود می‌شوند.

---

## 2. Color System (90% Ink & Paper / 10% Instrument Signals)

پالت رنگی Odyssey در دو تم هم‌تراز طراحی شده است:
- **Light Mode (پیش‌فرض برای نوشتن و چاپ — "Archival Paper"):** کاغذ گرمِ ماتِ بسیار روشن با مرکب ذغالی عمیق (کنتراست بالای 14:1 بدون زنندگی سفیدِ خالص `#FFFFFF`).
- **Dark Mode (تم حکاکی مسی — "Copperplate Void"):** پس‌زمینه مشکی-سرمه‌ای بسیار عمیقِ سالید (هماهنگ با لوگوی ادیسه) و خطوط روشنِ تیز.

### 2.1 Neutral Surface & Ink Tokens
| Token | Light Mode (Archival Paper) | Dark Mode (Copperplate Void) | کاربرد دقیق |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F6F5F0` | `#090B0E` | پس‌زمینه اصلی صفحه (هم‌رنگ بک‌گراند سالید لوگو در دارک‌مود) |
| `--bg-surface` | `#FCFBF8` | `#101318` | سطح کارت‌ها، ادیتورها و پنل‌های اصلی |
| `--bg-subtle` | `#ECEAE2` | `#171B22` | سطوح ثانویه، هدر جدول‌ها، Hover آیتم‌ها، اسلات‌های خالی |
| `--bg-inverted` | `#111317` | `#F3F2EC` | دکمه‌های Primary، تولتیپ‌های فشرده، حالت Pitch Mode |
| `--ink-primary` | `#111317` | `#F3F2EC` | تیترها، متن اصلی، خطوط حکاکی فعال |
| `--ink-secondary` | `#4A4D52` | `#9CA3AF` | لیبل‌ها، متادیتا، توضیحات کوتاه |
| `--ink-muted` | `#7A7D82` | `#636973` | Placeholder، شمارشگر کلمات، تاریخ‌های آرشیوی |
| `--border-subtle` | `#DFDDD4` | `#222730` | خطوط شبکه ۱ پیکسلی (Hairlines) و جداکننده‌های نرم |
| `--border-strong` | `#111317` | `#454D5B` | کادر فعال (Focus)، قاب‌های تحریریه‌ای، خطوط چاپ |

### 2.2 Semantic & Domain Instrument Tokens
رنگ‌های معنایی کم‌اشباع (Muted Editorial Pigments) انتخاب شده‌اند تا روی کاغذ و مشکی مثل مرکب مهندسی بنشینند، نه چراغ نئون:

| دامنه / وضعیت | Token | Light Mode | Dark Mode | کاربرد در Odyssey |
| :--- | :--- | :--- | :--- | :--- |
| **انرژی مثبت / رشد** | `--signal-positive` | `#1D6B4B` | `#3EB483` | انرژی مثبت ژورنال (`+Energy`)، سطل `GROWTH_OPPORTUNITY` |
| **انرژی منفی / تضاد** | `--signal-negative` | `#A63228` | `#E06358` | انرژی تخلیه‌کننده (`-Energy`)، تضاد قطب‌نما، خطای Invariant |
| **غافلگیری / Flow** | `--signal-amber` | `#9E6312` | `#E0A442` | برچسب `SURPRISE` فصل ۳، فلگ `Flow`، هشدار ۶ کلمه |
| **مسیر ۱ (Life 1)** | `--path-1` | `#1F4E78` | `#5B9BD5` | خط تایم‌لاین و برچسب مسیر اول ادیسه (آبی نقشه‌کشی / Blueprint) |
| **مسیر ۲ (Life 2)** | `--path-2` | `#2E6B5E` | `#4FB09B` | خط تایم‌لاین و برچسب مسیر دوم ادیسه (سبز وِریدیان) |
| **مسیر ۳ (Wild Card)** | `--path-3` | `#8C4A27` | `#D9885B` | خط تایم‌لاین و برچسب مسیر سوم ادیسه (اُکر سوخته / مس) |
| **مسئله گرانشی** | `--gravity-muted` | `#6B6E75` | `#525864` | مسائل پذیرفته‌شده `GRAVITY` و گزینه‌های `LET_GO_ARCHIVED` |

---

## 3. Typography System — Estedad Variable

### 3.1 Font Loading & Pairing
- **Primary Sans (`--font-sans`):** `Estedad` (Variable `wght: 100..900`) — بارگذاری محلی از `@odyssey/ui/fonts/Estedad-Variable.woff2` با `font-display: swap`. پوشش یکپارچه فارسی و انگلیسی.
- **Technical Mono (`--font-mono`):** `JetBrains Mono` (Self-Hosted WOFF2) برای UUIDها، کلیدهای میانبر (`Tab` / `Enter`)، کدهای چرخه (`C-01`)، و اعداد فنی در انگلیسی؛ در حالت فارسی برای اعداد گیج‌ها و تایمر، `Estedad` با `font-variant-numeric: tabular-nums` و ویژگی `ss01` (اعداد فارسی) اعمال می‌شود.

### 3.2 Bilingual Type Rules (قواعد حیاتی فارسی در برابر انگلیسی)
- **Zero Letter-Spacing in RTL:** در حالت `[dir="rtl"]` مقدار `letter-spacing` روی تمام سطوح تایپوگرافی اکیداً `0` است. مقادیر منفی یا مثبت (`tracking-tight` / `tracking-wider`) تنها در `[dir="ltr"]` اعمال می‌شوند.
- **Line-Height Calibration:** در فارسی به دلیل ارتفاع دندانه‌ها و حروفی مثل «گ/ک/ل/ی»، فاصله خطوط نسبت به انگلیسی `+0.15` بیشتر تعریف می‌شود.
- **Measure (عرض خط خوانش):** در ادیتورهای `Workview`، `Lifeview` و ژورنال، حداکثر عرض خط روی `62ch` تا `68ch` قفل می‌شود تا چشم هنگام نوشتن عمیق خسته نشود.
- **ZWNJ & Numerals:** در کل سیستم، اعداد درون گیج‌ها، تایمر Mind Map و شمارشگرها باید `tabular-nums` باشند تا هنگام تغییر لحظه‌ای (مثل تیک زدن تایمر ۵ دقیقه‌ای) عرض متن لرزش (Layout Jitter) نداشته باشد.

### 3.3 Type Scale
| نقش (Role) | Size | Weight | Line-Height (`fa` / `en`) | کاربرد |
| :--- | :--- | :--- | :--- | :--- |
| `display` | `2rem` (32px) | `700` | `1.35` / `1.15` | تیتر Onboarding، عنوان صفحه Pitch Mode |
| `h1` | `1.5rem` (24px) | `650` | `1.4` / `1.2` | عنوان اصلی هر فصل / ماژول |
| `h2` | `1.125rem` (18px) | `600` | `1.5` / `1.3` | عنوان ۶ کلمه‌ای مسیر ادیسه، هدر بخش‌ها |
| `h3` | `0.9375rem` (15px) | `600` | `1.55` / `1.35` | تیتر کارت‌ها، نام گیج‌ها، سرفصل AEIOU |
| `body` | `0.9375rem` (15px) | `400` | `1.75` / `1.6` | متن ادیتور Workview/Lifeview و یادداشت‌ها |
| `ui` | `0.8125rem` (13px) | `500` | `1.5` / `1.4` | دکمه‌ها، آیتم‌های منو، برچسب ورودی‌ها |
| `micro` | `0.75rem` (12px) | `500` | `1.45` / `1.3` | تولتیپ فشرده، تاریخ، شمارشگر، تگ ۵ ذهنیت |
| `data` | `0.875rem` (14px) | `600` | `1.2` / `1.2` | مقدار عددی گیج‌ها، تایمر، مختصات نمودار (`tabular-nums`) |

---

## 4. Spacing, Layout Grid & Editorial Collage Framing

### 4.1 Spatial Grid
- **واحد پایه:** `4px` (مقیاس مجاز: `4, 8, 12, 16, 20, 24, 32, 48, 64`).
- **شعاع انحنا (Radius):**
  - `--radius-none: 0px` (خطوط جدول، صفحات چاپ، کادرهای حکاکی)
  - `--radius-sm: 4px` (دکمه‌ها، Inputها، Tagها، Badgeها)
  - `--radius-md: 6px` (کارت‌ها، دیالوگ‌ها، پنل‌ها)
- **ضخامت خطوط (Strokes):** استاندارد `1px`؛ خط تأکید (Active Tab / Focus / Print Header) دقیقاً `2px`.

### 4.2 Editorial Collage Framing Rule
استفاده از تصاویر حکاکی کلاسیک (لوگو، نیم‌رخ ادیسه، خطوط شعاعی قطب‌نما) تابع قانون سخت‌گیرانه **«قاب در برابر محیط کار»** است:
- **مناطق مجاز برای بافت/حکاکی (High-Contrast Monochrome Zones):**
  1. صفحه قفل **Zero-Knowledge Vault** (پس‌زمینه مشکی سالید `#090B0E` با نشان حکاکی در مرکز و فرم Passphrase به شکل قاب کاغذی تیز).
  2. جریان **Onboarding** (معرفی ۵ ذهنیت).
  3. **Empty States** (تک‌خطی و بسیار کم‌کنتراست با Opacity `15%–25%` تا صفحه خالی سرد نباشد).
  4. سربرگ نسخه چاپی **Odyssey Pitch Sheet** (آیکون SVG وکتور تک‌رنگ).
- **مناطق ممنوعه:** پشت ادیتورهای متنی، زیر نمودار فصل ۳ و داخل بوم Mind Map هرگز بافت یا تصویر پس‌زمینه قرار نمی‌گیرد.

---

## 5. Signature Component Specifications (مکانیک بصری ابزارهای Odyssey)

### 5.1 Tactile Instrument Gauge (HWPL & Odyssey 4 Gauges)
- به‌جای Progress Bar گرد و کلیشه‌ای، گیج‌ها شبیه **درجه‌سنج خط‌کشی مهندسی (Calibrated Meter)** طراحی می‌شوند: نوار خطی با خط‌کش مدرج (`0`, `25`, `50`, `75`, `100`)، دستگیره دقیق عمودی، مقدار عددی `tabular-nums` در سمت `end` و کنترل کامل با کلیدهای جهت‌دار کیبورد.
- در فصل ۵، هر ۴ گیج دقیقاً با کلیدهای `Resources`، `Likability`، `Confidence` و `Coherence` و در کنار هم با ارتفاع فشرده نمایش داده می‌شوند تا هر ۳ مسیر بدون اسکرول قابل مقایسه باشند.

### 5.2 Compact Contextual Tooltips & Mindset Badges
- هر ماژول یک برچسب بسیار ظریف (`micro`) برای ذهنیت فعال خود دارد (مثلاً `[ بازچارچوب‌بندی ]`). با هاور یا فوکوس روی آن، یک **تولتیپ فشرده** (حداکثر ۲ خط، پس‌زمینه `--bg-inverted` و حداکثر عرض `260px`) دلیل متدولوژیک آن بخش را توضیح می‌دهد. هیچ بنر راهنمای بزرگ و مزاحمی وسط صفحه قرار نمی‌گیرد.

### 5.3 Gravity vs. Designable Board (Chapter 1)
- دو ستون با خط جداکننده `1px`. هنگام تغییر وضعیت یک مسئله به `GRAVITY`، کارت با انیمیشن `200ms` آرام کم‌رنگ شده و به ستون «واقعیت‌های پذیرفته‌شده» (با خط‌خوردگی ظریف و رنگ `--gravity-muted`) منتقل می‌شود.

### 5.4 Keyboard-First Mind Map & Outer Ring Mash-up (Chapter 4)
- گره‌ها (Nodes) مستطیل‌های تمیز با کادر `1px` و بدون سایه هستند؛ خطوط اتصال (Edges) منحنی‌های دقیقِ تمیز `1.5px`.
- در بالای بوم، یک **تایمر خطی و عددی دقیق** (`03:00` تا `05:00`) و راهنمای تک‌خطی میانبرها (`Tab` فرزند · `Enter` هم‌سطح) ثابت است.
- **حالت Mash-up:** به محض ورود به فاز Mash-up، تمام گره‌های غیربرگ و یال‌ها به `opacity: 0.18` و `pointer-events: none` می‌روند و صرفاً **حلقه بیرونی (Leaf Nodes)** با کادر تیز برجسته می‌شوند تا کاربر دقیقاً ۳ گره انتخاب کند (شمارنده `0/3` → `3/3`).

### 5.5 3-Column Odyssey Canvas & Pitch/Print Mode (Chapter 5)
- نمای دسکتاپ: **۳ ستون مساوی (`grid-cols-3`)** جداشده با Hairline عمودی `1px` و نوار رنگی بالای هر ستون (`2px` با `--path-1`, `--path-2`, `--path-3`).
- شمارشگر **عنوان ۶ کلمه‌ای**: نمایشگر `4/6` (در حالت عادی `--ink-muted`، در `> 6` تبدیل به `--signal-negative` هنگام Finalize).
- زیر هر یک از ۳ اسلات سؤال کلیدی، یک دکمه متنی مینیمال (`+ پروتوتایپ`) قرار دارد که بدون شلوغی، پل مستقیم به فصل ۶ است.

### 5.6 Hard-Locked 5-Slot Decision Room (Chapter 9)
- در مرحله `Narrowing`، رابط کاربری دقیقاً **۵ اسلات شماره‌گذاری‌شده (`01` تا `05`)** با کادر خط‌چین نشان می‌دهد تا محدودیت شناختی (`INV-06`) به‌صورت فیزیکی دیده شود.
- دکمه **`Commit & Let Go`** یک اقدام آیینی با دیالوگ تأیید کوتاه است؛ پس از تأیید، گزینه‌های دیگر با افکت محو شدن آرام به بخش آرشیو فقط‌خواندنی (با آیکون قفل) می‌روند.

### 5.7 Three Failure Buckets (Chapter 10)
- سه ستون با رفتار بصری متمایز:
  - `SCREWUP`: اکشن یک‌کلیکی «پذیرفتم و رد شدم» → محو شدن سریع از صفحه.
  - `WEAKNESS`: باز شدن یک خط ورودی «اصلاح محیط/سیستم».
  - `GROWTH_OPPORTUNITY`: کارت ساختاریافته با نشانگر وضعیت قفل تا تکمیل هر دو فیلد عامل بحرانی و اقدام بعدی (`INV-08`).

---

## 6. Motion & Micro-Interaction Rules
- **منحنی استاندارد:** `cubic-bezier(0.2, 0, 0, 1)` (دقیق، بدون فنریت اضافی).
- **زمان‌بندی:**
  - تعاملات فوری (Hover/Focus/Toggle): `120ms`
  - گذار پنل‌ها و تولتیپ‌ها: `180ms`
  - آیین‌های متدولوژی (Gravity Archive، Mash-up Dimming، Commit & Let Go): `280ms`
- **الزام دسترسی‌پذیری:** تمام انیمیشن‌ها در `@media (prefers-reduced-motion: reduce)` به `0ms` یا Fade ساده تقلیل می‌یابند.

---

## 7. Print Specification (`@media print` — Vector A4 Landscape)
- صفحه چاپ فقط برای نمای **Odyssey 3-Column Sheet** و **Compass Summary** فعال است.
- تنظیم صفحه: `@page { size: A4 landscape; margin: 10mm; }`.
- در حالت چاپ، تم به‌صورت اجباری روی **High-Contrast Black Ink on Pure White (`#FFFFFF`)** سوئیچ می‌شود تا مصرف جوهر بهینه و خوانایی چاپ لیزری بی‌نقص باشد.
- تمام المان‌های ناوبری، دکمه‌ها و اسکرول‌بارها با `print:hidden` حذف شده و خطوط مرزی روی `0.75pt solid #111317` قفل می‌شوند.
- فونت `Estedad` به صورت وکتور واقعی در PDF خروجی مرورگر تعبیه می‌شود.

---

## 8. Agent Pre-PR UI Audit Checklist
پیش از اعلام اتمام هر فیچر UI، ایجنت باید این ۶ مورد را تأیید کند:
- [ ] هیچ کلاس فیزیکی (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`) در کد نیست.
- [ ] هیچ `bg-gradient-*`، `rounded-2xl`، `shadow-lg` یا ایموجی در کروم UI استفاده نشده است.
- [ ] در حالت `fa-IR` تمام `letter-spacing`ها صفر، تقویم شمسی و اعداد خوانا (`tabular-nums`) هستند.
- [ ] کنتراست تمام متن‌ها در هر دو تم Light و Dark استاندارد **WCAG 2.1 AA** (حداقل `4.5:1` برای متن عادی و `3:1` برای UI) را پاس می‌کند.
- [ ] فوکوس کیبورد (`:focus-visible`) با رینگ تیز `2px` روی تمام عناصر تعاملی قابل رؤیت است.
- [ ] هیچ لینک فونت یا asset خارجی در کل کامپوننت وجود ندارد.