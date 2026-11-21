# Software Requirements Document (SRD): Odyssey
**Document ID:** SRD-ODY-001
**Version:** 1.0.0
**Architecture Style:** Hexagonal Architecture (Ports & Adapters) + Domain-Driven Design (DDD) + Local-First

---

## 1. System Overview & Architectural Boundaries

### 1.1 Monorepo Topology
کل سیستم در یک Monorepo مدیریت‌شده با `pnpm` و `Turborepo` پیاده‌سازی می‌شود و قوانین وابستگی بین پکیج‌ها در CI با `dependency-cruiser` اجباری می‌شوند:

| مسیر | نام پکیج | مسئولیت | وابستگی‌های مجاز |
| :--- | :--- | :--- | :--- |
| `packages/domain` | `@odyssey/domain` | Entities, Value Objects, Domain Invariants, Domain Events | **صفر وابستگی خارجی** (به‌جز ابزارهای تایپ خالص) |
| `packages/application` | `@odyssey/application` | Use Cases (CQRS), XState v5 Statecharts, Ports (`I*Repository`, `ICryptoService`, `ISyncAdapter`) | فقط `@odyssey/domain` + `xstate` + `zod` |
| `packages/storage-sqlite` | `@odyssey/storage-sqlite` | Adapter برای SQLite WASM + OPFS (Web Worker) و Native SQLite (Tauri)، Drizzle ORM، FTS5، Migrations | `@odyssey/domain`, `@odyssey/application` |
| `packages/crypto` | `@odyssey/crypto` | Zero-Knowledge Vault (`AES-256-GCM`, `Argon2id` WASM, SHA-256 Verifiable Bundles) | `@odyssey/application` |
| `packages/sync-engine` | `@odyssey/sync-engine` | موتور HLC / CR-SQLite Event Log، Yjs/Loro برای Mind Map CRDT، `ISyncAdapter` | `@odyssey/domain`, `@odyssey/application`, `@odyssey/crypto` |
| `packages/plugin-sdk` | `@odyssey/plugin-sdk` | قراردادها و Sandbox API برای افزونه‌های شخص ثالث (BYOK AI Counsel, Exporters, Sync Providers) | `@odyssey/domain` (Read-only DTOs) |
| `packages/ui` | `@odyssey/ui` | Design Tokens، کامپوننت‌های Radix UI + Tailwind CSS v4 (Logical CSS)، Motion، Storybook | مستقل از منطق دیتابیس |
| `apps/web` | `@odyssey/web` | کلاینت PWA (Vite + React 19 + TanStack Router + Web Workers) | تمام پکیج‌های بالا از طریق DI Container |
| `apps/desktop` | `@odyssey/desktop` | کلاینت نیتیو Tauri v2 (macOS/Win/Linux) با Native SQLite و OS Keychain | مشابه `apps/web` + Tauri Bridges |
| `apps/sync-server` | `@odyssey/sync-server` | رله اختیاری Self-Hosted داکرایز شده برای همگام‌سازی Blobهای رمزنگاری‌شده E2EE | `@odyssey/sync-engine` (Protocol types only) |

---

## 2. Functional Requirements (FR)

### FR-00: Design Cycles & Five Mindsets Backbone (Intro & Conclusion)
* **FR-00.1 (Onboarding):** جریان خوش‌آمدگویی تعاملی شامل معرفی منطق تفکر طراحی برای مسائل بدخیم، بازچارچوب‌بندی افسانه «اول علاقه» و معرفی ۵ ذهنیت طراح.
* **FR-00.2 (Active Mindsets Integration):** هر یک از ۵ ذهنیت (`curiosity`, `bias_to_action`, `reframing`, `awareness`, `radical_collaboration`) به صورت متادیتای ساختاری در ماژول‌ها تنیده می‌شوند و در نقاط بن‌بست (مثلاً وجود مسئله لنگرشده، یا عدم ثبت پروتوتایپ برای ادیسه) راهنماهای بافتی (Contextual Prompts) بدون ایجاد مزاحمت نمایش می‌دهند.
* **FR-00.3 (Design Cycles / Snapshots):** سیستم از چرخه‌های زمانی چندگانه پشتیبانی می‌کند. کاربر می‌تواند در هر زمان از وضعیت فعلی یک Snapshot تغییرناپذیر (Immutable) بگیرد یا چرخه جدیدی آغاز کند و نمودارهای HWPL، قطب‌نما و ادیسه‌ها را در طول زمان مقایسه نماید.

