# Feature: [Feature Name]

> **Status**: Planning | In Development | Testing | Complete
> **Priority**: P0 | P1 | P2 | P3
> **Created**: [Date]
> **Last Updated**: [Date]

## Problem Statement

[What user problem does this feature solve? Why is it important?]

## User Stories

1. As a [user type], I want to [action] so that [benefit]
2. As a [user type], I want to [action] so that [benefit]
3. As a [user type], I want to [action] so that [benefit]

## Proposed Solutions

### Option A: [Name - e.g., "Minimal MVP"]

**What it does:**
- [Feature 1]
- [Feature 2]

**Pros:**
- ✅ [Advantage]
- ✅ [Advantage]

**Cons:**
- ❌ [Disadvantage]
- ❌ [Disadvantage]

**Estimated Effort:** [X hours/days]

---

### Option B: [Name - e.g., "Balanced Approach"] ⭐ Recommended

**What it does:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Pros:**
- ✅ [Advantage]
- ✅ [Advantage]

**Cons:**
- ⚠️ [Tradeoff]

**Estimated Effort:** [X hours/days]

---

### Option C: [Name - e.g., "Full-Featured"]

**What it does:**
- [Feature 1]
- [Feature 2]
- [Feature 3]
- [Feature 4]

**Pros:**
- ✅ [Advantage]
- ✅ [Advantage]

**Cons:**
- ❌ [Disadvantage]
- ❌ [Disadvantage]

**Estimated Effort:** [X hours/days]

---

## Selected Approach

**Decision:** Option [X]

**Rationale:**
[Why was this option chosen? What factors influenced the decision?]

## User Flow

1. User [action]
2. System [response]
3. User [action]
4. System [response]
5. User sees [result]

## UI/UX Requirements

### Design Principles
- Mobile-first responsive design
- Swiss International Style (minimal, clean, high contrast)
- Accessibility: WCAG 2.1 AA compliant
- Touch targets: Minimum 44x44px

### Visual States

**Initial State:**
- [Description of how the UI looks on first load]

**Loading State:**
- [What users see while content/data is loading]
- Use skeleton loaders or progress indicators

**Success State:**
- [What users see after successful action]

**Error State:**
- [What users see when something goes wrong]
- Clear error messages in user's language
- Helpful suggestions for resolution

**Empty State:**
- [What users see when there's no data]
- Helpful message explaining why it's empty
- Call-to-action to get started

### Responsive Breakpoints
- Mobile (320px - 639px): [Specific considerations]
- Tablet (640px - 1023px): [Specific considerations]
- Desktop (1024px+): [Specific considerations]

## Acceptance Criteria

### Functional Requirements
- [ ] User can [perform action]
- [ ] System validates [input/data]
- [ ] Error messages are clear and helpful
- [ ] Success feedback is immediate
- [ ] Data persists correctly in database
- [ ] Files upload to MinIO successfully (if applicable)

### Non-Functional Requirements
- [ ] Page loads in < 2 seconds
- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] Works on desktop (Chrome, Firefox, Safari)
- [ ] Accessibility: Keyboard navigation works
- [ ] Accessibility: Screen reader friendly
- [ ] Privacy: No PII exposed in client
- [ ] Security: Input validation on server
- [ ] Swiss nFADP compliant

### Edge Cases Handled
- [ ] [Edge case 1] → [Expected behavior]
- [ ] [Edge case 2] → [Expected behavior]
- [ ] [Edge case 3] → [Expected behavior]

## Screenshot Test Scenarios

### Scenario 1: [Name - e.g., "Initial State"]
**Steps:**
1. Navigate to [URL/page]
2. [Any setup needed]

**Capture:**
- Filename: `[feature]-initial-state.png`
- What to verify: [Elements that should be visible]

---

### Scenario 2: [Name - e.g., "User Interaction"]
**Steps:**
1. [Action 1]
2. [Action 2]

**Capture:**
- Filename: `[feature]-interaction.png`
- What to verify: [Changes that should occur]

---

### Scenario 3: [Name - e.g., "Success State"]
**Steps:**
1. [Complete the flow successfully]

**Capture:**
- Filename: `[feature]-success.png`
- What to verify: [Success indicators]

---

### Scenario 4: [Name - e.g., "Error State"]
**Steps:**
1. [Trigger an error condition]

**Capture:**
- Filename: `[feature]-error.png`
- What to verify: [Error message, recovery options]

---

### Scenario 5: [Name - e.g., "Mobile View"]
**Steps:**
1. Resize to 375px width (iPhone SE)
2. [Perform main action]

**Capture:**
- Filename: `[feature]-mobile.png`
- What to verify: [Mobile-specific layout]

## Technical Requirements

### Database Changes

**New Tables:**
```prisma
// None
```

**Modified Tables:**
```prisma
// None
```

