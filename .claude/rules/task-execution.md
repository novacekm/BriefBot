# Task Execution Rules

## CRITICAL: PR-Based Development with Review

**Direct pushes to master are FORBIDDEN.** All changes must:
1. Go through Pull Requests
2. Pass code review (with actual review comments, not rubber-stamping)
3. Pass all CI checks
4. Have all review comments addressed

---

## Workflow: Plan → Execute → Review Loop → Merge

### 1. PLAN
- Read the GitHub issue
- Use `/plan` skill or `planner` agent for complex features
- Spawn domain agents in parallel if needed (architect, ux-designer, security)

### 2. EXECUTE
- Create feature branch: `git checkout -b issue-<N>-<short-title>`
- Write tests first (TDD)
- Implement the feature
- Run `npm run pre-pr` to validate locally

### 3. CREATE PR
- Push branch: `git push -u origin issue-<N>-<short-title>`
- Create PR: `gh pr create`

### 4. REVIEW LOOP (Mandatory)

```
┌─────────────────────────────────────────────┐
│                                             │
│   /pr-review ──► Issues? ──► Fix & Push   │
│        ▲           │              │         │
│        │           │ No           ▼         │
│        │           ▼         npm run pre-pr │
│        │       APPROVE            │         │
│        │       & MERGE            │         │
│        └──────────────────────────┘         │
│                                             │
└─────────────────────────────────────────────┘
```

**The review loop:**
1. Run `/pr-review <N>` - performs actual code review
2. If issues found:
   - Reviewer leaves specific comments on the PR
   - Requests changes via `gh pr review --request-changes`
3. Address each comment:
   - Fix the code
   - Run `npm run pre-pr` (MUST pass before pushing)
   - Push fixes
4. Re-run `/pr-review <N>`
5. Repeat until approved

**NO RUBBER-STAMPING:** Every PR must have actual review with comments on issues found.

### 5. MERGE & CLEANUP
- After approval: `gh pr merge --squash --delete-branch`
- Update README roadmap checkbox
- Close related issues if not auto-closed

---

## Pre-Push Validation (MANDATORY)

Before EVERY push (initial and fix commits):

```bash
npm run pre-pr
```

This runs:
- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run test:e2e -- --project=chromium`

**Never push if pre-pr fails.**

---

## Review Requirements

PRs cannot be merged until:

1. **Code review completed** - `/pr-review` has analyzed all changes
2. **All comments addressed** - No unresolved review threads
3. **CI passing** - All 10 GitHub Actions checks green
4. **Local validation** - `npm run pre-pr` passed before final push

---

## Parallelization Patterns

### When to Parallelize (same message)

**Multi-agent research:**
```
Task("Explore auth", Explore)
Task("Explore storage", Explore)
```

**Multi-domain planning:**
```
Task("Design backend", architect)
Task("Design UI", ux-designer)
Task("Review security", security)
```

### When NOT to Parallelize

- **Sequential dependencies**: Need output from previous step
- **Write operations**: Risk of race conditions
- **Dependent decisions**: Plan before build

---

## Quick Reference

```bash
# Create branch
git checkout -b issue-42-feature-name

# Before ANY push
npm run pre-pr

# Create PR
git push -u origin issue-42-feature-name
gh pr create --title "feat(scope): description"

# Review PR (mandatory)
/pr-review 42

# After fixing review comments
npm run pre-pr  # Must pass!
git add . && git commit -m "fix: address review comments"
git push

# Re-review
/pr-review 42

# Merge after approval
gh pr merge --squash --delete-branch
```
