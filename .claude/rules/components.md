---
globs:
  - "components/**/*.tsx"
  - "app/**/*.tsx"
---

# Component Rules

## Architecture

- Prefer Server Components by default
- Use `"use client"` only when needed (interactivity, hooks)
- Keep Client Components small and focused
- Co-locate component-specific types in same file

## shadcn/ui

- Use existing shadcn/ui components before creating custom ones
- Follow shadcn patterns for variants and composition
- Import from `@/components/ui/`

## Accessibility (WCAG 2.1 AA)

- Every interactive element needs `aria-label` or visible label
- Minimum touch target: 44x44px on mobile
- Support keyboard navigation (focus states, tab order)
- Use semantic HTML (`button` not `div onClick`)

## Swiss Design Principles

- Swiss International Style: clean, grid-based layouts
- Restrained color palette from design tokens
- Clear typography hierarchy
- Generous whitespace

## Mobile-First

- Design for 375px width first
- Use responsive Tailwind classes (`sm:`, `md:`, `lg:`)
- Test on actual mobile viewport
- Consider touch interactions
