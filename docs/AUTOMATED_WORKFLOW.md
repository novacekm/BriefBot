# Automated Claude Code Workflow

## Overview

This document describes how to run Claude Code in an automated loop to process BriefBot development tasks overnight or for extended periods.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTOMATED WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

GitHub Issues                    Claude Code                    Git
    │                                │                           │
    │  1. Fetch open issues          │                           │
    │<───────────────────────────────│                           │
    │                                │                           │
    │  2. Select ready task          │                           │
    │                                │                           │
    │  3. Mark in-progress           │                           │
    │<───────────────────────────────│                           │
    │                                │                           │
    │                    4. Execute task                         │
    │                                │                           │
    │                    5. Run tests                            │
    │                                │                           │
    │                                │  6. Commit & push         │
    │                                │─────────────────────────> │
    │                                │                           │
    │  7. Close issue                │                           │
    │<───────────────────────────────│                           │
    │                                │                           │
    │  8. Update related issues      │                           │
    │<───────────────────────────────│                           │
    │                                │                           │
    │  9. Loop to step 1             │                           │
    └────────────────────────────────┴───────────────────────────┘
```

## Prerequisites

### 1. GitHub CLI Authenticated
```bash
gh auth status
# Should show authenticated as novacekm
```

### 2. Docker Services Running
```bash
npm run docker:up
# PostgreSQL and MinIO should be running
```

### 3. Environment Variables Set
```bash
cp .env.example .env.local
# Fill in required values
```

### 4. Issues Properly Labeled

Each issue should have:
- **Priority label**: `P0-critical`, `P1-high`, `P2-medium`, or `P3-low`
- **Status label**: `ready`, `blocked`, or `needs-planning`
- **Domain label**: `frontend`, `backend`, `database`, `ai-ml`, `infra`, or `auth`
- **Dependencies**: Listed in body as `Blocked by: #X, #Y` or `None`

## Running the Task Loop

### Interactive Mode

Start Claude Code and invoke the task loop:

```bash
claude
# Then type: /task-loop
```

### Batch Mode (Recommended for Overnight)

Run Claude with automatic task loop:

```bash
# Process up to 10 tasks
claude --print "/task-loop --max-tasks 10"
```

### Continuous Mode

For truly overnight execution:

```bash
#!/bin/bash
# overnight-run.sh

MAX_ITERATIONS=20
ITERATION=0

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    echo "=== Iteration $ITERATION ==="

    # Run Claude with task loop
    claude --print "/task-loop --max-tasks 5" 2>&1 | tee -a overnight.log

    # Check exit code
    if [ $? -ne 0 ]; then
        echo "Claude exited with error, stopping loop"
        break
    fi

    # Brief pause between batches
    sleep 30

    ITERATION=$((ITERATION + 1))
done

echo "Overnight run complete. Check overnight.log for details."
```

Make executable and run:
```bash
chmod +x overnight-run.sh
./overnight-run.sh
```

## Task Selection Logic

The task loop selects tasks in this order:

1. **P0-critical + ready** - Must be done immediately
2. **P1-high + ready + unblocks others** - High impact
3. **P1-high + ready** - Important work
4. **P2-medium + ready + unblocks others** - Enables more work
5. **P2-medium + ready** - Normal backlog
6. **P3-low + ready** - Nice to have

### Dependency Handling

Issues can declare dependencies in the body:
```markdown
## Dependencies
Blocked by: #5, #12
```

The task loop:
- Skips blocked issues
- After completing a task, updates dependent issues
- Adds "ready" label to newly unblocked issues

## Issue Lifecycle

```
┌──────────────┐
│ needs-planning│  Issue created, needs more detail
└──────┬───────┘
       │ Planning complete
       ▼
┌──────────────┐
│    ready     │  Ready to be picked up
└──────┬───────┘
       │ Task loop selects
       ▼
┌──────────────┐
│ in-progress  │  Being worked on
└──────┬───────┘
       │ Implementation complete
       ▼
┌──────────────┐
│    CLOSED    │  Done!
└──────────────┘
```

## Safety Rails

### What the Loop Will NOT Do

1. **Force push** - Never rewrites history
2. **Modify main without commit** - All changes are committed
3. **Skip tests** - All changes must pass tests
4. **Commit secrets** - Validates no sensitive files
5. **Work without issue** - Every change references an issue
6. **Exceed error threshold** - Stops after 3 consecutive failures

### Error Handling

| Error Type | Action |
|------------|--------|
| Tests fail | Attempt fix (2 tries), then skip |
| Build fails | Investigate, fix if simple, else skip |
| External blocker | Add "blocked" label, move on |
| Merge conflict | Stop and alert |
| Auth failure | Stop and alert |

