import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/BriefBot/)

    // Check main heading
    await expect(page.locator('h1')).toContainText('Decode Swiss Official Mail')

    // Check description
    await expect(page.locator('text=Privacy-first OCR utility')).toBeVisible()
  })

  test('should display navigation header without protected links when unauthenticated', async ({ page, isMobile }) => {
    await page.goto('/')

    // Check logo in header
    await expect(page.locator('header').locator('text=BriefBot')).toBeVisible()

    // Protected nav links should NOT be visible when not authenticated
    if (!isMobile) {
      // Desktop nav should not exist or be hidden when not logged in
      await expect(page.locator('header nav')).toHaveCount(0)
      await expect(page.locator('header').locator('a[href="/upload"]')).toHaveCount(0)
      await expect(page.locator('header').locator('a[href="/documents"]')).toHaveCount(0)
      // Sign in should be visible
      await expect(page.locator('header').locator('text=Sign in')).toBeVisible()
    } else {
      // Mobile shows hamburger menu
      await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible()
    }
  })

  test('should display feature cards', async ({ page }) => {
    await page.goto('/')

    // Check feature cards
    await expect(page.locator('text=1. Upload')).toBeVisible()
    await expect(page.locator('text=2. Process')).toBeVisible()
    await expect(page.locator('text=3. Understand')).toBeVisible()
  })

  test('should display call-to-action buttons', async ({ page }) => {
    await page.goto('/')

    // Check CTA buttons
    await expect(page.locator('a[href="/upload"]').locator('text=Upload Document')).toBeVisible()
    await expect(page.locator('a[href="/documents"]').locator('text=View Documents')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    await page.goto('/')

    if (isMobile) {
      // Check mobile-specific behavior
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()

      // Mobile navigation should show hamburger menu
      await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible()

      // Desktop nav should not exist (not authenticated)
      await expect(page.locator('header nav')).toHaveCount(0)

      // Verify text is readable (not too small)
      const fontSize = await heading.evaluate((el) => {
        return window.getComputedStyle(el).fontSize
      })

      // Font size should be at least 24px on mobile (1.875rem = 30px)
      const size = parseInt(fontSize)
      expect(size).toBeGreaterThanOrEqual(24)
    }
  })

  test('should open mobile menu without protected links when unauthenticated', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Click hamburger menu
    await page.click('button[aria-label="Open menu"]')

    // Check that sheet is visible
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Protected nav links should NOT be visible when not authenticated
    await expect(page.locator('[role="dialog"]').locator('a[href="/upload"]')).toHaveCount(0)
    await expect(page.locator('[role="dialog"]').locator('a[href="/documents"]')).toHaveCount(0)
    await expect(page.locator('[role="dialog"]').locator('a[href="/settings"]')).toHaveCount(0)

    // Sign in/Register buttons should be visible
    await expect(page.locator('[role="dialog"]').locator('text=Sign in')).toBeVisible()
    await expect(page.locator('[role="dialog"]').locator('text=Register')).toBeVisible()
  })
})
