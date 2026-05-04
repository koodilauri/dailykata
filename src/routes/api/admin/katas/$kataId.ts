import { kata } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { logger } from '#/lib/logger'
import { KataInputSchema, TogglePublishSchema } from '#/lib/schemas'
import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

const log = logger.withTag('api:admin:katas')

async function requireAdmin(request: Request) {
  const session = await createAuth().api.getSession({ headers: request.headers })
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return null
  }
  return session
}

export const Route = createFileRoute('/api/admin/katas/$kataId')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const session = await requireAdmin(request)
        if (!session) return Response.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const { action, ...rest } = body as Record<string, unknown>

        if (action === 'publish') {
          const parsed = TogglePublishSchema.safeParse({ id: params.kataId, ...rest })
          if (!parsed.success) {
            return Response.json({ error: parsed.error.flatten() }, { status: 400 })
          }
          const db = createDb()
          await db
            .update(kata)
            .set({ published: parsed.data.published })
            .where(eq(kata.id, params.kataId))
          log.info('kata publish toggled', { id: params.kataId, published: parsed.data.published })
          return Response.json({ ok: true })
        }

        const parsed = KataInputSchema.safeParse(rest)
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 })
        }
        const db = createDb()
        await db.update(kata).set(parsed.data).where(eq(kata.id, params.kataId))
        log.info('kata updated', { id: params.kataId, title: parsed.data.title })
        return Response.json({ ok: true })
      }
    }
  }
})
