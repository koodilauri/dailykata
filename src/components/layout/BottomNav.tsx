'use client'

import { cn } from '#/lib/utils'
import { signIn } from '#/lib/auth-client'
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, LogIn, ScrollText, PlayCircle, User } from 'lucide-react'

type NavTabProps = {
  to: string
  label: string
  Icon: React.ComponentType<{ className?: string }>
  active: boolean
}

function NavTab({ to, label, Icon, active }: NavTabProps) {
  return (
    <Link to={to} className="flex flex-1 flex-col items-center gap-0.5">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
          active ? 'bg-sky-500/15' : 'bg-transparent'
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5 transition-colors',
            active ? 'text-sky-400' : 'text-muted-foreground'
          )}
        />
      </div>
      <span
        className={cn(
          'text-[10px] font-semibold tracking-wide transition-colors',
          active ? 'text-sky-400' : 'text-muted-foreground'
        )}
      >
        {label}
      </span>
    </Link>
  )
}

interface Props {
  nextKataSlug: string | null
  isLoggedIn: boolean
}

export function BottomNav({ nextKataSlug, isLoggedIn }: Props) {
  const pathname = useRouterState({ select: s => s.location.pathname })
  const continueActive = pathname.startsWith('/kata/')

  if (!isLoggedIn) {
    return (
      <nav className="border-border bg-card/95 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-start justify-around border-t pt-2 backdrop-blur-sm md:hidden">
        <NavTab to="/" label="Katas" Icon={ScrollText} active={pathname === '/'} />
        <button
          onClick={() =>
            signIn.social({ provider: 'github', callbackURL: window.location.pathname })
          }
          className="flex flex-1 flex-col items-center gap-0.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/15">
            <LogIn className="h-5 w-5 text-sky-400" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide text-sky-400">Sign in</span>
        </button>
      </nav>
    )
  }

  return (
    <nav className="border-border bg-card/95 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-start justify-around border-t pt-2 backdrop-blur-sm md:hidden">
      <NavTab to="/dashboard" label="Home" Icon={Home} active={pathname.startsWith('/dashboard')} />
      <NavTab to="/" label="Katas" Icon={ScrollText} active={pathname === '/'} />

      {nextKataSlug ? (
        <Link
          to="/kata/$slug"
          params={{ slug: nextKataSlug }}
          className="flex flex-1 flex-col items-center gap-0.5"
        >
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
              continueActive ? 'bg-sky-500/15' : 'bg-transparent'
            )}
          >
            <PlayCircle
              className={cn(
                'h-5 w-5 transition-colors',
                continueActive ? 'text-sky-400' : 'text-muted-foreground'
              )}
            />
          </div>
          <span
            className={cn(
              'text-[10px] font-semibold tracking-wide transition-colors',
              continueActive ? 'text-sky-400' : 'text-muted-foreground'
            )}
          >
            Continue
          </span>
        </Link>
      ) : (
        <div className="flex flex-1 flex-col items-center gap-0.5 opacity-30">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl">
            <PlayCircle className="text-muted-foreground h-5 w-5" />
          </div>
          <span className="text-muted-foreground text-[10px] font-semibold tracking-wide">
            Continue
          </span>
        </div>
      )}

      <NavTab to="/account" label="Account" Icon={User} active={pathname.startsWith('/account')} />
    </nav>
  )
}