### FR-01: Start Where You Are — HWPL & Gravity Filter (Chapter 1)
* **FR-01.1 (HWPL Dashboard):** چهار درجه‌سنج تعاملی با مقیاس `0` تا `100` (یا `0..4` پیوسته) برای `Health`, `Work`, `Play`, `Love` همراه با یادداشت متنی دلیل وضعیت هر مخزن و ثبت تاریخچه زمانی.
* **FR-01.2 (Gravity vs. Designable Filter):** امکان ثبت دغدغه‌ها و برچسب‌گذاری آن‌ها به عنوان `GRAVITY` (غیرقابل تغییر / واقعیت محیطی) یا `DESIGNABLE` (مسئله قابل طراحی). مسائل `GRAVITY` با یک گذار مشخص به بخش «پذیرفته‌شده‌ها» (Accepted Realities) منتقل می‌شوند تا از فضای تصمیم‌گیری خارج شوند (با امکان بازنگری در آینده).

### FR-02: Building a Compass — Workview & Lifeview (Chapter 2)
* **FR-02.1 (Dual Manifesto Editor):** دو ادیتور مینیمال کنار هم برای `Workview` و `Lifeview` با شمارشگر راهنما (هدف پیشنهادی حدود ۲۵۰ کلمه، بدون محدودیت سخت‌گیرانه در ذخیره‌سازی) و تاریخچه ویرایش در هر چرخه.
* **FR-02.2 (Coherence Matrix):** فضای تحلیل همراستایی شامل ۳ بخش ساختاری: (۱) نقاط هم‌پوشانی و تکمیل، (۲) نقاط تضاد و اصطکاک، (۳) جهت هدایت (آیا یکی دیگری را راهبری می‌کند؟).

### FR-03: Wayfinding — 3-Stage Good Time Journal (Chapter 3)
* **FR-03.1 (Stage 1 — Activity Log):** ثبت سریع فعالیت‌های روزانه شامل عنوان، زمان/مدت، امتیاز مستقل `Engagement` (`0..100` + فلگ `isFlow`) و امتیاز مستقل `Energy` (`-100..+100`). پشتیبانی از چرخه پیشنهادی ۳ هفته‌ای.
* **FR-03.2 (Stage 2 — Weekly & Cycle Reflection):** ویزارد مرور دوره‌ای شامل نمودار دو‌بعدی تعاملی (`Engagement vs. Energy` Scatter Plot) و ابزار نشانه‌گذاری آیتم‌ها با سه تگ تحلیلی: `TREND` (الگو)، `INSIGHT` (بینش) و `SURPRISE` (غافلگیری).
* **FR-03.3 (Stage 3 — AEIOU Deep Dive):** فرم کالبدشکافی AEIOU (`Activities`, `Environments`, `Interactions`, `Objects`, `Users`) که **مستقیماً به آیتم‌های هایلایت‌شده در مرحله ۲ (اوج‌ها و غافلگیری‌ها)** متصل می‌شود و صرفاً یک فرم جداگانه نیست.

