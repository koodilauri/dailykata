import { KataEditor } from '#/components/editor/KataEditor'
import { KataPageSkeleton } from '#/components/editor/KataPageSkeleton'
import { getUserProgress } from '#/server/progress'
import { getKata, getKatasForSection, getNextSection } from '#/server/kata'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/kata/$kataId')({
  pendingComponent: KataPageSkeleton,
  pendingMs: 0,
  pendingMinMs: 300,
  loader: async ({ params }) => {
    const kata = await getKata({ data: { kataId: params.kataId } })
    if (!kata) throw notFound()

    const sectionId = kata.sectionId ?? null
    const [sectionKatas, nextSection, progress] = await Promise.all([
      sectionId ? getKatasForSection({ data: { sectionId } }) : Promise.resolve([]),
      sectionId ? getNextSection({ data: { currentSectionId: sectionId } }) : Promise.resolve(null),
      getUserProgress()
    ])

    const completedIds = progress.map(p => p.kataId)
    const sectionComplete =
      sectionKatas.length > 0 && sectionKatas.every(k => completedIds.includes(k.id))

    return { kata, sectionKatas, nextSection, completedIds, sectionComplete, sectionId }
  },
  notFoundComponent: () => (
    <div className="text-muted-foreground flex h-screen items-center justify-center">
      Kata not found
    </div>
  ),
  component: KataPage
})

function KataPage() {
  const { kata, sectionKatas } = Route.useLoaderData()

  return <KataEditor key={kata.id} kata={kata} katas={sectionKatas} />
}
