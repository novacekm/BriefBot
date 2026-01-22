# Task Loop - Automated Task Orchestration Skill

> **Invoke with:** `/task-loop` or "run task loop"
> **Purpose:** Automated task selection, execution, and backlog management for overnight runs

## What This Skill Does

Orchestrates an intelligent task loop that:
1. **Analyzes** all open GitHub issues
2. **Selects** the highest-value ready task
3. **Plans** using parallel agents, **persists** plan to file
4. **Clears** context for maximum execution space
5. **Executes** on feature branch, creates PR
6. **Reviews** PR with `/pr-review`, auto-merges if passing
7. **Reflects** on impact and updates related issues
8. **Loops** until exit conditions are met

## The Task Loop Process

### Phase 1: ANALYZE

```bash
# Fetch all open issues with their labels and dependencies
gh issue list --repo novacekm/BriefBot --state open --json number,title,labels,body --limit 100
```

**Analysis Steps:**
1. Parse all open issues
2. Extract dependencies from issue body (`Blocked by: #X, #Y`)
3. Identify which issues are "ready" (no open blockers)
4. Group by priority (P0 → P1 → P2 → P3)
5. Consider domain relevance and complexity

**Issue Selection Criteria:**
| Priority | Criteria |
|----------|----------|
| 1st | P0-critical + ready |
| 2nd | P1-high + ready |
| 3rd | Unblocks most other issues |
| 4th | P2-medium + ready |
| 5th | P3-low + ready |

### Phase 2: SELECT

**Selection Algorithm:**
```
1. Filter issues with "ready" label OR no "blocked" label and no dependencies
2. Sort by priority (P0 > P1 > P2 > P3)
3. For same priority, prefer issues that unblock others
4. For same priority and no dependencies, prefer older issues (FIFO)
5. Validate selected issue is still relevant to current codebase
```

**Validation Check:**
- Does the file/component mentioned still exist?
- Has this already been implemented by another change?
- Are the acceptance criteria still valid?

**If issue is obsolete:**
- Close with comment explaining why
- Loop back to ANALYZE

### Phase 3: PLAN & PERSIST

**Context-Aware Execution Pattern:**

The key to efficient overnight runs is the **Plan → Persist → Clear → Execute** pattern:

**Step 3a: Plan the Task**
1. Add "in-progress" label to issue
2. Remove "ready" label
3. Read issue description and acceptance criteria
4. **Spawn planning agents in PARALLEL** (based on domain labels):
   - `frontend` → spawn `ux-designer` agent
   - `backend` → spawn `architect` agent
   - `database` → spawn `persistence` agent
   - `ai-ml` → spawn `ml-expert` agent
   - `infra` → spawn `infra` agent
   - `auth` → spawn `security` agent
   - Multiple domains → spawn multiple agents in ONE message
5. Consolidate agent recommendations into implementation plan

**Step 3b: Persist the Plan**
Write plan to `docs/plans/issue-<number>.md`:
```markdown
# Issue #<number>: <title>

## Summary
<consolidated from planning agents>

## Implementation Steps
1. <step from architect/ux-designer>
2. <step 2>
...

## Files to Modify
- <paths identified during planning>

## Acceptance Criteria
- [ ] <from GitHub issue>

## Technical Notes
<decisions made, gotchas identified>
```

**Step 3c: Clear Context**
```
/clear
```

