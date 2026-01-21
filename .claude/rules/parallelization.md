# Parallelization Rules

## When to Parallelize

Always spawn multiple agents in a SINGLE message when:

### 1. Independent Exploration
```
Example: "What does the auth system look like and how is storage handled?"

PARALLEL:
- Spawn Explore agent for auth
- Spawn Explore agent for storage
(Both in same message)
```

### 2. Multi-Domain Planning
```
Example: "Plan the document upload feature"

PARALLEL:
- Spawn architect agent for backend design
- Spawn ux-designer agent for UI design
- Spawn security agent for auth/privacy review
(All in same message)
```

### 3. Code Quality Checks
```
Example: Before committing

PARALLEL:
- Run npm run lint
- Run npm run type-check
- Run npm run test
(All in same Bash calls)
```

### 4. Multiple File Reads
```
Example: Understanding a feature

PARALLEL:
- Read component.tsx
- Read component.test.tsx
- Read types.ts
(All in same Read calls)
```

## When NOT to Parallelize

### 1. Sequential Dependencies
```
BAD: Read config.ts and use its values in another agent
GOOD: Read config.ts first, then spawn agent with the values
```

### 2. Write Operations
```
BAD: Write file A and file B in parallel (race conditions)
GOOD: Write file A, then write file B
```

### 3. Dependent Decisions
```
BAD: Spawn planner and builder at same time
GOOD: Plan first, then build based on plan
```

## Parallel Patterns

### Pattern: Multi-Agent Research
```typescript
// In single message, spawn:
Task("Explore auth implementation", Explore)
Task("Explore database schema", Explore)
Task("Explore API routes", Explore)
// All run in parallel, results come back together
```

### Pattern: Parallel Validation
```bash
# In single message:
Bash("npm run lint")
Bash("npm run type-check")
Bash("npm test -- --passWithNoTests")
```

### Pattern: Parallel File Reads
```typescript
// In single message:
Read("src/lib/auth.ts")
Read("src/lib/db.ts")
Read("src/types/index.ts")
```

### Pattern: Agent + CLI Parallel
```typescript
// In single message:
Task("Research best practices for X", claude-code-guide)
Bash("gh issue list --label 'related-topic'")
```

## Performance Impact

| Approach | Time | Context |
|----------|------|---------|
| Sequential 3 agents | 3x | Accumulated |
| Parallel 3 agents | 1x | Isolated |

Parallel agents:
- Run simultaneously
- Have isolated contexts
- Don't pollute main context
- Return results together

## Checklist Before Spawning

Before spawning agents, ask:
1. Are these tasks independent? → Parallelize
2. Does one need the other's output? → Sequential
3. Are they exploring different areas? → Parallelize
4. Is one a prerequisite? → Sequential
5. Can they run with current information? → Parallelize
