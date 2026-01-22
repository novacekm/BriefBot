import { test, expect } from '@playwright/test'

/**
 * Visual Regression Tests
 *
 * These tests capture screenshots and compare them to baseline images.
 * If the UI changes, the test will fail unless you update the baseline.
 *
 * Cross-platform notes:
 * - Baselines are platform-agnostic (no OS/browser suffix in filenames)
 * - Tolerance is set globally in playwright.config.ts (10% pixel diff allowed)
 * - Minor rendering differences between macOS and Linux are expected
 *
 * To update baselines locally:
 *   npm run test:visual -- --update-snapshots --project=chromium
 *
 * To update baselines on CI (Linux), run the visual tests with --update-snapshots
 * and commit the new snapshots from the artifacts.
 */

test.describe('Homepage Visual Regression @visual', () => {
  test('should match desktop screenshot @visual', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Capture full-page screenshot
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
    })
  })

  test('should match mobile screenshot @visual', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
    })
  })

  test('should match tablet screenshot @visual', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
    })
  })
})
