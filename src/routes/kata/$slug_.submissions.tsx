import { Badge } from '#/components/ui/badge'
import { getKata } from '#/server/kata'
import { getKataSubmissions } from '#/server/submission'
import { createFileRoute, Link, notFound, redirect } from '@tanstack/react-router'
import { getSession } from '#/server/auth'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/kata/$slug_/submissions')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/' })
  },
  loader: async ({ params }) => {
    const kata = await getKata({ data: { slug: params.slug } })
    if (!kata) throw notFound()
    const submissions = await getKataSubmissions({ data: { kataId: kata.id } })
    return { kata, submissions }
  },
  notFoundComponent: () => (
    <div className="text-muted-foreground flex h-screen items-center justify-center">
      Kata not found
    </div>
  ),
  component: SubmissionsPage
})

function SubmissionsPage() {
  const { kata, submissions } = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        to="/kata/$slug"
        params={{ slug: kata.slug }}
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {kata.title}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{kata.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {submissions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No submissions yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {submissions.map((s, i) => (
            <div key={s.id} className="rounded-lg border">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <span className="text-muted-foreground text-xs">
                  #{submissions.length - i} &mdash; {new Date(s.submittedAt).toLocaleString()}
                </span>
                <Badge variant={s.passed ? 'default' : 'secondary'}>
                  {s.passed ? 'Passed' : 'Failed'}
                </Badge>
              </div>
              <pre className="overflow-x-auto p-4 text-sm">
                <code>{s.code}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
