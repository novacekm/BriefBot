# BriefBot

Privacy-first, mobile-web OCR utility for Swiss residents to decode official mail in German, French, and Italian.

## What It Does

BriefBot helps Swiss residents quickly understand official correspondence (government letters, tax documents, legal notices) through:

- **OCR Extraction**: Upload photos of documents, get machine-readable text via GPT-4 Vision
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

### Not Yet Implemented

- User authentication
- Document upload UI
- OCR processing
- Translation service
- Document management views

## Roadmap

> Synced with [GitHub Issues](https://github.com/novacekm/BriefBot/issues). When an issue is closed, update this section.

### MVP (P0-critical)

- [ ] [#1 Supabase Authentication Setup](https://github.com/novacekm/BriefBot/issues/1)
- [ ] [#2 shadcn/ui Component Library Setup](https://github.com/novacekm/BriefBot/issues/2)
- [ ] [#3 MinIO Storage Integration](https://github.com/novacekm/BriefBot/issues/3)
- [ ] [#4 Document Upload UI](https://github.com/novacekm/BriefBot/issues/4)
- [ ] [#5 Document Upload Server Action](https://github.com/novacekm/BriefBot/issues/5)
- [ ] [#6 OCR Integration with GPT-4 Vision](https://github.com/novacekm/BriefBot/issues/6)
- [ ] [#7 OCR Processing Queue](https://github.com/novacekm/BriefBot/issues/7)
- [ ] [#8 Document List View](https://github.com/novacekm/BriefBot/issues/8)
- [ ] [#9 Document Detail View](https://github.com/novacekm/BriefBot/issues/9)

### Post-MVP (P1-high)

- [ ] [#10 Translation with Claude](https://github.com/novacekm/BriefBot/issues/10)
- [ ] [#11 Document Deletion](https://github.com/novacekm/BriefBot/issues/11)
- [ ] [#12 E2E Test Suite](https://github.com/novacekm/BriefBot/issues/12)

### Future (P2-P3)

- [ ] Full-text search across documents
- [ ] RAG-based Q&A on document content
- [ ] PWA with offline support
- [ ] Batch document uploads

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | Next.js Server Actions, Node.js |
| Database | PostgreSQL 16, Prisma ORM |
| Storage | MinIO (S3-compatible) |
| Auth | Supabase |
| AI/ML | OpenAI GPT-4 Vision, Anthropic Claude |
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

# Supabase (for auth)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI Services
OPENAI_API_KEY="your-openai-key"
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
