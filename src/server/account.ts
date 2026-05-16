import { user } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'

const DELETION_GRACE_DAYS = 14

async function requireSession() {
  const request = getRequest()
  const sess = await createAuth().api.getSession({ headers: request.headers })
  if (!sess) throw new Error('Unauthorized')
  return sess
}

export const getScheduledDeletion = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const sess = await createAuth().api.getSession({ headers: request.headers })
  if (!sess) return null
  const db = createDb()
  const row = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, sess.user.id),
    columns: { scheduledDeletionAt: true }
  })
  return row?.scheduledDeletionAt ?? null
})

export const scheduleAccountDeletion = createServerFn({ method: 'POST' }).handler(async () => {
  const sess = await requireSession()
  const db = createDb()
  const scheduledAt = new Date(Date.now() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000)
  await db
    .update(user)
    .set({ scheduledDeletionAt: scheduledAt, updatedAt: new Date() })
    .where(eq(user.id, sess.user.id))
})

export const cancelAccountDeletion = createServerFn({ method: 'POST' }).handler(async () => {
  const sess = await requireSession()
  const db = createDb()
  await db
    .update(user)
    .set({ scheduledDeletionAt: null, updatedAt: new Date() })
    .where(eq(user.id, sess.user.id))
})
