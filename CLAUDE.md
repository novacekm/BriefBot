# BriefBot - Claude AI Session Entry Point

## Project Overview

**BriefBot** is a privacy-first, mobile-web OCR utility for Swiss residents to decode official mail in German, French, and Italian.

**Mission**: Empower Swiss residents to quickly understand official correspondence through AI-powered OCR and translation, while maintaining strict privacy and data protection standards.

## Tech Stack

### Frontend & Backend
- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (utility-first styling)
- **shadcn/ui** (component library)

### Database & Authentication
- **Supabase** (PostgreSQL + Auth)
- **Prisma** (ORM)
- **PostgreSQL 16** (database)

### Infrastructure
- **Docker Compose** (local development)
- **MinIO** (S3-compatible object storage for local dev)
- **Vercel** (production deployment)

### AI & Machine Learning
- **Vercel AI SDK** (LLM orchestration)
- **OpenAI GPT-4 Vision** (OCR)
- **Anthropic Claude** (translation, document understanding)

### Testing
- **Playwright** (E2E testing)
- **Vitest** (unit testing)
- **Testing Library** (component testing)

## Specialized Agents

BriefBot development follows a multi-agent architecture. Each agent has specific expertise:

### 1. **Planner** (`.claude/agents/planner.md`) ⭐ START HERE
- Feature brainstorming and discovery
- Interactive planning sessions
- Asking clarifying questions
- Proposing multiple solution options
- User-centered design thinking
- Screenshot-based planning

### 2. **Architect** (`.claude/agents/architect.md`)
- Next.js 15 App Router patterns
- System design and architecture
- API design (Server Actions, Route Handlers)
- Performance optimization
- File structure and organization

### 3. **UX Designer** (`.claude/agents/ux-designer.md`)
- Swiss International Style minimalism
- shadcn/ui component library
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)
- Typography and spacing systems

### 4. **Persistence** (`.claude/agents/persistence.md`)
- Prisma ORM and schema design
- PostgreSQL optimization
- MinIO object storage integration
- Database migrations and seeding
- Connection pooling and performance

### 5. **Security** (`.claude/agents/security.md`)
- Swiss nFADP compliance
- Zero-trust architecture
- PII protection and encryption
- Authentication and authorization
- Security headers and rate limiting

### 6. **Infrastructure** (`.claude/agents/infra.md`)
- Docker Compose setup
- Local development environment
- CI/CD pipelines
- Deployment strategies
- Monitoring and observability

### 7. **Tester** (`.claude/agents/tester.md`)
- TDD practices
- Playwright E2E testing
- Component and unit testing
- Test coverage requirements
- Quality assurance

### 8. **Reviewer** (`.claude/agents/reviewer.md`)
- Code review standards
- Design consistency
- TypeScript best practices
- ESLint and Prettier configuration
- PR review process

### 9. **ML Expert** (`.claude/agents/ml-expert.md`)
- OCR with GPT-4 Vision
- Translation with Claude
- Document understanding and extraction
- RAG for document search
- Prompt engineering for Swiss documents

## Project Structure

```
BriefBot/
├── .claude/
│   └── agents/              # Agent personas
├── app/                     # Next.js 15 App Router
│   ├── (auth)/              # Authentication routes
│   ├── (main)/              # Main application routes
│   │   ├── upload/          # Document upload
│   │   ├── documents/       # Document management
│   │   └── settings/        # User settings
│   └── api/                 # API routes (minimal)
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── features/            # Feature-specific components
├── lib/
│   ├── actions/             # Server Actions
│   ├── db/                  # Prisma client
│   ├── ai/                  # AI/OCR integration
│   └── storage/             # MinIO integration
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
├── tests/
│   ├── e2e/                 # Playwright E2E tests
│   ├── components/          # Component tests
│   └── fixtures/            # Test fixtures
├── docs/
│   ├── ADR/                 # Architecture Decision Records
│   ├── COMPLIANCE/          # nFADP compliance docs
│   ├── SECURITY/            # Security documentation
│   └── BACKLOG.json         # Project backlog
├── docker-compose.yml       # Local dev services
├── CLAUDE.md                # This file
└── DEVELOPMENT_FLOW.md      # Development workflow
```

