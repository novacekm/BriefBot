import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    // Check page elements - target main content area
    const main = page.locator('#main-content')
    await expect(main.locator('text=Sign in').first()).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in')
  })

  test('should have link to register page', async ({ page }) => {
    await page.goto('/login')

    // Target the link in main content, not header
    const registerLink = page.locator('#main-content a[href="/register"]')
    await expect(registerLink).toBeVisible()
    await expect(registerLink).toContainText('Register')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message (target main content alert, not route announcer)
    const errorAlert = page.locator('#main-content [role="alert"]')
    await expect(errorAlert).toBeVisible({ timeout: 10000 })
    await expect(errorAlert).toContainText(/invalid/i)
  })

  test('should require email and password', async ({ page }) => {
    await page.goto('/login')

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Browser validation should prevent submission
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('required', '')
  })
})
