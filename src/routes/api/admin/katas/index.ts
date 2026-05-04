import { kata } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { logger } from '#/lib/logger'
import { KataInputSchema } from '#/lib/schemas'
import { createFileRoute } from '@tanstack/react-router'

const log = logger.withTag('api:admin:katas')

async function requireAdmin(request: Request) {
  const session = await createAuth().api.getSession({ headers: request.headers })
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return null
  }
  return session
}

export const Route = createFileRoute('/api/admin/katas/')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await requireAdmin(request)
        if (!session) return Response.json({ error: 'Forbidden' }, { status: 403 })

        const db = createDb()
        const katas = await db.query.kata.findMany({ orderBy: (k, { asc }) => asc(k.order) })
        return Response.json(katas)
      },

      POST: async ({ request }) => {
        const session = await requireAdmin(request)
        if (!session) return Response.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = KataInputSchema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const db = createDb()
        const [created] = await db.insert(kata).values(parsed.data).returning({ id: kata.id })
        log.info('kata created', { id: created.id, title: parsed.data.title })
        return Response.json(created, { status: 201 })
      }
    }
  }
})
