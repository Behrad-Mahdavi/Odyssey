import { describe, expect, it } from "vitest";
import { OdybundleV1Schema } from "../src/bundle/odybundle.schema.js";
import { WebCryptoService } from "../src/service/web-crypto.service.js";

describe("Encrypted Backup (.odybundle) Roundtrip Suite (F-011)", () => {
  const cryptoService = new WebCryptoService();
  const testPassphrase = "MasterSecurePassphrase2026!@#";

  const sampleExportData = {
    format: "odyssey-export" as const,
    schemaVersion: 1 as const,
    exportedAt: Date.now(),
    appVersion: "1.0.0",
    data: {
      designCycles: [
        {
          id: "cycle-1",
          name: "چرخه آزمایشی ۱",
          status: "ACTIVE" as const,
          startedAt: Date.now(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hlcTimestamp: "node-1",
        },
      ],
      hwplAssessments: [
        {
          id: "hwpl-1",
          cycleId: "cycle-1",
          health: 80,
          work: 75,
          play: 60,
          love: 90,
          healthNotes: "انرژی بالا",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hlcTimestamp: "node-1",
        },
      ],
      lifeProblems: [
        {
          id: "prob-1",
          cycleId: "cycle-1",
          content: "چالش زمان کافی",
          classification: "DESIGNABLE" as const,
          reframedQuestion: "چگونه زمان‌های تلف‌شده را بازآفرینی کنم؟",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hlcTimestamp: "node-1",
        },
      ],
      compassEntries: [
        {
          id: "comp-1",
          cycleId: "cycle-1",
          workview: "دیدگاه کار برای اثرگذاری مثبت و حل مسائل واقعی است.",
          lifeview: "زندگی فرصتی برای تجربه، رشد و آفرینش معنا است.",
          coherenceComplement: "هم‌راستا در یادگیری پیوسته",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hlcTimestamp: "node-1",
        },
      ],
      journalEntries: [
        {
          id: "jour-1",
          cycleId: "cycle-1",
          title: "طراحی استودیو",
          engagement: 90,
          energy: 85,
          isFlow: true,
          occurredAt: Date.now(),
          durationMinutes: 45,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hlcTimestamp: "node-1",
        },
      ],
      reflectionFindings: [],
      aeiouAnalyses: [],
      odysseyPlans: [
        {
          id: "plan-1",
          cycleId: "cycle-1",
          slot: "LIFE_1" as const,
          sixWordTitle: "ساخت استودیوی محلی برای طراحی زندگی",
          resources: 85,
          likability: 90,
          confidence: 80,
          coherence: 95,
          questionsJson: JSON.stringify(["سؤال ۱", "سؤال ۲", "سؤال ۳"]),
          timelineEventsJson: JSON.stringify([]),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hlcTimestamp: "node-1",
        },
      ],
      odysseyFeedbacks: [],
      prototypes: [
        {
          id: "proto-1",
          cycleId: "cycle-1",
          odysseyPlanId: "plan-1",
          questionIndex: 0,
          type: "CONVERSATION" as const,
          hypothesis: "آیا بازخورد طراحان نسبت به ابزارهای محلی مثبت است؟",
          status: "COMPLETED" as const,
          outcome: "بله، استقبال عالی بود.",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          hlcTimestamp: "node-1",
        },
      ],
    },
  };

  it("should create an encrypted .odybundle and restore payload with 100% fidelity using Argon2id and AES-256-GCM", async () => {
    const rawJson = JSON.stringify(sampleExportData);
    const rawBytes = new TextEncoder().encode(rawJson);

    // 1. Pack into .odybundle
    const bundleRes = await cryptoService.createBundle(rawBytes, testPassphrase);
    expect(bundleRes.ok).toBe(true);
    if (!bundleRes.ok) return;

    const bundleString = bundleRes.value;

    // Verify .odybundle structure against Zod Schema
    const parsedBundle = JSON.parse(bundleString);
    const validateSchema = OdybundleV1Schema.safeParse(parsedBundle);
    expect(validateSchema.success).toBe(true);
    if (!validateSchema.success) return;

    expect(validateSchema.data.format).toBe("odyssey-bundle");
    expect(validateSchema.data.bundleVersion).toBe(1);
    expect(validateSchema.data.kdf.algorithm).toBe("argon2id");
    expect(validateSchema.data.cipher.algorithm).toBe("AES-256-GCM");
    expect(validateSchema.data.bundleChecksumSha256).toHaveLength(64);

    // 2. Unpack with correct passphrase
    const unpackRes = await cryptoService.unpackBundle(bundleString, testPassphrase);
    expect(unpackRes.ok).toBe(true);
    if (!unpackRes.ok) return;

    const restoredBytes = unpackRes.value;
    const restoredJson = new TextDecoder().decode(restoredBytes);
    const restoredData = JSON.parse(restoredJson);

    expect(restoredData.format).toBe("odyssey-export");
    expect(restoredData.data.designCycles[0].name).toBe("چرخه آزمایشی ۱");
    expect(restoredData.data.odysseyPlans[0].sixWordTitle).toBe(
      "ساخت استودیوی محلی برای طراحی زندگی",
    );
    expect(restoredData.data.prototypes[0].outcome).toBe("بله، استقبال عالی بود.");
  });

  it("should fail unpacking with INVALID_PASSPHRASE if passphrase is wrong", async () => {
    const rawBytes = new TextEncoder().encode(JSON.stringify(sampleExportData));
    const bundleRes = await cryptoService.createBundle(rawBytes, testPassphrase);
    expect(bundleRes.ok).toBe(true);
    if (!bundleRes.ok) return;

    const unpackRes = await cryptoService.unpackBundle(bundleRes.value, "WrongPassphrase123!");
    expect(unpackRes.ok).toBe(false);
    if (!unpackRes.ok) {
      expect(unpackRes.error.code).toBe("INVALID_PASSPHRASE");
    }
  });

  it("should detect tampering in ciphertext and reject with BUNDLE_CORRUPTED before decryption", async () => {
    const rawBytes = new TextEncoder().encode(JSON.stringify(sampleExportData));
    const bundleRes = await cryptoService.createBundle(rawBytes, testPassphrase);
    expect(bundleRes.ok).toBe(true);
    if (!bundleRes.ok) return;

    const bundleObj = JSON.parse(bundleRes.value);
    // Tamper with ciphertext by altering a base64 character
    const ct = bundleObj.ciphertextBase64 as string;
    const tamperedChar = ct[10] === "A" ? "B" : "A";
    bundleObj.ciphertextBase64 = `${ct.slice(0, 10)}${tamperedChar}${ct.slice(11)}`;

    const tamperedBundleString = JSON.stringify(bundleObj);
    const unpackRes = await cryptoService.unpackBundle(tamperedBundleString, testPassphrase);

    expect(unpackRes.ok).toBe(false);
    if (!unpackRes.ok) {
      expect(unpackRes.error.code).toBe("BUNDLE_CORRUPTED");
      expect(unpackRes.error.message).toContain("checksum mismatch");
    }
  });
});
