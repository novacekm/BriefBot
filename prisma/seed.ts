import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../app/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const SALT_ROUNDS = 12
const DEV_PASSWORD = 'devpassword123'

async function main() {
  console.log('Starting database seed...')

  // Hash password for dev user
  const hashedPassword = await bcrypt.hash(DEV_PASSWORD, SALT_ROUNDS)

  // Seed test user for development
  const testUser = await prisma.user.upsert({
    where: { email: 'dev@briefbot.ch' },
    update: { password: hashedPassword },
    create: {
      email: 'dev@briefbot.ch',
      password: hashedPassword,
    },
  })

  console.log('Created development user:', testUser.email)
  console.log('Development credentials: dev@briefbot.ch / devpassword123')

  console.log('Database seeding completed!')
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
