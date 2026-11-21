import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Standard audit and sync columns for all entities.
 */
const baseColumns = {
  id: text("id").primaryKey(),
  cycleId: text("cycle_id").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  hlcTimestamp: text("hlc_timestamp").notNull(),
  deletedAt: integer("deleted_at"),
};

// Design Cycles (FR-00.3 / Intro & Conclusion)
export const designCycles = sqliteTable("design_cycles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status", { enum: ["ACTIVE", "ARCHIVED_SNAPSHOT"] })
    .notNull()
    .default("ACTIVE"),
  startedAt: integer("started_at").notNull(),
  snapshotAt: integer("snapshot_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  hlcTimestamp: text("hlc_timestamp").notNull(),
  deletedAt: integer("deleted_at"),
});

// Chapter 1: HWPL Assessments
export const hwplAssessments = sqliteTable("hwpl_assessments", {
  ...baseColumns,
  health: integer("health").notNull(),
  work: integer("work").notNull(),
  play: integer("play").notNull(),
  love: integer("love").notNull(),
  healthNotes: text("health_notes"),
  workNotes: text("work_notes"),
  playNotes: text("play_notes"),
  loveNotes: text("love_notes"),
});

// Chapter 1 & 4: Gravity vs Designable Problems
export const lifeProblems = sqliteTable("life_problems", {
  ...baseColumns,
  content: text("content").notNull(),
  classification: text("classification", { enum: ["GRAVITY", "DESIGNABLE"] }).notNull(),
  anchorStatement: text("anchor_statement"),
  reframedQuestion: text("reframed_question"),
});

// Chapter 2: Compass Studio (Workview & Lifeview)
export const compassEntries = sqliteTable("compass_entries", {
  ...baseColumns,
  workview: text("workview").notNull(),
  lifeview: text("lifeview").notNull(),
  coherenceComplement: text("coherence_complement"),
  coherenceConflict: text("coherence_conflict"),
  coherenceGuide: text("coherence_guide"),
});

// Chapter 3: Good Time Journal Activity Log
export const journalEntries = sqliteTable("journal_entries", {
  ...baseColumns,
  title: text("title").notNull(),
  engagement: integer("engagement").notNull(), // 0..100
  energy: integer("energy").notNull(), // -100..+100
  isFlow: integer("is_flow", { mode: "boolean" }).notNull().default(false),
  occurredAt: integer("occurred_at").notNull(),
  durationMinutes: integer("duration_minutes"),
});

// Chapter 3: Reflection Findings
export const reflectionFindings = sqliteTable("reflection_findings", {
  ...baseColumns,
  journalEntryId: text("journal_entry_id").references(() => journalEntries.id),
  tag: text("tag", { enum: ["TREND", "INSIGHT", "SURPRISE"] }).notNull(),
  notes: text("notes").notNull(),
});

// Chapter 3: AEIOU Deep Dive (INV-04)
export const aeiouAnalyses = sqliteTable("aeiou_analyses", {
  ...baseColumns,
  reflectionFindingId: text("reflection_finding_id")
    .references(() => reflectionFindings.id)
    .notNull(),
  activities: text("activities").notNull(),
  environments: text("environments").notNull(),
  interactions: text("interactions").notNull(),
  objects: text("objects").notNull(),
  users: text("users").notNull(),
});

// Chapter 4: Mind Maps & Nodes
export const mindMaps = sqliteTable("mind_maps", {
  ...baseColumns,
  title: text("title").notNull(),
  peakType: text("peak_type", { enum: ["ENGAGEMENT", "ENERGY", "FLOW"] }).notNull(),
  timerSeconds: integer("timer_seconds").notNull().default(300),
});

export const mindMapNodes = sqliteTable("mind_map_nodes", {
  ...baseColumns,
  mindMapId: text("mind_map_id")
    .references(() => mindMaps.id)
    .notNull(),
  parentId: text("parent_id"),
  depth: integer("depth").notNull(),
  label: text("label").notNull(),
});

// Chapter 4: Concept Cards from 3-Node Mash-up (INV-05)
export const conceptCards = sqliteTable("concept_cards", {
  ...baseColumns,
  title: text("title").notNull(),
  description: text("description").notNull(),
  nodeIdsJson: text("node_ids_json").notNull(), // Array of 3 node IDs
});

