import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '#/db/schema'

export function createDb() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 })
  return drizzle(client, { schema })
}
