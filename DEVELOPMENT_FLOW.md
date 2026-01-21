# BriefBot Development Flow

## Overview

This document defines the **Test-Build-Review** development loop for BriefBot. Following this workflow ensures code quality, security, and compliance with Swiss data protection standards.

## Development Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                    DEVELOPMENT LOOP                      │
└─────────────────────────────────────────────────────────┘

   ┌──────────┐
   │  PLAN    │  1. Understand requirements
   │          │  2. Consult Architect agent
   │          │  3. Design approach
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  TEST    │  4. Write failing tests (TDD)
   │          │  5. Consult Tester agent
   │          │  6. Define test cases
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  BUILD   │  7. Implement feature
   │          │  8. Follow agent guidelines
   │          │  9. Make tests pass
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  REVIEW  │  10. Self-review (Reviewer agent)
   │          │  11. Security check (Security agent)
   │          │  12. Run all tests
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  COMMIT  │  13. Commit with clear message
   │          │  14. Push to GitHub
   │          │  15. Monitor CI/CD
   └──────────┘
```

## Phase 1: PLAN

### Objectives
- Understand the feature or fix requirements
- Design the technical approach
- Identify affected components

### Steps

1. **Read Requirement**
   - Understand what needs to be built or fixed
   - Identify user value and success criteria

2. **Consult Architect**
   - Read `.claude/agents/architect.md`
   - Determine if this is a Server Component or Client Component
   - Plan data flow (Server Action vs API route)
   - Consider Next.js 15 patterns

3. **Consult UX Designer** (for UI features)
   - Read `.claude/agents/ux-designer.md`
   - Ensure design follows Swiss International Style
   - Verify accessibility requirements
   - Check mobile-first approach

4. **Consult Persistence** (for data changes)
   - Read `.claude/agents/persistence.md`
   - Plan database schema changes
   - Design Prisma queries
   - Consider MinIO storage if needed

5. **Document Decision**
   - Update relevant ADR in `docs/ADR/` if architectural
   - Add task to `docs/BACKLOG.json`

### Outputs
- [ ] Clear understanding of requirements
- [ ] Technical approach documented
- [ ] Relevant agents consulted
- [ ] ADR created (if needed)

---

## Phase 2: TEST

### Objectives
- Write tests BEFORE implementation (TDD)
- Define expected behavior
- Establish quality gates

### Steps

1. **Consult Tester**
   - Read `.claude/agents/tester.md`
   - Determine test type (unit, component, E2E)
   - Identify test cases

2. **Write Failing Tests**
   - **Unit tests**: Business logic, utilities
   - **Component tests**: UI components, user interactions
   - **Integration tests**: Server Actions, database operations
   - **E2E tests**: Critical user flows

3. **Test Checklist**
   - [ ] Happy path tested
   - [ ] Error cases tested
   - [ ] Edge cases tested
   - [ ] Loading states tested
   - [ ] Empty states tested
   - [ ] Accessibility tested

4. **Run Tests**
   ```bash
   npm run test:unit
   # Should FAIL at this point (TDD)
   ```

### Outputs
- [ ] Tests written and failing
- [ ] Test coverage plan defined
- [ ] Edge cases identified

---

## Phase 3: BUILD

### Objectives
- Implement feature following agent guidelines
- Make tests pass
- Maintain code quality

### Steps

1. **Set Up Environment**
   ```bash
   # Ensure Docker services running
   npm run docker:up

   # Ensure database is up to date
   npm run db:migrate

   # Start dev server
   npm run dev
   ```

2. **Implement Feature**
   - Follow relevant agent guidelines
   - Use TypeScript strictly (no `any`)
   - Implement Server Components by default
   - Use Server Actions for mutations

3. **Agent-Specific Guidelines**

   **For Server Components:**
   - Fetch data directly from Prisma
   - No `'use client'` directive
   - Use `async` functions
   - Handle errors with error boundaries

   **For Client Components:**
   - Add `'use client'` directive
   - Minimal state, maximal props
   - Use Server Actions for mutations
   - Handle loading states

   **For Server Actions:**
   - Validate input with Zod
   - Check authentication with `requireAuth()`
   - Check authorization (user owns resource)
   - Return typed responses

   **For Database Operations:**
   - Use Prisma client
   - Implement proper indexes
   - Use transactions for multi-step operations
   - Handle errors gracefully

   **For AI/OCR Features:**
   - Consult ML Expert agent
   - Use Vercel AI SDK
   - Implement proper error handling
   - Monitor costs and performance

4. **Code Quality Checks**
   ```bash
   # Type check
   npm run type-check

   # Lint
   npm run lint

   # Format
   npx prettier --write .
   ```

5. **Make Tests Pass**
   ```bash
   npm run test:unit
   # Should PASS now
   ```

### Outputs
- [ ] Feature implemented
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Code formatted

---

## Phase 4: REVIEW

### Objectives
- Ensure code quality
- Verify security compliance
- Confirm design consistency

### Steps

1. **Self-Review (Reviewer Agent)**
   - Read `.claude/agents/reviewer.md`
   - Check code review checklist:
     - [ ] Architecture & design
     - [ ] TypeScript quality
     - [ ] Code quality
     - [ ] Performance
     - [ ] Testing
     - [ ] Accessibility
     - [ ] UX/Design consistency

2. **Security Review (Security Agent)**
   - Read `.claude/agents/security.md`
   - Verify security checklist:
     - [ ] Input validation (Zod schemas)
     - [ ] Authentication enforced
     - [ ] Authorization checked
     - [ ] No SQL injection
     - [ ] No XSS vulnerabilities
     - [ ] No secrets in code
     - [ ] Swiss nFADP compliance

3. **Run Full Test Suite**
   ```bash
   # Unit tests
   npm run test:unit

   # E2E tests
   npm run test:e2e

   # Coverage report
   npm run test:coverage
   ```

4. **Accessibility Check**
   ```bash
   # Run accessibility tests
   npm run test:a11y
   ```

5. **Manual Testing**
   - Test in browser (Chrome, Safari)
   - Test on mobile viewport
   - Test keyboard navigation
   - Test screen reader (VoiceOver/NVDA)
   - Test error states
   - Test loading states

### Outputs
- [ ] All automated tests passing
- [ ] Security review complete
- [ ] Accessibility verified
- [ ] Manual testing complete
- [ ] Code review checklist satisfied

---

## Phase 5: COMMIT

### Objectives
- Create meaningful git history
- Trigger CI/CD pipeline
- Monitor deployment

### Steps

1. **Stage Changes**
   ```bash
   git add .
   ```

2. **Review Changes**
   ```bash
   git status
   git diff --staged
   ```

3. **Commit with Convention**
   ```bash
   git commit -m "feat(upload): add multi-file upload support

   - Allow selecting multiple files at once
   - Display progress for each file
   - Add batch upload to MinIO
   - Update UI to show multiple uploads

   Closes #123

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

   **Commit Types:**
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation
   - `style`: Formatting, no code change
   - `refactor`: Code restructuring
   - `test`: Adding tests
   - `chore`: Maintenance

