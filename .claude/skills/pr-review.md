# PR Review - Automated Pull Request Review Skill

> **Invoke with:** `/pr-review <pr-number>` or "review PR #X"
> **Purpose:** Automated PR review with approval and merge capability

## What This Skill Does

Reviews a pull request against BriefBot quality standards and:
1. **Analyzes** code changes for quality, security, and patterns
2. **Validates** tests are included and passing
3. **Checks** acceptance criteria from linked issue
4. **Decides** to approve, request changes, or flag for human review
5. **Merges** automatically if all checks pass

## Review Process

### Step 1: Fetch PR Information

```bash
# Get PR details
gh pr view <number> --json number,title,body,state,labels,files,additions,deletions,baseRefName,headRefName

# Get linked issue
gh pr view <number> --json body | grep -o '#[0-9]*'

# Get CI status
gh pr checks <number>
```

### Step 2: Review Changed Files

```bash
# Get diff
gh pr diff <number>

# List changed files
gh pr view <number> --json files --jq '.files[].path'
```

### Step 3: Run Review Checklist

**Code Quality Checks:**
- [ ] No `any` types in TypeScript
- [ ] Functions are reasonably sized (< 50 lines)
- [ ] Clear, descriptive naming
- [ ] No code duplication
- [ ] Error handling implemented
- [ ] No console.log (except error/warn)
- [ ] No commented-out code
- [ ] No TODOs (should be issues)

**Architecture Checks:**
- [ ] Server Components used by default
- [ ] `'use client'` only where necessary
- [ ] Server Actions for mutations
- [ ] Proper data fetching patterns
- [ ] No sensitive data in client bundles

**Security Checks:**
- [ ] Input validation with Zod
- [ ] Authentication enforced where needed
- [ ] Authorization checked (user owns resource)
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] No secrets in code
- [ ] Swiss nFADP considerations

**Testing Checks:**
- [ ] Tests included for new code
- [ ] Tests pass locally
- [ ] Edge cases covered
- [ ] No test skips without reason

**Accessibility Checks (UI changes):**
- [ ] Touch targets >= 44x44px
- [ ] Color contrast sufficient
- [ ] Keyboard navigation works
- [ ] ARIA labels where needed

### Step 4: Check CI Status

```bash
# Wait for CI and get status
gh pr checks <number> --watch

# Check if all required checks pass
gh pr checks <number> --json name,state --jq '.[] | select(.state != "SUCCESS")'
```

### Step 5: Make Decision

**Decision Matrix:**

| Condition | Action |
|-----------|--------|
| All checks pass + CI green | Approve & Auto-merge |
| Minor issues (style, naming) | Approve with comments |
| Moderate issues (missing tests) | Request changes |
| Security concerns | Request changes + flag |
| Major architecture issues | Request human review |

### Step 6: Execute Decision

**If Approved:**
```bash
# Approve PR
gh pr review <number> --approve --body "$(cat <<'EOF'
## Automated Review: APPROVED

**Review Summary:**
- Code quality: ✅ Passed
- Security: ✅ No issues found
- Tests: ✅ Included and passing
- Architecture: ✅ Follows patterns

**Notes:**
<any comments or suggestions for future>

Merging when CI passes.
EOF
)"

# Enable auto-merge (squash)
gh pr merge <number> --squash --auto --delete-branch
```

**If Changes Requested:**
```bash
gh pr review <number> --request-changes --body "$(cat <<'EOF'
## Automated Review: CHANGES REQUESTED

**Issues Found:**

### Must Fix
1. <issue 1 with file:line reference>
2. <issue 2>

### Suggestions
- <optional improvement>

Please address the "Must Fix" items and push updates.
EOF
)"
```

**If Human Review Needed:**
```bash
gh pr comment <number> --body "$(cat <<'EOF'
## Automated Review: HUMAN REVIEW REQUESTED

This PR requires human review due to:
- <reason 1>
- <reason 2>

@novacekm please review when available.
EOF
)"

# Add label
gh pr edit <number> --add-label "needs-human-review"
```

## Confidence Levels

