import { z } from 'zod'

export const KataIdSchema = z.object({
  kataId: z.string().min(1)
})

export const KataSlugSchema = z.object({
  slug: z.string().min(1)
})

export const SubmitKataSchema = z.object({
  kataId: z.string().min(1),
  code: z.string().min(1).max(100_000),
  passed: z.boolean()
})

export const KataInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens'),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  starterCode: z.string().min(1),
  tests: z.string().min(1),
  hints: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  order: z.number().int().min(0),
  published: z.boolean()
})

export const UpdateKataSchema = KataInputSchema.extend({
  id: z.string().min(1)
})

export const TogglePublishSchema = z.object({
  id: z.string().min(1),
  published: z.boolean()
})

export type KataInput = z.infer<typeof KataInputSchema>
export type UpdateKataInput = z.infer<typeof UpdateKataSchema>
export type SubmitKataInput = z.infer<typeof SubmitKataSchema>
