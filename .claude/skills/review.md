# Review - Code Review Skill

> **Invoke with:** Request code review after changes
> **Purpose:** Comprehensive code review following BriefBot quality standards

## What This Skill Does

Performs thorough code review checking:
- Code quality and TypeScript usage
- Architecture and design patterns
- Security and privacy compliance
- Accessibility and UX consistency
- Test coverage
- Performance considerations

## When to Use

Use this skill when:
- You've made code changes and want review before commit
- You want to check if code follows project standards
- You need security or privacy validation
- You want to ensure test coverage is adequate

## Review Process

### 1. Code Quality Check

**TypeScript:**
- ✅ No `any` types (use `unknown` if needed)
- ✅ Strict null checks respected
- ✅ Proper type inference
- ✅ Types imported from correct locations

**Code Structure:**
- ✅ Functions < 50 lines
- ✅ Clear, descriptive naming
- ✅ No code duplication (DRY)
- ✅ Error handling implemented
- ✅ Edge cases considered

### 2. Architecture Review

**Next.js 15 Patterns:**
- ✅ Server Components by default
- ✅ `'use client'` only when necessary
- ✅ Server Actions for mutations
- ✅ Proper data fetching patterns
- ✅ No sensitive data in client bundles

**File Organization:**
- ✅ Components in correct directories
- ✅ Server Actions in `/lib/actions/`
- ✅ Database queries in Server Components/Actions
- ✅ Proper separation of concerns

### 3. Security & Privacy Review

**Swiss nFADP Compliance:**
- ✅ PII properly protected
- ✅ Data minimization followed
- ✅ User consent where required
- ✅ Data retention limits respected

**Security:**
- ✅ Input validation (Zod schemas)
- ✅ Authentication enforced
- ✅ Authorization checked
- ✅ No SQL injection risks
- ✅ No XSS vulnerabilities
- ✅ Secrets not in code

### 4. UX & Accessibility Review

**Swiss International Style:**
- ✅ Minimal, clean design
- ✅ High contrast
- ✅ Consistent spacing (8px grid)
- ✅ shadcn/ui components used

**Accessibility (WCAG 2.1 AA):**
- ✅ Touch targets ≥ 44x44px
- ✅ Color contrast sufficient
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ Semantic HTML used
- ✅ ARIA labels where needed

### 5. Testing Review

**Coverage:**
- ✅ Unit tests for business logic
- ✅ Component tests for UI
- ✅ E2E tests for critical flows
- ✅ Visual regression tests for UI changes

**Quality:**
- ✅ Tests are meaningful
- ✅ Edge cases tested
- ✅ Error scenarios covered

### 6. Performance Review

**Optimization:**
- ✅ Images optimized (next/image)
- ✅ Dynamic imports for heavy components
- ✅ Database queries efficient
- ✅ No N+1 query problems
- ✅ Proper caching strategy

## Review Checklist

I will check your code against this comprehensive list:

### Must Fix (P0)
- ❌ Security vulnerabilities
- ❌ Privacy violations (PII exposure)
- ❌ Breaking changes without migration
- ❌ TypeScript errors
- ❌ Authentication/authorization bypasses

### Should Fix (P1)
- ⚠️ TypeScript `any` usage
- ⚠️ Missing error handling
- ⚠️ Accessibility violations
- ⚠️ Performance issues
- ⚠️ Code duplication

### Nice to Have (P2)
- 💡 Refactoring opportunities
- 💡 Documentation gaps
- 💡 Test coverage improvements
- 💡 Style improvements

## Review Output

I will provide:

**Issues Found:**
```markdown
### P0: Security - Input Validation Missing
**File:** app/actions/upload.ts:23
**Issue:** No Zod validation for file upload
**Fix:** Add schema validation before processing
**Example:**
  const schema = z.object({
    file: z.instanceof(File),
  })
```

**Suggestions:**
```markdown
### Refactoring: Extract Duplicate Logic
**Files:** components/A.tsx, components/B.tsx
**Suggestion:** Create shared hook `useDocumentUpload`
**Benefit:** DRY, easier to maintain
```

**Summary:**
- ✅ Code quality: Good
- ⚠️ Security: 1 issue (P0)
- ✅ Accessibility: Compliant
- ✅ Testing: 85% coverage

**Action Items:**
1. Fix P0 security issue (input validation)
2. Consider refactoring suggestion
3. Ready to commit after fixes

## Example Review

**You:** "Can you review my document upload implementation?"

**Me:**
```
I'll review your code...

[Reads changed files]

**Review Complete**

### Issues Found:

❌ **P0: Missing Authentication**
- File: app/actions/upload-document.ts:15
- Issue: No authentication check before upload
- Fix: Add `await requireAuth()` at function start

⚠️ **P1: Type Safety**
- File: components/UploadButton.tsx:42
- Issue: Using `any` for file parameter
- Fix: Change to `file: File`

💡 **P2: Accessibility**
- File: components/UploadZone.tsx:67
- Suggestion: Add aria-label to upload button
- Current: <button>Upload</button>
- Better: <button aria-label="Upload document">Upload</button>

### What's Good:

✅ Server Component usage is correct
✅ Error handling is comprehensive
✅ Loading states implemented
✅ Mobile responsive
✅ Tests included

### Action Items:

1. **Must fix:** Add authentication check (P0)
2. **Should fix:** Replace `any` with `File` type (P1)
3. **Nice to have:** Add aria-label (P2)

After fixing P0 and P1, you'll be ready to commit.
```

## Reference Guides

For detailed standards, see:
- `docs/guides/reviewer-guide.md` - Complete review standards
- `docs/guides/architecture-guide.md` - Next.js 15 patterns
- `docs/guides/security-guide.md` - Security requirements
- `docs/guides/ux-design-guide.md` - Design standards
