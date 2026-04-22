import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { user } from './schema/auth'
import { eq } from 'drizzle-orm'

const email = process.argv[2]
if (!email) {
  console.error('Usage: pnpm db:make-admin <email>')
  process.exit(1)
}

const client = postgres(process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!, {
  prepare: false
})
const db = drizzle(client)

const [updated] = await db
  .update(user)
  .set({ role: 'admin' })
  .where(eq(user.email, email))
  .returning({ id: user.id, email: user.email })

if (!updated) {
  console.error(`No user found with email: ${email}`)
  console.error('Sign in with GitHub first, then re-run this script.')
  process.exit(1)
}

console.log(`✓ ${updated.email} is now an admin.`)
await client.end()
