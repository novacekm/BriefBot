import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for BriefBot
 * Supports E2E testing and visual regression testing with screenshots
 */
export default defineConfig({
  testDir: './tests',
  // Ignore unit tests (handled by Vitest)
  testIgnore: ['**/unit/**'],

  // Test timeout
  timeout: 30000,
  expect: {
    timeout: 5000,
    // Visual comparison settings - tolerant for cross-platform rendering differences
    toHaveScreenshot: {
      // Allow up to 10% pixel difference for cross-platform compatibility (macOS vs Linux)
      maxDiffPixelRatio: 0.1,
      // Also allow absolute pixel difference threshold
      maxDiffPixels: 500,
    },
  },

  // Snapshot path template without platform for cross-platform baselines
  snapshotPathTemplate: '{testDir}/{testFileDir}/__snapshots__/{testFileName}-snapshots/{arg}{ext}',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers and mobile
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },

    // Tablet
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
