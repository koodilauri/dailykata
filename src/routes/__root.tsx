import { Button } from '#/components/ui/button'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import { signIn, signOut } from '#/lib/auth-client'
import { getSession } from '#/server/auth'
import { getUserStats } from '#/server/progress'
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Terminal } from 'lucide-react'

import appCss from '../styles.css?url'

const XP_PER_LEVEL = 500

export const Route = createRootRoute({
  loader: async () => {
    const [session, stats] = await Promise.all([getSession(), getUserStats()])
    return { session, stats }
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'dailykata' }
    ],
    links: [{ rel: 'stylesheet', href: appCss }]
  }),
  shellComponent: RootDocument,
  component: RootLayout
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  const { session, stats } = Route.useLoaderData()
  const user = session?.user as
    | { role?: string; name?: string | null; email: string; image?: string | null }
    | undefined

  const totalXp = stats?.totalXp ?? 0
  const currentStreak = stats?.currentStreak ?? 0
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpIntoLevel = totalXp % XP_PER_LEVEL
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)

  return (
    <>
      <header className="border-border bg-card sticky top-0 z-50 flex h-12 items-center gap-4 border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-md">
            <Terminal className="text-primary-foreground h-3.5 w-3.5" />
          </div>
          <span className="from-foreground to-primary bg-linear-to-r bg-clip-text font-semibold tracking-tight text-transparent">
            dailykata
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {user && (
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-1.5 text-sm transition-colors"
            >
              Admin
            </Link>
          )}

          {user && (
            <>
              {/* Level badge */}
              <div className="border-border bg-secondary flex items-center gap-2 rounded-full border px-3 py-1">
                <span className="text-sm font-bold text-sky-400">Lv {level}</span>
                <div className="flex flex-col gap-0.5">
                  <div className="bg-muted h-1 w-20 overflow-hidden rounded-full">
                    <div
                      className="h-1 rounded-full bg-sky-500 transition-all duration-700"
                      style={{ width: `${xpPct}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    {xpIntoLevel}/{XP_PER_LEVEL} XP
                  </span>
                </div>
              </div>

              {/* Streak pill */}
              <div className="rounded-full border border-orange-900/50 bg-linear-to-r from-orange-950 to-red-950 px-3 py-1 text-xs font-bold text-amber-400">
                🔥 {currentStreak}
              </div>

              {/* Avatar */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-600 to-violet-500 text-xs font-bold text-white">
                {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
              </div>
            </>
          )}

          {session ? (
            <Button
              size="sm"
              variant="outline"
              className="border-border ml-1"
              onClick={() =>
                signOut({ fetchOptions: { onSuccess: () => window.location.assign('/') } })
              }
            >
              Sign out
            </Button>
          ) : (
            <Button
              size="sm"
              className="ml-1"
              onClick={() =>
                signIn.social({ provider: 'github', callbackURL: window.location.pathname })
              }
            >
              Sign in with GitHub
            </Button>
          )}
        </div>
      </header>
      <Outlet />
    </>
  )
}
