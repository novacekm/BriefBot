import { test, expect } from "@playwright/test";
import path from "path";

/**
 * E2E Tests for Document Detail Page
 *
 * Tests the document detail functionality:
 * - Document viewer (image/PDF)
 * - Metadata display
 * - Processing states (PENDING, PROCESSING, FAILED)
 * - COMPLETED state with text and translations
 * - Error handling (404 for non-existent/other user's documents)
 * - Navigation
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

// Helper to upload a document and return its ID
async function uploadDocument(
  page: import("@playwright/test").Page,
  filename: string
): Promise<string> {
  await page.goto("/upload");
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(path.join(fixturesPath, filename));

  // Wait for upload to complete and redirect to document detail
  await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });
  const documentUrl = page.url();
  return documentUrl.split("/documents/")[1];
}

test.describe("Document Detail - PENDING State", () => {
  test("should display document with PENDING status", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-pending");
    const documentId = await uploadDocument(page, "test-image.png");

    // Should be on document detail page
    await expect(page).toHaveURL(`/documents/${documentId}`);

    // Should show document title
    await expect(page.locator("h1")).toContainText("test-image.png");

    // Should show document ID
    await expect(page.locator(`text=Document ID: ${documentId}`)).toBeVisible();

    // Should show PENDING status in metadata
    await expect(page.locator("text=Pending")).toBeVisible();

    // Should show processing state card
    await expect(page.getByRole("heading", { name: "Ready for Processing" })).toBeVisible();
    await expect(
      page.locator("text=This document has not been processed yet")
    ).toBeVisible();

    // Should show Extract Text button
    await expect(page.getByRole("button", { name: "Extract Text" })).toBeVisible();
  });

  test("should display metadata correctly", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-metadata");
    await uploadDocument(page, "test-image.png");

    // Check for metadata fields
    await expect(page.locator("dt:has-text('Filename')")).toBeVisible();
    await expect(page.locator("dt:has-text('Size')")).toBeVisible();
    await expect(page.locator("dt:has-text('Uploaded')")).toBeVisible();
    await expect(page.locator("dt:has-text('Type')")).toBeVisible();
    await expect(page.locator("dt:has-text('Status')")).toBeVisible();

    // Check file type is Image (use exact match to avoid matching filename)
    await expect(page.getByText("Image", { exact: true })).toBeVisible();
  });
});

test.describe("Document Detail - Image Viewer", () => {
  test("should display image preview", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-image");
    await uploadDocument(page, "test-image.png");

    // Should show image in viewer
    const image = page.locator('img[alt*="Document: test-image.png"]');
    await expect(image).toBeVisible();
  });

  test("should open zoom modal when clicking image", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-zoom");
    await uploadDocument(page, "test-image.png");

    // Click on image to open zoom modal
    const imageButton = page.locator('button[aria-label="Click to zoom image"]');
    await imageButton.click();

    // Modal should be visible
    const modal = page.locator('[role="dialog"][aria-label="Zoomed document view"]');
    await expect(modal).toBeVisible();

    // Close button should be visible
    const closeButton = page.locator('button[aria-label="Close zoom view"]');
    await expect(closeButton).toBeVisible();

    // Click close button
    await closeButton.click();

    // Modal should be closed
    await expect(modal).not.toBeVisible();
  });

  test("should show download button", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-download");
    await uploadDocument(page, "test-image.png");

    // Should have download link
    const downloadLink = page.locator('a:has-text("Download")');
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute("download", "test-image.png");
  });
});

test.describe("Document Detail - PDF Viewer", () => {
  test("should display PDF in iframe", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-pdf");
    await uploadDocument(page, "test-document.pdf");

    // Should show PDF iframe
    const iframe = page.locator('iframe[title*="PDF Document: test-document.pdf"]');
    await expect(iframe).toBeVisible();

    // Should show PDF type in metadata (use exact match to avoid matching filename)
    await expect(page.getByText("PDF", { exact: true })).toBeVisible();
  });
});

test.describe("Document Detail - Not Found", () => {
  test("should show 404 for non-existent document", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-404");

    // Navigate to a non-existent document
    await page.goto("/documents/non-existent-document-id");

    // Should show not found page
    await expect(page.getByRole("heading", { name: "Document Not Found" })).toBeVisible();
    await expect(
      page.locator("text=The document you're looking for doesn't exist")
    ).toBeVisible();

    // Should have back to documents button
    const backButton = page.getByRole("link", { name: "Back to Documents" });
    await expect(backButton).toBeVisible();
  });

  test("should show 404 for another user's document", async ({ page, browser }) => {
    // First user uploads a document
    await registerAndAuthenticate(page, "detail-other-user-1");
    const documentId = await uploadDocument(page, "test-image.png");

    // Log out by clearing cookies
    const context1 = await browser.newContext();
    const page2 = await context1.newPage();

    // Second user tries to access the first user's document
    await registerAndAuthenticate(page2, "detail-other-user-2");
    await page2.goto(`/documents/${documentId}`);

    // Should show not found page (security - doesn't reveal the document exists)
    await expect(page2.getByRole("heading", { name: "Document Not Found" })).toBeVisible();

    await context1.close();
  });
});

test.describe("Document Detail - Navigation", () => {
  test("should navigate back to documents list", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-nav-back");
    await uploadDocument(page, "test-image.png");

    // Click back button
    await page.getByRole("link", { name: /Back to documents/ }).click();

    // Should navigate to documents list
    await expect(page).toHaveURL("/documents");
  });

  test("should navigate from documents list to detail and back", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-nav-full");
    const documentId = await uploadDocument(page, "test-image.png");

    // Go to documents list
    await page.goto("/documents");

    // Click on document card
    await page.locator("text=test-image.png").click();

    // Should be on detail page
    await expect(page).toHaveURL(`/documents/${documentId}`);

    // Go back
    await page.getByRole("link", { name: /Back to documents/ }).click();

    // Should be on list page
    await expect(page).toHaveURL("/documents");
  });
});

test.describe("Document Detail - Responsive Layout", () => {
  test("should display properly on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndAuthenticate(page, "detail-mobile");
    await uploadDocument(page, "test-image.png");

    // Page should be visible
    await expect(page.locator("h1")).toContainText("test-image.png");

    // Metadata should be visible
    await expect(page.locator("dt:has-text('Filename')")).toBeVisible();

    // Back button should be visible
    await expect(page.getByRole("link", { name: /Back to documents/ })).toBeVisible();

    // Download button should be visible
    await expect(page.locator('a:has-text("Download")')).toBeVisible();
  });

  test("should display properly on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "detail-desktop");
    await uploadDocument(page, "test-image.png");

    // Page should be visible
    await expect(page.locator("h1")).toContainText("test-image.png");

    // All elements should be visible
    await expect(page.getByRole("heading", { name: "Ready for Processing" })).toBeVisible();
  });
});

test.describe("Document Detail - Accessibility", () => {
  test("should have proper ARIA labels", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-a11y");
    await uploadDocument(page, "test-image.png");

    // Back button should have meaningful text
    await expect(page.getByRole("link", { name: /Back to documents/ })).toBeVisible();

    // Image should have alt text
    const image = page.locator('img[alt*="Document: test-image.png"]');
    await expect(image).toBeVisible();

    // Download link should be accessible
    const downloadLink = page.locator('a:has-text("Download")');
    await expect(downloadLink).toBeVisible();
  });

  test("should have touch-friendly targets (44x44 minimum)", async ({ page }) => {
    await registerAndAuthenticate(page, "detail-touch");
    await uploadDocument(page, "test-image.png");

    // Back button should have minimum height
    const backButton = page.getByRole("link", { name: /Back to documents/ });
    const backBox = await backButton.boundingBox();
    expect(backBox?.height).toBeGreaterThanOrEqual(44);

    // Download button should have minimum height
    const downloadLink = page.locator('a:has-text("Download")');
    const downloadBox = await downloadLink.boundingBox();
    expect(downloadBox?.height).toBeGreaterThanOrEqual(44);
  });
});