4. **Push to GitHub**
   ```bash
   git push origin master
   ```

5. **Monitor CI/CD**
   - Check GitHub Actions status
   - Verify all checks pass
   - Review deployment logs

### Outputs
- [ ] Changes committed
- [ ] Pushed to GitHub
- [ ] CI/CD passing
- [ ] No deployment errors

---

## Special Workflows

### Adding a New Database Model

1. **Plan**
   - Consult Persistence agent
   - Design schema
   - Plan indexes and relations

2. **Test**
   - Write tests for database operations
   - Test migrations

3. **Build**
   ```bash
   # Update schema.prisma
   # Generate migration
   npm run db:migrate -- --name add_new_model

   # Generate Prisma client
   npm run db:generate
   ```

4. **Review**
   - Verify migration SQL
   - Test rollback scenario
   - Check indexes created

5. **Commit**
   ```bash
   git add prisma/
   git commit -m "feat(db): add NewModel schema"
   ```

### Adding a New shadcn/ui Component

1. **Plan**
   - Consult UX Designer agent
   - Verify component fits design system

2. **Test**
   - Write component tests

3. **Build**
   ```bash
   # Add component
   npx shadcn-ui@latest add button

   # Customize in components/ui/
   ```

4. **Review**
   - Verify accessibility
   - Check responsive design
   - Test keyboard navigation

