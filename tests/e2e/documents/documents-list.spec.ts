import { test, expect } from "@playwright/test";
import path from "path";

/**
 * E2E Tests for Documents List Page
 *
 * Tests the document list functionality:
 * - Empty state for new users
 * - List view with documents
 * - Navigation to document detail
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

test.describe("Documents List - Empty State", () => {
  test("should show empty state for new user", async ({ page }) => {
    await registerAndAuthenticate(page, "docs-empty");

    await page.goto("/documents");
    await expect(page).toHaveURL("/documents");

    // Verify empty state content
    await expect(page.locator("h1")).toContainText("My Documents");
    await expect(page.getByRole("heading", { name: "No documents yet" })).toBeVisible();
    await expect(
      page.locator("text=Upload your first document to get started")
    ).toBeVisible();

    // Verify upload button is present
    const uploadButton = page.getByRole("link", { name: /Upload Document/i });
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toHaveAttribute("href", "/upload");
  });

  test("should navigate to upload page from empty state", async ({ page }) => {
    await registerAndAuthenticate(page, "docs-empty-nav");

    await page.goto("/documents");

    // Click upload button in empty state
    await page.getByRole("link", { name: /Upload Document/i }).click();
    await expect(page).toHaveURL("/upload");
  });
});

test.describe("Documents List - With Documents", () => {
  test("should show document list after upload", async ({ page }) => {
    await registerAndAuthenticate(page, "docs-list");

    // Upload a document first
    await page.goto("/upload");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-image.png"));

    // Wait for upload to complete and redirect to document detail
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });

    // Navigate to documents list
    await page.goto("/documents");
    await expect(page).toHaveURL("/documents");

    // Verify document appears in the list
    await expect(page.locator("h1")).toContainText("My Documents");

    // Should NOT show empty state
    await expect(page.getByRole("heading", { name: "No documents yet" })).not.toBeVisible();

    // Should show the uploaded document card
    await expect(page.locator("text=test-image.png")).toBeVisible();

    // Should show status badge (PENDING initially)
    await expect(page.locator("text=Pending")).toBeVisible();
  });

  test("should show multiple documents in grid", async ({ page }) => {
    await registerAndAuthenticate(page, "docs-multi");

    // Upload first document
    await page.goto("/upload");
    let fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-image.png"));
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });

    // Upload second document
    await page.goto("/upload");
    fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-document.pdf"));
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });

    // Navigate to documents list
    await page.goto("/documents");

    // Both documents should be visible
    await expect(page.locator("text=test-image.png")).toBeVisible();
    await expect(page.locator("text=test-document.pdf")).toBeVisible();
  });
});

test.describe("Documents List - Navigation", () => {
  test("should navigate to document detail when clicking card", async ({ page }) => {
    await registerAndAuthenticate(page, "docs-nav");

    // Upload a document first
    await page.goto("/upload");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-image.png"));

    // Wait for upload to complete and capture the document ID from URL
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });
    const documentUrl = page.url();
    const documentId = documentUrl.split("/documents/")[1];

    // Navigate to documents list
    await page.goto("/documents");

    // Click on the document card
    await page.locator("text=test-image.png").click();

    // Should navigate to document detail page
    await expect(page).toHaveURL(`/documents/${documentId}`);
  });
});

test.describe("Documents List - Responsive Layout", () => {
  test("should show single column on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndAuthenticate(page, "docs-mobile");

    // Upload a document
    await page.goto("/upload");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-image.png"));
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });

    // Navigate to documents list
    await page.goto("/documents");

    // Verify the grid container has the proper responsive classes
    const grid = page.locator(".grid.gap-4");
    await expect(grid).toBeVisible();

    // Document should be visible in single column layout
    await expect(page.locator("text=test-image.png")).toBeVisible();
  });

  test("should show grid layout on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "docs-desktop");

    // Upload a document
    await page.goto("/upload");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-image.png"));
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });

    // Navigate to documents list
    await page.goto("/documents");

    // Verify the grid container exists
    const grid = page.locator(".grid.gap-4.sm\\:grid-cols-2.lg\\:grid-cols-3");
    await expect(grid).toBeVisible();
  });
});
