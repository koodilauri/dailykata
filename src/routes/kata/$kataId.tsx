import { KataEditor } from '#/components/editor/KataEditor'
import { KataSidebar } from '#/components/editor/KataSidebar'
import { getUserProgress } from '#/server/progress'
import { getKata, getKatasForSection, getNextSection } from '#/server/kata'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/kata/$kataId')({
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
  const { kata, sectionKatas, nextSection, completedIds, sectionComplete } = Route.useLoaderData()

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <div className="hidden md:flex">
        <KataSidebar
          katas={sectionKatas}
          completedIds={completedIds}
          activeId={kata.id}
          sectionTitle={kata.sectionId ?? undefined}
          sectionComplete={sectionComplete}
          nextSection={nextSection}
        />
      </div>
      <KataEditor key={kata.id} kata={kata} katas={sectionKatas} />
    </div>
  )
}
