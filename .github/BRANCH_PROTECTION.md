# Branch Protection Rules

## Status: ACTIVE (GitHub Enforced)

Branch protection is now enforced at the GitHub level. **Direct pushes to master are blocked by GitHub.**

### Protection Summary

| Setting | Value |
|---------|-------|
| Direct pushes to master | **BLOCKED** |
| PRs required | **YES** |
| CI must pass before merge | **YES** |
| Force pushes | **BLOCKED** |
| Branch deletion | **BLOCKED** |
| Enforced for admins | **YES** |

---

## Required Status Checks (ALL 10)

Before a PR can be merged, ALL of these CI jobs must pass:

### Core Checks
- **Lint** - ESLint checks
- **Type Check** - TypeScript compilation
- **Test** - Unit tests (vitest)
- **Build** - Next.js build

### E2E Tests (5 browsers)
- **E2E Tests (chromium)** - Chrome browser
- **E2E Tests (firefox)** - Firefox browser
- **E2E Tests (webkit)** - Safari browser
- **E2E Tests (Mobile Chrome)** - Mobile Chrome (Pixel 5)
- **E2E Tests (Mobile Safari)** - Mobile Safari (iPhone 13)

### Visual Tests
- **Visual Regression Tests** - Screenshot comparison (Linux baselines)

PRs are blocked from merging until ALL 10 checks are green.

## Workflow

```
master (protected)
    │
    └─── feature branch ───► PR ───► CI Checks ───► Merge
              │                          │
         git checkout -b           Must pass:
         issue-<N>-<title>         Lint, Type Check,
                                   Test, Build
```

### Creating a Feature Branch

```bash
# Always branch from master
git checkout master
git pull origin master
git checkout -b issue-<number>-<short-title>
```

### Creating a PR

```bash
git push -u origin issue-<number>-<short-title>
gh pr create --title "type(scope): description" --body "..."
```

### Merging (after CI passes)

```bash
gh pr merge <number> --squash --delete-branch
```

## What's Blocked

GitHub will reject:
- `git push origin master` - Direct pushes
- `git push --force origin master` - Force pushes
- Merging PRs with failing CI

## Repository Visibility

This repository is **public** to enable GitHub branch protection on the free tier.

## Admin Notes

- `enforce_admins: true` - Even admins cannot bypass protection
- `dismiss_stale_reviews: true` - New commits invalidate existing approvals
- `strict: true` - Branch must be up to date before merging
