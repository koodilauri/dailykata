import serverEntry from '@tanstack/react-start/server-entry'
import { parseCookies, verifyCookieValue } from '#/lib/cookie'
import { createDb } from '#/lib/db'
import { account, session, user, userProgress, userStats, xpEvent } from '#/db/schema'
import { submission } from '#/db/schema/kata'
import { and, eq, isNotNull, lte } from 'drizzle-orm'

type Db = ReturnType<typeof createDb>

async function hardDeleteUser(userId: string, db: Db) {
  await db.delete(xpEvent).where(eq(xpEvent.userId, userId))
  await db.delete(userStats).where(eq(userStats.userId, userId))
  await db.delete(userProgress).where(eq(userProgress.userId, userId))
  await db.delete(submission).where(eq(submission.userId, userId))
  await db.delete(session).where(eq(session.userId, userId))
  await db.delete(account).where(eq(account.userId, userId))
  await db
    .update(user)
    .set({
      name: 'Deleted User',
      email: `deleted-${userId}@deleted.local`,
      image: null,
      scheduledDeletionAt: null,
      updatedAt: new Date()
    })
    .where(eq(user.id, userId))
}

export default {
  fetch: async (request: Request, env: Record<string, string>, ctx: unknown) => {
    const url = new URL(request.url)

    const alwaysAllowed =
      url.pathname === '/gate' ||
      url.pathname.startsWith('/api/auth/demo-login') ||
      url.pathname.startsWith('/_build') ||
      url.pathname.startsWith('/__vite') ||
      url.pathname.startsWith('/favicon') ||
      url.pathname.startsWith('/@') ||
      url.pathname.startsWith('/node_modules')

    if (!alwaysAllowed) {
      const cookies = parseCookies(request.headers.get('Cookie') ?? '')
      const hasSession = !!cookies['better-auth.session_token']
      const secret = env.BETA_SECRET ?? ''
      const hasBeta = secret
        ? await verifyCookieValue(cookies['beta_access'] ?? '', 'beta', secret)
        : false
      const hasDemo = secret
        ? await verifyCookieValue(cookies['demo_access'] ?? '', 'demo', secret)
        : false

      if (!hasSession && !hasBeta && !hasDemo) {
        return Response.redirect(new URL('/gate', url).toString(), 302)
      }

      if (!hasSession && !hasBeta && hasDemo) {
        const isNavigation =
          request.method === 'GET' && request.headers.get('Accept')?.includes('text/html')
        if (isNavigation && !url.pathname.startsWith('/demo')) {
          return Response.redirect(new URL('/demo', url).toString(), 302)
        }
      }
    }

    return (
      serverEntry as { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> }
    ).fetch(request, env, ctx)
  },

  async scheduled(
    _event: unknown,
    _env: unknown,
    ctx: { waitUntil: (p: Promise<unknown>) => void }
  ) {
    ctx.waitUntil(
      (async () => {
        const db = createDb()
        const expired = await db
          .select({ id: user.id })
          .from(user)
          .where(
            and(isNotNull(user.scheduledDeletionAt), lte(user.scheduledDeletionAt, new Date()))
          )
        await Promise.all(expired.map(({ id }) => hardDeleteUser(id, db)))
      })()
    )
  }
}
