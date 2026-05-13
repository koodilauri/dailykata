import 'dotenv/config'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { kata, section, userStats, xpEvent } from './schema/kata'

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
const db = drizzle(client)

const KATAS_DIR = join(process.cwd(), 'katas')

function parseNumberedDir(name: string) {
  const match = /^(\d+)_(.+)$/.exec(name)
  if (!match) throw new Error(`Directory "${name}" does not match expected pattern NN_slug`)
  return { order: parseInt(match[1], 10), slug: match[2] }
}

function loadSectionsAndKatas() {
  const sections: { id: string; title: string; order: number }[] = []
  const katas: {
    id: string
    title: string
    difficulty: 'easy' | 'medium' | 'hard'
    estimatedMinutes: number | null
    order: number
    sectionId: string
    published: boolean
    hints: string[] | null
    description: string
    starterCode: string
    tests: string
  }[] = []

  for (const sectionDir of readdirSync(KATAS_DIR).sort()) {
    const sectionPath = join(KATAS_DIR, sectionDir)
    if (!statSync(sectionPath).isDirectory()) continue

    const { order: sectionOrder, slug: sectionSlug } = parseNumberedDir(sectionDir)
    const sectionMeta = JSON.parse(readFileSync(join(sectionPath, 'section.json'), 'utf8')) as {
      title: string
    }

    sections.push({ id: sectionSlug, title: sectionMeta.title, order: sectionOrder })

    for (const kataDir of readdirSync(sectionPath).sort()) {
      const dir = join(sectionPath, kataDir)
      if (!statSync(dir).isDirectory()) continue

      const { order: kataOrder, slug: kataSlug } = parseNumberedDir(kataDir)
      const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8')) as {
        title: string
        difficulty: 'easy' | 'medium' | 'hard'
        estimatedMinutes?: number
        published?: boolean
        hints?: string[]
      }

      katas.push({
        id: kataSlug,
        title: meta.title,
        difficulty: meta.difficulty,
        estimatedMinutes: meta.estimatedMinutes ?? null,
        order: kataOrder,
        sectionId: sectionSlug,
        published: meta.published ?? true,
        hints: meta.hints ?? null,
        description: readFileSync(join(dir, 'description.md'), 'utf8').trim(),
        starterCode: readFileSync(join(dir, 'starter.ts'), 'utf8').trim(),
        tests: readFileSync(join(dir, 'tests.ts'), 'utf8').trim()
      })
    }
  }

  return { sections, katas }
}

async function seed() {
  console.log('Wiping kata data…')
  await db.delete(xpEvent)
  await db.delete(userStats)
  await db.delete(kata)
  await db.delete(section)

  const { sections, katas: kataRows } = loadSectionsAndKatas()

  console.log(`Seeding ${sections.length} sections…`)
  await db.insert(section).values(sections)

  console.log(`Seeding ${kataRows.length} katas…`)
  await db.insert(kata).values(kataRows)

  console.log('Done.')
  await client.end()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
