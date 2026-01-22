# PR Review Skill

> **Invoke with:** `/pr-review <pr-number>`
> **Purpose:** Thorough PR review with actionable feedback and fix loops

## Overview

This skill performs **real code review** - not rubber-stamping. It:
1. Analyzes every changed file
2. Leaves specific comments on problematic code
3. Requests changes when issues are found
4. Repeats until all issues are addressed
5. Only approves when quality standards are met

---

## Review Process

### Step 1: Fetch PR Context

```bash
# Get PR details
gh pr view <N> --json number,title,body,files,additions,deletions,commits

# Get the diff
gh pr diff <N>

# Get linked issue for acceptance criteria
gh issue view <linked-issue> --json body
```

### Step 2: Analyze Each Changed File

For EVERY file in the PR, review for:

**Code Quality:**
- TypeScript: No `any` types, proper typing
- Functions < 50 lines, single responsibility
- Clear naming, no magic numbers
- Error handling present
- No console.log (except errors)
- No commented-out code

**Architecture:**
- Server Components by default
- `'use client'` only where needed
- Server Actions for mutations
- No sensitive data in client bundles

**Security (Swiss nFADP):**
- Input validation with Zod
- Auth/authz checks
- No SQL injection, XSS risks
- No secrets in code
- PII handling compliant

**Testing:**
- Tests included for new code
- Edge cases covered

### Step 3: Leave PR Comments

For EACH issue found, leave a **specific comment** on the PR:

**For line-specific issues:**
```bash
# Create a review with line comments
gh api repos/{owner}/{repo}/pulls/<N>/reviews \
  --method POST \
  -f event='COMMENT' \
  -f body='Review in progress...' \
  -f comments='[
    {
      "path": "src/lib/storage.ts",
      "line": 42,
      "body": "**Issue:** Using `any` type here.\n\n**Suggestion:** Define a proper type:\n```typescript\ntype StorageConfig = {\n  bucket: string;\n  endpoint: string;\n};\n```"
    }
  ]'
```

**For general issues:**
```bash
gh pr comment <N> --body "$(cat <<'EOF'
## Review Comment

**File:** `src/lib/storage.ts`

**Issue:** Missing error handling for network failures.

**Suggestion:**
```typescript
try {
  await client.putObject(...)
} catch (error) {
  if (error instanceof NetworkError) {
    throw new StorageError('Network unavailable', { cause: error });
  }
  throw error;
}
```
EOF
)"
```

### Step 4: Request Changes or Approve

**If issues found:**
```bash
gh pr review <N> --request-changes --body "$(cat <<'EOF'
## Review: Changes Requested

Found **X issues** that need to be addressed before merge.

### Must Fix
1. `src/lib/storage.ts:42` - Using `any` type
2. `src/lib/storage.ts:67` - Missing error handling
3. `src/actions/upload.ts:15` - No input validation

### Suggestions (Optional)
- Consider extracting the retry logic into a utility

Please address the "Must Fix" items, run `npm run pre-pr`, and push updates.

I'll re-review when ready.
EOF
)"
```

**If all checks pass:**
```bash
gh pr review <N> --approve --body "$(cat <<'EOF'
## Review: Approved

All review checks passed:
- ✅ Code quality
- ✅ Architecture patterns
- ✅ Security considerations
- ✅ Tests included
- ✅ CI passing

Merging.
EOF
)"

gh pr merge <N> --squash --auto --delete-branch
```

---

## Review-Fix Loop

When changes are requested, the following loop runs:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────┐    ┌──────────┐    ┌─────────────┐   │
│  │ REVIEW  │───►│  ISSUES  │───►│ FIX & PUSH  │   │
│  └─────────┘    │  FOUND?  │    └─────────────┘   │
│       ▲         └──────────┘           │          │
│       │              │                 │          │
│       │              │ No              ▼          │
│       │              ▼          ┌───────────┐     │
│       │         ┌────────┐      │ pre-pr    │     │
│       │         │APPROVE │      │ (local)   │     │
│       │         │& MERGE │      └───────────┘     │
│       │         └────────┘           │          │
│       │                              ▼          │
│       └──────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Fix Process

When reviewer leaves comments:

1. **Read all comments:**
   ```bash
   gh pr view <N> --comments
   gh api repos/{owner}/{repo}/pulls/<N>/comments
   ```

2. **Address each issue:**
   - Fix the code as suggested
   - If you disagree, reply to the comment explaining why

3. **Run local validation:**
   ```bash
   npm run pre-pr  # MUST pass before pushing
   ```

4. **Push fixes:**
   ```bash
   git add .
   git commit -m "fix: address review comments

   - Fix any types in storage.ts
   - Add error handling
   - Add input validation"
   git push
   ```

