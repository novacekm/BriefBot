# Claude Code Configuration

> **Full documentation**: See `/CLAUDE.md` in project root

## Quick Reference

### Skills (invoke with `/skill-name`)

| Skill | Purpose |
|-------|---------|
| `/sync-check` | Session start - verify sync, suggest next task |
| `/plan` | Multi-agent feature planning |
| `/review` | Code review before commit |
| `/task-loop` | Automated task orchestration |
| `/pr-review` | PR review with inline comments |

### Agents (spawn for specialized tasks)

| Need to... | Spawn |
|------------|-------|
| Plan a feature | `planner` |
| Design architecture | `architect` |
| Design UI/UX | `ux-designer` |
| Review security/compliance | `security` |
| Design database schema | `persistence` |
| Write tests | `tester` |
| Review code | `reviewer` |
| Implement OCR/translation | `ml-expert` |
| Set up infrastructure | `infra` |

### Rules (auto-loaded, persist across /clear)

- **no-claude-attribution**: No AI in git history
- **task-execution**: PR-based workflow, parallelization
- **context-management**: Token optimization
- **pre-pr-validation**: Run checks before PR
- **readme-sync**: Keep README in sync with issues

## Directory Structure

```
.claude/
├── agents/       # 9 specialized agents
├── skills/       # 5 reusable workflows
├── rules/        # 5 persistent rules
└── settings.json # Permissions
```
