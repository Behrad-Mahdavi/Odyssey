# AGENT.md — Architectural Constitution & Execution Guide for AI Agents

این سند دستورالعمل عملیاتی و غیرقابل تخطی برای تمام ایجنت‌های کدنویسی (Claude Code، Cursor، Antigravity و توسعه‌دهندگان) در ریپوزیتوری **Odyssey** است. پیش از هرگونه تغییر کد، این سند و فایل‌های `Brief.md`، `SRD.md` و `Featurelist.json` را مبنای تصمیم قرار دهید.

---

## 1. Source of Truth Hierarchy
در صورت بروز هرگونه ابهام، اولویت مرجعیت به ترتیب زیر است:
1. `SRD.md` (الزامات، Domain Invariants، اسکیما و NFRها)
2. `Featurelist.json` (اسکوپ فیچرها، وابستگی‌ها و معیار پذیرش)
3. `Brief.md` (چشم‌انداز، محدوده متدولوژی و مرزهای حقوقی/IP)
4. فایل‌های ADR داخل `docs/adr/`

---
## 2. Non-Negotiable Architectural Guardrails

### 2.1 Hexagonal & Dependency Boundaries
* پکیج `packages/domain` باید **۱۰۰٪ Pure TypeScript** باشد. ایمپورت کردن React، DOM APIs، Drizzle، SQLite، Zustand یا هر پکیج I/O در این لایه **ممنوع** است.
* تمام قواعد متدولوژی (`INV-01` تا `INV-08` در `SRD.md`) باید در `packages/domain` پیاده‌سازی و یونیت‌تست شوند. **هرگز** یک قانون دامنه را فقط در UI Validation یا React Component پیاده‌سازی نکنید.
* کامپوننت‌های React در `apps/web` و `apps/desktop` هرگز نباید مستقیم کوئری SQLite بزنند؛ دسترسی به داده صرفاً از طریق Use Caseهای `packages/application` و Portهای تعریف‌شده انجام می‌شود.

### 2.2 State Management Separation (Three-Tier Rule)
* **Persistent Domain State:** فقط و فقط در **SQLite (OPFS / Native)** از طریق Repository. استفاده از `localStorage` یا `sessionStorage` برای ذخیره داده‌های کاربری **ممنوع** است (به‌جز پرچم‌های غیرحساس UI مثل تم یا زبان).
* **Complex Multi-Step Workflows:** فقط با **XState v5 Statecharts** در `packages/application` (جریان‌های فصل ۳، ۴، ۹ و قفل Vault). استفاده از زنجیره `useEffect`/`useState` برای مدیریت مراحل شرطی ممنوع است.
* **Ephemeral UI State:** فقط در **Zustand** (حالت باز بودن مودال، انتخاب موقت گره‌ها، وضعیت Pitch Mode).

### 2.3 Privacy, Security & Zero-Telemetry
* **Zero External Calls:** هیچ درخواست شبکه‌ای به سرورهای خارجی، فونت‌های CDN (مثل Google Fonts)، آنالیتیکس یا سرویس‌های خطایابی ابری اضافه نکنید. تنها استثنا: آداپتورهای صریح Sync و پلاگین BYOK که تنها با پیکربندی و تایید صریح کاربر فعال می‌شوند.
* **No Sensitive Logging:** هرگز محتوای ژورنال، Workview/Lifeview، ادیسه، شکست‌ها یا Passphrase کاربر را در `console.log` یا Local Diagnostic Ring Buffer چاپ نکنید.
* تمام عملیات سنگین رمزنگاری (Argon2id) و کوئری‌های SQLite باید در **Web Worker** اجرا شوند.