## Development Workflow

See `DEVELOPMENT_FLOW.md` for the complete development process.

**Quick reference:**
1. **Design** → Consult Architect & UX Designer
2. **Implement** → Write code following agent guidelines
3. **Test** → Write tests (TDD) with Tester guidance
4. **Review** → Self-review with Reviewer checklist
5. **Security** → Verify compliance with Security agent
6. **Deploy** → Follow Infrastructure guidelines

## Core Principles

### 1. Privacy-First
- Swiss nFADP compliance mandatory
- Zero-trust architecture
- No PII in client bundles
- Encryption at rest and in transit
- User data deletion on request

### 2. Mobile-First
- Responsive design (mobile → desktop)
- Touch-friendly interfaces (44x44px min)
- Progressive web app capabilities
- Optimized for Swiss mobile networks

### 3. Multilingual
- Swiss German, French, Italian support
- Proper localization (not just translation)
- Swiss-specific date/number formats
- Official terminology preservation

### 4. Quality-Driven
- 80% test coverage minimum
- TDD for critical features
- Accessibility (WCAG 2.1 AA)
- Performance budgets enforced

### 5. Solo-Developer Optimized
- Clear separation of concerns
- Automated testing and deployment
- Comprehensive documentation
- Agent-guided decision making

## Getting Started

### Initial Setup
```bash
# Clone repository
git clone git@github.com:novacekm/BriefBot.git
cd BriefBot

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start Docker services
docker-compose up -d

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev
```

### Common Commands
```bash
# Development
npm run dev                 # Start Next.js dev server
npm run db:studio          # Open Prisma Studio

# Testing
npm run test               # Run all tests
npm run test:unit          # Unit tests only
npm run test:e2e           # E2E tests only
npm run test:ui            # Playwright UI mode

# Database
npm run db:migrate         # Create and apply migration
npm run db:push            # Push schema without migration
npm run db:reset           # Reset database

# Docker
npm run docker:up          # Start all services
npm run docker:down        # Stop all services
npm run docker:reset       # Reset with fresh volumes
npm run docker:logs        # View logs

# Code quality
npm run lint               # ESLint
npm run type-check         # TypeScript check
```

## Consulting Agents

When working on specific tasks, consult the relevant agent:

- **New feature/idea?** → **ALWAYS start with Planner agent** for brainstorming ⭐
- **Technical design?** → Consult **Architect** after planning
- **UI component?** → Check **UX Designer** guidelines
- **Database change?** → Consult **Persistence** agent
- **Security concern?** → Review **Security** checklist
- **Docker issue?** → See **Infrastructure** agent
- **Writing tests?** → Follow **Tester** patterns
- **Code review?** → Use **Reviewer** checklist
- **AI/OCR feature?** → Consult **ML Expert**

**Important:** For ANY new feature, always start with the **Planner agent** to brainstorm, ask questions, and propose solutions BEFORE implementation. See `CLAUDE_CODE_WORKFLOW.md` for the complete process.

## Key Resources

- **Tech Stack Docs**:
  - [Next.js 15](https://nextjs.org/docs)
  - [Prisma](https://www.prisma.io/docs)
  - [Vercel AI SDK](https://sdk.vercel.ai/docs)
  - [shadcn/ui](https://ui.shadcn.com)
  - [Playwright](https://playwright.dev)

- **Compliance**:
  - [Swiss nFADP](https://www.fedlex.admin.ch/eli/cc/2022/491/en)
  - [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

- **Design**:
  - [Swiss International Style](https://en.wikipedia.org/wiki/International_Typographic_Style)
  - [Tailwind CSS](https://tailwindcss.com/docs)

## Current Status

**Project Phase**: Initialization

**Next Steps**: See `docs/BACKLOG.json` for P0 tasks

## Contact

**Developer**: novacekm (mnovacek@gmail.com)
**Repository**: https://github.com/novacekm/BriefBot

---

*This document is the entry point for all Claude AI sessions. When starting a new task, read this file and consult the relevant agent persona.*
