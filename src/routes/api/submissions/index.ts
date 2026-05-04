import { submission, userProgress, userStats, xpEvent } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { logger } from '#/lib/logger'
import { KataIdSchema, SubmitKataSchema } from '#/lib/schemas'
import { createFileRoute } from '@tanstack/react-router'
import { and, eq, sql } from 'drizzle-orm'

const log = logger.withTag('api:submissions')

const XP_PER_KATA = 100

export const Route = createFileRoute('/api/submissions/')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await createAuth().api.getSession({ headers: request.headers })
        if (!session) {
          return Response.json({ requiresAuth: true }, { status: 401 })
        }

        const body = await request.json()
        const parsed = SubmitKataSchema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const { kataId, code, passed } = parsed.data
        const userId = session.user.id
        log.debug('submitKata', { kataId, passed, userId })
        const db = createDb()

        const prev = await db.query.userProgress.findFirst({
          where: (p, { and, eq }) => and(eq(p.userId, userId), eq(p.kataId, kataId))
        })
        const alreadyCompleted = prev?.completed ?? false

        await db.transaction(async tx => {
          await tx.insert(submission).values({ userId, kataId, code, passed })

          if (!passed) return

          if (prev) {
            await tx
              .update(userProgress)
              .set({ completed: true, xpEarned: XP_PER_KATA, lastAttemptAt: new Date() })
              .where(and(eq(userProgress.userId, userId), eq(userProgress.kataId, kataId)))
          } else {
            await tx
              .insert(userProgress)
              .values({ userId, kataId, completed: true, xpEarned: XP_PER_KATA })
          }

          if (alreadyCompleted) return

          await tx.insert(xpEvent).values({ userId, amount: XP_PER_KATA, reason: 'kata_complete' })

          const today = new Date().toISOString().split('T')[0]
          await tx
            .insert(userStats)
            .values({
              userId,
              totalXp: XP_PER_KATA,
              currentStreak: 1,
              longestStreak: 1,
              lastActivityDate: today
            })
            .onConflictDoUpdate({
              target: userStats.userId,
              set: {
                totalXp: sql`${userStats.totalXp} + ${XP_PER_KATA}`,
                currentStreak: sql`CASE
                  WHEN ${userStats.lastActivityDate} = CURRENT_DATE - INTERVAL '1 day' THEN ${userStats.currentStreak} + 1
                  WHEN ${userStats.lastActivityDate} = CURRENT_DATE THEN ${userStats.currentStreak}
                  ELSE 1 END`,
                longestStreak: sql`GREATEST(${userStats.longestStreak}, CASE
                  WHEN ${userStats.lastActivityDate} = CURRENT_DATE - INTERVAL '1 day' THEN ${userStats.currentStreak} + 1
                  ELSE 1 END)`,
                lastActivityDate: today
              }
            })
        })

        const xpEarned = alreadyCompleted ? 0 : XP_PER_KATA
        log.info('submission recorded', { kataId, passed, xpEarned })
        return Response.json({ requiresAuth: false, xpEarned })
      },

      GET: async ({ request }) => {
        const session = await createAuth().api.getSession({ headers: request.headers })
        if (!session) {
          return Response.json([], { status: 200 })
        }

        const url = new URL(request.url)
        const parsed = KataIdSchema.safeParse({ kataId: url.searchParams.get('kataId') })
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const { kataId } = parsed.data
        log.debug('getSubmissions', { kataId, userId: session.user.id })
        const db = createDb()
        const submissions = await db.query.submission.findMany({
          where: (s, { and, eq }) => and(eq(s.userId, session.user.id), eq(s.kataId, kataId)),
          orderBy: (s, { desc }) => desc(s.submittedAt)
        })
        return Response.json(submissions)
      }
    }
  }
})