### FR-04: Getting Unstuck — Reframing & Timed Mind Mapping (Chapter 4)
* **FR-04.1 (Primary Tool — Reframe Studio):** کارگاه تشخیص «مسائل لنگرشده» (Anchor Problems — قفل شدن روی یک راه‌حل واحد) و تبدیل گام‌به‌گام آن‌ها به پرسش‌های باز و قابل طراحی (Open Design Questions). سیستم ورودی این بخش را به مسائل `DESIGNABLE` فصل ۱ متصل می‌کند.
* **FR-04.2 (Secondary Tool — Triple Timed Mind Maps):** ایجاد ۳ نقشه ذهنی مجزا که گره مرکزی هر کدام به صورت خودکار از اوج‌های فصل ۳ قابل انتخاب است: (۱) اوج `Engagement`، (۲) اوج `Energy`، (۳) لحظه `Flow`.
* **FR-04.3 (Keyboard-First & Timer):** تایمر شمارش معکوس قابل تنظیم در بازه استاندارد ۳ تا ۵ دقیقه برای دور زدن سانسور ذهنی. ایجاد گره فرزند با `Tab` و گره هم‌سطح با `Enter` بدون نیاز به ماوس؛ چیدمان درختی خودکار.
* **FR-04.4 (Outer Ring Mash-up Mode):** پس از اتمام تایمر، سیستم لایه‌های میانی درخت را محو (Dim) کرده و تنها **گره‌های برگ / حلقه بیرونی (Leaf Nodes)** را برجسته می‌کند. کاربر دقیقاً ۳ گره غیرمرتبط انتخاب می‌کند و از ترکیب آن‌ها یک `ConceptCard` (عنوان نقش/مفهوم + شرح کوتاه) تولید می‌کند که قابل ارسال به فصل ۵ است.

### FR-05: Designing Your Lives — Odyssey Plans (Chapter 5)
* **FR-05.1 (Triple Parallel 5-Year Plans):** نمایش و ویرایش همزمان ۳ مسیر ۵ ساله کاملاً متمایز:
  * `LIFE_1`: ادامه و تکامل مسیر فعلی
  * `LIFE_2`: مسیر جایگزین در صورت ناپدید شدن کامل مسیر ۱
  * `LIFE_3`: مسیر رویایی بدون قید پول و پرستیژ (Wild Card)
* **FR-05.2 (Mandatory Card Structure):** هر مسیر شامل:
  * تایم‌لاین ۵ ساله (سال ۱ تا ۵) با پشتیبانی از رویدادهای تگ‌دار کاری (`WORK`) و غیرکاری (`LIFE`/`PERSONAL`)
  * عنوان ۶ کلمه‌ای (`Six-Word Title`)
  * دقیقاً **۳ جایگاه سؤال کلیدی** (`Key Questions`)
  * دقیقاً **۴ درجه‌سنج ارزیابی**: `Resources`، `Likability`، `Confidence` و `Coherence` (مقیاس `0..100`)
* **FR-05.3 (Pitch Mode, Vector Print & Feedback Loop):**
  * حالت ارائه تمام‌صفحه (Pitch Mode) و خروجی چاپی Vector PDF تک‌صفحه‌ای (A4 افقی از طریق CSS `@media print`) برای نمایش هر ۳ مسیر کنار هم.
  * بخش ثبت بازخورد پس از ارائه به تیم یا افراد معتمد (متصل به فصل ۱۱) شامل دو فیلد مجزا: `externalFeedback` (نقاط کور و سؤالات دیگران) و `presenterEnergyNote` (واکنش و انرژی درونی خود کاربر حین توضیح دادن هر مسیر).

### FR-06: Prototyping Lab (Chapter 6)
* **FR-06.1 (Question-to-Prototype Binding):** هر یک از ۳ سؤال کلیدی مسیرهای ادیسه مستقیماً قابلیت تبدیل به یک یا چند کارت پروتوتایپ را دارد.
* **FR-06.2 (Prototype Conversations):** مدیریت مصاحبه‌های داستان‌محور (Life Design Interviews) شامل اطلاعات فرد، سؤالات داستان‌محور، یادداشت روزمره‌های واقعی، چیزهای جذاب/آزاردهنده و وضعیت قرار. یادآور بافتی: «هدف شنیدن داستان است، نه درخواست شغل».
* **FR-06.3 (Prototype Experiences):** مدیریت تجربه‌های کوتاه و کم‌ریسک (Shadowing، دوره کوتاه، داوطلبی، پروژه آزمایشی) شامل فرضیه، هزینه زمانی/مالی، نتیجه واقعی و تصمیم ادامه/توقف.
* **FR-06.4 (Structured Brainstorming Canvas):** فضای طوفان فکری زمان‌بندی‌شده برای تولید ایده پروتوتایپ با مراحل: تعریف پرسش دقیق → گرم‌کردن → ثبت انبوه بدون نقد → دسته‌بندی و انتخاب.

