# Task Loop Skill

> **Invoke with:** `/task-loop` or "run task loop"

## Solo Dev Workflow (Daily Use)

For most tasks, use this simple workflow:

### 1. Pick a Task
```bash
gh issue list --label "ready" --state open
```
Select the highest priority (P0 > P1 > P2 > P3) issue.

### 2. Plan
```bash
# Mark as in-progress
gh issue edit <N> --add-label "in-progress" --remove-label "ready"
```
Use `/plan` skill or spawn relevant agents (architect, ux-designer, etc.).

### 3. Execute
```bash
git checkout -b issue-<N>-<short-title>
# Write tests first (TDD)
# Implement feature
npm run pre-pr
```

### 4. PR & Review Loop
```bash
git push -u origin issue-<N>-<short-title>
gh pr create --title "type(scope): description"
```

Then run the **review loop**:
```
/pr-review <N>
  │
  ├─► Issues found? ─► Fix code ─► npm run pre-pr ─► git push ─► /pr-review <N>
  │                                                                    │
  └─► No issues ─► Approved ─► gh pr merge --squash --delete-branch ◄──┘
```

**Every PR must be reviewed with actual comments - no rubber-stamping.**

### 5. Reflect
- Update README roadmap (`[ ]` → `[x]`)
- Unblock dependent issues (change "blocked" → "ready")
- Close the issue if not auto-closed

---

## Automated Task Loop (Overnight Runs)

For hands-off overnight execution, the full task loop orchestrates:

```
ANALYZE → SELECT → PLAN → PERSIST → CLEAR → EXECUTE → REVIEW → REFLECT → LOOP
```

### Phase 1: ANALYZE

```bash
gh issue list --state open --json number,title,labels,body --limit 100
```

**Selection Priority:**
1. P0-critical + ready
2. P1-high + ready
3. Issues that unblock others
4. P2-medium + ready
5. P3-low + ready

### Phase 2: SELECT

Filter for issues with "ready" label or no blockers. Validate:
- Does the feature still need to be built?
- Are acceptance criteria still valid?

### Phase 3: PLAN & PERSIST

1. Add "in-progress" label
2. Spawn domain agents in parallel based on labels:
   - `frontend` → ux-designer
   - `backend` → architect
   - `database` → persistence
   - `ai-ml` → ml-expert
   - `auth` → security
3. Write plan to `docs/plans/issue-<N>.md`

### Phase 4: CLEAR CONTEXT

```
/clear
```
Resets context while preserving rules and plan file on disk.

### Phase 5: EXECUTE

1. Read `docs/plans/issue-<N>.md`
2. Create feature branch
3. TDD: Write tests first, then implement
4. Run `npm run pre-pr`
5. Commit and push
6. Create PR with `gh pr create`

### Phase 6: REVIEW & MERGE

Use `/pr-review` skill:
- If all checks pass → approve and merge
- If issues found → fix inline or create follow-up issue

### Phase 7: REFLECT

1. **Update README** - mark issue as `[x]` in roadmap
2. **Unblock dependents** - change "blocked" → "ready" for issues waiting on this
3. **Create follow-ups** - if bugs or improvements discovered

### Phase 8: LOOP OR EXIT

**Continue if:**
- More "ready" issues exist
- Below error threshold
- Within task/time limits

**Exit if:**
- No more ready issues
- 3+ consecutive failures
- Max tasks reached

---

## Safety Rails

1. **NEVER** push directly to master
2. **ALWAYS** create feature branches
3. **ALWAYS** create PRs
4. **NEVER** skip tests
5. **NEVER** commit secrets
6. **ALWAYS** reference issues in commits

---

## Quick Commands

```bash
# Check ready issues
gh issue list --label "ready" --state open

# Check blocked issues
gh issue list --label "blocked" --state open

# Mark in progress
gh issue edit <N> --add-label "in-progress" --remove-label "ready"

# Close issue
gh issue close <N> --comment "Completed in PR #X"
```
