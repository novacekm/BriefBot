import { test, expect } from '@playwright/test'

/**
 * Visual Regression Tests
 *
 * These tests capture screenshots and compare them to baseline images.
 * If the UI changes, the test will fail unless you update the baseline.
 *
 * To update baselines:
 * npm run test:e2e -- --update-snapshots
 */

test.describe('Homepage Visual Regression @visual', () => {
  test('should match desktop screenshot @visual', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')

    // Capture full-page screenshot
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('should match mobile screenshot @visual', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })

  test('should match tablet screenshot @visual', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      maxDiffPixels: 100,
    })
  })
})
