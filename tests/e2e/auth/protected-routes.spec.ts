import { test, expect } from '@playwright/test'

test.describe('Protected Routes', () => {
  test('should redirect /upload to login when not authenticated', async ({ page }) => {
    await page.goto('/upload')

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect /documents to login when not authenticated', async ({ page }) => {
    await page.goto('/documents')

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect /settings to login when not authenticated', async ({ page }) => {
    await page.goto('/settings')

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('should allow access to public routes', async ({ page }) => {
    // Homepage should be accessible
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toBeVisible()

    // Login should be accessible
    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    // Register should be accessible
    await page.goto('/register')
    await expect(page).toHaveURL('/register')
  })
})
