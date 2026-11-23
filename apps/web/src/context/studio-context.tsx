import { type OdysseyExportData, OdysseyExportDataSchema } from "@odyssey/application";
import { WebCryptoService } from "@odyssey/crypto";
import type {
  AeiouItem,
  CompassData,
  FeedbackItem,
  JournalEntryItem,
  NextStepVerdict,
  OdysseySlot,
  PlanItem,
  ProblemItem,
  PrototypeItem,
  PrototypeStatus,
  ReflectionFindingItem,
} from "@odyssey/ui";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  EMPTY_WORKSPACE,
  SAMPLE_WORKSPACE,
  type StudioWorkspaceState,
} from "../data/sample-workspace.js";

const STORAGE_KEY = "odyssey_workspace_v1";
const VAULT_LOCK_KEY = "odyssey_vault_locked";

export interface StudioContextType {
  // Data State
  gaugeValues: Record<string, number>;
  gaugeNotes: Record<string, string>;
  problems: ProblemItem[];
  compassData: CompassData;
  journalEntries: JournalEntryItem[];
  reflectionFindings: ReflectionFindingItem[];
  aeiouAnalyses: Record<string, AeiouItem>;
  plans: Record<OdysseySlot, PlanItem>;
  feedbacks: Record<string, FeedbackItem[]>;
  prototypes: PrototypeItem[];

  // Meta
  hasData: boolean;
  activeCycle: string;
  isVaultLocked: boolean;

  // Actions
  updateGauge: (key: string, val: number) => void;
  updateGaugeNote: (key: string, note: string) => void;
  addProblem: (content: string) => void;
  toggleProblem: (id: string) => void;
  deleteProblem: (id: string) => void;
  saveCompass: (data: CompassData) => void;
  addJournalEntry: (entry: Omit<JournalEntryItem, "id">) => void;
  deleteJournalEntry: (id: string) => void;
  saveFinding: (finding: Omit<ReflectionFindingItem, "id">) => void;
  saveAeiou: (analysis: AeiouItem) => void;
  updatePlan: (plan: PlanItem) => void;
  saveFeedback: (
    slot: OdysseySlot,
    feedback: { externalFeedback: string; presenterEnergyNote: string },
  ) => void;
  activeBridge: { slot: string; questionIndex: number; questionText: string } | null;
  createPrototypeFromQuestion: (
    slot: OdysseySlot,
    questionIndex: number,
    questionText: string,
  ) => void;
  clearActiveBridge: () => void;
  createPrototype: (item: Omit<PrototypeItem, "id">) => void;
  updatePrototypeStatus: (
    id: string,
    status: PrototypeStatus,
    outcome?: string,
    verdict?: NextStepVerdict,
    notes?: string,
    referral?: string,
  ) => void;
  deletePrototype: (id: string) => void;

  // Workspace controls
  loadSampleWorkspace: () => void;
  clearWorkspace: () => void;

  // Vault Controls
  lockVault: () => void;
  unlockVault: (passphrase?: string) => boolean;

  // Modals
  showPortabilityModal: boolean;
  setShowPortabilityModal: (open: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (open: boolean) => void;
  showMindsetsModal: boolean;
  setShowMindsetsModal: (open: boolean) => void;
  showVaultModal: boolean;
  setShowVaultModal: (open: boolean) => void;

  // Portability
  exportBundle: (
    passphrase: string,
  ) => Promise<{ success: boolean; data?: string; error?: string }>;
  importBundle: (
    bundleString: string,
    passphrase: string,
  ) => Promise<{ success: boolean; totalRecords?: number; error?: string }>;
  exportJson: () => Promise<{ success: boolean; data: string }>;
  importJson: (
    jsonString: string,
  ) => Promise<{ success: boolean; totalRecords?: number; error?: string }>;
  exportMarkdown: () => Promise<{ success: boolean; files: Record<string, string> }>;
}

const StudioContext = createContext<StudioContextType | null>(null);

export function useStudio(): StudioContextType {
  const ctx = useContext(StudioContext);
  if (!ctx) {
    throw new Error("useStudio must be used within a StudioProvider");
  }
  return ctx;
}

export function StudioProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [cryptoService] = useState(() => new WebCryptoService());