### FR-07 & FR-08: Career Navigation, Hidden Market & Co-Creation (Chapters 7 & 8)
* **FR-07.1 (Hiring Problem & Language Analyzer):** فضای تحلیل آگهی‌های شغلی (در صورت اقدام برای آگهی) شامل استخراج کلیدواژه‌های دقیق آگهی و نگاشت مستقیم آن‌ها به «مسئله مدیر استخدام» و تطبیق معرفی/رزومه کاربر با همان واژگان.
* **FR-08.1 (Organic Referral Graph):** اتصال خودکار مکالمات فصل ۶ به یک گراف سبک ارتباطی؛ در پایان هر مکالمه فیلد «معرفی‌شده بعدی (Who else has an interesting story?)» یک گره جدید در شبکه می‌سازد.
* **FR-08.2 (Offer Tracker):** ردیاب فرصت‌ها و پیشنهادهای همزمان (Pursuing Offers) برای ارزیابی چند گزینه واقعی به جای تعقیب یک شغل واحد.

### FR-09: Choosing Happiness — 4-Step Decision Room (Chapter 9)
* **FR-09.1 (Step 1 — Gather & Create):** جمع‌آوری گزینه‌های کاندیدا (با امکان وارد کردن مستقیم از مسیرهای ادیسه یا پیشنهادهای فصل ۸).
* **FR-09.2 (Step 2 — Narrow Down with Hard Invariant):** مرحله فیلتر کردن لیست گزینه‌ها تا **حداکثر ۵ گزینه**. سیستم در لایه Domain اجازه عبور به مرحله ۳ را با بیش از ۵ گزینه فعال نمی‌دهد.
* **FR-09.3 (Step 3 — Grokking Space):** فضای ثبت درک کل‌نگر، شهودی و بدنی برای هر یک از گزینه‌های باقی‌مانده؛ شامل ژورنال روزانه «پوشیدن گزینه» (Trying on the option) برای ثبت واکنش‌های احساسی و فیزیکی طی چند روز.
* **FR-09.4 (Step 4 — Commit & Let Go):** اقدام قطعی انتخاب یک گزینه، آرشیو و محو کردن گزینه‌های رهاشده (غیرفعال کردن ویرایش مقایسه‌ای آن‌ها برای تقویت Synthetic Happiness و کاهش پشیمانی)، و ثبت تاریخ تعهد.

### FR-10: Failure Immunity — 3-Bucket Failure Reframe (Chapter 10)
* **FR-10.1 (Periodic Failure Log):** ثبت دوره‌ای شکست‌ها و اشتباهات (بازه یادآوری قابل تنظیم توسط کاربر، پیش‌فرض ماهانه) و دسته‌بندی اجباری در یکی از ۳ سطل:
  1. `SCREWUP`: چک‌باکس پذیرش و عذرخواهی → آرشیو سریع بدون نیاز به تحلیل عمیق.
  2. `WEAKNESS`: اتصال به یک کارت «اصلاح سیستم/محیط» برای کاهش تکرار.
  3. `GROWTH_OPPORTUNITY`: باز شدن فرم استخراج **بینش رشد (Growth Insight)** شامل دو فیلد اجباری: «عامل بحرانی شکست چه بود؟» و «دفعه بعد چه کار متفاوتی انجام می‌دهم؟».

### FR-11: Building a Team & Collaboration Hub (Chapter 11)
* **FR-11.1 (Four Rings Directory):** دفترچه محلی مخاطبین دسته‌بندی‌شده در ۴ حلقه: `SUPPORTERS`، `PLAYERS`، `INTIMATES` و `LIFE_DESIGN_TEAM`.
* **FR-11.2 (Advice vs. Counsel Guide):** نمایش کارت راهنمای تفکیک *نصیحت (Advice)* از *همفکری (Counsel)* پیش از جلسات.
* **FR-11.3 (Team Session Templates):** تمپلیت دستور جلسه برای تیم طراحی زندگی (۳ تا ۵ نفر) همراه با چک‌لیست ۴ قانون جلسه (`Respectful`, `Confidential`, `Participatory`, `Generative`) و ثبت خلاصه بازخوردها متصل به کارت‌های ادیسه و پروتوتایپ.

