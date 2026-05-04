'use client'

import { cn } from '#/lib/utils'
import { Link, useRouterState } from '@tanstack/react-router'
import { Home, ScrollText, Trophy, User } from 'lucide-react'

const tabs = [
  { to: '/dashboard', label: 'Home', Icon: Home },
  { to: '/', label: 'Katas', Icon: ScrollText },
  { to: '/ranks', label: 'Ranks', Icon: Trophy },
  { to: '/profile', label: 'Profile', Icon: User }
] as const

export function BottomNav() {
  const pathname = useRouterState({ select: s => s.location.pathname })

  // Hide on kata editor pages (give editor full screen)
  if (pathname.startsWith('/kata/')) return null

  return (
    <nav className="border-border bg-card/95 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-start justify-around border-t pt-2 backdrop-blur-sm md:hidden">
      {tabs.map(({ to, label, Icon }) => {
        const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
        return (
          <Link key={to} to={to} className="flex flex-1 flex-col items-center gap-0.5">
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
      })}
    </nav>
  )
}
