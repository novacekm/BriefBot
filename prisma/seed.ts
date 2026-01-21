import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed test user for development
  const testUser = await prisma.user.upsert({
    where: { email: 'dev@briefbot.ch' },
    update: {},
    create: {
      email: 'dev@briefbot.ch',
    },
  })

  console.log('✅ Created development user:', testUser.email)

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
