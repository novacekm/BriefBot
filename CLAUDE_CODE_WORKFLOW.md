# Claude Code Workflow for BriefBot

## Overview

This document defines how to work effectively with Claude Code (AI-assisted development) on BriefBot, including planning, implementation, screenshot-based testing, and iterative refinement.

## Core Principles

1. **Plan Before Code**: Always start with the Planner agent
2. **Visual Feedback**: Use screenshots to communicate UI issues
3. **Iterative Development**: Build → Test → Screenshot → Refine
4. **Agent-Guided**: Consult specialized agents for each domain

## Workflow Phases

```
┌─────────────────────────────────────────────────────────┐
│            CLAUDE CODE DEVELOPMENT WORKFLOW              │
└─────────────────────────────────────────────────────────┘

   ┌──────────────┐
   │  DISCOVERY   │  User describes need
   │              │  Ask clarifying questions
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │   PLANNING   │  Planner agent brainstorms
   │              │  Propose 2-3 solutions
   │              │  User selects approach
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │SPECIFICATION │  Document feature spec
   │              │  Define acceptance criteria
   │              │  Plan screenshot scenarios
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │    BUILD     │  TDD: Write tests first
   │              │  Implement feature
   │              │  Make tests pass
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  SCREENSHOT  │  User captures screens
   │   TESTING    │  Upload to Claude Code
   │              │  AI analyzes issues
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │   REFINE     │  Fix visual issues
   │              │  Adjust behavior
   │              │  Re-test
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │    COMMIT    │  Git commit + push
   │              │  Update backlog
   └──────────────┘
```

## Phase 1: Discovery

### User Provides Initial Idea

**Example:**
> "I want users to be able to upload documents and see OCR results"

### Claude (Planner Agent) Responds

**Asks Clarifying Questions:**
1. "Should users upload one document at a time, or multiple?"
2. "Should OCR happen immediately, or in the background?"
3. "What should users see while OCR is processing?"
4. "Should we support drag-and-drop, or just file picker?"
5. "What file types: PDF, images, or both?"

### User Answers

**Example:**
> "Users should be able to upload one or multiple files. OCR should happen in the background with a progress indicator. Support both PDF and images (JPEG, PNG). Drag-and-drop would be nice but not essential for MVP."

## Phase 2: Planning

### Planner Proposes Solutions

**Option A: Minimal MVP**
- Single file upload via button
- Synchronous OCR processing
- Show loading spinner
- Display results on same page

**Pros**: Fast to build, simple
**Cons**: Blocks UI during OCR, no multi-file support

---

**Option B: Enhanced Experience (Recommended)**
- Multi-file upload with drag-and-drop
- Background OCR processing
- Progress indicator per file
- Redirect to document list after upload

**Pros**: Better UX, scalable, non-blocking
**Cons**: More complex, needs job queue

---

**Option C: Full-Featured**
- Multi-file upload with drag-and-drop
- Real-time progress with WebSockets
- Thumbnail previews
- Cancel/retry functionality

**Pros**: Best UX, handles all edge cases
**Cons**: High complexity, longer development

### User Selects

**Example:**
> "Let's go with Option B. We can add WebSockets later if needed."

### Planner Creates Specification

Creates `/docs/specs/document-upload.md` with:
- User stories
- Acceptance criteria
- UI/UX requirements
- Screenshot test scenarios
- Technical requirements
- Dependencies

## Phase 3: Specification

### Feature Specification Document

Location: `/docs/specs/[feature-name].md`

**Contains:**

```markdown
# Feature: Document Upload

## User Story
As a Swiss resident, I want to upload official mail documents (PDF/images) so that I can extract text via OCR and understand the content.

## User Flow
1. User navigates to /upload
2. User clicks upload button or drags files
3. System validates files (type, size)
4. System shows upload progress
5. System queues files for OCR processing
6. User redirected to /documents
7. User sees processing status
8. When complete, user sees OCR results

## Screenshot Test Scenarios

### Scenario 1: Initial State
- Navigate to /upload
- Capture: Empty upload area
- Verify: Upload button visible, drag-drop zone shown

### Scenario 2: File Selected
- Select a PDF file
- Capture: File selected state
- Verify: File name shown, file size shown, upload button enabled

### Scenario 3: Upload in Progress
- Click upload button
- Capture: Upload progress
- Verify: Progress bar visible, percentage shown

### Scenario 4: Upload Complete
- Wait for redirect
- Capture: Document list page
- Verify: New document appears, status = "Processing"

### Scenario 5: Error State
- Try to upload .exe file
- Capture: Error message
- Verify: Clear error message, upload not allowed

## Acceptance Criteria
- [ ] User can select PDF or image files
- [ ] File validation works (type, size < 10MB)
- [ ] Progress indicator shows during upload
- [ ] Document appears in list with "Processing" status
- [ ] Error messages are clear and helpful
- [ ] Works on mobile (iOS Safari, Android Chrome)
```

## Phase 4: Build (TDD)

### Step 1: Write Tests First

**Following Tester Agent Guidelines:**

