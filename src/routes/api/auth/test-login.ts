import { createFileRoute } from '@tanstack/react-router'
import { uuidv7 } from 'uuidv7'
import { createDb } from '#/lib/db'
import { user, session } from '#/db/schema'

const TEST_USER_ID = 'test-user-e2e'

export const Route = createFileRoute('/api/auth/test-login')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (process.env.E2E_TESTING_ENABLED !== 'true') {
          return new Response('Not found', { status: 404 })
        }

        const db = createDb()

        await db
          .insert(user)
          .values({
            id: TEST_USER_ID,
            name: 'E2E Test User',
            email: 'e2e-test@test.local',
            emailVerified: true,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .onConflictDoUpdate({
            target: user.id,
            set: { updatedAt: new Date() }
          })

        const token = uuidv7().replace(/-/g, '')
        const sessionId = uuidv7()
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        await db.insert(session).values({
          id: sessionId,
          token,
          userId: TEST_USER_ID,
          expiresAt,
          createdAt: new Date(),
          updatedAt: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: request.headers.get('user-agent') ?? 'Playwright/E2E'
        })

        const secret = process.env.BETTER_AUTH_SECRET!
        const signedToken = await signCookieValue(token, secret)

        return new Response(JSON.stringify({ userId: TEST_USER_ID, sessionToken: token }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `better-auth.session_token=${signedToken}; Path=/; HttpOnly; SameSite=Lax`
          }
        })
      }
    }
  }
})

async function signCookieValue(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return `${value}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`
}
