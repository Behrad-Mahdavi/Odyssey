import type {
  AeiouItem,
  CompassData,
  FeedbackItem,
  JournalEntryItem,
  PlanItem,
  ProblemItem,
  PrototypeItem,
  ReflectionFindingItem,
} from "@odyssey/ui";

export interface StudioWorkspaceState {
  gaugeValues: Record<string, number>;
  gaugeNotes: Record<string, string>;
  problems: ProblemItem[];
  compassData: CompassData;
  journalEntries: JournalEntryItem[];
  reflectionFindings: ReflectionFindingItem[];
  aeiouAnalyses: Record<string, AeiouItem>;
  plans: Record<"LIFE_1" | "LIFE_2" | "LIFE_3", PlanItem>;
  feedbacks: Record<string, FeedbackItem[]>;
  prototypes: PrototypeItem[];
}

export const EMPTY_WORKSPACE: StudioWorkspaceState = {
  gaugeValues: {
    health: 0,
    work: 0,
    play: 0,
    love: 0,
  },
  gaugeNotes: {
    health: "",
    work: "",
    play: "",
    love: "",
  },
  problems: [],
  compassData: {
    workview: "",
    lifeview: "",
    coherenceComplement: "",
    coherenceConflict: "",
    coherenceGuide: "",
  },
  journalEntries: [],
  reflectionFindings: [],
  aeiouAnalyses: {},
  plans: {
    LIFE_1: {
      slot: "LIFE_1",
      sixWordTitle: "",
      resources: 0,
      likability: 0,
      confidence: 0,
      coherence: 0,
      questions: ["", "", ""],
      timelineEvents: [],
    },
    LIFE_2: {
      slot: "LIFE_2",
      sixWordTitle: "",
      resources: 0,
      likability: 0,
      confidence: 0,
      coherence: 0,
      questions: ["", "", ""],
      timelineEvents: [],
    },
    LIFE_3: {
      slot: "LIFE_3",
      sixWordTitle: "",
      resources: 0,
      likability: 0,
      confidence: 0,
      coherence: 0,
      questions: ["", "", ""],
      timelineEvents: [],
    },
  },
  feedbacks: {},
  prototypes: [],
};

