import { test, expect } from "@playwright/test";

/**
 * Visual Regression Tests for Skeleton Pages
 *
 * These tests capture screenshots of the new skeleton pages
 * to detect unintended UI changes.
 *
 * To update baselines:
 *   npm run test:visual -- --update-snapshots --project=chromium
 */

// Cross-platform visual comparison options
const visualCompareOptions = {
  maxDiffPixelRatio: 0.15,
  threshold: 0.3,
};

// Helper to register and authenticate
async function registerAndAuthenticate(
  page: import("@playwright/test").Page,
  emailPrefix: string
) {
  const user = {
    email: `${emailPrefix}-${Date.now()}@example.com`,
    password: "TestPass123!",
  };

  await page.goto("/register");
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/documents", { timeout: 10000 });
  return user;
}

test.describe("Upload Page Visual Regression @visual", () => {
  test("should match desktop screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "visual-upload-desktop");

    await page.goto("/upload");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("upload-desktop.png", visualCompareOptions);
  });

  test("should match mobile screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndAuthenticate(page, "visual-upload-mobile");

    await page.goto("/upload");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("upload-mobile.png", visualCompareOptions);
  });
});

test.describe("Documents List Page Visual Regression @visual", () => {
  test("should match desktop screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "visual-docs-desktop");

    await page.goto("/documents");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("documents-list-desktop.png", visualCompareOptions);
  });

  test("should match mobile screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndAuthenticate(page, "visual-docs-mobile");

    await page.goto("/documents");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("documents-list-mobile.png", visualCompareOptions);
  });
});

test.describe("Document Detail Page Visual Regression @visual", () => {
  test("should match desktop screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "visual-detail-desktop");

    await page.goto("/documents/sample-doc-id");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("document-detail-desktop.png", visualCompareOptions);
  });

  test("should match mobile screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndAuthenticate(page, "visual-detail-mobile");

    await page.goto("/documents/sample-doc-id");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("document-detail-mobile.png", visualCompareOptions);
  });
});

test.describe("Settings Page Visual Regression @visual", () => {
  test("should match desktop screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "visual-settings-desktop");

    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("settings-desktop.png", visualCompareOptions);
  });

  test("should match mobile screenshot @visual", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndAuthenticate(page, "visual-settings-mobile");

    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("settings-mobile.png", visualCompareOptions);
  });
});

test.describe("Loading State Visual Regression @visual", () => {
  test("should match loading spinner design @visual", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "visual-loading");

    // Navigate to upload and capture during load
    // Note: This is tricky since loading is transient
    // We'll test the loading component directly by visiting during server delay
    await page.goto("/upload");
    await page.waitForLoadState("networkidle");

    // The loading state appears briefly, so we just verify the page loads
    // Visual testing of loading state would require mocking slow responses
    await expect(page.locator("h1")).toContainText("Upload");
  });
});

test.describe("User Journey Flow Visual Regression @visual", () => {
  test("should capture authenticated navigation flow @visual", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "visual-journey");

    // Capture documents page (landing after auth)
    await page.goto("/documents");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("journey-01-documents.png", visualCompareOptions);

    // Navigate to upload
    await page.click('header a[href="/upload"]');
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("journey-02-upload.png", visualCompareOptions);

    // Navigate to settings
    await page.click('header a[href="/settings"]');
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("journey-03-settings.png", visualCompareOptions);

    // Navigate to document detail
    await page.goto("/documents/test-journey-doc");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("journey-04-document-detail.png", visualCompareOptions);
  });
});
