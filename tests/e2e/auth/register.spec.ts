import { test, expect } from '@playwright/test'

test.describe('Register Page', () => {
  test('should display registration form', async ({ page }) => {
    await page.goto('/register')

    // Check page elements - target main content area
    const main = page.locator('#main-content')
    await expect(main.locator('text=Create account').first()).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText('Create account')
  })

  test('should have link to login page', async ({ page }) => {
    await page.goto('/register')

    // Target the link in main content, not header
    const loginLink = page.locator('#main-content a[href="/login"]')
    await expect(loginLink).toBeVisible()
    await expect(loginLink).toContainText('Sign in')
  })

  test('should show password requirements', async ({ page }) => {
    await page.goto('/register')

    // Check password requirements text
    await expect(page.locator('text=At least 8 characters')).toBeVisible()
  })

  test('should require all fields', async ({ page }) => {
    await page.goto('/register')

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Browser validation should prevent submission
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('required', '')
  })
})
