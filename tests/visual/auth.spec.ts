import { test, expect } from '@playwright/test'

/**
 * Visual Regression Tests for Authentication Pages
 *
 * These tests capture screenshots of login and register pages
 * to detect unintended UI changes.
 *
 * To update baselines:
 *   npm run test:visual -- --update-snapshots --project=chromium
 */

// Cross-platform visual comparison options
const visualCompareOptions = {
  maxDiffPixelRatio: 0.15,
  threshold: 0.3,
}

test.describe('Login Page Visual Regression @visual', () => {
  test('should match desktop screenshot @visual', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('login-desktop.png', visualCompareOptions)
  })

  test('should match mobile screenshot @visual', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('login-mobile.png', visualCompareOptions)
  })

  test('should match error state screenshot @visual', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/login')

    // Trigger error state
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Wait for error to appear
    await page.locator('#main-content [role="alert"]').waitFor({ state: 'visible', timeout: 10000 })
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('login-error.png', visualCompareOptions)
  })
})

test.describe('Register Page Visual Regression @visual', () => {
  test('should match desktop screenshot @visual', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('register-desktop.png', visualCompareOptions)
  })

  test('should match mobile screenshot @visual', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/register')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('register-mobile.png', visualCompareOptions)
  })
})
