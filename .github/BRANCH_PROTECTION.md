# Branch Protection Rules

## CRITICAL: Direct Pushes to Master are FORBIDDEN

This repository enforces a strict PR-based development workflow. **Direct pushes to master are not allowed**, regardless of whether GitHub branch protection is enabled.

### How This is Enforced

1. **Programmatically by Claude** - The `/pr-review` and `/task-loop` skills enforce PR-based workflow
2. **By Convention** - All developers and AI assistants must follow the PR workflow
3. **By GitHub Branch Protection** - When available (requires GitHub Pro for private repos)

### What This Means

- **NEVER** run `git push origin master`
- **ALWAYS** create a feature branch: `git checkout -b issue-<number>-<title>`
- **ALWAYS** create a PR: `gh pr create`
- **ALWAYS** get approval before merging (admin or Claude on admin's behalf)

---

## Note on Private Repositories

GitHub branch protection rules require GitHub Pro for private repositories.
Until then, the `/pr-review` skill enforces these rules programmatically.

## Branch Protection Rules for Master Branch

These settings are enforced (programmatically now, by GitHub when available):

### Required Status Checks
- [x] Require status checks to pass before merging
- [x] Require branches to be up to date before merging

**Required checks:**
- `lint`
- `type-check`
- `test`
- `build`

### Pull Request Reviews
- [x] Require a pull request before merging
- [x] Require approvals: 1
- [x] Dismiss stale pull request approvals when new commits are pushed

### Additional Settings
- [x] Require conversation resolution before merging
- [x] Do not allow bypassing the above settings
- [ ] Allow force pushes: OFF
- [ ] Allow deletions: OFF

## Current Enforcement (Without Branch Protection)

The `/pr-review` skill enforces these rules manually:

1. **Before approving, verify:**
   - All CI checks pass (`gh pr checks <number>`)
   - Code review checklist passes
   - No merge conflicts

2. **Auto-merge only when:**
   - PR is approved
   - All CI status checks are green
   - Using squash merge (`gh pr merge --squash --auto`)

3. **If CI fails:**
   - Do not approve
   - Request changes with specific failures

## Setting Up Branch Protection (When Available)

Via GitHub UI:
1. Go to Settings → Branches
2. Add rule for `master`
3. Apply settings above

Via GitHub CLI (when available):
```bash
gh api repos/novacekm/BriefBot/branches/master/protection \
  -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks='{"strict":true,"contexts":["lint","type-check","test","build"]}' \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  -f restrictions=null
```

## Current Workflow (Enforced by Claude)

```
Feature Branch → PR → CI Checks → PR Review → Approval → Squash Merge
     ↑                              ↑           ↑
     │                              │           │
 git checkout -b              /pr-review    gh pr merge --squash --auto
```

**The `/pr-review` skill acts as the gate**, only approving and merging when:
- All CI checks pass
- Code quality standards met
- No security issues found

### Claude's Role in Branch Protection

Since GitHub branch protection requires Pro for private repos, Claude enforces protection programmatically:

1. **Before any push**: Claude checks the target branch
2. **If target is master**: Claude refuses and creates a feature branch instead
3. **For PRs**: Claude can approve on behalf of admin when criteria are met
4. **For merges**: Claude only merges via `gh pr merge`, never direct push

### Admin Approval Delegation

The admin (novacekm) has delegated PR approval authority to Claude for:
- Automated task-loop PRs where all checks pass
- Simple changes with no security implications
- PRs without the "needs-human-review" label

Human review is still required for:
- Security-sensitive changes
- Architecture changes
- Database migrations
- Configuration changes
- Any PR flagged for human review
