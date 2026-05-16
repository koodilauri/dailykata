import { createFileRoute } from '@tanstack/react-router'
import { DEMO_KATAS } from '#/lib/demo-katas'
import { DemoKataEditor } from '#/components/editor/DemoKataEditor'

export const Route = createFileRoute('/demo/$slug')({
  component: DemoKataPage
})

function DemoKataPage() {
  const { slug } = Route.useParams()
  const kata = DEMO_KATAS.find(k => k.slug === slug)

  if (!kata) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Kata not found.</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <DemoKataEditor kata={kata} katas={DEMO_KATAS} />
    </div>
  )
}
