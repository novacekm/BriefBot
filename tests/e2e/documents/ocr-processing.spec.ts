import { test, expect } from "@playwright/test";
import path from "path";

/**
 * E2E Tests for OCR Processing Flow
 *
 * Tests the document OCR processing functionality:
 * - Triggering text extraction from PENDING state
 * - Status transitions (PENDING → PROCESSING → COMPLETED)
 * - Displaying extracted text and metadata
 * - Displaying structured data (deadlines, amounts, actions)
 * - German tax document sample detection
 */

const fixturesPath = path.join(__dirname, "../../fixtures");

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

// Helper to upload a document with a custom filename (by renaming)
async function uploadDocumentWithName(
  page: import("@playwright/test").Page,
  sourceFile: string,
  targetFilename: string
): Promise<string> {
  await page.goto("/upload");
  const fileInput = page.locator('input[type="file"]');

  // Upload file - the filename from the fixture will be used
  // Note: Browser limitations prevent renaming, so we test with actual fixture
  await fileInput.setInputFiles(path.join(fixturesPath, sourceFile));

  // Wait for upload to complete and redirect to document detail
  await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });
  const documentUrl = page.url();
  return documentUrl.split("/documents/")[1];
}

test.describe("OCR Processing - Extract Text Button", () => {
  test("should show Extract Text button for PENDING document", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-pending");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Should show Extract Text button
    const extractButton = page.getByRole("button", { name: "Extract Text" });
    await expect(extractButton).toBeVisible();
    await expect(extractButton).toBeEnabled();
  });

  test("should trigger OCR when clicking Extract Text", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-extract");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Click Extract Text button
    const extractButton = page.getByRole("button", { name: "Extract Text" });
    await extractButton.click();

    // Should show loading state
    await expect(page.getByText("Processing...")).toBeVisible({ timeout: 5000 });

    // Wait for processing to complete (mock OCR has 1-2s delay)
    // Should transition to COMPLETED state
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("OCR Processing - Status Transitions", () => {
  test("should show Completed status after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-status");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Status should show Completed badge
    await expect(page.getByText("Completed", { exact: true })).toBeVisible();
  });
});

test.describe("OCR Processing - Extracted Content", () => {
  test("should display extracted text after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-text");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Should show Extracted Text section
    await expect(page.getByRole("heading", { name: "Extracted Text" })).toBeVisible();

    // Should have copy button
    await expect(page.getByRole("button", { name: "Copy text" })).toBeVisible();
  });

  test("should display document language badge after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-lang");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Should show language badge (one of de, fr, it)
    const languageBadges = page.locator('text=/^(German|French|Italian)$/');
    await expect(languageBadges.first()).toBeVisible();
  });

  test("should display confidence score after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-conf");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Should show confidence percentage (e.g., "92% confidence")
    await expect(page.locator('text=/\\d+% confidence/')).toBeVisible();
  });
});

test.describe("OCR Processing - Structured Data Display", () => {
  test("should display deadlines panel after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-deadlines");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Should show Deadlines panel (mock data includes deadlines)
    await expect(page.getByRole("heading", { name: "Deadlines" })).toBeVisible();
  });

  test("should display amounts panel after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-amounts");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Should show Amounts panel with CHF values
    await expect(page.getByRole("heading", { name: "Amounts" })).toBeVisible();
    // Verify CHF amounts are shown (total line)
    await expect(page.locator("text=/CHF \\d/").first()).toBeVisible();
  });

  test("should display actions panel after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-actions");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Should show Actions panel
    await expect(page.getByRole("heading", { name: "Required Actions" })).toBeVisible();
  });
});

test.describe("OCR Processing - Translation Section", () => {
  test("should show translation tabs placeholder after OCR", async ({ page }) => {
    await registerAndAuthenticate(page, "ocr-trans");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Trigger OCR
    await page.getByRole("button", { name: "Extract Text" }).click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });

    // Should show Translations section
    await expect(page.getByRole("heading", { name: "Translations" })).toBeVisible();
  });
});

test.describe("OCR Processing - Mobile Viewport", () => {
  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndAuthenticate(page, "ocr-mobile");
    await uploadDocumentWithName(page, "test-image.png", "test-image.png");

    // Extract Text button should be visible and tappable
    const extractButton = page.getByRole("button", { name: "Extract Text" });
    await expect(extractButton).toBeVisible();

    // Button should have minimum touch target
    const buttonBox = await extractButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44);

    // Trigger OCR
    await extractButton.click();

    // Wait for completion
    await expect(page.getByRole("heading", { name: "Document Summary" })).toBeVisible({
      timeout: 10000,
    });
  });
});
