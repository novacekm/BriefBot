# Sync Check Skill

> **Invoke with:** `/sync-check` or at session start
> **Purpose:** Verify all tracking systems are in sync and identify what to work on next

## What This Does

Run this when starting a fresh Claude Code session to:
1. Get a full picture of project status
2. Identify inconsistencies between tracking systems
3. Validate issue quality
4. Suggest what to work on next

---

## Step 1: Gather Data (run in parallel)

```bash
# Open issues by status
gh issue list --state open --json number,title,labels,body --limit 50

# Closed issues (recent)
gh issue list --state closed --limit 10 --json number,title

# README roadmap
cat README.md | grep -E "^\s*-\s*\[.\]"

# Open PRs
gh pr list --state open --json number,title,headRefName

# Recent commits on master
git log --oneline -10

# Local branches
git branch -a
```

---

## Step 2: Check Sync Status

### README vs GitHub Issues

Compare:
- `[x]` items in README should match closed issues
- `[ ]` items should match open issues
- No orphaned entries in either

**Report format:**
```
README SYNC CHECK
-----------------
[OK] #3 MinIO Storage - closed, README marked [x]
[OK] #5 OCR Pipeline - open, README marked [ ]
[MISMATCH] #7 Auth - closed but README shows [ ]
[MISSING] #12 - In README but no matching issue
```

### Issue Quality Check

For each open issue, verify:
- Has description (not empty body)
- Has acceptance criteria (contains "- [ ]" or "## Acceptance")
- Has priority label (P0/P1/P2/P3)
- Has status label (ready/blocked/in-progress)
- Has domain label (frontend/backend/etc.)

**Report format:**
```
ISSUE QUALITY CHECK
-------------------
#1 Document Upload
  [OK] Has description
  [OK] Has acceptance criteria
  [MISSING] No priority label
  [OK] Has status: ready

#2 OCR Integration
  [OK] Has description
  [MISSING] No acceptance criteria
  ...
```

### Orphaned Work Check

Identify:
- Branches without PRs
- PRs without linked issues
- In-progress issues with no recent commits

**Report format:**
```
ORPHANED WORK CHECK
-------------------
[WARN] Branch 'feature-dark-mode' has no open PR
[WARN] PR #15 not linked to any issue
[WARN] Issue #8 marked in-progress but no commits in 7 days
```

### Label Consistency Check

Verify:
- Only one issue marked "in-progress" at a time (solo dev)
- "blocked" issues have blocker noted in comments
- "ready" issues have no unmet dependencies

---

## Step 3: Suggest Next Action

Based on analysis, recommend:

```
RECOMMENDED NEXT ACTION
-----------------------
Priority: P1
Issue: #5 OCR Pipeline Integration
Status: ready
Reason: Highest priority ready issue, unblocks #6 and #7

To start:
  gh issue edit 5 --add-label "in-progress" --remove-label "ready"
  git checkout -b issue-5-ocr-pipeline
  /plan 5
```

---

## Step 4: Fix Issues (optional)

If inconsistencies found, offer to fix:

```
FIXES AVAILABLE
---------------
1. Add missing priority labels to issues #2, #4
2. Update README checkboxes for closed issues #3, #7
3. Close stale branch 'feature-dark-mode'

Run fixes? [y/n]
```

---

## Quick Reference

```bash
# Full sync check
/sync-check

# Just show status (no fixes)
/sync-check --status

# Auto-fix issues
/sync-check --fix
```

---

## Example Output

```
=====================================
  BriefBot Sync Check
=====================================

README SYNC CHECK
-----------------
[OK] 8/8 items in sync

ISSUE QUALITY CHECK
-------------------
[OK] 10/12 issues have complete metadata
[WARN] #4 missing acceptance criteria
[WARN] #11 missing priority label

ORPHANED WORK CHECK
-------------------
[OK] No orphaned branches or PRs

LABEL CONSISTENCY CHECK
-----------------------
[OK] No conflicts

RECOMMENDED NEXT ACTION
-----------------------
Issue #5: OCR Pipeline Integration (P1, ready)
  → /plan 5

=====================================
```
