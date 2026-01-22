# Design Review - UI Consistency Audit Skill

> **Invoke with:** Request design review or UI audit
> **Purpose:** Audit existing UI for Swiss International Style compliance and consistency

## What This Skill Does

Performs comprehensive design system audit checking:
- Design token usage (no hardcoded values)
- Swiss International Style compliance
- Consistency across components and pages
- Accessibility (WCAG 2.1 AA)
- Responsive design patterns
- Component pattern adherence

## When to Use

Use this skill when:
- Adding new UI components that need to match existing design
- Reviewing existing UI for consistency issues
- Before major UI releases to ensure design quality
- After receiving design feedback to identify issues
- Migrating UI to updated design tokens

## Audit Process

### Phase 1: Token Compliance Audit

**Search for hardcoded values:**

```bash
# Colors
Grep "bg-\[#" app/ components/
Grep "text-\[#" app/ components/
Grep "border-\[#" app/ components/

# Spacing
Grep "-\[.*px\]" app/ components/
Grep "-\[.*rem\]" app/ components/

# Border radius
Grep "rounded-\[" app/ components/
```

**Classification:**
- **Violation**: Hardcoded value that has a token equivalent
- **Exception**: Intentional override with documented reason
- **Missing Token**: Need for new token identified

### Phase 2: Swiss Style Compliance

**Check against principles:**

| Principle | What to Look For | Pass/Fail Criteria |
|-----------|------------------|-------------------|
| Minimal Decoration | Gradients, shadows, borders | No decorative elements |
| High Contrast | Text-background ratio | 4.5:1 minimum |
| Clean Typography | Font variations | Only Inter, standard weights |
| Systematic Spacing | Spacing values | 4px grid baseline |
| Minimal Radius | Border radius | Max 8px (--radius-lg) |

### Phase 3: Component Consistency

**Compare patterns across files:**

```bash
# Find all Card usages
Grep "Card" components/ app/

# Find all Button variants
Grep "Button" components/ app/

# Find all form patterns
Grep "Label" components/ app/
Grep "Input" components/ app/
```

**Check for:**
- Same component styled differently in different places
- Different components used for same purpose
- Missing wrapper components causing inconsistency

### Phase 4: Accessibility Audit

**Check elements:**

```bash
# Icon buttons without labels
Grep 'size="icon"' components/ app/
# Verify aria-label exists

# Images without alt
Grep "<img" components/ app/
Grep "Image" components/ app/
# Verify alt attribute exists

# Form inputs without labels
Grep "<Input" components/ app/
# Verify associated Label exists
```

### Phase 5: Responsive Audit

**Check for mobile-first patterns:**

```bash
# Find non-mobile-first (desktop-first) patterns
Grep "lg:hidden" app/ components/
# Should use "hidden lg:block" instead

# Find missing responsive variants
Grep "className=" app/ components/ | grep -v "md:" | grep -v "lg:"
```

## Output Format

### Summary Report

```markdown
## Design Audit Report

**Scope:** [files/components audited]
**Date:** [date]

### Token Compliance: [PASS/FAIL] ([X] issues)

| File | Line | Issue | Recommended Fix |
|------|------|-------|-----------------|
| ... | ... | ... | ... |

### Swiss Style Compliance: [PASS/FAIL]

- Minimal Decoration: [PASS/FAIL]
- High Contrast: [PASS/FAIL]
- Typography: [PASS/FAIL]
- Spacing: [PASS/FAIL]
- Border Radius: [PASS/FAIL]

### Component Consistency: [PASS/FAIL]

[List of inconsistencies found]

### Accessibility: [PASS/FAIL] ([X] issues)

| Type | File | Line | Issue | Fix |
|------|------|------|-------|-----|
| ... | ... | ... | ... | ... |

### Responsive Design: [PASS/FAIL]

[List of responsive issues]

### Action Items

**Must Fix (P0):**
1. [Critical issues]

**Should Fix (P1):**
1. [Important issues]

**Nice to Have (P2):**
1. [Minor improvements]
```

## Issue Severity Guide

### P0 - Must Fix

- Hardcoded colors that break dark mode
- Touch targets below 44x44px
- Missing accessibility labels
- Contrast ratio below 4.5:1
- Breaking responsive behavior

### P1 - Should Fix

- Hardcoded values with token equivalents
- Inconsistent component usage
- Non-mobile-first responsive patterns
- Missing focus indicators

### P2 - Nice to Have

- Spacing not on 4px grid
- Slightly inconsistent styling
- Documentation gaps
- Minor pattern deviations

## Example Audit

**Request:** "Audit the homepage for design consistency"

**Response:**

```markdown
## Design Audit Report

**Scope:** app/page.tsx, components/layout/header.tsx
**Date:** 2026-01-22

### Token Compliance: PASS (0 issues)

All styling uses design tokens. No hardcoded values found.

### Swiss Style Compliance: PASS

- Minimal Decoration: PASS - No gradients or decorative elements
- High Contrast: PASS - Text meets 4.5:1 ratio
- Typography: PASS - Inter font, standard weights
- Spacing: PASS - Uses Tailwind spacing scale
- Border Radius: PASS - Uses --radius (0.5rem)

### Component Consistency: PASS

All cards use `Card` component with consistent structure:
- CardHeader with CardTitle + CardDescription
- CardContent for body
- Consistent text-muted-foreground for secondary text

### Accessibility: PASS (0 issues)

- All interactive elements have adequate size
- Heading hierarchy is correct (h1 -> h2)
- Links have descriptive text

### Responsive Design: PASS

Mobile-first patterns used throughout:
- `text-3xl md:text-4xl lg:text-5xl` for headings
- `py-8 md:py-16` for section spacing
- `grid md:grid-cols-3` for feature cards

### Action Items

No issues found. Design is consistent with Swiss International Style.
```

## Reference

For detailed design specifications, see:
- `.claude/agents/ux-designer/AGENT.md` - Full design system documentation
- `app/globals.css` - Design tokens
- `components/ui/` - shadcn/ui components