**Migrations:**
- [ ] Migration created: `[migration-name]`
- [ ] Migration tested locally
- [ ] Migration rollback tested

### Server Actions

**New Server Actions:**
- `[actionName]` in `/lib/actions/[file].ts`
  - Inputs: [type]
  - Outputs: [type]
  - Validation: [Zod schema]
  - Authentication: Required | Optional
  - Authorization: [Rules]

### API Routes

**New API Routes:**
- `[method] /api/[endpoint]`
  - Purpose: [Description]
  - Authentication: Required | Optional
  - Rate limiting: [X requests per minute]

### Components

**New Components:**
- `[ComponentName]` - Client | Server Component
  - Location: `/components/[path]/[name].tsx`
  - Props: [interface]
  - State: [if Client Component]

**Modified Components:**
- `[ComponentName]` - [What changed]

### External Services

**APIs Used:**
- [ ] OpenAI GPT-4 Vision (for OCR)
- [ ] Anthropic Claude (for translation)
- [ ] Supabase (for auth)
- [ ] MinIO (for storage)

**Configuration Needed:**
- [ ] Environment variables set
- [ ] API keys configured
- [ ] Rate limits understood

## Dependencies

### Agent Personas to Consult
- [ ] Planner (this spec)
- [ ] Architect (technical design)
- [ ] UX Designer (visual design)
- [ ] Security (privacy/compliance)
- [ ] Persistence (database)
- [ ] Tester (test strategy)
- [ ] ML Expert (if AI features)

### External Libraries
- [ ] [library-name] v[x.x.x] - [Purpose]

### Blocked By
- [ ] [Task or dependency that must be completed first]

## Testing Strategy

### Unit Tests
- [ ] [Component/function to test]
- [ ] [Component/function to test]

### Integration Tests
- [ ] [Server Action to test]
- [ ] [API route to test]

### E2E Tests
- [ ] [User flow to test]
- [ ] [User flow to test]

### Visual Regression Tests
- [ ] Desktop view
- [ ] Mobile view
- [ ] Tablet view
- [ ] All visual states (loading, error, success, empty)

### Manual Testing Checklist
- [ ] Test on iOS Safari (iPhone)
- [ ] Test on Android Chrome
- [ ] Test on Desktop Chrome
- [ ] Test on Desktop Firefox
- [ ] Test on Desktop Safari
- [ ] Test keyboard navigation
- [ ] Test screen reader (VoiceOver/NVDA)
- [ ] Test with slow network (throttle to 3G)
- [ ] Test error scenarios
- [ ] Test edge cases

## Privacy & Security Review

### PII Handling
- What PII does this feature collect? [List]
- How is it stored? [Encrypted/plain, location]
- How long is it retained? [Duration]
- Can users delete it? [Yes/No, how]

### Swiss nFADP Compliance
- [ ] Purpose limitation: Feature has clear, limited purpose
- [ ] Data minimization: Collect only necessary data
- [ ] User consent: Explicit consent obtained if needed
- [ ] Transparency: Privacy policy updated
- [ ] User rights: Deletion/export implemented

### Security Checklist
- [ ] Input validation (Zod schemas)
- [ ] Authentication enforced
- [ ] Authorization checked (user owns resource)
- [ ] No SQL injection risk
- [ ] No XSS vulnerabilities
- [ ] Secrets not in code
- [ ] HTTPS only in production
- [ ] Rate limiting implemented
- [ ] CSRF protection (Next.js handles this)

## Risks & Mitigations

### Risk 1: [Description]
**Probability:** Low | Medium | High
**Impact:** Low | Medium | High
**Mitigation:** [How to prevent or handle]

### Risk 2: [Description]
**Probability:** Low | Medium | High
**Impact:** Low | Medium | High
**Mitigation:** [How to prevent or handle]

## Timeline

- Planning: [Estimated time]
- Design: [Estimated time]
- Implementation: [Estimated time]
- Testing: [Estimated time]
- Review: [Estimated time]

**Total Estimated Time:** [X hours/days]

## Success Metrics

How will we know this feature is successful?

- [ ] [Metric 1] - Target: [value]
- [ ] [Metric 2] - Target: [value]
- [ ] User feedback: [What are we looking for]

## Open Questions

- [ ] [Question that needs to be answered]
- [ ] [Question that needs to be answered]

## Notes & Discussion

[Any additional context, links to references, design inspiration, etc.]

---

## Changelog

### [Date] - Planning Session
- Initial planning session with Planner agent
- Proposed 3 solution options
- Selected Option [X]

### [Date] - Technical Review
- Reviewed with Architect agent
- Updated database schema
- Identified dependencies

### [Date] - Implementation Started
- [Notes about implementation]

### [Date] - Testing & Screenshots
- Screenshots captured
- Issues identified: [list]
- Fixes applied

### [Date] - Complete
- All acceptance criteria met
- Committed and pushed to GitHub
