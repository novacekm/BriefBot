# PR Review Skill

> **Invoke with:** `/pr-review <pr-number>`
> **Purpose:** Multi-agent PR review with inline code comments that must be resolved

## What This Does

1. Spawns multiple agents IN PARALLEL to review from different perspectives
2. Each agent posts **inline code comments** on specific lines (not general comments)
3. Comments appear in "Files changed" tab and can be individually resolved
4. Review loops until ALL comments are resolved
5. Only merges when all reviewers approve and no unresolved threads

---

## Review Process

### Step 1: Get PR Context

```bash
# Get PR info and files
gh pr view <N> --json number,title,body,files,headRefName

# Get the diff
gh pr diff <N>

# Check comment count (resolution status requires GitHub UI check)
gh api repos/novacekm/BriefBot/pulls/<N>/comments --jq 'length'
```

### Step 2: Spawn Review Agents (PARALLEL)

Spawn these agents in a SINGLE message:

```
Task("Review PR #<N> for code quality - post inline comments", reviewer)
Task("Review PR #<N> for security - post inline comments", security)
Task("Review PR #<N> for architecture - post inline comments", architect)
```

> **Solo dev tip:** For small changes (1-2 files, < 50 lines), spawn only one general-purpose agent instead of all three. Use full multi-agent review for features, security-sensitive changes, or architecture modifications.

### Step 3: Agents Post Inline Comments

Each agent creates a **review with line comments** using the GitHub API:

```bash
# Create review with inline comments on specific lines
gh api repos/novacekm/BriefBot/pulls/<N>/reviews \
  --method POST \
  -f body="Code Quality Review" \
  -f event="REQUEST_CHANGES" \
  -f comments='[
    {
      "path": "src/lib/storage.ts",
      "line": 42,
      "body": "**Issue:** Using `any` type here.\n\n**Fix:** Define a proper interface."
    },
    {
      "path": "src/lib/storage.ts",
      "line": 67,
      "body": "**Issue:** Function too long (53 lines).\n\n**Fix:** Extract into smaller functions."
    }
  ]'
```

If no issues found:
```bash
gh api repos/novacekm/BriefBot/pulls/<N>/reviews \
  --method POST \
  -f body="Code Quality Review - No issues found" \
  -f event="APPROVE"
```

### Step 4: Review Loop Until All Resolved (max 3 iterations)

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Review ──► Inline Comments ──► Author Fixes        │
│      ▲              │                   │            │
│      │              │                   ▼            │
│      │              │            Push + Mark         │
│      │              │            as Resolved         │
│      │              │                   │            │
│      │              ▼                   │            │
│      │      All Resolved? ──────────────┘            │
│      │              │                                │
│      │              │ Yes                            │
│      │              ▼                                │
│      │         APPROVE                               │
│      │         & MERGE                               │
│      │                                               │
│      └───────────────────────────────────────────────┘
│                                                      │
└──────────────────────────────────────────────────────┘
```

> **Iteration limit:** After 3 review cycles, if issues remain, add a comment explaining why the approach is intentional and request a final decision. This prevents infinite loops from disagreements.

**Check for comments (resolution status must be verified in GitHub UI):**
```bash
# Get top-level comment count (REST API cannot check resolved status)
gh api repos/novacekm/BriefBot/pulls/<N>/comments \
  --jq '[.[] | select(.in_reply_to_id == null)] | length'
```

> **Note:** The REST API does not expose `isResolved` status. Check resolution visually in the "Files changed" tab, or use the GraphQL API with `PullRequestReviewThread.isResolved`.

---

## Agent Instructions for Inline Comments

### For ALL Review Agents

When reviewing a PR:

1. **Get the diff:**
   ```bash
   gh pr diff <N>
   ```

   > Line numbers are in hunk headers: `@@ -14,5 +18,10 @@` means new file starts at line 18. Count lines from there.

2. **Identify issues with specific file paths and line numbers**

3. **Post inline comments using this format:**
   ```bash
   gh api repos/novacekm/BriefBot/pulls/<N>/reviews \
     --method POST \
     -f body="<Review Type> Review" \
     -f event="REQUEST_CHANGES" \
     -f comments='[
       {"path": "<file>", "line": <N>, "body": "**Issue:** <problem>\n\n**Fix:** <solution>"}
     ]'
   ```

4. **If no issues, approve:**
   ```bash
   gh api repos/novacekm/BriefBot/pulls/<N>/reviews \
     --method POST \
     -f body="<Review Type> Review - LGTM" \
     -f event="APPROVE"
   ```

### reviewer Agent Checklist

Post inline comments for:
- `any` types in TypeScript
- Functions > 50 lines
- Missing error handling
- console.log statements (not .error/.warn)
- Commented-out code
- Unclear naming

### security Agent Checklist

Post inline comments for:
- Missing input validation (Zod)
- Missing auth/authz checks
- SQL injection risks
- XSS vulnerabilities
- Hardcoded secrets
- PII handling violations (Swiss nFADP)

### architect Agent Checklist

Post inline comments for:
- `'use client'` without justification
- Client-side fetch for initial data
- Not using Server Actions for mutations
- Sensitive data in client bundles

---

## Resolving Comments

After author pushes fixes:

1. **Author marks each comment as resolved** in GitHub UI
   - Or replies "Fixed in <commit>" and resolves

2. **Re-run review:**
   ```bash
   /pr-review <N>
   ```

3. **Agents check if their previous issues are fixed:**
   - If fixed: Approve
   - If not fixed: Leave new comment explaining what's still wrong

4. **Continue until no unresolved threads**

---

## Final Approval & Merge

When all agents approve and no unresolved comments:

```bash
# Check all 3 review types approved (look for review body prefixes)
gh api repos/novacekm/BriefBot/pulls/<N>/reviews \
  --jq '[.[] | select(.state == "APPROVED")] | length'
# Should be >= 3 (Code Quality, Security, Architecture)

# Verify review types present
gh api repos/novacekm/BriefBot/pulls/<N>/reviews \
  --jq '[.[] | select(.state == "APPROVED") | .body] | join("\n")'
# Should contain "Code Quality", "Security", and "Architecture"

# Check no pending comments (verify resolution in GitHub UI)
gh api repos/novacekm/BriefBot/pulls/<N>/comments \
  --jq '[.[] | select(.in_reply_to_id == null)] | length'

# If all pass, merge (--auto waits for CI)
gh pr merge <N> --squash --auto --delete-branch
```

---

## Safety Requirements

1. **Local CI before every push:** `npm run pre-pr` must pass
2. **Resolve ALL inline comments:** Each must be addressed and marked resolved
3. **Re-review after fixes:** Run `/pr-review <N>` again
4. **No unresolved threads:** Cannot merge with open review comments

---

## Quick Reference

```bash
# Review a PR (creates inline comments)
/pr-review <N>

# View review comments
gh api repos/novacekm/BriefBot/pulls/<N>/comments

# Check review status
gh pr view <N>

# After author fixes, re-review
/pr-review <N>
```
