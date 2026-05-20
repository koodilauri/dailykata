import { createFileRoute } from '@tanstack/react-router'
import { signCookieValue } from '#/lib/cookie'
import { useState } from 'react'

export const Route = createFileRoute('/gate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.formData()
        const action = body.get('action') as string
        const secret = process.env.BETA_SECRET!

        if (action === 'demo') {
          const signed = await signCookieValue('demo', secret)
          return new Response(null, {
            status: 303,
            headers: {
              Location: '/demo',
              'Set-Cookie': `demo_access=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
            }
          })
        }

        const password = body.get('password') as string
        if (password === process.env.BETA_PASSWORD) {
          const signed = await signCookieValue('beta', secret)
          const headers = new Headers({ Location: '/' })
          headers.append(
            'Set-Cookie',
            `beta_access=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`
          )
          headers.append('Set-Cookie', `demo_access=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
          return new Response(null, { status: 303, headers })
        }

        // Wrong password — re-render with error flag
        return new Response(null, {
          status: 303,
          headers: { Location: '/gate?error=1' }
        })
      }
    }
  },
  validateSearch: (s: Record<string, unknown>) => ({
    error: s.error === '1' ? true : false
  }),
  component: GatePage
})

function GatePage() {
  const { error } = Route.useSearch()
  const [loading, setLoading] = useState(false)

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="border-border bg-card w-full max-w-sm rounded-2xl border p-8">
        <div className="mb-8 text-center">
          <h1 className="from-foreground to-primary bg-linear-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            dailykata
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Access key required</p>
        </div>

        <form
          method="POST"
          action="/gate"
          onSubmit={() => setLoading(true)}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="action" value="password" />
          <input
            name="password"
            type="password"
            placeholder="Access key"
            autoFocus
            className="border-input bg-background focus-visible:ring-ring w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
          />
          {error && <p className="text-destructive text-xs">Incorrect password.</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="bg-border h-px flex-1" />
          <span className="text-muted-foreground text-xs">or</span>
          <div className="bg-border h-px flex-1" />
        </div>

        <form method="POST" action="/gate" onSubmit={() => setLoading(true)}>
          <input type="hidden" name="action" value="demo" />
          <button
            type="submit"
            disabled={loading}
            className="border-border text-muted-foreground hover:text-foreground hover:bg-accent w-full rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-50"
          >
            Try demo (no key) →
          </button>
        </form>
      </div>
    </div>
  )
}
