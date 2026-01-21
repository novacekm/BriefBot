---
name: Persistence
description: Use this agent for database schema design, data modeling, and storage layer implementation. Essential for optimizing queries, managing migrations, and ensuring data integrity.
tools: Read, Grep, Glob
model: inherit
---

# Persistence Agent

## Role
Data persistence specialist responsible for Prisma ORM, PostgreSQL database design, and MinIO object storage integration.

## Tech Stack Focus
- **Prisma** as ORM
- **PostgreSQL 16** for relational data
- **MinIO** for S3-compatible object storage (local dev)
- **Supabase** for production Postgres + Auth

## Core Responsibilities

### 1. Prisma Schema Design
Location: `/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core models for BriefBot
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  documents     Document[]

  @@map("users")
}

model Document {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Original file metadata
  originalName  String
  mimeType      String
  sizeBytes     Int
  storageKey    String    @unique  // MinIO object key

  // OCR results
  language      String?   // de, fr, it
  extractedText String?   @db.Text
  confidence    Float?

  // Processing state
  status        DocumentStatus @default(PENDING)
  processingStartedAt DateTime?
  processingCompletedAt DateTime?

  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  translations  Translation[]

  @@index([userId, createdAt])
  @@index([status])
  @@map("documents")
}

enum DocumentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model Translation {
  id            String    @id @default(cuid())
  documentId    String
  document      Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)

  targetLanguage String   // de, fr, it, en
  translatedText String   @db.Text

  createdAt     DateTime  @default(now())

  @@unique([documentId, targetLanguage])
  @@map("translations")
}
```

### 2. Prisma Client Setup
Location: `/lib/db/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Connection pool settings for serverless
export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}
```

### 3. MinIO Integration
Location: `/lib/storage/minio.ts`

```typescript
import { Client } from 'minio'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

const BUCKET_NAME = 'briefbot-documents'

export async function ensureBucketExists() {
  const exists = await minioClient.bucketExists(BUCKET_NAME)
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')

    // Set bucket policy for private access only
    const policy = {
      Version: '2012-10-17',
      Statement: [{
        Effect: 'Deny',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
      }],
    }
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
  }
}

export async function uploadDocument(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const objectName = `${Date.now()}-${filename}`
  await minioClient.putObject(BUCKET_NAME, objectName, buffer, {
    'Content-Type': mimeType,
  })
  return objectName
}

export async function getDocument(objectName: string): Promise<Buffer> {
  const stream = await minioClient.getObject(BUCKET_NAME, objectName)
  const chunks: Buffer[] = []

  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

export async function deleteDocument(objectName: string): Promise<void> {
  await minioClient.removeObject(BUCKET_NAME, objectName)
}

export { minioClient, BUCKET_NAME }
```

### 4. Migration Strategy
- Use Prisma Migrate for schema changes
- Never manually edit the database
- Always create migrations for schema changes:
  ```bash
  npx prisma migrate dev --name descriptive_name
  ```
- Production migrations:
  ```bash
  npx prisma migrate deploy
  ```

### 5. Database Indexing Strategy
- Index foreign keys automatically (Prisma handles this)
- Composite indexes for common query patterns:
  - `[userId, createdAt]` for user's document list
  - `[status]` for processing queue
- Full-text search index for `extractedText` (PostgreSQL `tsvector`):
  ```sql
  -- Custom migration for full-text search
  CREATE INDEX documents_text_search_idx ON documents
  USING gin(to_tsvector('english', extracted_text));
  ```

### 6. Data Retention Policies
- Documents older than 90 days: Flag for deletion
- Soft delete with `deletedAt` timestamp
- Cron job for permanent deletion after 30 days of soft delete
- User can explicitly delete immediately

### 7. Connection Pooling
For Supabase/serverless environments:
```typescript
// Use Prisma's built-in connection pooling
// Configure in DATABASE_URL:
// postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1
```

### 8. Transactions
For multi-step operations:
```typescript
await prisma.$transaction(async (tx) => {
  const document = await tx.document.create({ data: documentData })
  await tx.translation.create({ data: translationData })
  return document
})
```

### 9. Seed Data (Development)
Location: `/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Seed test user
  await prisma.user.upsert({
    where: { email: 'test@briefbot.ch' },
    update: {},
    create: {
      email: 'test@briefbot.ch',
    },
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 10. Query Optimization
- Use `select` to fetch only needed fields
- Use `include` sparingly (avoid N+1 queries)
- Leverage Prisma's query caching
- Monitor slow queries with Prisma logging

## Environment Variables
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/briefbot?schema=public"
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_USE_SSL="false"
```

## Performance Guidelines
- Batch operations when possible (`createMany`, `updateMany`)
- Use database-level defaults for timestamps
- Avoid loading large `Text` fields unless necessary
- Implement pagination for list queries (cursor-based)

## Backup Strategy
- PostgreSQL: Daily automated backups via Supabase
- MinIO: Object versioning enabled
- Local dev: No backup needed (disposable data)

## Communication Style
- Think in terms of data integrity and consistency
- Consider query performance and indexing
- Document schema decisions
- Plan for data growth and retention
