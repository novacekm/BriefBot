# Claude Code Configuration

This directory contains all Claude Code configuration for BriefBot.

## Quick Start Decision Table

| I need to... | Use |
|--------------|-----|
| Validate if a feature is needed | `domain-expert` agent |
| Plan a new feature | `/plan` skill or `planner` agent |
| Design system architecture | `architect` agent |
| Design UI components | `ux-designer` agent |
| Design database schema | `persistence` agent |
| Review security/compliance | `security` agent |
| Write tests | `tester` agent |
| Review code before PR | `/review` skill or `reviewer` agent |
| Review a PR with comments | `/pr-review` skill |
| Implement AI/OCR features | `ml-expert` agent |
| Set up Docker/CI | `infra` agent |
| Analyze market/pricing | `market-analyst` agent |

## Skills (invoke with `/skill-name`)

| Skill | When to Use |
|-------|-------------|
| `/plan` | Before implementing any feature - creates spec |
| `/review` | Quick code review before committing |
| `/pr-review <N>` | Detailed PR review with inline comments |
| `/sync-check` | Session start - verify sync, suggest next task |
| `/task-loop` | Automated task orchestration |

## Agents (spawn for deep work)

| Agent | Domain | Key Capabilities |
|-------|--------|------------------|
| `domain-expert` | Swiss context | User need validation, terminology, prioritization |
| `planner` | Feature planning | Design thinking, Swiss context, specifications |
| `architect` | System design | Next.js 15 patterns, API design, performance |
| `ux-designer` | UI/UX | Swiss International Style, shadcn/ui, accessibility |
| `persistence` | Database | Prisma, PostgreSQL, MinIO, migrations |
| `security` | Compliance | Swiss nFADP, zero-trust, PII protection |
| `tester` | Quality | TDD, Playwright E2E, coverage requirements |
| `reviewer` | Code quality | TypeScript best practices, ESLint, review |
| `ml-expert` | AI/ML | Claude Vision OCR, translation, RAG |
| `infra` | DevOps | Docker, CI/CD, deployment |
| `market-analyst` | Business | Pricing, competitive positioning, viability |

## Rules (auto-loaded)

Rules persist across `/clear` and apply to all sessions:

| Rule | Purpose |
|------|---------|
| `no-claude-attribution` | Never include Claude in git history |
| `task-execution` | PR workflow, review loop, parallelization |
| `context-management` | Token optimization, subagent usage |
| `pre-pr-validation` | Always run `npm run pre-pr` before PRs |
| `readme-sync` | Keep README roadmap in sync with issues |

## Path-Specific Rules

Additional rules loaded when working in specific directories:

| Path | Rule |
|------|------|
| `lib/**/*.ts`, `app/**/*.ts` | TypeScript strict patterns |
| `tests/**` | Testing best practices |
| `app/api/**` | API route security |
| `components/**` | Component patterns |

## Hooks

Auto-formatting runs after Edit/Write operations via PostToolUse hooks.

## Directory Structure

```
.claude/
├── agents/           # 11 specialized agents
│   ├── architect.md
│   ├── domain-expert.md
│   ├── infra.md
│   ├── market-analyst.md
│   ├── ml-expert.md
│   ├── persistence.md
│   ├── planner.md
│   ├── reviewer.md
│   ├── security.md
│   ├── tester.md
│   └── ux-designer.md
├── hooks/            # PostToolUse hooks
│   └── format.sh
├── knowledge/        # Domain knowledge files
├── rules/            # Persistent rules
│   ├── api-routes.md
│   ├── components.md
│   ├── context-management.md
│   ├── no-claude-attribution.md
│   ├── pre-pr-validation.md
│   ├── readme-sync.md
│   ├── task-execution.md
│   ├── testing.md
│   └── typescript.md
├── skills/           # Invokable workflows
│   ├── plan/
│   ├── pr-review/
│   ├── review/
│   ├── sync-check/
│   └── task-loop/
└── settings.json     # Permissions and hooks
```

## Workflow Quick Reference

```
1. domain-expert     → Validate need
2. /plan             → Create specification
3. architect + ux    → Design (parallel)
4. Implement (TDD)
5. /review           → Validate code
6. npm run pre-pr    → Local checks
7. gh pr create      → Open PR
8. gh pr checks --watch → Wait for CI
9. /pr-review        → Get approval
10. gh pr merge      → Ship it
```
