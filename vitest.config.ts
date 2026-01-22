import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Exclude Playwright tests (e2e, visual) from vitest
    exclude: [
      'tests/e2e/**',
      'tests/visual/**',
      'node_modules/**',
    ],
    // Only look in tests/unit for vitest tests
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
  },
})
