# Task Execution Workflow

## CRITICAL: PR-Based Development is MANDATORY

**Direct pushes to master are FORBIDDEN.** All changes must go through Pull Requests.

### The Non-Negotiable Rules:
1. **NEVER** run `git push origin master` - this is forbidden
2. **ALWAYS** create a feature branch for every change
3. **ALWAYS** create a PR for every change
4. **ALWAYS** get PR approval before merging (admin or Claude on admin's behalf)

Violating these rules will break the development workflow and potentially destabilize the codebase.

---

## The Plan → Persist → Clear → Execute Pattern

For each task from the backlog, follow this workflow:

### Step 1: PLAN (in fresh context)

```
1. Read GitHub issue for the task
2. Use /plan skill or planner agent to create implementation plan
3. Ask clarifying questions if needed
4. Document the plan
```

### Step 2: PERSIST (save to file)

Before clearing context, persist the plan:

```bash
# Create session plan file
docs/plans/issue-<number>.md
```

Plan file format:
```markdown
# Issue #<number>: <title>

## Summary
<1-2 sentence description>

## Implementation Steps
1. <step 1>
2. <step 2>
3. ...

## Files to Modify
- path/to/file1.ts
- path/to/file2.ts

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Notes
<any important context>
```

### Step 3: CLEAR (reset context)

```
/clear
```

This removes conversation history but:
- CLAUDE.md is reloaded
- Rules in .claude/rules/ are reloaded
- Skills remain available
- The plan file persists on disk

### Step 4: EXECUTE (with fresh context)

Start fresh execution:
```
Read docs/plans/issue-<number>.md and implement it.
```

The fresh context means:
- No stale exploration results
- No accumulated search results
- Full context available for implementation
- Focused on the specific task

### Step 5: VERIFY, PR & CLOSE

After implementation:
1. Run tests
2. Verify acceptance criteria
3. Commit with issue reference
4. **Push to feature branch** (NEVER to master)
5. **Create Pull Request** with `gh pr create`
6. **Get PR approved** (by admin or Claude via `/pr-review`)
7. **Merge via PR** with `gh pr merge --squash --auto`
8. GitHub issue auto-closes via "Closes #X" in PR
9. Delete plan file (optional)

**REMINDER**: Direct pushes to master are forbidden. Always use the PR workflow.

## Why This Works

| Phase | Context Usage |
|-------|---------------|
| Plan | ~20% (exploration, questions) |
| Clear | 0% (reset) |
| Execute | ~60% (implementation, tests) |
| Buffer | ~20% (for errors, fixes) |

Without clearing: Plan uses 20%, then execute tries to use 60%, but only 30% remains = failures.

## Automation with Task Loop

The `/task-loop` skill should follow this pattern:

```
for each issue:
    1. Plan (spawn planner agent)
    2. Persist (write plan file)
    3. Clear context
    4. Execute (read plan, implement)
    5. Commit & close
```

## Quick Reference

```bash
# Check current context usage
/context

# Compact if needed
/compact Focus on implementation steps

# Full clear for new task
/clear

# Read persisted plan
Read docs/plans/issue-<N>.md
```
