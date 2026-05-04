import { kata } from '#/db/schema'
import { createAuth } from '#/lib/auth'
import { createDb } from '#/lib/db'
import { logger } from '#/lib/logger'
import { KataIdSchema, KataInputSchema, TogglePublishSchema, UpdateKataSchema } from '#/lib/schemas'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'

const log = logger.withTag('kata')

export const getKata = createServerFn({ method: 'GET' })
  .inputValidator(d => KataIdSchema.parse(d))
  .handler(async ({ data }) => {
    log.debug('getKata', { kataId: data.kataId })
    const db = createDb()
    return db.query.kata.findFirst({
      where: (k, { and, eq }) => and(eq(k.id, data.kataId), eq(k.published, true))
    })
  })

export const getKatas = createServerFn({ method: 'GET' }).handler(async () => {
  log.debug('getKatas')
  const db = createDb()
  return db.query.kata.findMany({
    where: (k, { eq }) => eq(k.published, true),
    orderBy: (k, { asc }) => asc(k.order),
    columns: { id: true, title: true, difficulty: true, order: true }
  })
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
