import { Button } from '#/components/ui/button'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import { signIn, signOut } from '#/lib/auth-client'
import { getSession } from '#/server/auth'
import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  loader: () => getSession(),
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
    <html lang="en">
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
  const session = Route.useLoaderData()
  const user = session?.user as
    | { role?: string; name?: string | null; email: string; image?: string | null }
    | undefined

  return (
    <>
      <header className="flex h-12 items-center gap-4 border-b px-4">
        <Link to="/" className="font-semibold tracking-tight">
          dailykata
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Admin
            </Link>
          )}
          {session ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                signOut({ fetchOptions: { onSuccess: () => window.location.assign('/') } })
              }
            >
              Sign out
            </Button>
          ) : (
            <Button
              size="sm"
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