### FR-12: Data Portability, Vault & Plugins
* **FR-12.1 (Zero-Knowledge Vault):** امکان قفل کردن کل فضای کاری با Passphrase کاربر، Auto-Lock پس از بیکاری قابل تنظیم، و تغییر Passphrase با Re-wrap کردن کلید اصلی (DEK).
* **FR-12.2 (Export / Import):**
  * بکاپ کامل رمزنگاری‌شده (`.odybundle` — JSON + SchemaVersion + SHA-256 Checksum + AES-256-GCM)
  * بکاپ استاندارد JSON باز (Plaintext با هشدار امنیتی) + اعتبارسنجی Zod و اجرای خودکار Migration
  * خروجی پوشه/فایل **Markdown** تمیز و ساختاریافته با Frontmatter (سازگار با Obsidian)
* **FR-12.3 (Plugin SDK & BYOK Counsel):** سیستم پلاگین ایزوله با مجوزهای شفاف (Permission Manifest). پلاگین مرجع **BYOK AI Counsel** مستقیماً از مرورگر به کلید API کاربر یا Ollama لوکال وصل می‌شود و System Prompt آن به صورت سخت‌گیرانه روی نقش **Counsel (پرسشگری سقراطی و کشف تضادها)** قفل است و از ارائه Advice مستقیم منع می‌شود.

---

## 3. Domain Invariants (Testable Rules in `@odyssey/domain`)

| شناسه | قانون دامنه (Invariant) | رفتار در صورت نقض |
| :--- | :--- | :--- |
| `INV-01` | مقادیر گیج‌های HWPL و Odyssey باید در بازه `[0, 100]` و `Energy` در `[-100, 100]` باشند. | پرتاب خطای `DomainRangeError` |
| `INV-02` | هر مسیر ادیسه باید دقیقاً دارای ۴ گیج (`resources`, `likability`, `confidence`, `coherence`) و حداکثر ۳ سؤال کلیدی فعال (با استاندارد ۳ اسلات) باشد. | رد در Constructor / Validator |
| `INV-03` | عنوان ۶ کلمه‌ای ادیسه (Six-Word Title) هنگام نهایی‌سازی (Finalize) با شمارشگر دقیق کلمات (سازگار با نیم‌فاصله فارسی ZWNJ) اعتبارسنجی می‌شود و از ۶ کلمه تجاوز نمی‌کند. | هشدار در Draft / خطای `WordCountInvariantError` در Finalize |
| `INV-04` | تحلیل `AEIOU` باید به یک `JournalEntry` یا `ReflectionFinding` معتبر لینک شود. | رد رکورد یتیم (Orphan Record) |
| `INV-05` | حالت Mash-up در فصل ۴ تنها اجازه انتخاب گره‌های برگ (`children.length === 0`) را می‌دهد و برای ساخت `ConceptCard` دقیقاً به ۳ گره نیاز دارد. | خطای `InvalidMashupSelectionError` |
| `INV-06` | در فصل ۹ (Decision Room)، انتقال ماشین وضعیت از `NARROWING` به `GROKKING` با تعداد گزینه‌های فعال `> 5` یا `=== 0` غیرمجاز است. | مسدودسازی گذار در Domain & XState Guard |
| `INV-07` | پس از اجرای `COMMIT_AND_LET_GO` در فصل ۹، گزینه‌های انتخاب‌نشده به وضعیت `LET_GO_ARCHIVED` (فقط خواندنی) تغییر وضعیت می‌دهند. | رد هرگونه Mutation روی گزینه‌های آرشیوشده |
| `INV-08` | شکست از نوع `GROWTH_OPPORTUNITY` بدون پر شدن هر دو فیلد `criticalFailureFactor` و `nextTimeAction` قابل بستن (`RESOLVED`) نیست. | خطای `IncompleteGrowthInsightError` |

