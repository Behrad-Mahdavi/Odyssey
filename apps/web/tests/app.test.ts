import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { App } from "../src/App.js";
import i18n from "../src/i18n.js";

describe("Web App & PWA Sanity (F-004)", () => {
  it("should export App functional component", () => {
    expect(typeof App).toBe("function");
  });

  it("should initialize i18n with fa-IR and en-US resources", () => {
    expect(i18n.isInitialized).toBe(true);
    expect(i18n.hasResourceBundle("fa", "translation")).toBe(true);
    expect(i18n.hasResourceBundle("en", "translation")).toBe(true);
    expect(i18n.t("common.appName")).toBe("Odyssey");
  });

  it("should include PWA Web Manifest with standalone display and offline icons", () => {
    const manifestPath = resolve(import.meta.dirname, "../public/manifest.webmanifest");
    expect(existsSync(manifestPath)).toBe(true);
    const content = JSON.parse(readFileSync(manifestPath, "utf-8"));
    expect(content.name).toContain("Odyssey");
    expect(content.display).toBe("standalone");
    expect(content.start_url).toBe("/");
    expect(content.icons.length).toBeGreaterThan(0);
  });

  it("should include Offline Service Worker with cache-first and stale-while-revalidate strategy", () => {
    const swPath = resolve(import.meta.dirname, "../public/sw.js");
    expect(existsSync(swPath)).toBe(true);
    const content = readFileSync(swPath, "utf-8");
    expect(content).toContain("caches.open");
    expect(content).toContain("odyssey-v1");
  });
});