  // Initialize state from localStorage or empty
  const [workspace, setWorkspace] = useState<StudioWorkspaceState>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...EMPTY_WORKSPACE,
            ...parsed,
          };
        }
      } catch {
        // Fallback to empty
      }
    }
    return EMPTY_WORKSPACE;
  });

  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(VAULT_LOCK_KEY) === "true";
    }
    return false;
  });

  // Modal states
  const [showPortabilityModal, setShowPortabilityModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMindsetsModal, setShowMindsetsModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);

  // Active question bridge to prototype
  const [activeBridge, setActiveBridge] = useState<{
    slot: string;
    questionIndex: number;
    questionText: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
      } catch {
        // storage quota or error
      }
    }
  }, [workspace]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(VAULT_LOCK_KEY, isVaultLocked ? "true" : "false");
    }
  }, [isVaultLocked]);

  // Actions
  const updateGauge = (key: string, val: number) => {
    setWorkspace((prev) => ({
      ...prev,
      gaugeValues: { ...prev.gaugeValues, [key]: val },
    }));
  };

  const updateGaugeNote = (key: string, note: string) => {
    setWorkspace((prev) => ({
      ...prev,
      gaugeNotes: { ...prev.gaugeNotes, [key]: note },
    }));
  };

  const addProblem = (content: string) => {
    const newItem: ProblemItem = {
      id: `prob-${Date.now()}`,
      content,
      isGravity: false,
    };
    setWorkspace((prev) => ({
      ...prev,
      problems: [newItem, ...prev.problems],
    }));
  };

  const toggleProblem = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      problems: prev.problems.map((p) => (p.id === id ? { ...p, isGravity: !p.isGravity } : p)),
    }));
  };

  const deleteProblem = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      problems: prev.problems.filter((p) => p.id !== id),
    }));
  };

  const saveCompass = (data: CompassData) => {
    setWorkspace((prev) => ({
      ...prev,
      compassData: data,
    }));
  };

  const addJournalEntry = (entry: Omit<JournalEntryItem, "id">) => {
    const newEntry: JournalEntryItem = {
      ...entry,
      id: `gtj-${Date.now()}`,
    };
    setWorkspace((prev) => ({
      ...prev,
      journalEntries: [newEntry, ...prev.journalEntries],
    }));
  };

  const deleteJournalEntry = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      journalEntries: prev.journalEntries.filter((e) => e.id !== id),
    }));
  };

  const saveFinding = (finding: Omit<ReflectionFindingItem, "id">) => {
    const newFinding: ReflectionFindingItem = {
      ...finding,
      id: `find-${Date.now()}`,
    };
    setWorkspace((prev) => ({
      ...prev,
      reflectionFindings: [newFinding, ...prev.reflectionFindings],
    }));
  };

  const saveAeiou = (analysis: AeiouItem) => {
    setWorkspace((prev) => ({
      ...prev,
      aeiouAnalyses: {
        ...prev.aeiouAnalyses,
        [analysis.reflectionFindingId]: analysis,
      },
    }));
  };

  const updatePlan = (plan: PlanItem) => {
    setWorkspace((prev) => ({
      ...prev,
      plans: {
        ...prev.plans,
        [plan.slot]: plan,
      },
    }));
  };

  const saveFeedback = (
    slot: OdysseySlot,
    feedback: { externalFeedback: string; presenterEnergyNote: string },
  ) => {
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      odysseyPlanId: slot,
      externalFeedback: feedback.externalFeedback,
      presenterEnergyNote: feedback.presenterEnergyNote,
    };
    setWorkspace((prev) => ({
      ...prev,
      feedbacks: {
        ...prev.feedbacks,
        [slot]: [...(prev.feedbacks[slot] ?? []), newFeedback],
      },
    }));
  };

  const createPrototypeFromQuestion = (
    slot: OdysseySlot,
    questionIndex: number,
    questionText: string,
  ) => {
    setActiveBridge({ slot, questionIndex, questionText });
  };

  const clearActiveBridge = () => {
    setActiveBridge(null);
  };

  const createPrototype = (item: Omit<PrototypeItem, "id">) => {
    const newProto: PrototypeItem = {
      ...item,
      id: `proto-${Date.now()}`,
    };
    setWorkspace((prev) => ({
      ...prev,
      prototypes: [newProto, ...prev.prototypes],
    }));
    setActiveBridge(null);
  };

  const updatePrototypeStatus = (
    id: string,
    status: PrototypeStatus,
    outcome?: string,
    verdict?: NextStepVerdict,
    notes?: string,
    referral?: string,
  ) => {
    setWorkspace((prev) => ({
      ...prev,
      prototypes: prev.prototypes.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              ...(outcome !== undefined ? { outcome } : {}),
              ...(verdict !== undefined ? { nextStepVerdict: verdict } : {}),
              ...(notes !== undefined ? { conversationNotes: notes } : {}),
              ...(referral !== undefined ? { referralContact: referral } : {}),
            }
          : p,
      ),
    }));
  };

  const deletePrototype = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      prototypes: prev.prototypes.filter((p) => p.id !== id),
    }));
  };

  const loadSampleWorkspace = () => {
    setWorkspace(SAMPLE_WORKSPACE);
  };

  const clearWorkspace = () => {
    setWorkspace(EMPTY_WORKSPACE);
  };

  const lockVault = () => {
    setIsVaultLocked(true);
  };

  const unlockVault = (_passphrase?: string) => {
    setIsVaultLocked(false);
    return true;
  };

  // Portability builder
  const buildExportData = (): OdysseyExportData => {
    const now = Date.now();
    const cycleId = "cycle-1";

    return {
      format: "odyssey-export",
      schemaVersion: 1,
      exportedAt: now,
      appVersion: "1.0.0",
      data: {
        designCycles: [
          {
            id: cycleId,
            name: "Cycle 1: Core Studio",
            status: "ACTIVE",
            startedAt: now,
            createdAt: now,
            updatedAt: now,
            hlcTimestamp: `node-${now}`,
          },
        ],
        hwplAssessments: [
          {
            id: "hwpl-active",
            cycleId,
            health: workspace.gaugeValues.health ?? 0,
            work: workspace.gaugeValues.work ?? 0,
            play: workspace.gaugeValues.play ?? 0,
            love: workspace.gaugeValues.love ?? 0,
            healthNotes: workspace.gaugeNotes.health ?? "",
            createdAt: now,
            updatedAt: now,
            hlcTimestamp: `node-${now}`,
          },
        ],
        lifeProblems: workspace.problems.map((p) => ({
          id: p.id,
          cycleId,
          content: p.content,
          classification: p.isGravity ? "GRAVITY" : "DESIGNABLE",
          anchorStatement: p.isGravity ? p.content : null,
          reframedQuestion: null,
          createdAt: now,
          updatedAt: now,
          hlcTimestamp: `node-${now}`,
        })),
        compassEntries: [
          {
            id: "compass-active",
            cycleId,
            workview: workspace.compassData.workview,
            lifeview: workspace.compassData.lifeview,
            coherenceComplement: workspace.compassData.coherenceComplement ?? null,
            coherenceConflict: workspace.compassData.coherenceConflict ?? null,
            coherenceGuide: workspace.compassData.coherenceGuide ?? null,
            createdAt: now,
            updatedAt: now,
            hlcTimestamp: `node-${now}`,
          },
        ],
        journalEntries: workspace.journalEntries.map((j) => ({
          id: j.id,
          cycleId,
          title: j.title,
          engagement: j.engagement,
          energy: j.energy,
          isFlow: j.isFlow,
          occurredAt: j.occurredAt ?? now,
          durationMinutes: j.durationMinutes ?? null,
          createdAt: now,
          updatedAt: now,
          hlcTimestamp: `node-${now}`,
        })),
        reflectionFindings: workspace.reflectionFindings.map((f) => ({
          id: f.id,
          cycleId,
          journalEntryId: f.journalEntryId ?? null,
          tag: f.tag,
          notes: f.notes,
          createdAt: now,
          updatedAt: now,
          hlcTimestamp: `node-${now}`,
        })),
        aeiouAnalyses: Object.values(workspace.aeiouAnalyses).map((a, idx) => ({
          id: a.id || `aeiou-${idx}-${now}`,
          cycleId,
          reflectionFindingId: a.reflectionFindingId,
          activities: a.activities,
          environments: a.environments,
          interactions: a.interactions,
          objects: a.objects,
          users: a.users,
          createdAt: now,
          updatedAt: now,
          hlcTimestamp: `node-${now}`,
        })),
        odysseyPlans: Object.values(workspace.plans).map((plan) => ({
          id: `plan-${plan.slot}`,
          cycleId,
          slot: plan.slot,
          sixWordTitle: plan.sixWordTitle,
          resources: plan.resources,
          likability: plan.likability,
          confidence: plan.confidence,
          coherence: plan.coherence,
          questionsJson: JSON.stringify(plan.questions),
          timelineEventsJson: JSON.stringify(plan.timelineEvents),
          createdAt: now,
          updatedAt: now,
          hlcTimestamp: `node-${now}`,
        })),
        odysseyFeedbacks: Object.values(workspace.feedbacks)
          .flat()
          .map((fb, idx) => ({
            id: fb.id || `fb-${idx}-${now}`,
            cycleId,
            odysseyPlanId: `plan-${fb.odysseyPlanId}`,
            externalFeedback: fb.externalFeedback,
            presenterEnergyNote: fb.presenterEnergyNote,
            createdAt: now,
            updatedAt: now,
            hlcTimestamp: `node-${now}`,
          })),
        prototypes: workspace.prototypes.map((proto) => ({
          id: proto.id,
          cycleId,
          odysseyPlanId: proto.odysseyPlanId ? `plan-${proto.odysseyPlanId}` : null,
          questionIndex: proto.questionIndex ?? null,
          type: proto.type,
          hypothesis: proto.hypothesis,
          status: proto.status,
          outcome: proto.outcome ?? null,
          contactId: proto.referralContact ?? null,
          createdAt: now,
          updatedAt: now,
          hlcTimestamp: `node-${now}`,
        })),
      },
    };
  };

  const applyImportedData = (data: OdysseyExportData): number => {
    const d = data.data;

    const newGaugeValues = { ...workspace.gaugeValues };
    const newGaugeNotes = { ...workspace.gaugeNotes };
    const hwpl = d.hwplAssessments[0];
    if (hwpl) {
      newGaugeValues.health = hwpl.health;
      newGaugeValues.work = hwpl.work;
      newGaugeValues.play = hwpl.play;
      newGaugeValues.love = hwpl.love;
      if (hwpl.healthNotes) newGaugeNotes.health = hwpl.healthNotes;
    }

    const newProblems: ProblemItem[] = d.lifeProblems.map((p) => ({
      id: p.id,
      content: p.content,
      isGravity: p.classification === "GRAVITY",
    }));

    let newCompass: CompassData = { ...workspace.compassData };
    const comp = d.compassEntries[0];
    if (comp) {
      newCompass = {
        workview: comp.workview,
        lifeview: comp.lifeview,
        coherenceComplement: comp.coherenceComplement ?? "",
        coherenceConflict: comp.coherenceConflict ?? "",
        coherenceGuide: comp.coherenceGuide ?? "",
      };
    }

    const newJournals: JournalEntryItem[] = d.journalEntries.map((j) => ({
      id: j.id,
      title: j.title,
      engagement: j.engagement,
      energy: j.energy,
      isFlow: j.isFlow,
      ...(j.durationMinutes ? { durationMinutes: j.durationMinutes } : {}),
      ...(j.occurredAt ? { occurredAt: j.occurredAt } : {}),
    }));

    const newFindings: ReflectionFindingItem[] = d.reflectionFindings.map((f) => ({
      id: f.id,
      journalEntryId: f.journalEntryId || "gtj-1",
      tag: f.tag,
      notes: f.notes,
    }));

    const newAeiou: Record<string, AeiouItem> = {};
    for (const a of d.aeiouAnalyses) {
      newAeiou[a.reflectionFindingId] = {
        id: a.id,
        reflectionFindingId: a.reflectionFindingId,
        activities: a.activities,
        environments: a.environments,
        interactions: a.interactions,
        objects: a.objects,
        users: a.users,
      };
    }

    const newPlans: Record<OdysseySlot, PlanItem> = { ...workspace.plans };
    for (const op of d.odysseyPlans) {
      let qs: [string, string, string] = ["", "", ""];
      try {
        const parsed = JSON.parse(op.questionsJson);
        qs = [parsed[0] ?? "", parsed[1] ?? "", parsed[2] ?? ""];
      } catch {
        qs = ["", "", ""];
      }
      let evs: Array<{
        year: 1 | 2 | 3 | 4 | 5;
        type: "work" | "personal";
        description: string;
      }> = [];
      try {
        const parsedEvs = JSON.parse(op.timelineEventsJson) as Array<{
          year: number;
          type: "work" | "personal";
          description: string;
        }>;
        evs = parsedEvs.map((e) => ({
          year: Math.min(5, Math.max(1, e.year)) as 1 | 2 | 3 | 4 | 5,
          type: e.type === "personal" ? "personal" : "work",
          description: e.description,
        }));
      } catch {
        evs = [];
      }

      newPlans[op.slot] = {
        slot: op.slot,
        sixWordTitle: op.sixWordTitle,
        resources: op.resources,
        likability: op.likability,
        confidence: op.confidence,
        coherence: op.coherence,
        questions: qs,
        timelineEvents: evs,
      };
    }

    const newPrototypes: PrototypeItem[] = d.prototypes.map((proto) => ({
      id: proto.id,
      ...(proto.odysseyPlanId ? { odysseyPlanId: proto.odysseyPlanId.replace("plan-", "") } : {}),
      ...(proto.questionIndex !== null && proto.questionIndex !== undefined
        ? { questionIndex: proto.questionIndex }
        : {}),
      type: proto.type,
      title: proto.hypothesis,
      hypothesis: proto.hypothesis,
      status: proto.status,
      ...(proto.outcome ? { outcome: proto.outcome } : {}),
    }));

    setWorkspace({
      gaugeValues: newGaugeValues,
      gaugeNotes: newGaugeNotes,
      problems: newProblems,
      compassData: newCompass,
      journalEntries: newJournals,
      reflectionFindings: newFindings,
      aeiouAnalyses: newAeiou,
      plans: newPlans,
      feedbacks: workspace.feedbacks,
      prototypes: newPrototypes,
    });

    return (
      d.designCycles.length +
      d.hwplAssessments.length +
      d.lifeProblems.length +
      d.compassEntries.length +
      d.journalEntries.length +
      d.reflectionFindings.length +
      d.aeiouAnalyses.length +
      d.odysseyPlans.length +
      d.odysseyFeedbacks.length +
      d.prototypes.length
    );
  };

  const exportBundle = async (passphrase: string) => {
    const data = buildExportData();
    const rawBytes = new TextEncoder().encode(JSON.stringify(data));
    const bundleRes = await cryptoService.createBundle(rawBytes, passphrase);
    if (!bundleRes.ok) {
      return { success: false, error: bundleRes.error.message };
    }
    return { success: true, data: bundleRes.value };
  };

  const importBundle = async (bundleString: string, passphrase: string) => {
    const unpackRes = await cryptoService.unpackBundle(bundleString, passphrase);
    if (!unpackRes.ok) {
      return { success: false, error: unpackRes.error.message };
    }

    let parsed: unknown;
    try {
      const jsonStr = new TextDecoder().decode(unpackRes.value);
      parsed = JSON.parse(jsonStr);
    } catch {
      return { success: false, error: "رمزگشایی انجام شد اما محتوای فایل معتبر نیست." };
    }

    const validated = OdysseyExportDataSchema.safeParse(parsed);
    if (!validated.success) {
      return { success: false, error: validated.error.message };
    }

    const total = applyImportedData(validated.data);
    return { success: true, totalRecords: total };
  };

  const exportJson = async () => {
    const data = buildExportData();
    return { success: true, data: JSON.stringify(data, null, 2) };
  };

  const importJson = async (jsonString: string) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return { success: false, error: "فایل انتخاب شده یک ساختار JSON معتبر نیست." };
    }

    const validated = OdysseyExportDataSchema.safeParse(parsed);
    if (!validated.success) {
      return { success: false, error: validated.error.message };
    }

    const total = applyImportedData(validated.data);
    return { success: true, totalRecords: total };
  };

  const exportMarkdown = async () => {
    const data = buildExportData();
    const dateStr = new Date(data.exportedAt).toISOString().split("T")[0] ?? "archive";
    const files: Record<string, string> = {
      "README.md": `---
type: odyssey_archive
version: 1.0.0
exportedAt: "${dateStr}"
---

# Odyssey Life Design Studio — Archive Map of Content

این بایگانی شامل مستندات طراحی زندگی شما از استودیوی Odyssey است:

## فهرست دسترسی سریع به یادداشت‌ها
- دیدگاه کار (Compass/Workview)
- دیدگاه زندگی (Compass/Lifeview)
- انسجام قطب‌نما (Compass/Coherence)
- تراز چهارگانه سلامت، کار، بازی و عشق (Dashboard/HWPL)
- تفکیک مسائل گرانشی و چالش‌های طراحی (Problems/Gravity-and-Designable)
- دفترچه اوقات خوش (Journal/Index)
- مسیرهای سه‌گانه ادیسه (Odyssey/Index)
- آزمایشگاه پروتوتایپ (Prototypes/Index)
`,
      "Compass/Workview.md": `---
type: compass
view: workview
---

# دیدگاه کار (Workview)

${workspace.compassData.workview}
`,
      "Compass/Lifeview.md": `---
type: compass
view: lifeview
---

# دیدگاه زندگی (Lifeview)

${workspace.compassData.lifeview}
`,
      "Compass/Coherence.md": `---
type: coherence
---

# انسجام دیدگاه کار و زندگی

- نقاط مکمل: ${workspace.compassData.coherenceComplement || "تعیین نشده"}
- نقاط تضاد: ${workspace.compassData.coherenceConflict || "تعیین نشده"}
- راهنمای عمل: ${workspace.compassData.coherenceGuide || "تعیین نشده"}
`,
      "Dashboard/HWPL.md": `---
type: hwpl_dashboard
health: ${workspace.gaugeValues.health ?? 0}
work: ${workspace.gaugeValues.work ?? 0}
play: ${workspace.gaugeValues.play ?? 0}
love: ${workspace.gaugeValues.love ?? 0}
---

# تراز چهارگانه زندگی (HWPL)

- سلامت: ${workspace.gaugeValues.health ?? 0}%
- کار: ${workspace.gaugeValues.work ?? 0}%
- بازی: ${workspace.gaugeValues.play ?? 0}%
- عشق: ${workspace.gaugeValues.love ?? 0}%
`,
      "Problems/Gravity-and-Designable.md": `---
type: problems
---

# مسائل گرانشی و چالش‌های قابل طراحی

${workspace.problems.map((p) => `- ${p.isGravity ? "مسئله گرانشی (Gravity)" : "چالش طراحی (Designable)"}: ${p.content}`).join("\n")}
`,
    };

    return { success: true, files };
  };

  const hasData =
    (workspace.gaugeValues.health ?? 0) > 0 ||
    workspace.problems.length > 0 ||
    Boolean(workspace.compassData.workview) ||
    workspace.journalEntries.length > 0 ||
    workspace.prototypes.length > 0 ||
    Boolean(workspace.plans.LIFE_1.sixWordTitle);

  return (
    <StudioContext.Provider
      value={{
        gaugeValues: workspace.gaugeValues,
        gaugeNotes: workspace.gaugeNotes,
        problems: workspace.problems,
        compassData: workspace.compassData,
        journalEntries: workspace.journalEntries,
        reflectionFindings: workspace.reflectionFindings,
        aeiouAnalyses: workspace.aeiouAnalyses,
        plans: workspace.plans,
        feedbacks: workspace.feedbacks,
        prototypes: workspace.prototypes,
        hasData,
        activeCycle: "چرخه ۱",
        isVaultLocked,
        updateGauge,
        updateGaugeNote,
        addProblem,
        toggleProblem,
        deleteProblem,
        saveCompass,
        addJournalEntry,
        deleteJournalEntry,
        saveFinding,
        saveAeiou,
        updatePlan,
        saveFeedback,
        activeBridge,
        createPrototypeFromQuestion,
        clearActiveBridge,
        createPrototype,
        updatePrototypeStatus,
        deletePrototype,
        loadSampleWorkspace,
        clearWorkspace,
        lockVault,
        unlockVault,
        showPortabilityModal,
        setShowPortabilityModal,
        showOnboarding,
        setShowOnboarding,
        showMindsetsModal,
        setShowMindsetsModal,
        showVaultModal,
        setShowVaultModal,
        exportBundle,
        importBundle,
        exportJson,
        importJson,
        exportMarkdown,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}
