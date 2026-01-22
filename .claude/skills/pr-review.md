# PR Review Skill

> **Invoke with:** `/pr-review <pr-number>`
> **Purpose:** Multi-agent PR review with findings posted directly to GitHub

## What This Does

Spawns multiple specialized agents IN PARALLEL to review the PR from different perspectives. Each agent posts their findings directly to the GitHub PR. This is NOT rubber-stamping.

---

## Review Process

### Step 1: Get PR Context

```bash
# Get PR info
gh pr view <N> --json number,title,body,files,additions,deletions

# Get the diff
gh pr diff <N>

# Get linked issue
gh issue view <linked-issue-number> --json body
```

### Step 2: Spawn Review Agents (PARALLEL)

Spawn these agents in a SINGLE message to review in parallel.

> **Note:** The syntax below is pseudo-code. In practice, use the Task tool with `subagent_type` parameter pointing to agents defined in `.claude/agents/`.

```
Task("Review PR #<N> for code quality", subagent_type=reviewer)
Task("Review PR #<N> for security", subagent_type=security)
Task("Review PR #<N> for architecture", subagent_type=architect)
```

Each agent:
1. Reads the PR diff
2. Analyzes from their domain perspective
3. Posts findings directly to GitHub PR

### Step 3: Collect & Post Results

**If ANY agent found issues:**
```bash
gh pr review <N> --request-changes --body "$(cat <<'EOF'
## Review: Changes Requested

Multiple reviewers found issues that need addressing.

See individual comments above for details.

Please fix and push updates, then request re-review.
EOF
)"
```

**If ALL agents approve:**
```bash
gh pr comment <N> --body "LGTM - All review checks passed."

gh pr review <N> --approve --body "$(cat <<'EOF'
## Review: Approved

All reviewers passed:
- Code quality
- Security & compliance
- Architecture patterns

Merging.
EOF
)"

gh pr merge <N> --squash --auto --delete-branch
```

---

## Agent Review Instructions

### For `reviewer` Agent

When spawned to review a PR:

1. **Read the diff**: `gh pr diff <N>`
2. **Check for**:
   - `any` types in TypeScript
   - Functions > 50 lines
   - Missing error handling
   - console.log statements
   - Commented-out code
   - Unclear naming
3. **Post findings to GitHub**:
   ```bash
   gh pr comment <N> --body "$(cat <<'EOF'
   ## Code Quality Review

   **File:** `src/lib/storage.ts`

   ### Issues Found
   - Line 42: Using `any` type - define proper interface
   - Line 67-120: Function too long (53 lines) - extract helpers

   ### Suggestions
   - Consider adding JSDoc for public functions
   EOF
   )"
   ```
4. **If no issues**:
   ```bash
   gh pr comment <N> --body "## Code Quality Review\n\nNo issues found."
   ```

### For `security` Agent

When spawned to review a PR:

1. **Read the diff**: `gh pr diff <N>`
2. **Check for**:
   - Input validation (Zod schemas)
   - Auth/authz checks
   - SQL injection risks
   - XSS vulnerabilities
   - Hardcoded secrets
   - PII handling (Swiss nFADP)
3. **Post findings to GitHub**:
   ```bash
   gh pr comment <N> --body "$(cat <<'EOF'
   ## Security Review

   ### Issues Found
   - `src/actions/upload.ts:23` - User input not validated
   - `src/lib/db.ts:45` - Missing authorization check

   ### nFADP Compliance
   - PII handling: OK
   - Data retention: Not applicable
   EOF
   )"
   ```
4. **If no issues**:
   ```bash
   gh pr comment <N> --body "## Security Review\n\nNo security issues found. nFADP compliance: OK"
   ```

### For `architect` Agent

When spawned to review a PR:

1. **Read the diff**: `gh pr diff <N>`
2. **Check for**:
   - Server Components used by default
   - `'use client'` only where needed
   - Server Actions for mutations
   - Proper data fetching patterns
   - No sensitive data in client bundles
3. **Post findings to GitHub**:
   ```bash
   gh pr comment <N> --body "$(cat <<'EOF'
   ## Architecture Review

   ### Issues Found
   - `app/upload/page.tsx` - Using client-side fetch for initial data, should use Server Component

   ### Patterns
   - Server Components: OK
   - Data fetching: Issue above
   EOF
   )"
   ```
4. **If no issues**:
   ```bash
   gh pr comment <N> --body "## Architecture Review\n\nFollows Next.js 15 patterns correctly."
   ```

---

## Example Invocation

When you run `/pr-review 21`:

```
[CONTEXT] Fetching PR #21...
- Title: feat(storage): add MinIO integration
- Files: 5 changed (+245 -12)

[REVIEW] Spawning review agents in parallel...

Task("Review PR #21 code quality", reviewer)
Task("Review PR #21 security", security)
Task("Review PR #21 architecture", architect)

[WAIT] Agents analyzing...

[RESULTS]
- reviewer: Posted comment - 2 issues found
- security: Posted comment - No issues
- architect: Posted comment - 1 issue found

[ACTION] Issues found - requesting changes...
gh pr review 21 --request-changes

[DONE] Review complete. See PR #21 for comments.
```

---

## After Fixes

When author fixes issues and requests re-review:

1. Run `/pr-review <N>` again
2. Agents re-analyze the updated code
3. Post new comments or confirm resolution
4. Approve when all clear

---

## Safety Requirements

1. **Local CI before every push:** Run `npm run pre-pr` and ensure it passes
2. **Address ALL review comments:** Don't leave unresolved threads
3. **Re-review after fixes:** Run `/pr-review <N>` again after pushing fixes
4. **Never skip review:** Even for "small" changes

---

## Quick Reference

```bash
# Review a PR (spawns agents, posts to GitHub)
/pr-review <N>

# View posted comments
gh pr view <N> --comments

# After fixes, re-review
/pr-review <N>
```
