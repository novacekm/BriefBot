# Pre-PR Validation Rule

**CRITICAL: Always run `npm run pre-pr` before creating any Pull Request.**

## Why This Matters

All CI checks are mandatory for merging. Running them locally first:
- Catches failures before pushing (saves time)
- Ensures you don't wait for CI only to find failures
- Keeps the PR process smooth and efficient

## What Pre-PR Runs

```bash
npm run pre-pr
```

This script runs:
1. **Lint** - ESLint checks
2. **Type Check** - TypeScript compilation
3. **Build** - Next.js production build
4. **E2E Tests** - Playwright end-to-end tests (chromium)
5. **Visual Tests** - Screenshot regression tests (chromium)

## Workflow

```
Code Changes → npm run pre-pr → All Pass? → Create PR
                    ↓
                 Failures? → Fix → Re-run pre-pr
```

## Required Checks in CI

All of these must pass before a PR can be merged:
- Lint
- Type Check
- Test
- Build
- E2E Tests (all browsers)
- Visual Regression Tests

## Never Skip This Step

Even for "small changes" - run `npm run pre-pr` before creating a PR.
Small changes can still break tests or introduce regressions.
