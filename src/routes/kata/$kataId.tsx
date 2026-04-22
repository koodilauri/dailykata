import { KataEditor } from '#/components/editor/KataEditor'
import { getKata } from '#/server/kata'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/kata/$kataId')({
  loader: async ({ params }) => {
    const kata = await getKata({ data: { kataId: params.kataId } })
    if (!kata) throw notFound()
    return kata
  },
  notFoundComponent: () => (
    <div className="text-muted-foreground flex h-screen items-center justify-center">
      Kata not found
    </div>
  ),
  component: KataPage
})

function KataPage() {
  const kata = Route.useLoaderData()
  return <KataEditor kata={kata} />
}
