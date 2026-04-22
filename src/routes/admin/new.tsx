import { KataForm, type KataFormData } from '#/components/admin/KataForm'
import { getSession } from '#/server/auth'
import { createKata } from '#/server/kata'
import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/new')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: NewKata
})

function NewKata() {
  const navigate = useNavigate()
  const router = useRouter()

  async function handleSubmit(form: KataFormData) {
    const hints = form.hints
      .split('\n')
      .map(h => h.trim())
      .filter(Boolean)
    await createKata({ data: { ...form, hints } })
    await router.invalidate()
    await navigate({ to: '/admin' })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">New kata</h1>
      <KataForm onSubmit={handleSubmit} submitLabel="Create kata" />
    </div>
  )
}