This resets context while preserving:
- CLAUDE.md (reloaded)
- .claude/rules/* (reloaded)
- The plan file on disk

### Phase 4: EXECUTE (on feature branch)

**Fresh Context Execution:**

After clearing, execute with maximum available context:

**Step 4a: Create Feature Branch**
```bash
# Create and switch to feature branch
git checkout -b issue-<number>-<short-title>

# Example: issue-3-minio-storage
```

**Step 4b: TDD Implementation**

Follow Test-Driven Development:

1. **Read the plan**: `docs/plans/issue-<number>.md`

2. **Write tests FIRST** (Red phase):
   ```bash
   # Unit tests for business logic
   # File: tests/unit/<feature>.test.ts

   # Component tests for UI
   # File: tests/components/<Component>.test.tsx

   # E2E tests for user flows
   # File: tests/e2e/<feature>.spec.ts
   ```

3. **Run tests - should FAIL**:
   ```bash
   npm run test -- --watch
   ```

4. **Implement feature** (Green phase):
   - Write minimal code to make tests pass
   - Follow the plan steps

5. **Refactor** (Refactor phase):
   - Clean up code
   - Ensure no duplication
   - Verify patterns followed

**Step 4c: Testing & QA**

Run comprehensive testing:

1. **Unit Tests**:
   ```bash
   npm run test:unit
   ```

2. **Type Check**:
   ```bash
   npm run type-check
   ```

3. **Lint**:
   ```bash
   npm run lint
   ```

4. **E2E Tests** (multi-browser):
   ```bash
   # Desktop browsers
   npm run test:e2e -- --project=chromium
   npm run test:e2e -- --project=firefox
   npm run test:e2e -- --project=webkit

   # Mobile simulators
   npm run test:e2e -- --project="Mobile Chrome"
   npm run test:e2e -- --project="Mobile Safari"
   npm run test:e2e -- --project="iPad"
   ```

5. **Visual Regression Tests**:
   ```bash
   # Capture screenshots and compare
   npm run test:visual

   # Update baselines if intentional changes
   npm run test:visual -- --update-snapshots
   ```

6. **Accessibility Tests**:
   ```bash
   npm run test:a11y
   ```

**Step 4d: Screenshot QA**

For UI changes, capture and verify screenshots:

1. **Capture key states**:
   - Initial/empty state
   - Loading state
   - Success state
   - Error state
   - Mobile view (375px)
   - Tablet view (768px)
   - Desktop view (1280px)

2. **Save to documentation**:
   ```bash
   mkdir -p docs/screenshots/issue-<number>
   # Screenshots saved by Playwright to this directory
   ```

3. **Visual checklist**:
   - [ ] Layout correct on all viewports
   - [ ] Colors match design system
   - [ ] Typography consistent
   - [ ] Touch targets >= 44x44px (mobile)
   - [ ] Focus indicators visible
   - [ ] No layout shifts
   - [ ] Images optimized

**Step 4e: Commit**

After all tests pass:
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "<type>(<scope>): <description>

- <detail 1>
- <detail 2>

Tests: unit, e2e, visual"
```

Can make multiple commits during implementation.

**Step 4f: Pre-PR Validation**

Before creating a PR, run all CI checks locally to catch failures early:
```bash
# Run all CI checks locally
npm run pre-pr

# This runs: lint, type-check, build, e2e tests, visual tests
# Only proceed if ALL checks pass
```

**Step 4g: Push and Create PR**
```bash
# Push feature branch
git push -u origin issue-<number>-<short-title>

# Create PR with comprehensive testing checklist
gh pr create \
  --title "<type>(<scope>): <description>" \
  --body "## Summary
<what this PR does>

## Changes
- <change 1>
- <change 2>

## Testing Completed
- [x] Unit tests pass
- [x] Type check passes
- [x] Lint passes
- [x] E2E tests pass (Chrome, Firefox, Safari)
- [x] Mobile tests pass (iOS, Android simulators)
- [x] Visual regression tests pass
- [x] Accessibility tests pass

## Screenshots
<link to docs/screenshots/issue-<number>/ or inline images>

## QA Checklist
- [x] Tested on desktop (1280px+)
- [x] Tested on tablet (768px)
- [x] Tested on mobile (375px)
- [x] Keyboard navigation works
- [x] Screen reader tested

Closes #<issue-number>" \
  --label "<domain>"
```

**Step 4h: Return to Master (Read-Only)**
```bash
# Return to master for the next task selection
# NOTE: Never push directly to master - all changes go through PRs
git checkout master
```

**Commit Message Format:**
```
<type>(<scope>): <description>

<body explaining what and why>

Closes #<issue-number>
```

### Phase 5: REVIEW & MERGE

**Automated PR Review:**

After the PR is created, invoke the `/pr-review` skill:

**Step 5a: Review the PR**
```bash
# Get PR details
gh pr view <pr-number> --json title,body,files,additions,deletions

# Review changes
gh pr diff <pr-number>
```

**Step 5b: Run Review Checklist**
The pr-review skill checks:
- [ ] Code follows project patterns
- [ ] No security vulnerabilities
- [ ] Tests are included
- [ ] No `any` types in TypeScript
- [ ] Acceptance criteria met
- [ ] CI checks pass

**Step 5c: Decision**

If ALL checks pass:
```bash
# Approve the PR
gh pr review <pr-number> --approve --body "Automated review: All checks passed."

# Merge (squash) when CI passes
gh pr merge <pr-number> --squash --auto --delete-branch
```

If issues found:
```bash
# Request changes
gh pr review <pr-number> --request-changes --body "Issues found:
- <issue 1>
- <issue 2>"

# Create follow-up issue or fix inline
```

**Auto-Merge Requirements:**
- All CI checks must pass (GitHub Actions)
- PR must be approved
- Branch protection rules enforced

### Phase 6: REFLECT

After the PR is merged, reflect on its impact:

**Update Related Issues:**
```bash
# Find issues that reference the completed issue
gh issue list --search "Blocked by: #<completed-issue>" --json number,title
```

**Reflection Actions:**
1. **Update README Roadmap:**
   - Change `- [ ]` to `- [x]` for the completed issue
   - Keep README in sync with GitHub Issues
   - Example: `- [ ] [#3 MinIO Storage](...)` → `- [x] [#3 MinIO Storage](...)`

2. **Unblock dependent issues:**
   - Remove "blocked" label
   - Add "ready" label
   - Comment: "Unblocked by #X"

3. **Close obsolete issues:**
   - If implementation made another issue unnecessary
   - Comment: "Resolved by #X - closing as obsolete"

4. **Update related issues:**
   - If scope changed, update description
   - If new complexity discovered, add notes

5. **Create new issues:**
   - If bugs discovered during implementation
   - If refactoring opportunities found
   - If new features identified
   - **Add new issues to README Roadmap**

6. **Reprioritize if needed:**
   - If P0 revealed more P0s, address those first
   - If P1 is now blocking others, bump priority
   - **Update README if priority section changes**

### Phase 7: NEXT?

**Exit Conditions:**
- No more "ready" issues
- Error count exceeds threshold (3 consecutive failures)
- Maximum tasks completed (configurable)
- Time limit reached
- Critical error encountered

**Continue Conditions:**
- More "ready" issues exist
- Below error threshold
- Within time/task limits

## Usage

### Start the Loop
```
/task-loop
```

### Start with Limits
```
/task-loop --max-tasks 5
/task-loop --max-errors 2
```

### Dry Run (analyze only)
```
/task-loop --dry-run
```

## Helper Commands

### Check Ready Issues
```bash
gh issue list --repo novacekm/BriefBot --label "ready" --state open
```

### Check Blocked Issues
```bash
gh issue list --repo novacekm/BriefBot --label "blocked" --state open
```

### Check P0 Issues
```bash
gh issue list --repo novacekm/BriefBot --label "P0-critical" --state open
```

### Mark Issue as In Progress
```bash
gh issue edit <number> --add-label "in-progress" --remove-label "ready"
```

### Close Issue
```bash
gh issue close <number> --comment "Completed in commit <sha>"
```

## Best Practices

### Before Running Overnight

1. **Review the backlog:**
   ```bash
   gh issue list --repo novacekm/BriefBot --state open --label "ready"
   ```

2. **Ensure issues have proper labels:**
   - Priority (P0/P1/P2/P3)
   - Domain (frontend/backend/etc.)
   - Status (ready/blocked)

3. **Check dependencies are accurate:**
   - "Blocked by: #X" in issue body
   - Blocker issues should exist

4. **Set reasonable limits:**
   - Start with `--max-tasks 3` to test
   - Increase after verifying stability

### During Execution

- Each task should be self-contained
- Commit after each completed task
- Never leave a task half-done
- If stuck, create a new issue and move on

### Error Handling

- If tests fail: attempt fix up to 2 times, then skip
- If build fails: investigate, fix if simple, else skip
- If blocked by external factor: add "blocked" label, move on
- Log all skipped tasks for review

## Example Session

```
Claude: Starting task loop...

[ANALYZE] Fetching open issues...
Found 12 open issues:
- 3 P0-critical
- 5 P1-high
- 4 P2-medium

[ANALYZE] Checking dependencies...
- #5 blocked by #3
- #8 blocked by #5, #7
- 7 issues are ready

[SELECT] Selecting next task...
Selected: #3 [P0-critical] "Set up Supabase authentication"
Reason: Highest priority, unblocks #5 and #8

[PLAN] Planning implementation...
- Spawning security agent (auth domain) - PARALLEL
- Spawning architect agent (backend) - PARALLEL
- Agents returned recommendations
- Consolidated into implementation plan

[PERSIST] Saving plan...
- Written to docs/plans/issue-3.md
- Contains 8 implementation steps
- Lists 5 files to modify

[CLEAR] Clearing context...
- Running /clear
- Context reset, rules reloaded
- Plan file persists on disk

[EXECUTE] Working on #3 (fresh context)...
- Reading docs/plans/issue-3.md
- Implementing step 1/8: Install Supabase packages
- Implementing step 2/8: Configure environment
- ...
- Running tests
- Tests passed
- Committing: "feat(auth): set up Supabase authentication\n\nCloses #3"
- Pushed to GitHub
- Deleting docs/plans/issue-3.md

[REFLECT] Analyzing impact...
- #5 is now unblocked (was blocked by #3)
- Updating #5: removed "blocked", added "ready"
- #8 still blocked by #7

[NEXT] Continuing loop...
Remaining ready issues: 8
Next iteration starting...
```

## Integration with Claude Code

To run overnight:

```bash
# In terminal, start Claude Code with the task loop
claude --print "run /task-loop --max-tasks 20"

# Or with automatic continuation
while true; do
  claude --print "run /task-loop --max-tasks 5"
  sleep 60  # Brief pause between batches
done
```

## Safety Rails

1. **NEVER push directly to master** - All changes MUST go through Pull Requests
2. **ALWAYS create feature branches** - Create `issue-<number>-<short-title>` branches for all work
3. **ALWAYS create PRs** - Every change requires a PR, no exceptions
4. **Never force push** - All commits are normal pushes
5. **Never skip tests** - All changes must pass tests
6. **Never commit secrets** - Validate no .env or credentials
7. **Always reference issues** - Every commit closes an issue

### PR Approval Process

Only the admin (novacekm) can approve PRs. However, Claude can approve PRs on behalf of the admin using the `gh` CLI when:
- All CI checks pass
- Code review checklist passes
- No security vulnerabilities detected
- The admin has delegated approval authority for automated task loops

**Direct pushes to master are FORBIDDEN** - this is enforced by branch protection rules and programmatically by Claude.

## Metrics Tracked

After each session, report:
- Tasks completed
- Tasks skipped (and why)
- Issues created
- Issues closed
- Issues updated
- Errors encountered
- Total time elapsed
