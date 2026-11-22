import type { Result } from "@odyssey/domain";
import { z } from "zod";
import type { StorageError } from "../errors/storage-error.js";

// Design Cycle DTO Schema
export const DesignCycleExportSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(["ACTIVE", "ARCHIVED_SNAPSHOT"]),
  startedAt: z.number().int(),
  snapshotAt: z.number().int().nullable().optional(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// HWPL Assessment DTO Schema
export const HwplAssessmentExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  health: z.number().min(0).max(100),
  work: z.number().min(0).max(100),
  play: z.number().min(0).max(100),
  love: z.number().min(0).max(100),
  healthNotes: z.string().nullable().optional(),
  workNotes: z.string().nullable().optional(),
  playNotes: z.string().nullable().optional(),
  loveNotes: z.string().nullable().optional(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Life Problem DTO Schema
export const LifeProblemExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  content: z.string().min(1),
  classification: z.enum(["GRAVITY", "DESIGNABLE"]),
  anchorStatement: z.string().nullable().optional(),
  reframedQuestion: z.string().nullable().optional(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Compass Entry DTO Schema
export const CompassEntryExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  workview: z.string(),
  lifeview: z.string(),
  coherenceComplement: z.string().nullable().optional(),
  coherenceConflict: z.string().nullable().optional(),
  coherenceGuide: z.string().nullable().optional(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Journal Entry DTO Schema
export const JournalEntryExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  title: z.string().min(1),
  engagement: z.number().min(0).max(100),
  energy: z.number().min(-100).max(100),
  isFlow: z.boolean(),
  occurredAt: z.number().int(),
  durationMinutes: z.number().int().nullable().optional(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Reflection Finding DTO Schema
export const ReflectionFindingExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  journalEntryId: z.string().nullable().optional(),
  tag: z.enum(["TREND", "INSIGHT", "SURPRISE"]),
  notes: z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// AEIOU Analysis DTO Schema
export const AeiouAnalysisExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  reflectionFindingId: z.string().min(1),
  activities: z.string(),
  environments: z.string(),
  interactions: z.string(),
  objects: z.string(),
  users: z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Odyssey Plan DTO Schema
export const OdysseyPlanExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  slot: z.enum(["LIFE_1", "LIFE_2", "LIFE_3"]),
  sixWordTitle: z.string(),
  resources: z.number().min(0).max(100),
  likability: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  coherence: z.number().min(0).max(100),
  questionsJson: z.string(),
  timelineEventsJson: z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Odyssey Feedback DTO Schema
export const OdysseyFeedbackExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  odysseyPlanId: z.string().min(1),
  sessionId: z.string().nullable().optional(),
  externalFeedback: z.string(),
  presenterEnergyNote: z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Prototype DTO Schema
export const PrototypeExportSchema = z.object({
  id: z.string().min(1),
  cycleId: z.string().min(1),
  odysseyPlanId: z.string().nullable().optional(),
  questionIndex: z.number().int().nullable().optional(),
  type: z.enum(["CONVERSATION", "EXPERIENCE"]),
  hypothesis: z.string(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "ABANDONED"]),
  outcome: z.string().nullable().optional(),
  contactId: z.string().nullable().optional(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  hlcTimestamp: z.string().min(1),
  deletedAt: z.number().int().nullable().optional(),
});

// Master Odyssey Export Data Schema (Strict Validation for JSON backups)
export const OdysseyExportDataSchema = z.object({
  format: z.literal("odyssey-export"),
  schemaVersion: z.literal(1),
  exportedAt: z.number().int().positive(),
  appVersion: z.string().default("1.0.0"),
  data: z.object({
    designCycles: z.array(DesignCycleExportSchema).default([]),
    hwplAssessments: z.array(HwplAssessmentExportSchema).default([]),
    lifeProblems: z.array(LifeProblemExportSchema).default([]),
    compassEntries: z.array(CompassEntryExportSchema).default([]),
    journalEntries: z.array(JournalEntryExportSchema).default([]),
    reflectionFindings: z.array(ReflectionFindingExportSchema).default([]),
    aeiouAnalyses: z.array(AeiouAnalysisExportSchema).default([]),
    odysseyPlans: z.array(OdysseyPlanExportSchema).default([]),
    odysseyFeedbacks: z.array(OdysseyFeedbackExportSchema).default([]),
    prototypes: z.array(PrototypeExportSchema).default([]),
  }),
});

export type OdysseyExportData = z.infer<typeof OdysseyExportDataSchema>;

export interface ImportSummary {
  success: boolean;
  designCycles: number;
  hwplAssessments: number;
  lifeProblems: number;
  compassEntries: number;
  journalEntries: number;
  reflectionFindings: number;
  aeiouAnalyses: number;
  odysseyPlans: number;
  odysseyFeedbacks: number;
  prototypes: number;
  totalRecords: number;
}

export interface IPortabilityService {
  exportAllData(): Promise<Result<OdysseyExportData, StorageError>>;
  importAllData(data: OdysseyExportData): Promise<Result<ImportSummary, StorageError>>;
  generateMarkdownArchive(data: OdysseyExportData): Result<Record<string, string>, StorageError>;
}
