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

### 4. WAIT FOR CI (Mandatory - Do NOT skip)

**ALWAYS wait for CI after creating a PR.** This is automatic workflow, not optional.

```bash
gh pr checks <PR_NUMBER> --watch
```

**CI monitoring loop:**
1. After `gh pr create`, immediately run `gh pr checks <N> --watch`
2. Wait for ALL checks to complete (10 checks total)
3. If ANY check fails:
   - Investigate the failure using `gh run view <run-id> --log-failed`
   - Fix the issue locally
   - Run `npm run pre-pr` to verify fix
   - Commit and push the fix
   - Watch CI again: `gh pr checks <N> --watch`
4. Repeat until ALL checks pass
5. Only proceed to review/merge after CI is green

**Never leave a PR with failing CI.** Always fix before moving on.

### 5. REVIEW LOOP (Mandatory)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   CREATE PR ──► WAIT CI ──► CI Fails? ──► Fix      │
│       │            │            │           │        │
│       │            │            │ No        ▼        │
│       │            ▼            ▼      npm run pre-pr│
│       │        CI Pass ──► /pr-review       │        │
│       │            │            │            │        │
│       │            │      Issues? ──► Fix & Push    │
│       │            │            │                    │
│       │            │            │ No                 │
│       │            ▼            ▼                    │
│       │        APPROVE & MERGE                       │
│       └──────────────────────────────────────────────┘
└──────────────────────────────────────────────────────┘
```

**The review loop:**
1. Wait for CI to pass (step 4 - mandatory)
2. Run `/pr-review <N>` - performs actual code review
3. If issues found:
   - Reviewer leaves specific comments on the PR
   - Requests changes via `gh pr review --request-changes`
4. Address each comment:
   - Fix the code
   - Run `npm run pre-pr` (MUST pass before pushing)
   - Push fixes
   - Wait for CI again
5. Re-run `/pr-review <N>`
6. Repeat until approved

**NO RUBBER-STAMPING:** Every PR must have actual review with comments on issues found.

### 6. APPROVE & MERGE

Once CI passes and review is complete:

```bash
# Approve the PR
gh pr review <PR_NUMBER> --approve

# Merge with squash and delete branch
gh pr merge <PR_NUMBER> --squash --delete-branch
```

**Post-merge cleanup:**
- Update README roadmap checkbox if applicable
- Issues with "Closes #N" are auto-closed

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

# ALWAYS wait for CI (do not skip!)
gh pr checks 42 --watch

# If CI fails: fix, push, watch again
npm run pre-pr
git add . && git commit -m "fix: address CI failure"
git push
gh pr checks 42 --watch

# Review PR (after CI passes)
/pr-review 42

# After fixing review comments
npm run pre-pr  # Must pass!
git add . && git commit -m "fix: address review comments"
git push
gh pr checks 42 --watch  # Wait for CI again

# Approve and merge after CI passes
gh pr review 42 --approve
gh pr merge 42 --squash --delete-branch
```
