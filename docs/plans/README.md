# Task Plans

This directory stores implementation plans for GitHub issues.

## Purpose

Plans are persisted here so that Claude Code can:
1. **Plan** a task (exploring codebase, asking questions)
2. **Persist** the plan to this directory
3. **Clear** context to free up space
4. **Execute** by reading the plan file

This ensures maximum context is available for implementation.

## File Naming

```
issue-<number>.md
```

Example: `issue-1.md` for GitHub issue #1

## File Format

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

## Files to Create
- path/to/new-file.ts

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Notes
<any important context, decisions, or gotchas>

## Dependencies
<npm packages to install, env vars needed, etc.>
```

## Lifecycle

1. **Created**: When planning a task
2. **Read**: When executing the task (after /clear)
3. **Updated**: If implementation reveals new info
4. **Deleted**: After task is completed and committed (optional)

## Tips

- Keep plans concise but complete
- Include specific file paths
- Note any decisions made during planning
- List acceptance criteria from GitHub issue
- Add technical notes that would be lost after /clear
