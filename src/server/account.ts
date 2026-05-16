import { account, session, user, userProgress, userStats, xpEvent } from '#/db/schema'
import { submission } from '#/db/schema/kata'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'

type Db = ReturnType<typeof createDb>
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

export async function hardDeleteUser(userId: string, db: Db) {
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
