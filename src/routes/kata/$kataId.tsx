import { KataEditor } from '#/components/editor/KataEditor'
import { KataSidebar } from '#/components/editor/KataSidebar'
import { getUserProgress, getUserStats } from '#/server/progress'
import { getKata, getKatas } from '#/server/kata'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/kata/$kataId')({
  loader: async ({ params }) => {
    const [kata, katas, progress, stats] = await Promise.all([
      getKata({ data: { kataId: params.kataId } }),
      getKatas(),
      getUserProgress(),
      getUserStats()
    ])
    if (!kata) throw notFound()
    const completedIds = progress.map(p => p.kataId)
    return { kata, katas, completedIds, stats: stats ?? null }
  },
  notFoundComponent: () => (
    <div className="text-muted-foreground flex h-screen items-center justify-center">
      Kata not found
    </div>
  ),
  component: KataPage
})

function KataPage() {
  const { kata, katas, completedIds, stats } = Route.useLoaderData()
  return (
    <div className="flex h-[calc(100vh-3rem)]">
      <KataSidebar katas={katas} completedIds={completedIds} activeId={kata.id} stats={stats} />
      <KataEditor kata={kata} katas={katas} />
    </div>
  )
}
