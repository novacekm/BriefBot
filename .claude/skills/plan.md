# Plan - Feature Planning Skill

> **Invoke with:** User describes a feature idea
> **Purpose:** Interactive planning session to brainstorm, clarify requirements, and create specifications

## What This Skill Does

Conducts an interactive planning session for new features:
1. Asks clarifying questions about the feature
2. Proposes 2-3 solution approaches with trade-offs
3. Helps select the best approach
4. Creates detailed feature specification
5. Plans screenshot test scenarios

## When to Use

Use this skill when you want to:
- Start planning a new feature
- Brainstorm different approaches
- Get help understanding requirements
- Create a detailed specification

## Planning Process

### Phase 1: Discovery

**I will ask you:**
- What problem are you trying to solve?
- Who are the users?
- What's the ideal user experience?
- Are there any constraints?
- What does success look like?

**Example Questions:**
- "Should users be able to upload multiple files at once?"
- "Should OCR happen immediately or in the background?"
- "What file types should we support?"
- "How long should we keep documents?"

### Phase 2: Solution Options

**I will propose 2-3 approaches:**

**Option A: Minimal MVP**
- Core functionality only
- Fast to build
- Limited features

**Option B: Balanced (Usually Recommended)**
- Good user experience
- Reasonable complexity
- Covers common use cases

**Option C: Full-Featured**
- Best UX
- Handles all edge cases
- Higher complexity

**Each option includes:**
- What it does
- Pros and cons
- Estimated effort
- When to use it

### Phase 3: Specification

After you select an approach, I will create:

**Feature Specification** (`docs/specs/[feature-name].md`):
- Problem statement
- User stories
- Selected approach and rationale
- User flow
- UI/UX requirements (all visual states)
- Acceptance criteria
- Screenshot test scenarios
- Technical requirements
- Privacy & security review
- Testing strategy

### Phase 4: Handoff

Specification ready for:
- Technical agents (Architect, UX Designer, Security, etc.)
- Implementation
- Testing

## Swiss Context Considerations

I will ensure we consider:
- **Multi-language**: German, French, Italian support
- **Privacy-first**: Swiss nFADP compliance
- **Mobile-first**: Touch-friendly, offline-capable
- **Document types**: Swiss official mail, insurance, tax forms

## Example Planning Session

**You:** "I want to add document upload"

**Me:**
```
Let me help you plan this feature. I have some questions:

1. Should users upload one document at a time, or multiple?
2. Should OCR happen immediately, or in the background?
3. What should users see while OCR is processing?
4. Should we support drag-and-drop, or just file picker?
5. What file types: PDF, images, or both?
6. What's the maximum file size we should allow?
7. Can users delete documents immediately after upload?
```

**You:** [Answer questions]

**Me:**
```
Based on your answers, here are 3 approaches:

**Option A: Simple Upload**
- Single file via button
- Synchronous OCR processing
- Loading spinner
- Display results on same page

Pros: ✅ Fast to build, ✅ Simple
Cons: ❌ Blocks UI, ❌ No multi-file

Effort: ~4 hours

**Option B: Enhanced Upload (Recommended)**
- Multi-file with drag-and-drop
- Background OCR processing
- Progress indicators
- Redirect to document list

Pros: ✅ Better UX, ✅ Scalable, ✅ Non-blocking
Cons: ⚠️ More complex, ⚠️ Needs job queue

Effort: ~8 hours

**Option C: Advanced Upload**
- All features from Option B
- Real-time progress (WebSockets)
- Thumbnail previews
- Cancel/retry functionality

Pros: ✅ Best UX, ✅ All edge cases
Cons: ❌ High complexity, ❌ Longer dev time

Effort: ~16 hours

Which option works best for you?
```

**You:** "Option B sounds good"

**Me:**
```
Perfect! Let me create the specification...

[Creates docs/specs/document-upload.md with full details]

Specification created! Next steps:
1. Review the spec in docs/specs/document-upload.md
2. I'll consult technical agents (Architect, UX Designer, Security)
3. Ready to start implementation when you are
```

## Output

This skill produces:
- ✅ Feature specification document
- ✅ Screenshot test scenarios
- ✅ Acceptance criteria
- ✅ Technical requirements
- ✅ Security review checklist

## Reference Guides

For detailed context, see:
- `docs/guides/planner-guide.md` - Comprehensive planning methodology
- `docs/guides/ux-design-guide.md` - Swiss International Style principles
- `docs/guides/security-guide.md` - Swiss nFADP compliance requirements
