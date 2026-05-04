import { submission, userProgress, userStats, xpEvent } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { logger } from '#/lib/logger'
import { KataIdSchema, SubmitKataSchema } from '#/lib/schemas'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, eq, sql } from 'drizzle-orm'

const log = logger.withTag('submission')

const XP_PER_KATA = 100

export const submitKata = createServerFn({ method: 'POST' })
  .inputValidator(d => SubmitKataSchema.parse(d))
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await createAuth().api.getSession({ headers: request.headers })
    if (!session) return { requiresAuth: true as const }

    const userId = session.user.id
    log.debug('submitKata', { kataId: data.kataId, passed: data.passed, userId })
    const db = createDb()

    const prev = await db.query.userProgress.findFirst({
      where: (p, { and, eq }) => and(eq(p.userId, userId), eq(p.kataId, data.kataId))
    })
    const alreadyCompleted = prev?.completed ?? false

    await db.transaction(async tx => {
      await tx.insert(submission).values({
        userId,
        kataId: data.kataId,
        code: data.code,
        passed: data.passed
      })

      if (!data.passed) return

      if (prev) {
        await tx
          .update(userProgress)
          .set({ completed: true, xpEarned: XP_PER_KATA, lastAttemptAt: new Date() })
          .where(and(eq(userProgress.userId, userId), eq(userProgress.kataId, data.kataId)))
      } else {
        await tx.insert(userProgress).values({
          userId,
          kataId: data.kataId,
          completed: true,
          xpEarned: XP_PER_KATA
        })
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
    log.info('submission recorded', { kataId: data.kataId, passed: data.passed, xpEarned })
    return { requiresAuth: false as const, xpEarned }
  })

export const getKataSubmissions = createServerFn({ method: 'GET' })
  .inputValidator(d => KataIdSchema.parse(d))
  .handler(async ({ data }) => {
    const request = getRequest()
    const session = await createAuth().api.getSession({ headers: request.headers })
    if (!session) return []
    log.debug('getKataSubmissions', { kataId: data.kataId, userId: session.user.id })
    const db = createDb()
    return db.query.submission.findMany({
      where: (s, { and, eq }) => and(eq(s.userId, session.user.id), eq(s.kataId, data.kataId)),
      orderBy: (s, { desc }) => desc(s.submittedAt)
    })
  })
