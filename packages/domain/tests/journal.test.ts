import { describe, expect, it } from "vitest";
import {
  AeiouAnalysis,
  DomainRangeError,
  JournalEntry,
  OrphanRecordError,
  ReflectionFinding,
} from "../src/index.js";

describe("Good Time Journal Domain Invariants (F-008)", () => {
  describe("JournalEntry (INV-01)", () => {
    it("should create valid journal entry with engagement [0..100] and energy [-100..+100]", () => {
      const entryResult = JournalEntry.create({
        cycleId: "cycle-1",
        title: "برنامه‌ریزی معماری ادیسه",
        engagement: 90,
        energy: 75,
        isFlow: true,
        durationMinutes: 45,
      });

      expect(entryResult.ok).toBe(true);
      if (!entryResult.ok) return;

      expect(entryResult.value.title).toBe("برنامه‌ریزی معماری ادیسه");
      expect(entryResult.value.engagement).toBe(90);
      expect(entryResult.value.energy).toBe(75);
      expect(entryResult.value.isFlow).toBe(true);
      expect(entryResult.value.durationMinutes).toBe(45);
    });

    it("should allow negative energy values within [-100, 100] (INV-01)", () => {
      const drainingEntry = JournalEntry.create({
        cycleId: "cycle-1",
        title: "جلسه اداری طولانی و بی‌هدف",
        engagement: 20,
        energy: -85,
        isFlow: false,
      });

      expect(drainingEntry.ok).toBe(true);
      if (!drainingEntry.ok) return;
      expect(drainingEntry.value.energy).toBe(-85);
    });

    it("should reject energy outside [-100, 100] with DomainRangeError (INV-01)", () => {
      const invalidLow = JournalEntry.create({
        cycleId: "cycle-1",
        title: "تست",
        engagement: 50,
        energy: -101,
      });
      expect(invalidLow.ok).toBe(false);
      if (invalidLow.ok) return;
      expect(invalidLow.error).toBeInstanceOf(DomainRangeError);
      expect(invalidLow.error.code).toBe("DOMAIN_RANGE_ERROR");

      const invalidHigh = JournalEntry.create({
        cycleId: "cycle-1",
        title: "تست",
        engagement: 50,
        energy: 105,
      });
      expect(invalidHigh.ok).toBe(false);
      if (invalidHigh.ok) return;
      expect(invalidHigh.error).toBeInstanceOf(DomainRangeError);
    });

    it("should reject engagement outside [0, 100] with DomainRangeError (INV-01)", () => {
      const invalidEngagement = JournalEntry.create({
        cycleId: "cycle-1",
        title: "تست",
        engagement: 110,
        energy: 50,
      });
      expect(invalidEngagement.ok).toBe(false);
      if (invalidEngagement.ok) return;
      expect(invalidEngagement.error).toBeInstanceOf(DomainRangeError);
    });

    it("should reject empty title", () => {
      const emptyTitle = JournalEntry.create({
        cycleId: "cycle-1",
        title: "   ",
        engagement: 50,
        energy: 50,
      });
      expect(emptyTitle.ok).toBe(false);
      if (emptyTitle.ok) return;
      expect(emptyTitle.error.code).toBe("DOMAIN_INVARIANT_VIOLATION");
    });
  });

  describe("ReflectionFinding (INV-04)", () => {
    it("should create valid reflection finding linked to a journal entry", () => {
      const findingResult = ReflectionFinding.create({
        cycleId: "cycle-1",
        journalEntryId: "entry-123",
        tag: "SURPRISE",
        notes: "متوجه شدم کدنویسی سیستم‌های محلی در صبح بالاترین انرژی را ایجاد می‌کند",
      });

      expect(findingResult.ok).toBe(true);
      if (!findingResult.ok) return;
      expect(findingResult.value.journalEntryId).toBe("entry-123");
      expect(findingResult.value.tag).toBe("SURPRISE");
    });

    it("should reject reflection finding without journalEntryId (INV-04 Orphan record)", () => {
      const orphanResult = ReflectionFinding.create({
        cycleId: "cycle-1",
        journalEntryId: "   ",
        tag: "TREND",
        notes: "بدون ژورنال والد",
      });

      expect(orphanResult.ok).toBe(false);
      if (orphanResult.ok) return;
      expect(orphanResult.error).toBeInstanceOf(OrphanRecordError);
      expect(orphanResult.error.invariantId).toBe("INV-04");
    });
  });

  describe("AeiouAnalysis (INV-04)", () => {
    it("should create valid AEIOU analysis linked to reflection finding", () => {
      const aeiouResult = AeiouAnalysis.create({
        cycleId: "cycle-1",
        reflectionFindingId: "finding-456",
        activities: "طراحی معماری نرم‌افزار تمیز",
        environments: "اتاق آرام با نور طبیعی",
        interactions: "بحث فنی سازنده دونفره",
        objects: "دفترچه یادداشت مهندسی و ادیتور متنی",
        users: "توسعه‌دهنده سیستم و معمار نرم‌افزار",
      });

      expect(aeiouResult.ok).toBe(true);
      if (!aeiouResult.ok) return;
      expect(aeiouResult.value.reflectionFindingId).toBe("finding-456");
      expect(aeiouResult.value.activities).toBe("طراحی معماری نرم‌افزار تمیز");
    });

    it("should reject AEIOU analysis without reflectionFindingId (INV-04 Orphan record)", () => {
      const orphanResult = AeiouAnalysis.create({
        cycleId: "cycle-1",
        reflectionFindingId: "",
        activities: "فعالیت بدون مرجع",
        environments: "محیط",
        interactions: "تعامل",
        objects: "شیء",
        users: "کاربر",
      });

      expect(orphanResult.ok).toBe(false);
      if (orphanResult.ok) return;
      expect(orphanResult.error).toBeInstanceOf(OrphanRecordError);
      expect(orphanResult.error.invariantId).toBe("INV-04");
    });
  });
});
