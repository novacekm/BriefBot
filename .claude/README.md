# Claude Code Configuration

This directory contains Claude Code skills for BriefBot development.

## Structure

```
.claude/
└── skills/           # Invokable skills for specific tasks
    ├── plan.md       # Feature planning and brainstorming
    └── review.md     # Code review
```

## Skills

### plan.md
**Purpose:** Interactive feature planning and specification creation

Use when you want to:
- Plan a new feature
- Brainstorm different approaches
- Create feature specifications
- Get help with requirements

**Usage:** Simply describe your feature idea, and the planning process will begin.

### review.md
**Purpose:** Comprehensive code review

Use when you want to:
- Review code before committing
- Check compliance with project standards
- Validate security and privacy
- Ensure test coverage

**Usage:** Request a code review after making changes.

## Reference Guides

Detailed development guides are in `/docs/guides/`:
- `planner-guide.md` - Comprehensive planning methodology
- `architect-guide.md` - Next.js 15 patterns and system design
- `ux-designer-guide.md` - Swiss International Style and accessibility
- `security-guide.md` - Swiss nFADP compliance and security
- `persistence-guide.md` - Prisma, PostgreSQL, and MinIO
- `tester-guide.md` - TDD practices and Playwright testing
- `reviewer-guide.md` - Code review standards
- `ml-expert-guide.md` - OCR, translation, and RAG
- `infra-guide.md` - Docker and deployment

## How It Works

**Skills** are actionable: You invoke them for specific tasks.
**Guides** are reference: Consulted for detailed context and standards.

## Development Workflow

1. **Plan** → Use `plan` skill for any new feature
2. **Build** → Follow guides for implementation
3. **Review** → Use `review` skill before committing
4. **Test** → Run Playwright tests
5. **Commit** → Push to GitHub

See `CLAUDE_CODE_WORKFLOW.md` for complete workflow details.
