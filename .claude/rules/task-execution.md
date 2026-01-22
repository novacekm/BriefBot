# Task Execution Rules

## CRITICAL: PR-Based Development

**Direct pushes to master are FORBIDDEN.** All changes must go through Pull Requests.

1. **NEVER** run `git push origin master`
2. **ALWAYS** create a feature branch: `issue-<N>-<short-title>`
3. **ALWAYS** create a PR with `gh pr create`
4. **ALWAYS** run `npm run pre-pr` before creating PR
5. **ALWAYS** update README roadmap when closing issues

---

## Workflow: Plan → Execute → PR

### 1. PLAN
- Read the GitHub issue
- Use `/plan` skill or `planner` agent for complex features
- Spawn domain agents in parallel if needed (architect, ux-designer, security)

### 2. EXECUTE
- Create feature branch: `git checkout -b issue-<N>-<short-title>`
- Write tests first (TDD)
- Implement the feature
- Run `npm run pre-pr` to validate

### 3. PR & MERGE
- Push branch: `git push -u origin issue-<N>-<short-title>`
- Create PR: `gh pr create`
- Wait for CI (all 10 checks must pass)
- Merge: `gh pr merge --squash --delete-branch`
- Update README roadmap checkbox

---

## Parallelization Patterns

### When to Parallelize (same message)

**Multi-agent research:**
```
Task("Explore auth", Explore)
Task("Explore storage", Explore)
```

**Multi-domain planning:**
```
Task("Design backend", architect)
Task("Design UI", ux-designer)
Task("Review security", security)
```

**Validation commands:**
```
Bash("npm run lint")
Bash("npm run type-check")
```

**File reads:**
```
Read("component.tsx")
Read("component.test.tsx")
```

### When NOT to Parallelize

- **Sequential dependencies**: Need output from previous step
- **Write operations**: Risk of race conditions
- **Dependent decisions**: Plan before build

---

## Context Management

For large tasks, use the **Persist → Clear → Execute** pattern:

1. **Persist**: Save plan to `docs/plans/issue-<N>.md`
2. **Clear**: Run `/clear` to reset context
3. **Execute**: Read plan file, implement with fresh context

This prevents context exhaustion on complex features.

---

## Quick Reference

```bash
# Before PR
npm run pre-pr

# Create branch
git checkout -b issue-42-feature-name

# Create PR
gh pr create --title "feat(scope): description"

# Merge after CI passes
gh pr merge --squash --delete-branch
```
