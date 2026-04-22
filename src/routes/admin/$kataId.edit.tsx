import { KataForm, type KataFormData } from '#/components/admin/KataForm'
import { getSession } from '#/server/auth'
import { getKataForAdmin, updateKata } from '#/server/kata'
import { createFileRoute, notFound, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/$kataId/edit')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  loader: async ({ params }) => {
    const kata = await getKataForAdmin({ data: { kataId: params.kataId } })
    if (!kata) throw notFound()
    return kata
  },
  notFoundComponent: () => (
    <div className="text-muted-foreground flex h-screen items-center justify-center">
      Kata not found
    </div>
  ),
  component: EditKata
})

function EditKata() {
  const kata = Route.useLoaderData()
  const navigate = useNavigate()

  async function handleSubmit(form: KataFormData) {
    const hints = form.hints
      .split('\n')
      .map(h => h.trim())
      .filter(Boolean)
    await updateKata({ data: { id: kata.id, ...form, hints } })
    await navigate({ to: '/admin' })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Edit kata</h1>
      <KataForm
        initial={{
          ...kata,
          hints: (kata.hints ?? []).join('\n')
        }}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  )
}
