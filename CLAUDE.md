# BriefBot

Privacy-first OCR utility for Swiss residents to decode official mail in German, French, and Italian.

## Tech Stack

Next.js 15 (App Router) | TypeScript | Tailwind CSS | shadcn/ui | Prisma | PostgreSQL | MinIO | Vercel AI SDK

## Commands

```bash
npm run dev              # Start dev server
npm run test:e2e         # E2E tests
npm run pre-pr           # Run before creating PR (lint, type-check, build, test)
npm run db:migrate       # Database migrations
npm run docker:up        # Start Docker services
```

## Agent Quick Reference

| Task | Agent |
|------|-------|
| Validate user need | `domain-expert` |
| Plan feature | `planner` or `/plan` |
| Design architecture | `architect` |
| Design UI | `ux-designer` |
| Database schema | `persistence` |
| Security review | `security` |
| Write tests | `tester` |
| Code review | `reviewer` or `/review` |
| AI/OCR features | `ml-expert` |
| Infrastructure | `infra` |

**Rule**: Start with `/plan` or `planner` before implementing any feature.

## Workflow

1. Create branch: `git checkout -b issue-<N>-<title>`
2. Implement with TDD
3. Run `npm run pre-pr`
4. Create PR: `gh pr create`
5. Wait for CI: `gh pr checks <N> --watch`
6. Merge: `gh pr merge <N> --squash --delete-branch`

## Detailed Documentation

- `.claude/README.md` - Agents, skills, and rules reference
- `.claude/rules/task-execution.md` - PR workflow and review loop
- `DEVELOPMENT_FLOW.md` - Complete development lifecycle
- `docs/BACKLOG.json` - Current tasks