### 2.4 RTL/LTR & Print Guardrails
* **Logical CSS Only:** در کل `packages/ui` و `apps/*` استفاده از کلاس‌های فیزیکی (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`) **ممنوع** است. همیشه از معادل‌های منطقی (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `text-end`) استفاده کنید.
* **No jsPDF / html2canvas:** برای خروجی PDF صفحه ادیسه از کتابخانه‌های رسترکننده یا jsPDF استفاده نکنید؛ صرفاً از مسیر **CSS `@media print`** و خروجی Vector مرورگر استفاده کنید.

### 2.5 Methodology & IP Fidelity Guardrails
* دقت واژگانی کتاب را در کد و کلیدهای ترجمه حفظ کنید:
  * نام دقیق گیج‌های ادیسه: `resources`, `likability` (نه `i_like_it`), `confidence`, `coherence`.
  * تعداد اسلات سؤالات هر مسیر ادیسه: دقیقاً `3`.
  * فصل ۳ همیشه جریان ۳ مرحله‌ای دارد: `Log` → `Reflection (Trends/Insights/Surprises)` → `AEIOU`.
  * فصل ۴ همیشه با `Reframe Studio` (بازچارچوب‌بندی مسئله لنگرشده) شروع می‌شود و سپس وارد `Mind Map` + `Outer Ring Mash-up` می‌شود.
  * فصل ۵ حتماً شامل بخش اشتراک‌گذاری (`Pitch Mode`) و ثبت بازخورد (بیرونی + انرژی درونی ارائه‌دهنده) است.
  * ۵ ذهنیت طراحی باید در متادیتا و راهنماهای بافتی کل اپ زنده باشند.
* **کپی‌رایت:** هیچ متن یا ورک‌شیت کلمه‌به‌کلمه‌ای از کتاب را وارد فایل‌های `i18n` نکنید. تمام متن‌های فارسی و انگلیسی UI باید بازنویسی مستقل، دقیق و اصیل باشند.

---

## 3. Standard Execution Workflow (Per Feature)

هنگام پیاده‌سازی هر آیتم از `Featurelist.json` (مثلاً `F-008`)، دقیقاً به این ترتیب عمل کنید:
1. **Inspect Spec:** جزئیات فیچر را در `Featurelist.json` و بخش متناظر آن را در `SRD.md` بخوانید و از تکمیل بودن تمام `dependencies` مطمئن شوید.
2. **Domain First:** Entityها، Value Objectها، Invariantها و Domain Eventها را در `packages/domain` بنویسید و **ابتدا** تست‌های واحد Vitest را بنویسید و سبز کنید.
3. **Storage & Migration:** اسکیمای Drizzle و فایل Migration قطعی را در `packages/storage-sqlite` اضافه کنید و Repository Adapter را تست کنید.
4. **Application & Statechart:** Use Caseها، اسکیماهای Zod و (در صورت نیاز) ماشین وضعیت XState v5 را در `packages/application` پیاده‌سازی و تست کنید.
5. **UI & i18n:** کامپوننت‌های پایه را در `packages/ui` و صفحات/جریان را در `apps/web` با هر دو کلید ترجمه `fa-IR` و `en-US` پیاده‌سازی کنید.
6. **Verify & Update:** تمام Gateهای کیفیت زیر را اجرا کنید، سپس وضعیت فیچر را در `Featurelist.json` به `completed` تغییر دهید.

---

## 4. Coding & Repository Conventions
* **TypeScript:** حالت Strict کامل؛ استفاده از `any`، `@ts-ignore` و Type Assertion غیرضروری (`as`) ممنوع است. از `unknown` + Zod یا Type Guard استفاده کنید.
* **Error Handling:** در لایه Domain و Application از الگوی `Result<T, DomainError>` (یا کلاس‌های خطای تایپ‌شده مشخص) استفاده کنید؛ خطاهای خام بدون ساختار پرتاب نکنید.
* **IDs & Timestamps:** تمام کلیدهای اصلی با **UUIDv7** (قابل مرتب‌سازی زمانی) و تمام زمان‌ها به صورت **UTC Epoch Milliseconds** ذخیره می‌شوند.
* **ADRs:** هر تصمیم معماری جدید (مثل تغییر کتابخانه گراف یا پروتکل Sync) نیازمند ثبت یک فایل جدید در `docs/adr/NNNN-title.md` است.
* **Commits & Versioning:** از استاندارد **Conventional Commits** (`feat(odyssey): ...`, `fix(crypto): ...`) و **Changesets** برای تغییرات پکیج‌ها پیروی کنید.

---

## 5. Verification Commands (Mandatory Before Completion)
پیش از اعلام اتمام هر تسک، تمام دستورات زیر باید با کد خروج `0` اجرا شوند:

```bash
pnpm dep:check        # بررسی قوانین مرزبندی Hexagonal با dependency-cruiser
pnpm lint             # بررسی Biome (فرمت، لینت و منع کلاس‌های فیزیکی CSS)
pnpm typecheck        # بررسی TypeScript Strict در کل Monorepo
pnpm test:unit        # اجرای Vitest (Domain Invariants, XState, Crypto, Migrations)
pnpm test:e2e         # اجرای Playwright (OPFS, Offline, Vault, RTL/LTR Visuals)