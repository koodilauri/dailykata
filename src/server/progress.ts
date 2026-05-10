import { kata, section, user, userProgress, userStats, xpEvent } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { logger } from '#/lib/logger'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, asc, desc, eq } from 'drizzle-orm'

const log = logger.withTag('progress')

export const getUserStats = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await createAuth().api.getSession({ headers: request.headers })
  if (!session) return null
  log.debug('getUserStats', { userId: session.user.id })
  const db = createDb()
  return db.query.userStats.findFirst({
    where: (s, { eq }) => eq(s.userId, session.user.id)
  })
})

export const getUserProgress = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await createAuth().api.getSession({ headers: request.headers })
  if (!session) return []
  log.debug('getUserProgress', { userId: session.user.id })
  const db = createDb()
  return db
    .select({
      kataId: userProgress.kataId,
      completed: userProgress.completed,
      xpEarned: userProgress.xpEarned,
      lastAttemptAt: userProgress.lastAttemptAt,
      kataTitle: kata.title,
      kataDifficulty: kata.difficulty,
      kataOrder: kata.order
    })
    .from(userProgress)
    .innerJoin(kata, eq(userProgress.kataId, kata.id))
    .leftJoin(section, eq(kata.sectionId, section.id))
    .where(and(eq(userProgress.userId, session.user.id), eq(userProgress.completed, true)))
    .orderBy(asc(section.order), asc(kata.order))
})

export const getNextKata = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await createAuth().api.getSession({ headers: request.headers })
  if (!session) return null
  const db = createDb()
  const completed = await db
    .select({ kataId: userProgress.kataId })
    .from(userProgress)
    .where(and(eq(userProgress.userId, session.user.id), eq(userProgress.completed, true)))
  const completedSet = new Set(completed.map(r => r.kataId))
  const katas = await db
    .select({ id: kata.id, title: kata.title })
    .from(kata)
    .leftJoin(section, eq(kata.sectionId, section.id))
    .where(eq(kata.published, true))
    .orderBy(asc(section.order), asc(kata.order))
  return katas.find(k => !completedSet.has(k.id)) ?? null
})

export const deleteAccount = createServerFn({ method: 'POST' }).handler(async () => {
  const request = getRequest()
  const auth = createAuth()
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) throw new Error('Unauthorized')
  const db = createDb()
  await db.delete(xpEvent).where(eq(xpEvent.userId, session.user.id))
  await db.delete(userStats).where(eq(userStats.userId, session.user.id))
  await auth.api.deleteUser({ headers: request.headers, body: {} })
})

export const getRanks = createServerFn({ method: 'GET' }).handler(async () => {
  log.debug('getRanks')
  const db = createDb()
  return db
    .select({
      userId: userStats.userId,
      name: user.name,
      image: user.image,
      totalXp: userStats.totalXp,
      currentStreak: userStats.currentStreak
    })
    .from(userStats)
    .innerJoin(user, eq(userStats.userId, user.id))
    .orderBy(desc(userStats.totalXp))
    .limit(20)
})