5. **Commit**
   ```bash
   git add components/ui/
   git commit -m "feat(ui): add Button component from shadcn"
   ```

### Fixing a Security Vulnerability

1. **Plan**
   - Consult Security agent
   - Assess severity and impact

2. **Test**
   - Write test that exposes vulnerability
   - Write test for fix

3. **Build**
   - Implement fix
   - Add security measures

4. **Review**
   - Security agent full review
   - Verify no other vulnerabilities
   - Test extensively

5. **Commit**
   ```bash
   git commit -m "fix(security): prevent SQL injection in document query

   - Add Zod validation for documentId
   - Use parameterized queries
   - Add authorization check

   SECURITY: Critical fix for SQL injection vulnerability"
   ```

---

## Quality Gates

### Before Committing
- [ ] All tests pass
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Prettier formatted
- [ ] No `console.log` (except `console.error`, `console.warn`)
- [ ] No commented code
- [ ] No TODOs (move to BACKLOG.json)

### Before Pushing
- [ ] Commits are atomic and meaningful
- [ ] Commit messages follow convention
- [ ] No secrets in code
- [ ] No large files (use Git LFS if needed)

### Before Deploying
- [ ] All CI checks pass
- [ ] E2E tests pass
- [ ] Manual testing complete
- [ ] Database migrations tested
- [ ] Rollback plan documented

---

## Emergency Procedures

### Hotfix Process
1. Create hotfix branch from master
2. Minimal fix only (no refactoring)
3. Write test that reproduces bug
4. Fix bug
5. Deploy immediately
6. Post-mortem in `docs/INCIDENTS/`

### Rollback Process
1. Identify last good commit
2. Revert on master
3. Deploy immediately
4. Investigate root cause
5. Plan proper fix

---

## Tools and Commands

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run db:studio        # Prisma Studio (localhost:5555)
npm run docker:logs      # View Docker logs
```

### Testing
```bash
npm run test             # All tests
npm run test:unit        # Unit tests only
npm run test:e2e         # E2E tests only
npm run test:ui          # Playwright UI mode
npm run test:coverage    # Coverage report
npm run test:a11y        # Accessibility tests
```

### Database
```bash
npm run db:migrate       # Create migration
npm run db:push          # Push schema (no migration)
npm run db:seed          # Seed data
npm run db:reset         # Reset and reseed
npm run db:studio        # Open Prisma Studio
```

### Code Quality
```bash
npm run lint             # ESLint
npm run type-check       # TypeScript
npx prettier --write .   # Format all files
```

### Docker
```bash
npm run docker:up        # Start services
npm run docker:down      # Stop services
npm run docker:reset     # Reset volumes
npm run docker:logs      # View logs
```

---

## Metrics and Monitoring

### Code Quality Metrics
- **Test Coverage**: ≥ 80%
- **TypeScript Strict**: 100%
- **ESLint Errors**: 0
- **Bundle Size**: < 200KB initial JS

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: ≥ 90

### Security Metrics
- **npm audit**: 0 high/critical vulnerabilities
- **Dependency updates**: Weekly
- **Security reviews**: Every PR

---

## References

- **Tech Docs**: See CLAUDE.md
- **Agent Personas**: `.claude/agents/`
- **Backlog**: `docs/BACKLOG.json`
- **ADRs**: `docs/ADR/`
- **Compliance**: `docs/COMPLIANCE/`

---

*Follow this workflow religiously. It's designed for solo development with AI assistance, ensuring quality and compliance at every step.*
