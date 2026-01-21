# Context Management Rules

These rules ensure efficient context usage during Claude Code sessions.

## Keep Context Lean

1. **Use subagents for exploration**
   - Spawn `Explore` agent for codebase searches
   - Spawn specialized agents for domain-specific tasks
   - Never do extensive file reading in main context

2. **Prefer CLI tools over manual reads**
   - Use `gh` for GitHub operations
   - Use `git` for version control
   - Use `npm`/`npx` for package operations

3. **Batch operations**
   - Make multiple independent tool calls in parallel
   - Don't wait for one result if another doesn't depend on it

4. **Clear aggressively**
   - Run `/clear` between unrelated tasks
   - Run `/compact` when context feels heavy
   - Use `/context` to monitor usage

## Files to Avoid Reading Directly

These are excluded via permissions.deny, but also avoid:
- `node_modules/` - Use package documentation instead
- `.next/` - Build artifacts, not source
- `*.log` files - Summarize with grep instead
- Large JSON files - Query specific fields

## Parallel Agent Spawning

When multiple independent tasks exist:
```
GOOD: Spawn agents A, B, C in single message (parallel)
BAD: Spawn A, wait, spawn B, wait, spawn C (sequential)
```

Always spawn multiple agents in ONE message when:
- Tasks are independent (no data dependencies)
- Results don't inform next task selection
- Exploring multiple code areas

## Context Checkpoints

Before large operations:
1. Note what you've learned
2. Write important findings to a file (docs/session-notes/)
3. Run `/clear`
4. Resume with fresh context
