import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Exclude Playwright tests (e2e, visual) from vitest
    exclude: [
      'tests/e2e/**',
      'tests/visual/**',
      'node_modules/**',
    ],
    // Look in tests/unit and tests/integration for vitest tests
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}', 'tests/integration/**/*.{test,spec}.{ts,tsx}'],
    // Use jsdom for DOM testing
    environment: 'jsdom',
    // Setup file for testing library
    setupFiles: ['./tests/unit/setup.ts'],
    // Enable globals for describe, it, expect
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
