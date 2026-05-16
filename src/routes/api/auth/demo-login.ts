import { createFileRoute } from '@tanstack/react-router'
import { uuidv7 } from 'uuidv7'
import { createDb } from '#/lib/db'
import { user, session } from '#/db/schema'

export const Route = createFileRoute('/api/auth/demo-login')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const db = createDb()
        const userId = `demo-${uuidv7()}`

        await db.insert(user).values({
          id: userId,
          name: 'Demo User',
          email: `${userId}@demo.local`,
          emailVerified: true,
          role: 'user',
          // auto-delete after 24 hours via the nightly cron
          scheduledDeletionAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        })

        const token = uuidv7().replace(/-/g, '')
        const sessionId = uuidv7()

        await db.insert(session).values({
          id: sessionId,
          token,
          userId,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          ipAddress: request.headers.get('x-forwarded-for') ?? '0.0.0.0',
          userAgent: request.headers.get('user-agent') ?? 'Demo'
        })

        const secret = process.env.BETTER_AUTH_SECRET!
        const signedToken = await signCookieValue(token, secret)

        return new Response(null, {
          status: 303,
          headers: {
            Location: '/',
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
