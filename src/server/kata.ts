import { kata, section } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { logger } from '#/lib/logger'
import {
  KataIdSchema,
  KataInputSchema,
  KataSlugSchema,
  TogglePublishSchema,
  UpdateKataSchema
} from '#/lib/schemas'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, asc, eq } from 'drizzle-orm'
import { z } from 'zod'

const log = logger.withTag('kata')

export const getKata = createServerFn({ method: 'GET' })
  .inputValidator(d => KataSlugSchema.parse(d))
  .handler(async ({ data }) => {
    log.debug('getKata', { slug: data.slug })
    const db = createDb()
    return db.query.kata.findFirst({
      where: (k, { and, eq }) => and(eq(k.slug, data.slug), eq(k.published, true))
    })
  })

export const getKatas = createServerFn({ method: 'GET' }).handler(async () => {
  log.debug('getKatas')
  const db = createDb()
  return db
    .select({
      id: kata.id,
      slug: kata.slug,
      title: kata.title,
      difficulty: kata.difficulty,
      order: kata.order
    })
    .from(kata)
    .leftJoin(section, eq(kata.sectionId, section.id))
    .where(eq(kata.published, true))
    .orderBy(asc(section.order), asc(kata.order))
})

export const getSections = createServerFn({ method: 'GET' }).handler(async () => {
  log.debug('getSections')
  const db = createDb()
  const rows = await db
    .select({
      sectionId: section.id,
      sectionTitle: section.title,
      sectionOrder: section.order,
      kataId: kata.id,
      kataSlug: kata.slug,
      kataTitle: kata.title,
      kataDifficulty: kata.difficulty,
      kataOrder: kata.order
    })
    .from(section)
    .leftJoin(kata, and(eq(kata.sectionId, section.id), eq(kata.published, true)))
    .orderBy(asc(section.order), asc(kata.order))

  const sectionMap = new Map<
    string,
    {
      id: string
      title: string
      order: number
      katas: {
        id: string
        slug: string
        title: string
        difficulty: 'easy' | 'medium' | 'hard'
        order: number
      }[]
    }
  >()
  for (const row of rows) {
    if (!sectionMap.has(row.sectionId)) {
      sectionMap.set(row.sectionId, {
        id: row.sectionId,
        title: row.sectionTitle,
        order: row.sectionOrder,
        katas: []
      })
    }
    if (row.kataId) {
      sectionMap.get(row.sectionId)!.katas.push({
        id: row.kataId,
        slug: row.kataSlug!,
        title: row.kataTitle!,
        difficulty: row.kataDifficulty! as 'easy' | 'medium' | 'hard',
        order: row.kataOrder!
      })
    }
  }
  return [...sectionMap.values()]
})

const SectionIdSchema = z.object({ sectionId: z.string().min(1) })

const sectionKatasCache = new Map<string, ReturnType<typeof fetchKatasForSection>>()
const nextSectionCache = new Map<string, ReturnType<typeof fetchNextSection>>()

async function fetchKatasForSection(sectionId: string) {
  const db = createDb()
  return db.query.kata.findMany({
    where: (k, { and, eq }) => and(eq(k.sectionId, sectionId), eq(k.published, true)),
    orderBy: (k, { asc }) => asc(k.order),
    columns: { id: true, slug: true, title: true, difficulty: true, order: true }
  })
}

async function fetchNextSection(currentSectionId: string) {
  const db = createDb()
  const current = await db.query.section.findFirst({
    where: (s, { eq }) => eq(s.id, currentSectionId)
  })
  if (!current) return null
  const next = await db.query.section.findFirst({
    where: (s, { gt }) => gt(s.order, current.order),
    orderBy: (s, { asc }) => asc(s.order)
  })
  if (!next) return null
  const firstKata = await db.query.kata.findFirst({
    where: (k, { and, eq }) => and(eq(k.sectionId, next.id), eq(k.published, true)),
    orderBy: (k, { asc }) => asc(k.order),
    columns: { id: true, slug: true }
  })
  return {
    id: next.id,
    title: next.title,
    firstKataId: firstKata?.id ?? null,
    firstKataSlug: firstKata?.slug ?? null
  }
}

export const getKatasForSection = createServerFn({ method: 'GET' })
  .inputValidator(d => SectionIdSchema.parse(d))
  .handler(async ({ data }) => {
    log.debug('getKatasForSection', { sectionId: data.sectionId })
    let cached = sectionKatasCache.get(data.sectionId)
    if (!cached) {
      cached = fetchKatasForSection(data.sectionId)
      sectionKatasCache.set(data.sectionId, cached)
    }
    return cached
  })

export const getNextSection = createServerFn({ method: 'GET' })
  .inputValidator(d => z.object({ currentSectionId: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    log.debug('getNextSection', { currentSectionId: data.currentSectionId })
    let cached = nextSectionCache.get(data.currentSectionId)
    if (!cached) {
      cached = fetchNextSection(data.currentSectionId)
      nextSectionCache.set(data.currentSectionId, cached)
    }
    return cached
  })

// --- Admin functions (require admin role) ---

async function requireAdmin() {
  const request = getRequest()
  const session = await createAuth().api.getSession({ headers: request.headers })
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    log.warn('requireAdmin: forbidden')
    throw new Error('Forbidden')
  }
  return session
}

export const getAllKatas = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()
  log.debug('getAllKatas')
  const db = createDb()
  return db.query.kata.findMany({ orderBy: (k, { asc }) => asc(k.order) })
})

export const createKata = createServerFn({ method: 'POST' })
  .inputValidator(d => KataInputSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin()
    const db = createDb()
    const [created] = await db.insert(kata).values(data).returning({ id: kata.id })
    log.info('kata created', { id: created.id, title: data.title })
    return created
  })

export const updateKata = createServerFn({ method: 'POST' })
  .inputValidator(d => UpdateKataSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin()
    const { id, ...fields } = data
    const db = createDb()
    await db.update(kata).set(fields).where(eq(kata.id, id))
    log.info('kata updated', { id, title: fields.title })
  })

export const togglePublish = createServerFn({ method: 'POST' })
  .inputValidator(d => TogglePublishSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin()
    const db = createDb()
    await db.update(kata).set({ published: data.published }).where(eq(kata.id, data.id))
    log.info('kata publish toggled', { id: data.id, published: data.published })
  })

export const getKataForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(d => KataIdSchema.parse(d))
  .handler(async ({ data }) => {
    await requireAdmin()
    log.debug('getKataForAdmin', { kataId: data.kataId })
    const db = createDb()
    return db.query.kata.findFirst({ where: (k, { eq }) => eq(k.id, data.kataId) })
  })
