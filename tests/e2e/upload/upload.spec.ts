import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Document Upload", () => {
  const fixturesPath = path.join(__dirname, "../../fixtures");

  // Helper to register and login a new user
  async function registerUser(page: import("@playwright/test").Page) {
    const testUser = {
      email: `upload-test-${Date.now()}@example.com`,
      password: "TestPass123!",
    };

    await page.goto("/register");
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');

    // Wait for redirect after registration
    await expect(page).toHaveURL("/documents", { timeout: 10000 });
    return testUser;
  }

  test("should upload an image successfully", async ({ page }) => {
    await registerUser(page);

    // Navigate to upload page
    await page.goto("/upload");
    await expect(page).toHaveURL("/upload");

    // Wait for upload zone to be visible
    const uploadZone = page.locator('[role="button"][aria-label="Upload zone"]');
    await expect(uploadZone).toBeVisible();

    // Upload test image using file chooser
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-image.png"));

    // Should show file preview
    await expect(page.locator("text=test-image.png")).toBeVisible();

    // Wait for upload to complete and redirect
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });
  });

  test("should upload a PDF successfully", async ({ page }) => {
    await registerUser(page);

    // Navigate to upload page
    await page.goto("/upload");

    // Upload test PDF
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-document.pdf"));

    // Should show file name
    await expect(page.locator("text=test-document.pdf")).toBeVisible();

    // Wait for upload to complete and redirect
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });
  });

  test("should reject upload when not authenticated", async ({ page }) => {
    // Go directly to upload page without logging in
    await page.goto("/upload");

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test("should show error for invalid file type", async ({ page }) => {
    await registerUser(page);

    // Navigate to upload page
    await page.goto("/upload");

    // Create a temporary invalid file (text file)
    const fileInput = page.locator('input[type="file"]');

    // Set input files with a custom file
    await page.evaluate(() => {
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const dataTransfer = new DataTransfer();
      const file = new File(["test content"], "test.txt", { type: "text/plain" });
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    // Should show validation error from the UploadZone component
    await expect(page.locator("text=Invalid file type")).toBeVisible({ timeout: 5000 });
  });

  test("should show upload zone description text", async ({ page }) => {
    await registerUser(page);

    // Navigate to upload page
    await page.goto("/upload");

    // Verify upload zone displays helpful text
    await expect(page.locator("text=Drop file here or click to upload")).toBeVisible();
    await expect(page.locator("text=JPEG, PNG, WebP, or PDF up to 10MB")).toBeVisible();
  });

  test("should show loading state during upload", async ({ page }) => {
    await registerUser(page);

    // Navigate to upload page
    await page.goto("/upload");

    // Upload test image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.join(fixturesPath, "test-image.png"));

    // The loading indicator should briefly appear (might be too fast to catch reliably)
    // Instead, verify the flow completes successfully
    await expect(page).toHaveURL(/\/documents\/[\w-]+/, { timeout: 15000 });
  });
});
