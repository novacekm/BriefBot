# Claude Code Configuration

This directory contains Claude Code agents and skills for BriefBot development.

## Structure

```
.claude/
├── agents/           # Specialized subagents for specific domains
│   ├── planner/      # Feature planning and brainstorming
│   ├── architect/    # Next.js 15 architecture and system design
│   ├── ux-designer/  # Swiss International Style and accessibility
│   ├── security/     # Swiss nFADP compliance and security
│   ├── persistence/  # Prisma, PostgreSQL, and MinIO
│   ├── tester/       # TDD practices and Playwright testing
│   ├── reviewer/     # Code review and quality standards
│   ├── ml-expert/    # OCR, translation, and RAG
│   └── infra/        # Docker and deployment
└── skills/           # Invokable skills for specific tasks
    ├── plan.md       # Feature planning and brainstorming
    └── review.md     # Code review
```

## Agents

**Agents** are specialized subagents that handle specific task types with:
- Their own isolated context
- Focused system prompts for specific domains
- Specialized tool access
- Ability to preserve context by keeping exploration separate from main conversation

### Available Agents

| Agent | Purpose | Use When |
|-------|---------|----------|
| **planner** | Feature brainstorming, UX planning, specification creation | Planning new features or breaking down complex requirements |
| **architect** | Next.js 15 patterns, system design, technical architecture | Designing system architecture or making technical decisions |
| **ux-designer** | Swiss International Style, accessibility, shadcn/ui | Designing UI components or ensuring accessibility compliance |
| **security** | Swiss nFADP compliance, zero-trust architecture | Reviewing security or privacy implications |
| **persistence** | Prisma, PostgreSQL, MinIO integration | Designing database schemas or storage solutions |
| **tester** | TDD practices, Playwright, test strategies | Writing test plans or implementing test coverage |
| **reviewer** | Code review, quality standards, best practices | Reviewing code before commits |
| **ml-expert** | OCR, translation, RAG optimization | Implementing AI/ML features |
| **infra** | Docker, CI/CD, deployment | Setting up infrastructure or deployment pipelines |

### How to Use Agents

Agents run in their own subprocess with isolated context. They can:
- Explore codebases without cluttering your main conversation
- Specialize with domain-specific knowledge
- Preserve context for long-running tasks

Example: Spawn the planner agent for feature planning:
```
User: "Plan the document upload feature"
Claude: [Spawns planner agent to handle planning session]
```

## Skills

**Skills** are reusable knowledge and commands that can be:
- Invoked manually with `/skill-name`
- Used automatically by Claude when relevant
- Injected into agents via the `skills` field in agent frontmatter

### Available Skills

| Skill | Purpose | Invoke With |
|-------|---------|-------------|
| **plan** | Interactive feature planning and specification creation | `/plan` or describe feature idea |
| **review** | Comprehensive code review following BriefBot standards | `/review` or request code review |

### How to Use Skills

**Manual Invocation:**
```bash
/plan
```

**Automatic Usage:**
Claude will automatically use skills when relevant based on context.

**In Agents:**
Agents can have skills preloaded by adding to their frontmatter:
```yaml
---
name: planner
skills:
  - plan
---
```

## Relationship Between Agents and Skills

- **Agents** = Specialist roles with focused system prompts (e.g., "planner agent")
- **Skills** = Reusable knowledge and commands (e.g., "plan skill")
- **Connection**: Agents can use skills for domain knowledge

Example:
- The `planner` **agent** has the `plan` **skill** injected, giving it planning methodology
- The `reviewer` **agent** has the `review` **skill** injected, giving it review checklists

## Development Workflow

1. **Plan** → Use `planner` agent or `/plan` skill for any new feature
2. **Design** → Consult `architect` and `ux-designer` agents
3. **Build** → Follow agent guidelines for implementation
4. **Review** → Use `reviewer` agent or `/review` skill before committing
5. **Test** → Consult `tester` agent for test strategies
6. **Commit** → Push to GitHub

See `CLAUDE_CODE_WORKFLOW.md` for complete workflow details.

## When to Use What

| Scenario | Use This |
|----------|----------|
| "I want to plan a new feature" | `/plan` skill or spawn `planner` agent |
| "I need help with database schema" | Spawn `persistence` agent |
| "Is this code secure and compliant?" | Spawn `security` agent |
| "Should I use Server Component or Client Component?" | Spawn `architect` agent |
| "Is this accessible and does it follow our design system?" | Spawn `ux-designer` agent |
| "I want to review my code before committing" | `/review` skill or spawn `reviewer` agent |
| "How should I test this feature?" | Spawn `tester` agent |
| "How do I implement OCR for Swiss documents?" | Spawn `ml-expert` agent |
| "How do I deploy this?" | Spawn `infra` agent |

## Benefits

**Agents:**
- ✅ Preserve context by isolating exploration from main conversation
- ✅ Specialize behavior with focused system prompts
- ✅ Long-running tasks without cluttering main chat

**Skills:**
- ✅ Reusable knowledge across conversations
- ✅ Quick invocation with `/skill-name`
- ✅ Can be injected into agents for domain expertise

**Together:**
- ✅ Flexible workflow (use skills directly or via agents)
- ✅ Clear separation of concerns
- ✅ Consistent quality standards