The skill operates with confidence thresholds:

| Confidence | Criteria | Action |
|------------|----------|--------|
| **High** (auto-merge) | Simple changes, tests pass, clear patterns | Approve + merge |
| **Medium** (approve) | Good code, minor questions | Approve, note questions |
| **Low** (request changes) | Issues found, fixable | Request specific changes |
| **Very Low** (escalate) | Complex, security, architecture | Flag for human |

## Auto-Merge Conditions

For automatic merge, ALL must be true:
1. All review checklist items pass
2. All CI checks pass (GitHub Actions)
3. No merge conflicts
4. PR is not marked "needs-human-review"
5. PR is not a draft
6. **PR has been approved** (by admin or Claude on admin's behalf)
7. **Changes came through a feature branch** (never direct to master)

## Example Review

```
Claude: Reviewing PR #15...

[FETCH] Getting PR details...
- Title: feat(storage): add MinIO integration
- Changes: +245 -12 across 5 files
- Linked issue: #3

[ANALYZE] Reviewing code changes...
- lib/storage/minio.ts: New file, storage utilities
- lib/actions/upload.ts: Uses new storage functions
- tests/storage.test.ts: Tests included

[CHECKLIST] Running quality checks...
✅ No `any` types
✅ Functions < 50 lines
✅ Clear naming
✅ Error handling present
✅ Tests included
✅ No security issues

[CI] Checking CI status...
✅ lint: passed
✅ type-check: passed
✅ test: passed
✅ build: passed

[DECISION] All checks pass, high confidence
→ Approving PR
→ Enabling auto-merge

[RESULT] PR #15 approved and will merge when CI completes.
```

## Safety Rails

1. **NEVER push directly to master** - All changes MUST go through PRs
2. **Never force merge** - Always use `--auto` to wait for CI
3. **Never skip CI** - All checks must pass
4. **Escalate uncertainty** - When in doubt, request human review
5. **Document decisions** - Always explain why in review comment
6. **Preserve branch** - Only delete after successful merge

### Pre-Review Safety Check

Before reviewing ANY PR, verify:
```bash
# Ensure we're not accidentally on master with uncommitted changes
git status

# Ensure we're reviewing a PR, not pushing to master
gh pr view <number> --json baseRefName --jq '.baseRefName'
# Must target 'master' as base, changes come FROM feature branch
```

**CRITICAL**: If you ever find yourself about to run `git push origin master`, STOP immediately. This is forbidden. Create a feature branch and PR instead.

## Claude's PR Approval Authority

Claude can approve and merge PRs on behalf of the admin (novacekm) under these conditions:

### Automatic Approval Permitted When:
1. **All CI checks pass** - lint, type-check, test, build
2. **Code review checklist passes** - no security issues, follows patterns
3. **Tests are included** - for new functionality
4. **No "needs-human-review" label** - not flagged for manual review
5. **PR is from task-loop** - automated overnight work

### Human Review Required When:
1. Security-sensitive changes (auth, data handling)
2. Architecture changes (new patterns, major refactors)
3. Configuration changes (env vars, CI/CD)
4. Database migrations (schema changes)
5. Dependency updates (especially major versions)
6. Any PR with "needs-human-review" label

### Approval Command
```bash
# Claude approves on behalf of admin
gh pr review <number> --approve --body "$(cat <<'EOF'
## Automated Review: APPROVED

Approved by Claude on behalf of @novacekm.

**Review Summary:**
- Code quality: Passed
- Security: No issues found
- Tests: Included and passing
- Architecture: Follows patterns

**Approval Authority:** Delegated for automated task-loop execution.
EOF
)"
```

## Integration with Task Loop

The task loop invokes this skill after creating a PR:

```
[EXECUTE] Implementation complete, PR #15 created

[REVIEW] Invoking /pr-review 15...
<review process runs>

[RESULT] PR #15 merged successfully

[REFLECT] Continuing to next task...
```

## Manual Invocation

You can also use this skill standalone:

```
/pr-review 15
```

Or:
```
Review PR #15 for me
```
