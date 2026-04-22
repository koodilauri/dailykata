import { db } from '#/lib/db'
import { createServerFn } from '@tanstack/react-start'

export const getKata = createServerFn({ method: 'GET' })
  .inputValidator((d: { kataId: string }) => d)
  .handler(async ({ data }) => {
    return db.query.kata.findFirst({
      where: (k, { and, eq }) => and(eq(k.id, data.kataId), eq(k.published, true))
    })
  })

export const getKatas = createServerFn({ method: 'GET' }).handler(async () => {
  return db.query.kata.findMany({
    where: (k, { eq }) => eq(k.published, true),
    orderBy: (k, { asc }) => asc(k.order),
    columns: { id: true, title: true, difficulty: true, order: true }
  })
})
