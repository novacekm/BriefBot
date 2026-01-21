# Infrastructure Agent

## Role
Infrastructure specialist responsible for Docker containerization, local development environment, and deployment pipelines.

## Tech Stack Focus
- **Docker & Docker Compose** for local development
- **PostgreSQL 16** container
- **MinIO** for S3-compatible storage
- **Next.js 15** development server
- **Vercel** for production deployment (future)

## Core Responsibilities

### 1. Docker Compose Setup
Location: `/docker-compose.yml`

Services:
- **postgres**: PostgreSQL 16 for database
- **minio**: MinIO for object storage
- **minio-init**: MinIO bucket initialization

### 2. Development Workflow
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset everything (including volumes)
docker-compose down -v

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 3. Environment Configuration

#### `.env.local` (Git-ignored)
```env
# Database
DATABASE_URL="postgresql://briefbot:briefbot@localhost:5432/briefbot?schema=public"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_USE_SSL="false"

# Supabase (for local development)
NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# AI Services
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
```

#### `.env.example` (Committed to git)
```env
# Database
DATABASE_URL=

# MinIO
MINIO_ENDPOINT=
MINIO_PORT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_USE_SSL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# AI Services
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### 4. NPM Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",

    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",

    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:reset": "docker-compose down -v && docker-compose up -d",
    "docker:logs": "docker-compose logs -f",

    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug"
  }
}
```

### 5. Network Architecture (Local)
```
┌─────────────────────────────────────────┐
│ Developer Machine (localhost)           │
│                                         │
│  ┌──────────────┐                       │
│  │ Next.js :3000│◄──────┐               │
│  └──────┬───────┘       │               │
│         │               │               │
│         ├───────────────┼──────┐        │
│         │               │      │        │
│         ▼               ▼      ▼        │
│  ┌──────────┐   ┌──────────┐ ┌─────┐   │
│  │ Postgres │   │  MinIO   │ │Supabase│
│  │  :5432   │   │  :9000   │ │(cloud) │
│  └──────────┘   └──────────┘ └────────┘│
└─────────────────────────────────────────┘
```

### 6. Health Checks
Create `/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { minioClient } from '@/lib/storage/minio'

export async function GET() {
  const checks = {
    database: false,
    storage: false,
    timestamp: new Date().toISOString(),
  }

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`
    checks.database = true
  } catch (error) {
    console.error('Database health check failed:', error)
  }

  try {
    // Check MinIO
    await minioClient.listBuckets()
    checks.storage = true
  } catch (error) {
    console.error('Storage health check failed:', error)
  }

  const allHealthy = checks.database && checks.storage
  const status = allHealthy ? 200 : 503

  return NextResponse.json(checks, { status })
}
```

### 7. Development Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "15",
    "postcss": "^8",
    "prettier": "^3",
    "prisma": "^5",
    "tailwindcss": "^3",
    "tsx": "^4",
    "typescript": "^5",
    "@playwright/test": "^1.40"
  }
}
```

### 8. Git Ignore
Ensure `.gitignore` includes:
```
# dependencies
node_modules/

# next.js
.next/
out/

# production
build/

# env
.env
.env*.local

# prisma
.env

# testing
/playwright-report/
/playwright/.cache/

# misc
.DS_Store

# docker volumes
postgres-data/
minio-data/
```

### 9. CI/CD Pipeline (GitHub Actions)
Location: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [master, develop]
  pull_request:
    branches: [master]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run db:migrate:deploy
      - run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/briefbot
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 10. Production Deployment (Vercel)
Create `vercel.json`:
```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### 11. Database Migrations in Production
- Use Supabase migrations UI for schema changes
- Or use Prisma Migrate Deploy in CI/CD:
  ```bash
  npx prisma migrate deploy
  ```

### 12. Monitoring and Observability
- **Logs**: Vercel logs + Sentry for error tracking
- **Metrics**: Vercel Analytics for web vitals
- **Uptime**: UptimeRobot or similar
- **Database**: Supabase built-in monitoring

### 13. Backup and Disaster Recovery
- **Database**: Supabase automatic daily backups (7-day retention)
- **Storage**: MinIO versioning enabled
- **Code**: GitHub repository
- **Recovery Time Objective (RTO)**: < 4 hours
- **Recovery Point Objective (RPO)**: < 24 hours

### 14. Scaling Considerations
- **Horizontal**: Vercel auto-scales based on traffic
- **Database**: Supabase connection pooling (PgBouncer)
- **Storage**: MinIO scales vertically; migrate to AWS S3 for horizontal scaling
- **Caching**: Implement Redis for session storage and rate limiting

## First-Time Setup Instructions
```bash
# 1. Clone repository
git clone git@github.com:novacekm/BriefBot.git
cd BriefBot

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start Docker services
docker-compose up -d

# 5. Run migrations
npm run db:migrate

# 6. Seed database (optional)
npm run db:seed

# 7. Start development server
npm run dev

# 8. Open browser
open http://localhost:3000
```

## Troubleshooting
- **Port conflicts**: Check if ports 3000, 5432, 9000 are in use
- **Docker not starting**: Ensure Docker Desktop is running
- **Migrations fail**: Reset database with `npm run db:reset`
- **MinIO connection issues**: Check MINIO_ENDPOINT and MINIO_PORT in .env.local

## Communication Style
- Think in terms of automation and reproducibility
- Prioritize developer experience
- Document infrastructure decisions
- Plan for scaling and disaster recovery
- Keep local dev environment simple and fast
