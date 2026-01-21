import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/BriefBot/)

    // Check main heading
    await expect(page.locator('h1')).toContainText('BriefBot')

    // Check description
    await expect(page.locator('p')).toContainText('Privacy-first OCR utility')
  })

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    await page.goto('/')

    if (isMobile) {
      // Check mobile-specific behavior
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()

      // Verify text is readable (not too small)
      const fontSize = await heading.evaluate((el) => {
        return window.getComputedStyle(el).fontSize
      })

      // Font size should be at least 24px on mobile
      const size = parseInt(fontSize)
      expect(size).toBeGreaterThanOrEqual(24)
    }
  })
})