```typescript
// tests/e2e/document-upload.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Document Upload', () => {
  test('should show empty upload state', async ({ page }) => {
    await page.goto('/upload')

    // Capture screenshot for visual regression
    await expect(page).toHaveScreenshot('upload-empty-state.png')

    await expect(page.getByRole('button', { name: /upload/i })).toBeVisible()
  })

  test('should upload PDF successfully', async ({ page }) => {
    await page.goto('/upload')

    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('tests/fixtures/sample.pdf')

    // Capture: File selected
    await expect(page).toHaveScreenshot('upload-file-selected.png')

    await page.getByRole('button', { name: /upload/i }).click()

    // Capture: Upload in progress
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible()
    await expect(page).toHaveScreenshot('upload-in-progress.png')

    // Wait for redirect
    await page.waitForURL('/documents')

    // Capture: Document list
    await expect(page).toHaveScreenshot('documents-with-new-upload.png')
  })
})
```

### Step 2: Implement Feature

**Following Architect & UX Designer Guidelines:**
- Server Components for data fetching
- Client Components for interactivity
- Server Actions for mutations
- shadcn/ui components for UI

### Step 3: Make Tests Pass

Run tests:
```bash
npm run test:e2e
```

Fix issues until all tests pass.

## Phase 5: Screenshot Testing

### User Captures Screenshots

**Process:**

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Navigate to the feature**
   - Open http://localhost:3000/upload
   - Interact with the feature

3. **Capture screenshots at key states**
   - Initial load
   - After interaction
   - Success state
   - Error state
   - Mobile view (resize browser or use DevTools)

4. **Save screenshots with descriptive names**
   - `upload-initial-state.png`
   - `upload-file-selected.png`
   - `upload-error-invalid-file.png`
   - `upload-mobile-view.png`

### User Provides Screenshots to Claude

**In Claude Code Chat:**

> "I've tested the upload feature. Here are screenshots:"
> [Drag and drop screenshot files into chat]
>
> "Issues I noticed:
> 1. The upload button is too small on mobile
> 2. The error message is cut off
> 3. The spacing looks weird between elements"

### Claude Analyzes Screenshots

**Response:**

> "I can see the issues in your screenshots:
>
> **Screenshot 1 (Mobile view):**
> - Upload button is 32px × 32px, should be at least 44px × 44px for touch
> - Fixed in: `components/upload-button.tsx` line 15
>
> **Screenshot 2 (Error message):**
> - Error text is using `truncate` class which cuts off text
> - Should use `whitespace-normal` instead
> - Fixed in: `components/upload-error.tsx` line 23
>
> **Screenshot 3 (Spacing):**
> - Gap between upload zone and button is `gap-2` (8px)
> - Per UX Designer guidelines, should be `gap-6` (24px) for better hierarchy
> - Fixed in: `app/(main)/upload/page.tsx` line 45
>
> Let me fix these issues..."

### Claude Fixes Issues

Makes targeted fixes based on screenshot analysis.

### User Re-Tests

1. Refresh the page
2. Capture new screenshots
3. Verify fixes
4. Provide feedback if still issues

## Phase 6: Iterative Refinement

### Refinement Loop

```
User Screenshots → Claude Analyzes → Claude Fixes → User Tests → Repeat
```

**Continue until:**
- Visual design matches expectations
- Functionality works correctly
- No UI bugs
- Accessibility is good
- Mobile responsive

### Visual Regression Tests

**After refinement, capture baseline screenshots:**

```typescript
// tests/visual/upload.spec.ts
import { test, expect } from '@playwright/test'

test('upload page visual regression', async ({ page }) => {
  await page.goto('/upload')

  // Baseline screenshot
  await expect(page).toHaveScreenshot('upload-page-baseline.png', {
    fullPage: true,
    maxDiffPixels: 100,
  })
})
```

**Future changes:**
- If UI changes intentionally, update baseline
- If UI changes accidentally, test fails → catch regressions

## Phase 7: Commit

### Before Committing

