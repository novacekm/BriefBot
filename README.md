# BriefBot

Privacy-first, mobile-web OCR utility for Swiss residents to decode official mail in German, French, and Italian.

## What It Does

BriefBot helps Swiss residents quickly understand official correspondence (government letters, tax documents, legal notices) through:

- **Document Understanding**: Upload photos of documents, extract text and structured data via Claude Vision
- **Translation**: Translate between Swiss national languages (German, French, Italian) and English
- **Privacy-First**: All processing compliant with Swiss nFADP (Federal Act on Data Protection)

## Current Status

**Phase**: MVP Development (v0.1.0)

### Implemented

- Next.js 15 with App Router and Server Components
- PostgreSQL database with Prisma ORM
- Docker development environment (PostgreSQL + MinIO)
- CI/CD pipeline with GitHub Actions
- E2E testing (Playwright) across 5 browsers
- Visual regression testing
- Branch protection requiring all CI checks
- User authentication (NextAuth.js with credentials provider)
- shadcn/ui component library

### Implemented (POC Complete)

- Document upload with drag-and-drop
- Document list and detail views
- Mock OCR with Swiss document samples
- Status badges and document type detection

### Not Yet Implemented

- Real AI document understanding (Claude Vision)
- Translation service
- Document deletion
- Background processing queue

## Roadmap

> Synced with [GitHub Issues](https://github.com/novacekm/BriefBot/issues). When an issue is closed, update this section.

### MVP (P0-critical)

**Completed:**
- [x] [#24 Local Authentication with NextAuth.js](https://github.com/novacekm/BriefBot/issues/24)
- [x] [#2 shadcn/ui Component Library Setup](https://github.com/novacekm/BriefBot/issues/2)
- [x] [#26 MinIO Storage Integration](https://github.com/novacekm/BriefBot/issues/26)
- [x] [#4 Document Upload UI](https://github.com/novacekm/BriefBot/issues/4)
- [x] [#5 Document Upload Server Action](https://github.com/novacekm/BriefBot/issues/5)
- [x] [#60 Document List Page](https://github.com/novacekm/BriefBot/issues/60)
- [x] [#61 Document Detail Page](https://github.com/novacekm/BriefBot/issues/61)
- [x] [#28 Mock OCR Service](https://github.com/novacekm/BriefBot/issues/28)

**In Progress:**
- [ ] [#32 Direct Document Understanding with Claude Vision](https://github.com/novacekm/BriefBot/issues/32) *(architecture updated)*
- [ ] [#72 Background Job Queue](https://github.com/novacekm/BriefBot/issues/72) *(new)*
- [ ] [#71 Document Deletion for nFADP Compliance](https://github.com/novacekm/BriefBot/issues/71) *(new - P0 for compliance)*
- [ ] [#70 Rate Limiting for Auth/Upload](https://github.com/novacekm/BriefBot/issues/70) *(new - security)*
- [ ] [#33 Translation with Claude](https://github.com/novacekm/BriefBot/issues/33)

### Post-MVP (P1-high)

- [ ] [#73 Pagination for Documents List](https://github.com/novacekm/BriefBot/issues/73) *(new)*
- [ ] [#74 PWA Basic Implementation](https://github.com/novacekm/BriefBot/issues/74) *(new)*
- [ ] [#38 Basic Privacy Compliance (Swiss nFADP)](https://github.com/novacekm/BriefBot/issues/38)
- [ ] [#37 E2E Test Suite for New Features](https://github.com/novacekm/BriefBot/issues/37)
- [ ] [#36 Mobile-Responsive UI](https://github.com/novacekm/BriefBot/issues/36)

### Future (P2-P3)

- [ ] Full-text search across documents
- [ ] RAG-based Q&A on document content
- [ ] Batch document uploads
- [ ] Calendar integration for deadlines

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | Next.js Server Actions, Node.js |
| Database | PostgreSQL 16, Prisma ORM |
| Storage | MinIO (S3-compatible) |
| Auth | NextAuth.js (local credentials) |
| AI/ML | Anthropic Claude (Vision + Text), Vercel AI SDK |
| Testing | Playwright, Vitest |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/BriefBot.git
cd BriefBot

# Install dependencies
npm install

# Start local services (PostgreSQL + MinIO)
npm run docker:up

# Run database migrations
npm run db:migrate

# Seed the database (optional)
npm run db:seed

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Database
DATABASE_URL="postgresql://briefbot:briefbot@localhost:5432/briefbot"

# MinIO Storage
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Authentication (NextAuth.js)
AUTH_SECRET="your-auth-secret"  # Generate with: openssl rand -base64 32

# AI Services (Claude for document understanding and translation)
ANTHROPIC_API_KEY="your-anthropic-key"
```

## Development

### Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
npm run test:unit    # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
npm run test:visual  # Visual regression tests
npm run pre-pr       # Run all checks before PR
```

### Workflow

1. Create a feature branch from `master`: `git checkout -b issue-<N>-<title>`
2. Make changes following TDD
3. Run `npm run pre-pr` to validate locally
4. Create a PR - all 10 CI checks must pass
5. Merge after CI is green

### Branch Protection

Direct pushes to `master` are blocked. All changes require:
- Pull Request
- All CI checks passing (Lint, Type Check, Test, Build, 5 E2E browsers, Visual)

## Architecture

```
BriefBot/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── (main)/          # Authenticated routes (planned)
├── lib/                 # Shared utilities
│   └── db/              # Database client
├── prisma/              # Database schema and migrations
├── tests/               # Test suites
│   ├── e2e/             # Playwright E2E tests
│   ├── visual/          # Visual regression tests
│   └── unit/            # Vitest unit tests
└── docs/                # Documentation and specs
```

## Privacy & Compliance

BriefBot is designed for Swiss nFADP compliance:

- No document content stored longer than necessary
- User data isolated with row-level security
- No PII in client-side bundles
- All AI processing through privacy-respecting APIs

## License

Private project - All rights reserved.