---

## 4. Data Model & SQLite Schema (Logical Overview)

تمام جداول دارای ستون‌های استاندارد زیر برای پشتیبانی از CRDT/Sync و Audit محلی هستند:
`id TEXT PRIMARY KEY (UUIDv7)`, `cycle_id TEXT NOT NULL`, `created_at INTEGER`, `updated_at INTEGER`, `hlc_timestamp TEXT`, `deleted_at INTEGER NULL`

* `design_cycles`: چرخه‌های طراحی (`name`, `status`, `started_at`, `snapshot_at`)
* `hwpl_assessments`: تاریخچه ارزیابی‌های ۴ گیج + یادداشت‌ها
* `life_problems`: مسائل فصل ۱ (`content`, `classification: GRAVITY | DESIGNABLE`, `anchor_statement`, `reframed_question`)
* `compass_entries`: متن‌های `workview`, `lifeview` و فیلدهای تحلیل `coherence`
* `journal_entries`: لاگ فعالیت‌های فصل ۳ (`title`, `engagement`, `energy`, `is_flow`, `occurred_at`)
* `reflection_findings`: یافته‌های مرور هفتگی (`journal_entry_id`, `tag: TREND | INSIGHT | SURPRISE`, `notes`)
* `aeiou_analyses`: تحلیل‌های AEIOU متصل به `reflection_finding_id`
* `mind_maps` & `mind_map_nodes`: درخت نقشه‌های ذهنی (`type: ENGAGEMENT | ENERGY | FLOW`, `timer_seconds`, `parent_id`, `depth`, `label`, `crdt_state BLOB`)
* `concept_cards`: خروجی‌های Mash-up متصل به ۳ `mind_map_node_id`
* `odyssey_plans`: سه مسیر ۵ ساله (`slot: LIFE_1 | LIFE_2 | LIFE_3`, `six_word_title`, `resources`, `likability`, `confidence`, `coherence`, `questions_json`, `timeline_events_json`)
* `odyssey_feedbacks`: بازخوردهای ارائه (`odyssey_plan_id`, `session_id`, `external_feedback`, `presenter_energy_note`)
* `prototypes`: کارت‌های آزمایش (`odyssey_plan_id`, `question_index`, `type: CONVERSATION | EXPERIENCE`, `hypothesis`, `status`, `outcome`, `contact_id`)
* `contacts`: مخاطبین ۴ حلقه و شبکه معرفی‌ها (`name`, `ring`, `referred_by_contact_id`, `story_notes`)
* `career_offers`: تحلیل آگهی‌ها و پیشنهادهای شغلی فصل ۷ و ۸
* `decisions` & `decision_options` & `grokking_logs`: اتاق تصمیم‌گیری فصل ۹
* `failure_logs`: لاگ ۳ سطل فصل ۱۰ (`bucket`, `description`, `system_adjustment`, `critical_factor`, `next_action`)
* `team_sessions`: جلسات تیم طراحی فصل ۱۱ + چک‌لیست ۴ قانون
* `fts_search_index`: جدول مجازی **SQLite FTS5** متصل به `journal_entries`, `aeiou_analyses`, `odyssey_plans`, `prototypes`, `failure_logs` با تریگرهای خودکار.

---

## 5. Core Statecharts (XState v5)

1. **`wayfindingMachine` (فصل ۳):** `logging` → `weeklyReview` (با نمودار و تگ‌گذاری) → `aeiouDeepDive` → `readyForIdeation`
2. **`ideationMachine` (فصل ۴):** `anchorDetection` → `reframing` → `mindMapRunning` (تایمر فعال ۳–۵ دقیقه) → `mashupSelection` (فقط برگ‌ها، Guard دقیقاً ۳ گره) → `conceptCreated`
3. **`decisionMachine` (فصل ۹):** `gathering` → `narrowing` (Guard: `1 <= activeOptions <= 5`) → `grokking` (ثبت حداقل یک لاگ حسی برای گزینه‌ها) → `committed` (آرشیو خودکار مابقی)
4. **`vaultMachine` (امنیت):** `uninitialized` | `locked` → `unlocking` (Argon2id Worker) → `unlocked` (با تایمر Idle Auto-Lock) → `locked`

