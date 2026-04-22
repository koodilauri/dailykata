import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from '#/lib/db'
import * as schema from '#/db/schema'

export function createAuth() {
  return betterAuth({
    database: drizzleAdapter(createDb(), {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification
      }
    }),
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!
      }
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          defaultValue: 'user'
        }
      }
    }
  })
}
