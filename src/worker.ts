import serverEntry from '@tanstack/react-start/server-entry'
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
  ...serverEntry,

  async scheduled(_event: ScheduledEvent, _env: unknown, ctx: ExecutionContext) {
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
