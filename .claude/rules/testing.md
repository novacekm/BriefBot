---
globs:
  - "tests/**/*.ts"
  - "tests/**/*.tsx"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
---

# Testing Rules

## Test Structure

- Use descriptive `describe` blocks matching the module under test
- One assertion per test when practical
- Use `it("should...")` format for test names

## E2E Tests (Playwright)

- Always wait for network idle or specific elements
- Use `data-testid` attributes for stable selectors
- Register unique users per test to avoid conflicts
- Clean up test data after tests when possible

## Unit Tests (Vitest)

- Mock external dependencies, not internal modules
- Test behavior, not implementation
- Cover edge cases: empty inputs, null, undefined

## Fixtures

- Store test fixtures in `tests/fixtures/`
- Use realistic Swiss document samples
- Include German, French, and Italian test cases

## Coverage

- Minimum 80% coverage for critical paths
- Focus on business logic, not UI wiring
- Always test error paths and edge cases