## Monitoring Progress

### During Execution

Watch the log output for:
```
[ANALYZE] Fetching open issues...
[SELECT] Selected: #15 "Add user settings page"
[EXECUTE] Working on #15...
[REFLECT] Task complete, updating dependencies...
[NEXT] Continuing loop...
```

### After Execution

Check GitHub:
```bash
# Closed issues (completed tasks)
gh issue list --state closed --limit 10

# Open issues (remaining work)
gh issue list --state open

# Recent commits
git log --oneline -10
```

### Review Overnight Results

```bash
# What was accomplished?
gh issue list --state closed --search "closed:>$(date -v-1d +%Y-%m-%d)"

# What's left?
gh issue list --state open --label "ready"

# Any new issues created?
gh issue list --search "created:>$(date -v-1d +%Y-%m-%d)"
```

## Creating Good Issues for Automation

### Do's

- **Clear acceptance criteria** - Testable, unambiguous
- **Accurate dependencies** - List all blockers
- **Appropriate scope** - One feature/fix per issue
- **Domain labels** - Help select the right agent
- **Technical notes** - Include relevant file paths

### Don'ts

- **Vague descriptions** - "Make it better"
- **Missing dependencies** - Leads to blocked work
- **Too large scope** - Break into smaller issues
- **No acceptance criteria** - Can't verify completion

### Example Good Issue

```markdown
## Description
Add a "Delete Account" button to the user settings page that allows users to permanently delete their account and all associated data.

## User Story
As a user, I want to delete my account so that my personal data is removed from the system per Swiss nFADP requirements.

## Acceptance Criteria
- [ ] Delete button visible on /settings page
- [ ] Confirmation dialog before deletion
- [ ] All user data deleted (documents, translations)
- [ ] Files deleted from MinIO storage
- [ ] User redirected to homepage after deletion
- [ ] Cannot log in after deletion

## Dependencies
Blocked by: #3 (Supabase auth setup)

## Domain
- backend
- frontend
- database

## Technical Notes
- Use Server Action for deletion
- Implement cascade delete in Prisma
- Call MinIO delete for stored files
- Clear Supabase session
```

## Backlog Management

### Adding New Tasks

Use GitHub issue templates:
```bash
# Open browser to create issue
gh issue create --web
```

Or via CLI:
```bash
gh issue create \
  --title "[Feature]: Add document search" \
  --label "feature,P2-medium,ready,backend" \
  --body "## Description\n..."
```

### Prioritizing

Update labels:
```bash
# Bump priority
gh issue edit 15 --add-label "P1-high" --remove-label "P2-medium"

# Mark as ready
gh issue edit 15 --add-label "ready" --remove-label "needs-planning"
```

### Blocking/Unblocking

```bash
# Block an issue
gh issue edit 15 --add-label "blocked" --remove-label "ready"
gh issue comment 15 --body "Blocked by #20 - need auth setup first"

# Unblock after dependency resolved
gh issue edit 15 --remove-label "blocked" --add-label "ready"
gh issue comment 15 --body "Unblocked by #20 - auth setup complete"
```

## Troubleshooting

### Task Loop Stops Unexpectedly

1. Check the log for error messages
2. Verify GitHub auth: `gh auth status`
3. Check Docker services: `docker ps`
4. Verify database connection: `npm run db:studio`

### Tests Keep Failing

1. Run tests manually: `npm run test`
2. Check if database is seeded: `npm run db:seed`
3. Verify environment variables in `.env.local`

### Loop Picks Wrong Task

1. Check issue labels are correct
2. Verify dependencies are listed in issue body
3. Ensure "ready" label is only on truly ready issues

### Commits Not Pushing

1. Check git remote: `git remote -v`
2. Verify SSH key: `ssh -T git@github.com`
3. Check branch protection rules on GitHub

## Best Practices for Overnight Runs

1. **Start small** - Test with 3-5 tasks first
2. **Review in morning** - Check what was accomplished
3. **Clean backlog** - Ensure issues are well-defined
4. **Set limits** - Use `--max-tasks` and `--max-errors`
5. **Monitor remotely** - Check GitHub activity on phone
6. **Have rollback plan** - Know how to revert if needed

## Related Documentation

- [CLAUDE_CODE_WORKFLOW.md](./CLAUDE_CODE_WORKFLOW.md) - Development workflow
- [DEVELOPMENT_FLOW.md](../DEVELOPMENT_FLOW.md) - Dev process
- [.claude/skills/task-loop.md](../.claude/skills/task-loop.md) - Task loop skill details
