# README-GitHub Issues Sync Rule

## Requirement

The README.md Roadmap section MUST stay in sync with GitHub Issues.

## When to Update README

1. **After closing an issue**: Change `- [ ]` to `- [x]` for the completed item
2. **After creating a new issue**: Add it to the appropriate priority section
3. **After changing issue priority**: Move the item to the correct section
4. **After deleting an issue**: Remove the item from README

## Update Process

When completing work on an issue:

```bash
# 1. Close the issue
gh issue close <number>

# 2. Update README.md - change checkbox from [ ] to [x]
# Example: - [ ] [#1 Feature] becomes - [x] [#1 Feature]

# 3. Include README update in the PR or as a follow-up commit
```

## Roadmap Section Format

```markdown
### MVP (P0-critical)

- [ ] [#1 Feature Name](https://github.com/novacekm/BriefBot/issues/1)
- [x] [#2 Completed Feature](https://github.com/novacekm/BriefBot/issues/2)
```

## Automated Check

Before merging any PR that closes an issue, verify:
- The README.md checkbox is updated to `[x]`
- The issue link is correct
- The item is in the correct priority section

## Adding New Issues

When creating a new GitHub issue for a planned feature:

1. Create the issue: `gh issue create --title "[Feature]: Name" --label "feature,P0-critical"`
2. Add to README Roadmap in the matching priority section
3. Include the issue number and link
