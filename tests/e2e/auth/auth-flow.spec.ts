import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPass123!',
  }

  test('should complete full registration and login flow', async ({ page }) => {
    // 1. Register a new user
    await page.goto('/register')

    await page.fill('input[name="email"]', testUser.email)
    await page.fill('input[name="password"]', testUser.password)
    await page.fill('input[name="confirmPassword"]', testUser.password)
    await page.click('button[type="submit"]')

    // Should redirect to documents after registration (auto-login)
    await expect(page).toHaveURL('/documents', { timeout: 10000 })
  })

  test('should show user is logged in after registration', async ({ page }) => {
    // Register a new user
    const newUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPass123!',
    }

    await page.goto('/register')
    await page.fill('input[name="email"]', newUser.email)
    await page.fill('input[name="password"]', newUser.password)
    await page.fill('input[name="confirmPassword"]', newUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await expect(page).toHaveURL('/documents', { timeout: 10000 })

    // User should see their avatar/initial in the header (desktop)
    // Or be able to access protected routes
    await page.goto('/upload')
    await expect(page).toHaveURL('/upload')
  })

  test('should show protected nav links when authenticated', async ({ page }) => {
    // Set desktop viewport to verify desktop nav
    await page.setViewportSize({ width: 1280, height: 720 })

    // Register and login
    const navUser = {
      email: `nav-test-${Date.now()}@example.com`,
      password: 'TestPass123!',
    }

    await page.goto('/register')
    await page.fill('input[name="email"]', navUser.email)
    await page.fill('input[name="password"]', navUser.password)
    await page.fill('input[name="confirmPassword"]', navUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await expect(page).toHaveURL('/documents', { timeout: 10000 })

    // Go to homepage to check nav
    await page.goto('/')

    // Desktop navigation should now be visible with protected links
    await expect(page.locator('header nav')).toBeVisible()
    await expect(page.locator('header').locator('a[href="/upload"]')).toBeVisible()
    await expect(page.locator('header').locator('a[href="/documents"]')).toBeVisible()
    await expect(page.locator('header').locator('a[href="/settings"]')).toBeVisible()
  })

  test('should show protected nav links in mobile menu when authenticated', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Register and login
    const mobileNavUser = {
      email: `mobile-nav-test-${Date.now()}@example.com`,
      password: 'TestPass123!',
    }

    await page.goto('/register')
    await page.fill('input[name="email"]', mobileNavUser.email)
    await page.fill('input[name="password"]', mobileNavUser.password)
    await page.fill('input[name="confirmPassword"]', mobileNavUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await expect(page).toHaveURL('/documents', { timeout: 10000 })

    // Go to homepage
    await page.goto('/')

    // Open mobile menu
    await page.click('button[aria-label="Open menu"]')

    // Protected nav links should be visible in mobile menu
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('[role="dialog"]').locator('a[href="/upload"]')).toBeVisible()
    await expect(page.locator('[role="dialog"]').locator('a[href="/documents"]')).toBeVisible()
    await expect(page.locator('[role="dialog"]').locator('a[href="/settings"]')).toBeVisible()
  })

  test('should be able to logout', async ({ page }) => {
    // Set desktop viewport first to ensure user menu is visible
    await page.setViewportSize({ width: 1280, height: 720 })

    // Register and login
    const logoutUser = {
      email: `logout-test-${Date.now()}@example.com`,
      password: 'TestPass123!',
    }

    await page.goto('/register')
    await page.fill('input[name="email"]', logoutUser.email)
    await page.fill('input[name="password"]', logoutUser.password)
    await page.fill('input[name="confirmPassword"]', logoutUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect
    await expect(page).toHaveURL('/documents', { timeout: 10000 })

    // Wait for the page to fully load and user menu to be visible
    const userMenuButton = page.locator('button[aria-label="User menu"]')
    await expect(userMenuButton).toBeVisible({ timeout: 5000 })

    // Click on user avatar to open menu
    await userMenuButton.click()

    // Wait for dropdown and click sign out (target the menuitem form)
    const signOutButton = page.getByRole('menuitem', { name: 'Sign out' })
    await expect(signOutButton).toBeVisible({ timeout: 5000 })
    await signOutButton.click()

    // Should be redirected after logout
    await expect(page).toHaveURL(/\/(login)?$/, { timeout: 10000 })
  })

  test('should redirect logged-in users away from login page', async ({ page }) => {
    // Register a user first
    const redirectUser = {
      email: `redirect-test-${Date.now()}@example.com`,
      password: 'TestPass123!',
    }

    await page.goto('/register')
    await page.fill('input[name="email"]', redirectUser.email)
    await page.fill('input[name="password"]', redirectUser.password)
    await page.fill('input[name="confirmPassword"]', redirectUser.password)
    await page.click('button[type="submit"]')

    // Wait for redirect after registration
    await expect(page).toHaveURL('/documents', { timeout: 10000 })

    // Try to go to login page - should redirect away
    await page.goto('/login')
    await expect(page).toHaveURL('/documents', { timeout: 5000 })
  })
})
