# Plan Skill

> **Invoke with:** `/plan <issue-number>` or `/plan` for new ideas
> **Purpose:** Multi-agent feature planning with persistent plan output

## Two Modes

### Mode 1: Issue-Based Planning (`/plan <N>`)

For existing GitHub issues - structured planning with domain agents.

### Mode 2: Discovery Planning (`/plan`)

For new ideas - interactive brainstorming before creating an issue.

---

## Mode 1: Issue-Based Planning

### Step 1: Gather Context

```bash
# Get issue details
gh issue view <N> --json number,title,body,labels,comments

# Get related code
# (based on issue labels, explore relevant directories)
```

### Step 2: Spawn Domain Agents (PARALLEL)

Based on issue labels, spawn relevant agents:

| Label | Agent | Focus |
|-------|-------|-------|
| `frontend` | ux-designer | UI/UX, component design, states |
| `backend` | architect | API design, data flow, patterns |
| `database` | persistence | Schema, queries, migrations |
| `auth` | security | Auth flows, nFADP compliance |
| `ai-ml` | ml-expert | OCR, translation, AI integration |
| `infra` | infra | Deployment, Docker, CI/CD |

```
Task("Analyze issue #<N> for UI/UX requirements", ux-designer)
Task("Analyze issue #<N> for architecture", architect)
Task("Analyze issue #<N> for security", security)
```

Each agent:
1. Reads the issue
2. Explores relevant code
3. Returns their analysis and recommendations

### Step 3: Synthesize Plan

Combine agent outputs into a plan file:

```bash
# Create plan file
docs/plans/issue-<N>.md
```

**Plan file format:**
```markdown
# Issue #<N>: <title>

## Summary
<1-2 sentence description>

## Agent Analysis

### Architecture (from architect agent)
- <findings>
- <recommendations>

### UI/UX (from ux-designer agent)
- <findings>
- <recommendations>

### Security (from security agent)
- <findings>
- <recommendations>

## Implementation Steps
1. <step with file path>
2. <step with file path>
3. ...

## Files to Modify
- `path/to/file1.ts` - <what changes>
- `path/to/file2.ts` - <what changes>

## Files to Create
- `path/to/new-file.ts` - <purpose>

## Acceptance Criteria
- [ ] <from issue>
- [ ] <from issue>

## Test Scenarios
- [ ] <scenario 1>
- [ ] <scenario 2>

## Technical Decisions
- <decision 1 and rationale>
- <decision 2 and rationale>

## Dependencies
- <npm packages>
- <env vars>
- <external services>

## Open Questions
- <any unresolved questions for user>
```

### Step 4: Review & Approve

Present plan summary to user:
- Key decisions made
- Implementation approach
- Any open questions

User can:
- Approve → proceed to execution
- Modify → adjust plan based on feedback
- Reject → start over with different approach

### Step 5: Update Issue

After approval:
```bash
gh issue comment <N> --body "Plan created: docs/plans/issue-<N>.md"
gh issue edit <N> --add-label "planned"
```

---

## Mode 2: Discovery Planning

For new feature ideas without an existing issue.

### Phase 1: Discovery

Ask clarifying questions:
- What problem are you solving?
- Who are the users?
- What's the ideal experience?
- Any constraints?
- What does success look like?

### Phase 2: Solution Options

Propose 2-3 approaches:

**Option A: Minimal**
- Core functionality only
- Fast to build
- Pros/cons

**Option B: Balanced (Recommended)**
- Good UX
- Reasonable complexity
- Pros/cons

**Option C: Full-Featured**
- Best UX
- Handles edge cases
- Pros/cons

### Phase 3: Create Issue

After selecting approach:
```bash
gh issue create \
  --title "feat: <feature name>" \
  --body "<generated specification>" \
  --label "ready,<priority>,<domain>"
```

### Phase 4: Proceed to Issue-Based Planning

```
/plan <new-issue-number>
```

---

## Swiss Context

Always consider:
- **Multi-language**: DE/FR/IT support needed?
- **Privacy-first**: Swiss nFADP compliance
- **Mobile-first**: Touch-friendly, works offline
- **Document types**: Swiss official mail, insurance, tax forms

---

## Quick Reference

```bash
# Plan existing issue
/plan 5

# Plan new feature (discovery mode)
/plan

# Read existing plan
cat docs/plans/issue-5.md

# Execute after planning
git checkout -b issue-5-feature-name
# (read plan and implement)
```

---

## Example: `/plan 5`

```
=====================================
  Planning Issue #5: OCR Pipeline
=====================================

GATHERING CONTEXT...
- Issue: #5 OCR Pipeline Integration
- Labels: backend, ai-ml, P1
- Acceptance criteria: 4 items

SPAWNING AGENTS...
- architect: Analyzing backend patterns...
- ml-expert: Analyzing OCR requirements...
- security: Analyzing data handling...

AGENT RESULTS:

[Architect]
- Recommend Server Actions for OCR trigger
- Use background job queue (BullMQ)
- Store results in MinIO + DB

[ML Expert]
- Tesseract.js for client-side preview
- Google Vision API for production accuracy
- Support DE/FR/IT language detection

[Security]
- Encrypt documents at rest
- No PII in logs
- 30-day retention policy

GENERATING PLAN...
→ Created: docs/plans/issue-5.md

KEY DECISIONS:
1. Hybrid OCR: client preview + server accuracy
2. Background processing with progress updates
3. Results cached in MinIO

OPEN QUESTIONS:
1. Preferred cloud OCR provider?
2. Maximum document size?

Approve plan? [y/n/modify]
```