---

## 6. Non-Functional Requirements (NFR)

### NFR-01: Security & Zero-Knowledge Cryptography
* مشتق‌سازی کلید (KDF): **Argon2id** (حداقل پارامترها: `memory >= 64 MiB`, `iterations >= 3`, `parallelism = 1` در Web Worker برای عدم فریز شدن UI).
* رمزنگاری داده: **AES-256-GCM** با IV یکتا (96-bit CSPRNG) برای هر عملیات. الگوی کلید دو لایه (KEK برای رمزنگاری DEK) جهت امکان تغییر سریع Passphrase.
* پاک‌سازی حافظه: با قفل شدن Vault، رفرنس کلیدهای رمزنگاری بلافاصله از حافظه پاک و Worker ریست می‌شود.
* **Zero-Telemetry Policy:** هیچ SDK آنالیتیکس، Crash Reporter ابری یا فونت لودشده از CDN خارجی در اپ وجود ندارد (فونت‌های `Vazirmatn` و `Inter` به صورت Self-Hosted در باندل قرار می‌گیرند). عیب‌یابی صرفاً از طریق Ring Buffer محلی و خروجی پاک‌سازی‌شده توسط کاربر انجام می‌شود.

### NFR-02: Performance & Durability
* **SQLite OPFS Persistence:** تمام عملیات خواندن/نوشتن دیتابیس در Dedicated Web Worker اجرا می‌شوند تا Main Thread همیشه زیر `16ms` (60fps) بماند.
* زمان جستجوی FTS5 روی ۱۰,۰۰۰ رکورد: کمتر از `30ms`.
* زمان Cold Start اپ (PWA): کمتر از `1.5s` روی شبکه 4G و کمتر از `500ms` در حالت آفلاین.
* ذخیره خودکار (Auto-Save) با Debounce `300ms` و تراکنش ACID؛ صفر از دست رفتن داده در صورت بسته شدن ناگهانی تب.

### NFR-03: Internationalization (i18n) & Bidirectional Layout
* پشتیبانی کامل و هم‌سطح از فارسی (`fa-IR`, `dir="rtl"`) و انگلیسی (`en-US`, `dir="ltr"`).
* الزام ۱۰۰٪ به **CSS Logical Properties** (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`)؛ استفاده از `ml-*`, `mr-*`, `left-*`, `right-*` در linter ممنوع است.
* تقویم و فرمت تاریخ: پشتیبانی از تقویم جلالی (شمسی) در حالت فارسی و میلادی در حالت انگلیسی از طریق `Intl.DateTimeFormat` و ذخیره‌سازی همیشگی زمان به صورت UTC Epoch در دیتابیس.

### NFR-04: Accessibility & Print Quality
* انطباق کامل با **WCAG 2.1 Level AA** (کنتراست رنگ، ناوبری کامل کیبورد، برچسب‌های ARIA برای اسلایدرها و گیج‌ها).
* خروجی چاپ صفحه ادیسه صرفاً با **CSS Paged Media (`@media print`)** به صورت Vector PDF بدون شکستگی حروف فارسی و با فونت تعبیه‌شده.

---

## 7. Verification & Quality Gates
* **Unit Tests (Vitest):** پوشش ۱۰۰٪ برای تمام `INV-01` تا `INV-08`، ماشین‌های وضعیت XState، الگوریتم‌های Crypto و Migrationهای Drizzle/SQLite.
* **E2E Tests (Playwright):** تست‌های خودکار در کرومیوم و فایرفاکس روی OPFS واقعی، قطع کامل شبکه (`offline: true`)، چرخه قفل/باز کردن Vault، Export/Import بین ورژن‌ها، و Visual Regression در هر دو حالت `fa-IR (RTL)` و `en-US (LTR)`.
* **Static Gates:** `Biome` (Lint + Format)، `tsc --noEmit` با حالت Strict کامل و `dependency-cruiser`.