5. **Request re-review:**
   ```bash
   gh pr comment <N> --body "Addressed all review comments. Ready for re-review."
   ```

6. **Reviewer re-runs `/pr-review <N>`**

---

## Review Checklist

### Code Quality (All Files)

| Check | Fail Condition | Auto-fixable |
|-------|----------------|--------------|
| No `any` types | Found `any` or implicit any | Sometimes |
| Function size | Function > 50 lines | No |
| Naming | Unclear names, magic numbers | No |
| Error handling | Missing try/catch for async | Sometimes |
| Console logs | console.log (not .error/.warn) | Yes |
| Dead code | Commented-out code | Yes |
| TODOs | TODO without issue link | Yes |

### Architecture (React/Next.js)

| Check | Fail Condition |
|-------|----------------|
| Server Components | `'use client'` without justification |
| Data fetching | Client-side fetch for initial data |
| Mutations | Not using Server Actions |
| Bundle safety | Importing server code in client |

### Security (Swiss nFADP)

| Check | Fail Condition | Severity |
|-------|----------------|----------|
| Input validation | User input not validated | HIGH |
| Auth check | Missing authentication | HIGH |
| Authz check | Missing user ownership check | HIGH |
| SQL injection | String concatenation in queries | CRITICAL |
| XSS | Unescaped user content | HIGH |
| Secrets | Hardcoded credentials | CRITICAL |
| PII logging | Logging user data | HIGH |

### Testing

| Check | Fail Condition |
|-------|----------------|
| Tests exist | New code without tests |
| Tests pass | Failing tests |
| Coverage | Major paths not covered |

---

## Comment Templates

### Type Issue
```markdown
**Issue:** Using `any` type

**Location:** Line 42

**Problem:** `any` bypasses TypeScript's type checking, hiding potential bugs.

**Fix:**
```typescript
// Before
function process(data: any) { ... }

// After
function process(data: DocumentUpload) { ... }
```
```

### Missing Error Handling
```markdown
**Issue:** Missing error handling

**Location:** Lines 45-50

**Problem:** Async operation without try/catch. Network failures will crash.

**Fix:**
```typescript
try {
  const result = await uploadFile(file);
  return result;
} catch (error) {
  logger.error('Upload failed', { error, fileId: file.id });
  throw new UploadError('Failed to upload file');
}
```
```

### Security Issue
```markdown
**⚠️ Security Issue:** Missing input validation

**Location:** Line 23

**Problem:** User input passed directly to database query without validation.

**Fix:**
```typescript
import { z } from 'zod';

const schema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(255),
});

const validated = schema.parse(input);
```

**Severity:** HIGH - Must fix before merge.
```

### Suggestion (Non-blocking)
```markdown
**Suggestion:** Consider extracting this logic

**Location:** Lines 67-89

This retry logic could be reused. Consider:
```typescript
// lib/utils/retry.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> { ... }
```

*This is a suggestion, not blocking merge.*
```

---

## Integration with Task Loop

After creating a PR, task-loop invokes review:

```
[EXECUTE] PR #15 created

[REVIEW] Running /pr-review 15...
- Analyzing 5 changed files
- Found 3 issues:
  1. src/storage.ts:42 - any type
  2. src/storage.ts:67 - missing error handling
  3. src/actions/upload.ts:15 - no validation

[REVIEW] Requesting changes...

[FIX] Addressing review comments...
- Fixed any type → proper StorageConfig type
- Added error handling with retry
- Added Zod validation

[VALIDATE] Running npm run pre-pr...
- ✅ lint passed
- ✅ type-check passed
- ✅ tests passed
- ✅ build passed

[PUSH] Pushing fixes...

[REVIEW] Re-running /pr-review 15...
- All issues addressed
- ✅ Approved

[MERGE] PR #15 merged
```

---

## Safety Requirements

1. **Local CI before every push:**
   ```bash
   npm run pre-pr  # MUST pass
   git push
   ```

2. **Never skip review:** Even for "small" changes

3. **Address ALL comments:** Don't leave unresolved threads

4. **Re-review after fixes:** Always run `/pr-review` again after pushing fixes

5. **Escalate when uncertain:** Flag for human review if complex

---

## Quick Reference

```bash
# Review a PR
/pr-review 15

# View PR comments
gh pr view 15 --comments

# View review comments (line-level)
gh api repos/novacekm/BriefBot/pulls/15/comments

# Reply to a comment
gh api repos/novacekm/BriefBot/pulls/15/comments/<comment-id>/replies \
  --method POST -f body="Fixed in latest commit"

# Mark PR ready for re-review
gh pr comment 15 --body "Addressed all comments. Ready for re-review."
```