// Chapter 5: Odyssey Plans (INV-01, INV-02, INV-03)
export const odysseyPlans = sqliteTable("odyssey_plans", {
  ...baseColumns,
  slot: text("slot", { enum: ["LIFE_1", "LIFE_2", "LIFE_3"] }).notNull(),
  sixWordTitle: text("six_word_title").notNull(),
  resources: integer("resources").notNull(),
  likability: integer("likability").notNull(),
  confidence: integer("confidence").notNull(),
  coherence: integer("coherence").notNull(),
  questionsJson: text("questions_json").notNull(), // exactly 3 questions
  timelineEventsJson: text("timeline_events_json").notNull(),
});

// Chapter 5: Odyssey Pitch Feedback
export const odysseyFeedbacks = sqliteTable("odyssey_feedbacks", {
  ...baseColumns,
  odysseyPlanId: text("odyssey_plan_id")
    .references(() => odysseyPlans.id)
    .notNull(),
  sessionId: text("session_id"),
  externalFeedback: text("external_feedback").notNull(),
  presenterEnergyNote: text("presenter_energy_note").notNull(),
});

// Chapter 6: Prototyping Lab
export const prototypes = sqliteTable("prototypes", {
  ...baseColumns,
  odysseyPlanId: text("odyssey_plan_id").references(() => odysseyPlans.id),
  questionIndex: integer("question_index"),
  type: text("type", { enum: ["CONVERSATION", "EXPERIENCE"] }).notNull(),
  hypothesis: text("hypothesis").notNull(),
  status: text("status", { enum: ["PLANNED", "IN_PROGRESS", "COMPLETED", "ABANDONED"] })
    .notNull()
    .default("PLANNED"),
  outcome: text("outcome"),
  contactId: text("contact_id"),
});

// Chapter 8 & 11: Contacts and 4 Rings
export const contacts = sqliteTable("contacts", {
  ...baseColumns,
  name: text("name").notNull(),
  ring: text("ring", { enum: ["SUPPORTER", "PLAYER", "INTIMATE", "TEAM"] }).notNull(),
  referredByContactId: text("referred_by_contact_id"),
  storyNotes: text("story_notes"),
});

// Chapter 7 & 8: Career Offers
export const careerOffers = sqliteTable("career_offers", {
  ...baseColumns,
  company: text("company").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
});

// Chapter 9: Decision Room (INV-06, INV-07)
export const decisions = sqliteTable("decisions", {
  ...baseColumns,
  title: text("title").notNull(),
  status: text("status", { enum: ["GATHERING", "NARROWING", "GROKKING", "COMMITTED"] })
    .notNull()
    .default("GATHERING"),
});

export const decisionOptions = sqliteTable("decision_options", {
  ...baseColumns,
  decisionId: text("decision_id")
    .references(() => decisions.id)
    .notNull(),
  title: text("title").notNull(),
  status: text("status", { enum: ["ACTIVE", "LET_GO_ARCHIVED", "CHOSEN"] })
    .notNull()
    .default("ACTIVE"),
});

export const grokkingLogs = sqliteTable("grokking_logs", {
  ...baseColumns,
  decisionOptionId: text("decision_option_id")
    .references(() => decisionOptions.id)
    .notNull(),
  somaticNotes: text("somatic_notes").notNull(),
  reflection: text("reflection").notNull(),
});

// Chapter 10: Failure Immunity (INV-08)
export const failureLogs = sqliteTable("failure_logs", {
  ...baseColumns,
  bucket: text("bucket", { enum: ["SCREWUP", "WEAKNESS", "GROWTH_OPPORTUNITY"] }).notNull(),
  description: text("description").notNull(),
  systemAdjustment: text("system_adjustment"),
  criticalFactor: text("critical_factor"),
  nextAction: text("next_action"),
});

// Chapter 11: Team Sessions
export const teamSessions = sqliteTable("team_sessions", {
  ...baseColumns,
  title: text("title").notNull(),
  scheduledAt: integer("scheduled_at").notNull(),
  notes: text("notes"),
  rulesAgreed: integer("rules_agreed", { mode: "boolean" }).notNull().default(true),
});