export const SAMPLE_WORKSPACE: StudioWorkspaceState = {
  gaugeValues: {
    health: 80,
    work: 65,
    play: 45,
    love: 70,
  },
  gaugeNotes: {
    health: "پیاده‌روی روزانه و خواب منظم؛ نیاز به بهبود تغذیه در روزهای کاری پرمشغله.",
    work: "تمرکز بر توسعه معماری فنی؛ احساس رضایت بالا از پیشرفت پروژه‌های محلی.",
    play: "زمان فراغت محدود بوده است؛ اختصاص آخر هفته‌ها به کوه‌نوردی و مطالعه آزاد.",
    love: "گفت‌وگوهای صمیمانه هفتگی با دوستان نزدیک و خانواده.",
  },
  problems: [
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
    {
      id: "prob-3",
      content: "محدودیت فضای کار فیزیکی در آپارتمان فعلی",
      isGravity: true,
    },
    {
      id: "prob-4",
      content: "ایجاد روال منظم مطالعه روزانه ۳۰ دقیقه فلسفه",
      isGravity: false,
    },
  ],
  compassData: {
    workview:
      "کار برای من تجلی خلاقیت، حل مسائل بنیادین انسان و خلق ابزارهای ماندگار است. یک کار معنادار نه فقط منبع درآمد، بلکه محملی برای رشد فردی، گسترش افق‌های فکری و خدمت صادقانه به جامعه است. کار خوب کاری است که به استقلال ذهنی احترام بگذارد و حس اثرگذاری مثبت را تقویت کند.",
    lifeview:
      "زندگی فرصتی یگانه برای یادگیری، حضور آگاهانه در جهان و تجربه زیبایی و معناست. ارزش‌های بنیادین من بر آزادی فکر، صداقت درونی، شفقت و دوستی عمیق استوار است. انسان نقاش مسیر خویش است و معنا پیش از آنکه کشف شود، با اقدام و انتخاب‌های شجاعانه ساخته می‌شود.",
    coherenceComplement:
      "خلق ابزارهای مهندسی با رویکرد تفکر طراحی، مستقیماً با دیدگاه من درباره خدمت به پتانسیل انسانی و توانمندسازی افراد هم‌راستاست.",
    coherenceConflict:
      "گاهی الزامات پروژه‌های فوری یا بوروکراسی‌های کاری مانع از تداوم تفکر عمیق و حفظ ریتم آرام زیست شخصی می‌شود.",
    coherenceGuide:
      "در هر دوراهی شغلی، پیشنهادی انتخاب می‌شود که آزادی عمل، اخلاق حرفه‌ای و تعادل سلامت روان را حفظ کند.",
  },
  journalEntries: [
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
    {
      id: "gtj-3",
      title: "گفت‌وگوی کاوشگرانه درباره استودیوی ابزارسازی با همکاران",
      engagement: 85,
      energy: 70,
      isFlow: true,
      durationMinutes: 60,
      occurredAt: Date.now() - 3600000 * 24,
    },
  ],
  reflectionFindings: [
    {
      id: "find-1",
      journalEntryId: "gtj-1",
      tag: "INSIGHT",
      notes: "تمرکز عمیق روی معماری تمیز بدون نوتیفیکیشن انرژی روانی را به جای فرسایش، شارژ می‌کند.",
    },
    {
      id: "find-2",
      journalEntryId: "gtj-3",
      tag: "TREND",
      notes: "گفت‌وگوهای فکری سطح بالا و همکاری رادیکال، خلاقیت را به اوج می‌رساند.",
    },
  ],
  aeiouAnalyses: {
    "find-1": {
      id: "aeiou-1",
      reflectionFindingId: "find-1",
      activities: "طراحی اینترفیس‌ها و تست‌های واحد تمیز",
      environments: "اتاق آرام، میز کار بدون شلوغی با نور طبیعی",
      interactions: "تعامل فنی و گفت‌وگوی فکری سطح بالا",
      objects: "ادیتور متنی ساده و دفترچه یادداشت فیزیکی",
      users: "توسعه‌دهندگان و کاربران متمرکز",
    },
  },
  plans: {
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
        { year: 4, type: "work", description: "تثبیت درآمد مستقل و هدایت فنی" },
        { year: 5, type: "personal", description: "تألیف کتاب تجربیات مهندسی ابزار" },
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
        { year: 3, type: "personal", description: "برگزاری اولین رویداد حضوری" },
        { year: 4, type: "work", description: "گسترش مدرسه به دوره‌های بین‌المللی" },
        { year: 5, type: "work", description: "ایجاد صندوق حمایتی برای دانشجویان" },
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
        { year: 2, type: "work", description: "انتشار مقالات در نشریات تخصصی" },
        { year: 3, type: "personal", description: "راه‌اندازی کتابخانه محلی" },
        { year: 4, type: "work", description: "تدریس مهمان در نشست‌های فلسفی" },
        { year: 5, type: "personal", description: "نگارش دفتر دوم تأملات" },
      ],
    },
  },
  feedbacks: {},
  prototypes: [
    {
      id: "proto-seed-1",
      odysseyPlanId: "LIFE_2",
      questionIndex: 0,
      type: "CONVERSATION",
      title: "گفت‌وگو با طراحان دوره‌های آموزشی دیزاین",
      hypothesis: "آیا تقاضای واقعی برای آموزش تفکر طراحی و ابزارسازی مستقل وجود دارد؟",
      intervieweeRole: "مدرس ارشد بوت‌کمپ و طراح محصول مستقل",
      status: "COMPLETED",
      storyQuestions: ["چگونه دوره اول را بازاریابی کردید؟", "سختی‌های حفظ جریان درآمد چه بود؟"],
      conversationNotes: "بازخورد بسیار مثبت بود. توصیه شد ابتدا با وبینارهای کوتاه تست شود.",
      referralContact: "سارا رضایی (منتور پروداکت)",
      nextStepVerdict: "PROCEED",
      outcome: "تأیید شد که تقاضای ملموس برای مباحث پیشرفته مهندسی ابزار وجود دارد.",
    },
    {
      id: "proto-seed-2",
      odysseyPlanId: "LIFE_1",
      questionIndex: 0,
      type: "EXPERIENCE",
      title: "آزمون ساخت نسخه پیش‌نمایش در ۲ روز کاری",
      hypothesis: "آیا می‌توان با استک SQLite WASM معماری پایدار و بدون لگ در مرورگر ساخت؟",
      costEstimate: "صفر ریال (فقط زمان)",
      duration: "۲ روز",
      status: "COMPLETED",
      nextStepVerdict: "PROCEED",
      outcome: "پرفورمنس عالی بود و ذخیره‌سازی OPFS با سرعت زیر ۳۰ میلی‌ثانیه کار کرد.",
    },
  ],
};
