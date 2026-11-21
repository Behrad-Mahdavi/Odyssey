import { setupFts5 } from "../fts/fts5-setup.js";
import type { Migration } from "./migration-runner.js";

export const migration0001: Migration = {
  version: 1,
  name: "0001_initial_schema",
  up: async (driver) => {
    // 1. Core tables
    await driver.exec(`
      CREATE TABLE IF NOT EXISTS design_cycles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        started_at INTEGER NOT NULL,
        snapshot_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS hwpl_assessments (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        health INTEGER NOT NULL,
        work INTEGER NOT NULL,
        play INTEGER NOT NULL,
        love INTEGER NOT NULL,
        health_notes TEXT,
        work_notes TEXT,
        play_notes TEXT,
        love_notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS life_problems (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        content TEXT NOT NULL,
        classification TEXT NOT NULL,
        anchor_statement TEXT,
        reframed_question TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS compass_entries (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        workview TEXT NOT NULL,
        lifeview TEXT NOT NULL,
        coherence_complement TEXT,
        coherence_conflict TEXT,
        coherence_guide TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        title TEXT NOT NULL,
        engagement INTEGER NOT NULL,
        energy INTEGER NOT NULL,
        is_flow INTEGER NOT NULL DEFAULT 0,
        occurred_at INTEGER NOT NULL,
        duration_minutes INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS reflection_findings (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        journal_entry_id TEXT REFERENCES journal_entries(id),
        tag TEXT NOT NULL,
        notes TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS aeiou_analyses (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        reflection_finding_id TEXT REFERENCES reflection_findings(id) NOT NULL,
        activities TEXT NOT NULL,
        environments TEXT NOT NULL,
        interactions TEXT NOT NULL,
        objects TEXT NOT NULL,
        users TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS mind_maps (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        title TEXT NOT NULL,
        peak_type TEXT NOT NULL,
        timer_seconds INTEGER NOT NULL DEFAULT 300,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS mind_map_nodes (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        mind_map_id TEXT REFERENCES mind_maps(id) NOT NULL,
        parent_id TEXT,
        depth INTEGER NOT NULL,
        label TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS concept_cards (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        node_ids_json TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS odyssey_plans (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        slot TEXT NOT NULL,
        six_word_title TEXT NOT NULL,
        resources INTEGER NOT NULL,
        likability INTEGER NOT NULL,
        confidence INTEGER NOT NULL,
        coherence INTEGER NOT NULL,
        questions_json TEXT NOT NULL,
        timeline_events_json TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS odyssey_feedbacks (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        odyssey_plan_id TEXT REFERENCES odyssey_plans(id) NOT NULL,
        session_id TEXT,
        external_feedback TEXT NOT NULL,
        presenter_energy_note TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS prototypes (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        odyssey_plan_id TEXT REFERENCES odyssey_plans(id),
        question_index INTEGER,
        type TEXT NOT NULL,
        hypothesis TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PLANNED',
        outcome TEXT,
        contact_id TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        name TEXT NOT NULL,
        ring TEXT NOT NULL,
        referred_by_contact_id TEXT,
        story_notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS career_offers (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'GATHERING',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS decision_options (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        decision_id TEXT REFERENCES decisions(id) NOT NULL,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS grokking_logs (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        decision_option_id TEXT REFERENCES decision_options(id) NOT NULL,
        somatic_notes TEXT NOT NULL,
        reflection TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS failure_logs (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        bucket TEXT NOT NULL,
        description TEXT NOT NULL,
        system_adjustment TEXT,
        critical_factor TEXT,
        next_action TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );

      CREATE TABLE IF NOT EXISTS team_sessions (
        id TEXT PRIMARY KEY,
        cycle_id TEXT NOT NULL,
        title TEXT NOT NULL,
        scheduled_at INTEGER NOT NULL,
        notes TEXT,
        rules_agreed INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        hlc_timestamp TEXT NOT NULL,
        deleted_at INTEGER
      );
    `);

    // 2. Setup FTS5 virtual table & triggers
    await setupFts5(driver);
  },
};
