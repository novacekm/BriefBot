import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Main Section Skeleton Pages
 *
 * Tests authenticated user access to the new skeleton pages:
 * - /upload
 * - /documents
 * - /documents/[id]
 * - /settings
 */

test.describe("Skeleton Pages - Authenticated Access", () => {
  // Helper to register and get authenticated
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

    // Wait for redirect after registration
    await expect(page).toHaveURL("/documents", { timeout: 10000 });
    return user;
  }

  test("should access upload page when authenticated", async ({ page }) => {
    await registerAndAuthenticate(page, "upload-test");

    await page.goto("/upload");
    await expect(page).toHaveURL("/upload");

    // Verify page content
    await expect(page.locator("h1")).toContainText("Upload Document");
    await expect(page.locator("text=Upload functionality coming soon")).toBeVisible();
  });

  test("should access documents list page when authenticated", async ({ page }) => {
    await registerAndAuthenticate(page, "documents-test");

    await page.goto("/documents");
    await expect(page).toHaveURL("/documents");

    // Verify page content
    await expect(page.locator("h1")).toContainText("My Documents");
    await expect(page.locator("text=No documents yet")).toBeVisible();
  });

  test("should access document detail page when authenticated", async ({ page }) => {
    await registerAndAuthenticate(page, "doc-detail-test");

    await page.goto("/documents/test-id-123");
    await expect(page).toHaveURL("/documents/test-id-123");

    // Verify page content
    await expect(page.locator("h1")).toContainText("Document Details");
    await expect(page.locator("text=Document ID: test-id-123")).toBeVisible();
    await expect(page.locator("text=Back to documents")).toBeVisible();
  });

  test("should access settings page when authenticated", async ({ page }) => {
    await registerAndAuthenticate(page, "settings-test");

    await page.goto("/settings");
    await expect(page).toHaveURL("/settings");

    // Verify page content
    await expect(page.locator("h1")).toContainText("Settings");
    await expect(page.getByRole("heading", { name: "Account Settings" })).toBeVisible();
  });

  test("should navigate between skeleton pages", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await registerAndAuthenticate(page, "nav-test");

    // Navigate to upload from documents
    await page.click('header a[href="/upload"]');
    await expect(page).toHaveURL("/upload");

    // Navigate to documents
    await page.click('header a[href="/documents"]');
    await expect(page).toHaveURL("/documents");

    // Navigate to settings
    await page.click('header a[href="/settings"]');
    await expect(page).toHaveURL("/settings");
  });

  test("should show back link on document detail page", async ({ page }) => {
    await registerAndAuthenticate(page, "back-link-test");

    await page.goto("/documents/some-id");

    // Click back to documents
    await page.click('text=Back to documents');
    await expect(page).toHaveURL("/documents");
  });
});

test.describe("Skeleton Pages - Mobile Navigation", () => {
  test("should navigate skeleton pages on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Register
    const user = {
      email: `mobile-test-${Date.now()}@example.com`,
      password: "TestPass123!",
    };

    await page.goto("/register");
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/documents", { timeout: 10000 });

    // Open mobile menu
    await page.click('button[aria-label="Open menu"]');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Navigate to upload
    await page.locator('[role="dialog"]').locator('a[href="/upload"]').click();
    await expect(page).toHaveURL("/upload");

    // Verify upload page loaded
    await expect(page.locator("h1")).toContainText("Upload Document");
  });
});

test.describe("Skeleton Pages - Page Metadata", () => {
  test("upload page should have correct title", async ({ page }) => {
    const user = {
      email: `title-upload-${Date.now()}@example.com`,
      password: "TestPass123!",
    };

    await page.goto("/register");
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/documents", { timeout: 10000 });

    await page.goto("/upload");
    await expect(page).toHaveTitle(/Upload Document/);
  });

  test("documents page should have correct title", async ({ page }) => {
    const user = {
      email: `title-docs-${Date.now()}@example.com`,
      password: "TestPass123!",
    };

    await page.goto("/register");
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/documents", { timeout: 10000 });

    await page.goto("/documents");
    await expect(page).toHaveTitle(/My Documents/);
  });

  test("settings page should have correct title", async ({ page }) => {
    const user = {
      email: `title-settings-${Date.now()}@example.com`,
      password: "TestPass123!",
    };

    await page.goto("/register");
    await page.fill('input[name="email"]', user.email);
    await page.fill('input[name="password"]', user.password);
    await page.fill('input[name="confirmPassword"]', user.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/documents", { timeout: 10000 });

    await page.goto("/settings");
    await expect(page).toHaveTitle(/Settings/);
  });
});