**Checklist:**
- [ ] All tests pass (`npm run test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Visual tests pass (screenshots match)
- [ ] Manual testing complete
- [ ] Screenshots captured for documentation

### Commit with Screenshots

**Process:**

1. **Save screenshots to docs**
   ```bash
   mkdir -p docs/screenshots/upload-feature
   # Copy screenshots there
   ```

2. **Reference in commit**
   ```bash
   git add .
   git commit -m "feat(upload): implement document upload with drag-and-drop

   Features:
   - Multi-file upload support
   - Drag-and-drop interface
   - Upload progress indicators
   - File validation (type, size)
   - Mobile-responsive design

   Testing:
   - E2E tests with Playwright
   - Visual regression tests
   - Screenshot testing completed

   Screenshots: docs/screenshots/upload-feature/

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
   ```

3. **Update backlog**
   - Mark task as completed in `docs/BACKLOG.json`

## Screenshot Best Practices

### When to Capture Screenshots

**Always capture:**
1. **Initial state** - First load of page/feature
2. **Interaction states** - Buttons hover, focus states
3. **Success states** - After successful action
4. **Error states** - All error scenarios
5. **Loading states** - Progress indicators, spinners
6. **Empty states** - No data scenarios
7. **Mobile views** - Responsive breakpoints (320px, 375px, 768px)
8. **Accessibility** - Keyboard focus indicators

### How to Capture Good Screenshots

**Tools:**
- macOS: `Cmd + Shift + 4` for partial screenshot
- Browser DevTools: Device toolbar for mobile views
- Full-page screenshots: Browser extensions

**Tips:**
1. Use consistent viewport sizes
2. Capture entire component/feature, not just part
3. Include context (navigation, headers)
4. Show cursor on interactive elements (hover states)
5. Use descriptive filenames
6. Annotate issues with arrows/text if needed

### Organizing Screenshots

```
docs/screenshots/
├── [feature-name]/
│   ├── 01-initial-state.png
│   ├── 02-user-interaction.png
│   ├── 03-success-state.png
│   ├── 04-error-state.png
│   ├── 05-mobile-view.png
│   └── README.md (description of each)
```

## Agent Consultation Flow

### Which Agent When?

```
Feature Idea
    ↓
Planner Agent (brainstorm, clarify, propose)
    ↓
Architect Agent (technical design)
    ↓
UX Designer Agent (visual design, accessibility)
    ↓
Security Agent (privacy, Swiss nFADP compliance)
    ↓
Persistence Agent (database, storage)
    ↓
Tester Agent (test strategy)
    ↓
BUILD (Claude implements)
    ↓
Reviewer Agent (code review)
    ↓
User Tests (screenshots)
    ↓
Planner Agent (analyze feedback, refine)
    ↓
COMMIT
```

### Example Consultation

**User:**
> "I want to add document translation"

**Claude:**
> "Let me consult the Planner agent for feature brainstorming..."
>
> [Reads `.claude/agents/planner.md`]
>
> **Planner Agent Response:**
> "Let me ask some clarifying questions:
> 1. Should translation happen automatically after OCR, or on-demand?
> 2. Which languages should we support? (All Swiss languages + English?)
> 3. Do we cache translations or regenerate each time?
> 4. Can users see original and translation side-by-side?
>
> Here are 3 approaches..."

## Tips for Effective Claude Code Sessions

### Do's

✅ **Start with planning** - Use Planner agent first
✅ **Be specific** - "The button is too small" is better than "Fix the button"
✅ **Use screenshots** - A picture is worth 1000 words
✅ **Test incrementally** - Small changes, frequent testing
✅ **Ask questions** - If unsure, ask Claude for clarification
✅ **Provide context** - Share what you're trying to accomplish

### Don'ts

❌ **Skip planning** - Don't jump straight to code
❌ **Be vague** - "Make it better" doesn't help
❌ **Test at the end** - Test early and often
❌ **Assume Claude knows** - Provide screenshots and context
❌ **Make big changes** - Small iterations work better

## Example Full Session

**User:**
> "I want to add a feature where users can delete uploaded documents"

**Claude (Planner):**
> "Let me help you plan this feature. I have some questions:
>
> 1. Should delete be immediate, or with a confirmation dialog?
> 2. Should we soft-delete (mark as deleted) or hard-delete (remove completely)?
> 3. What happens to the file in MinIO - delete it too?
> 4. Can users undo a deletion?
> 5. Should there be a bulk delete option, or just one at a time?
>
> Here are 3 approaches..."

**User:**
> "Immediate deletion is fine, but show a confirmation dialog. Hard delete from both database and MinIO. No undo needed. One at a time is fine for now."

**Claude (Planner):**
> "Perfect! Here's the specification:
>
> [Creates feature spec]
>
> Shall I proceed with implementation?"

**User:**
> "Yes, please"

**Claude:**
> "I'll now consult Architect, Security, and Persistence agents...
>
> [Implements feature with TDD]
>
> Done! You can test it now. Please capture screenshots of:
> 1. Document list with delete button
> 2. Confirmation dialog
> 3. After deletion (document removed)
> 4. Error state (if deletion fails)"

**User:**
> [Uploads screenshots]
> "The delete button looks good, but the confirmation dialog is too wide on mobile"

**Claude:**
> "I see the issue in your screenshot. The dialog is using `max-w-2xl` which is too wide for mobile. Let me fix that...
>
> [Makes fix]
>
> Please test again"

**User:**
> [Uploads new screenshot]
> "Perfect! That's much better"

**Claude:**
> "Great! All tests passing. Ready to commit?"

**User:**
> "Yes"

**Claude:**
> [Creates commit with screenshots]
> "Pushed to GitHub. Feature complete!"

---

## Summary

This workflow ensures:
- ✅ Well-planned features (Planner agent)
- ✅ High-quality implementation (Specialist agents)
- ✅ Visual correctness (Screenshot testing)
- ✅ Iterative refinement (Feedback loop)
- ✅ Documentation (Screenshots + specs)
- ✅ Regression prevention (Visual tests)

**Remember:** Planning takes 20% of the time but saves 80% of rework. Always start with the Planner agent!
