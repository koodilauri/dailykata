import serverEntry from '@tanstack/react-start/server-entry'
import { hardDeleteUser } from '#/server/account'
import { createDb } from '#/lib/db'
import { and, isNotNull, lte } from 'drizzle-orm'
import { user } from '#/db/schema'

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
