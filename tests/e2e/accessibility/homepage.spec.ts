import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Homepage Accessibility @a11y', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Check h1 exists
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText('Decode Swiss Official Mail')

    // Check h2 exists for section heading
    const h2 = page.locator('h2')
    await expect(h2).toContainText('How It Works')
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Check header exists
    const header = page.locator('header')
    await expect(header).toBeVisible()

    // Check nav landmark exists
    const nav = page.locator('header nav')
    await expect(nav).toBeVisible()

    // Check all links have accessible names
    const navLinks = page.locator('header nav a')
    const count = await navLinks.count()
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i)
      const accessibleName = await link.getAttribute('aria-label') || await link.textContent()
      expect(accessibleName).toBeTruthy()
    }
  })

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/')

    // Check all buttons have accessible names
    const buttons = page.locator('button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      const accessibleName = await button.getAttribute('aria-label') || await button.textContent()
      expect(accessibleName).toBeTruthy()
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Tab through interactive elements
    await page.keyboard.press('Tab') // First focusable element

    // Check that focus is visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Continue tabbing and check focus moves
    await page.keyboard.press('Tab')
    const secondFocused = page.locator(':focus')
    await expect(secondFocused).toBeVisible()
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['cat.color'])
      .analyze()

    // Filter to only color contrast issues
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    )

    expect(contrastViolations).toEqual([])
  })

  test('should have main landmark', async ({ page }) => {
    await page.goto('/')

    // Check main element exists
    const main = page.locator('main#main-content')
    await expect(main).toBeVisible()
  })

  test('mobile menu should be accessible', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check hamburger button has accessible name
    const menuButton = page.locator('button[aria-label="Open menu"]')
    await expect(menuButton).toBeVisible()
    await expect(menuButton).toHaveAttribute('aria-label', 'Open menu')

    // Open menu and check accessibility
    await menuButton.click()

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Run axe on the open dialog
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
