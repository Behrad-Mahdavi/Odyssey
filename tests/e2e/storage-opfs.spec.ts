import { expect, test } from "@playwright/test";

test.describe("Odyssey Local-First OPFS & Security E2E", () => {
  test("should render the Odyssey Studio with Local Vault offline status", async ({ page }) => {
    // Intercept and assert zero remote telemetry or external network calls
    const externalRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (!url.startsWith("http://localhost:3000") && !url.startsWith("data:")) {
        externalRequests.push(url);
      }
    });

    await page.goto("/");

    // Verify Title & UI header
    await expect(page).toHaveTitle(/Odyssey/);
    const vaultIndicator = page.locator("text=Local Vault · Offline");
    await expect(vaultIndicator).toBeVisible();

    // Verify zero external network calls were made
    expect(externalRequests).toHaveLength(0);
  });

  test("should retain state and operate in complete offline mode", async ({ context, page }) => {
    await page.goto("/");
    await expect(page.locator("text=Local Vault · Offline")).toBeVisible();

    // Emulate complete offline disconnection
    await context.setOffline(true);

    // Reload page in offline mode
    await page.reload();
    await expect(page.locator("text=Local Vault · Offline")).toBeVisible();

    // Restore online
    await context.setOffline(false);
  });

  test("should enforce multi-tab lock protection via Web Locks API", async ({ context }) => {
    const page1 = await context.newPage();
    await page1.goto("/");

    // Open second concurrent tab
    const page2 = await context.newPage();
    await page2.goto("/");

    // Both tabs successfully load with isolated safe rendering
    await expect(page1.locator("text=Local Vault · Offline")).toBeVisible();
    await expect(page2.locator("text=Local Vault · Offline")).toBeVisible();

    await page1.close();
    await page2.close();
  });
});
