# Task Loop - Automated Task Orchestration Skill

> **Invoke with:** `/task-loop` or "run task loop"
> **Purpose:** Automated task selection, execution, and backlog management for overnight runs

## What This Skill Does

Orchestrates an intelligent task loop that:
1. **Analyzes** all open GitHub issues
2. **Selects** the highest-value ready task
3. **Executes** the task (implementation, tests, commit)
4. **Reflects** on impact and updates related issues
5. **Loops** until exit conditions are met

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

### Phase 3: EXECUTE

**Execution Steps:**
1. Add "in-progress" label to issue
2. Remove "ready" label
3. Read issue description and acceptance criteria
4. Consult relevant agent (based on domain label):
   - `frontend` → `ux-designer` agent
   - `backend` → `architect` agent
   - `database` → `persistence` agent
   - `ai-ml` → `ml-expert` agent
   - `infra` → `infra` agent
   - `auth` → `security` agent
5. Plan implementation (use `plan` skill if complex)
6. Implement the feature/fix
7. Write/update tests
8. Run tests and ensure they pass
9. Commit with issue reference: `fix(scope): description\n\nCloses #X`
10. Push to GitHub

**Commit Message Format:**
```
<type>(<scope>): <description>

<body explaining what and why>

Closes #<issue-number>
```

### Phase 4: REFLECT

After completing a task, reflect on its impact:

**Update Related Issues:**
```bash
# Find issues that reference the completed issue
gh issue list --search "Blocked by: #<completed-issue>" --json number,title
```

**Reflection Actions:**
1. **Unblock dependent issues:**
   - Remove "blocked" label
   - Add "ready" label
   - Comment: "Unblocked by #X"

2. **Close obsolete issues:**
   - If implementation made another issue unnecessary
   - Comment: "Resolved by #X - closing as obsolete"

3. **Update related issues:**
   - If scope changed, update description
   - If new complexity discovered, add notes

4. **Create new issues:**
   - If bugs discovered during implementation
   - If refactoring opportunities found
   - If new features identified

5. **Reprioritize if needed:**
   - If P0 revealed more P0s, address those first
   - If P1 is now blocking others, bump priority

### Phase 5: NEXT?

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

[EXECUTE] Working on #3...
- Consulting security agent for auth patterns
- Implementing Supabase auth integration
- Writing tests
- Tests passed
- Committing: "feat(auth): set up Supabase authentication\n\nCloses #3"
- Pushed to GitHub

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

1. **Never force push** - All commits are normal pushes
2. **Never modify main directly** - Create branches for large changes
3. **Never skip tests** - All changes must pass tests
4. **Never commit secrets** - Validate no .env or credentials
5. **Always reference issues** - Every commit closes an issue

## Metrics Tracked

After each session, report:
- Tasks completed
- Tasks skipped (and why)
- Issues created
- Issues closed
- Issues updated
- Errors encountered
- Total time elapsed
