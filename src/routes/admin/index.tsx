import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { getSession } from '#/server/auth'
import { getAllKatas, togglePublish } from '#/server/kata'
import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  loader: () => getAllKatas(),
  component: AdminIndex
})

function AdminIndex() {
  const katas = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()

  async function handleToggle(id: string, published: boolean) {
    await togglePublish({ data: { id, published: !published } })
    await router.invalidate()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Kata management</h1>
        <Button size="sm" onClick={() => navigate({ to: '/admin/new' })}>
          <Plus className="mr-1 h-4 w-4" />
          New kata
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {katas.map(kata => (
          <div
            key={kata.id}
            className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
          >
            <span className="text-muted-foreground w-6 text-right">{kata.order}.</span>
            <span className="flex-1 font-medium">{kata.title}</span>
            <Badge
              variant="outline"
              className={
                kata.difficulty === 'easy'
                  ? 'border-green-300 text-green-700'
                  : kata.difficulty === 'medium'
                    ? 'border-yellow-300 text-yellow-700'
                    : 'border-red-300 text-red-700'
              }
            >
              {kata.difficulty}
            </Badge>
            <Badge variant={kata.published ? 'default' : 'secondary'}>
              {kata.published ? 'Published' : 'Draft'}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleToggle(kata.id, kata.published)}
            >
              {kata.published ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate({ to: '/admin/$kataId/edit', params: { kataId: kata.id } })}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
