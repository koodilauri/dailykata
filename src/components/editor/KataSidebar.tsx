'use client'

import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import { useSidebar } from '#/components/editor/sidebar-context'
import { signIn } from '#/lib/auth-client'
import { ChevronLeft, LogIn, Trophy } from 'lucide-react'

interface SidebarKata {
  id: string
  slug: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
}

interface NextSection {
  id: string
  title: string
  firstKataSlug: string | null
}

interface Props {
  katas: SidebarKata[]
  completedIds: string[]
  activeId: string
  sectionTitle?: string
  sectionComplete?: boolean
  nextSection?: NextSection | null
}

const difficultyDot: Record<SidebarKata['difficulty'], string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-red-500'
}

export function KataSidebar({
  katas,
  completedIds,
  activeId,
  sectionTitle,
  sectionComplete,
  nextSection
}: Props) {
  const { open, toggle, isLoggedIn } = useSidebar()

  if (!open) return null

  return (
    <div className="border-border bg-card flex h-full w-[240px] shrink-0 flex-col border-r">
      <button
        onClick={toggle}
        className="border-border text-muted-foreground hover:text-foreground hover:bg-accent flex h-12 w-full shrink-0 items-center border-b px-2.5 transition-colors"
        aria-label="Collapse sidebar"
      >
        <ChevronLeft className="h-4 w-4 shrink-0" />
        {sectionTitle && (
          <span className="ml-2 truncate text-xs font-semibold tracking-wide capitalize">
            {sectionTitle}
          </span>
        )}
      </button>

      <ScrollArea className="flex-1">
        <ul className="px-2 py-2">
          {katas.map(k => {
            const completed = completedIds.includes(k.id)
            const active = k.id === activeId
            return (
              <li key={k.id}>
                <Link
                  to="/kata/$slug"
                  params={{ slug: k.slug }}
                  className={cn(
                    'hover:bg-accent flex items-center gap-2 rounded-lg px-2 py-2 text-xs transition-colors',
                    active && 'border-border bg-accent border'
                  )}
                >
                  <span className="text-muted-foreground w-4 shrink-0 text-right text-[11px]">
                    {k.order}
                  </span>
                  <span
                    className={cn('h-1.5 w-1.5 shrink-0 rounded-full', difficultyDot[k.difficulty])}
                  />
                  <span className={cn('flex-1 truncate font-medium', active && 'text-sky-400')}>
                    {k.title}
                  </span>
                  {completed ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black">
                      ✓
                    </span>
                  ) : (
                    <span className="border-border h-4 w-4 shrink-0 rounded-full border-2" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {!isLoggedIn && (
          <div className="mx-2 mb-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="mb-2 text-[11px] font-semibold text-emerald-400">
              Sign in to save progress
            </p>
            <button
              onClick={() =>
                signIn.social({ provider: 'github', callbackURL: window.location.pathname })
              }
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/15"
            >
              <LogIn className="h-3 w-3 shrink-0" />
              Sign in with GitHub
            </button>
          </div>
        )}

        {sectionComplete && (
          <div className="mx-2 mb-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-3">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Section Complete!</span>
            </div>
            {nextSection ? (
              nextSection.firstKataSlug ? (
                <Link
                  to="/kata/$slug"
                  params={{ slug: nextSection.firstKataSlug }}
                  className="mt-1 block rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-center text-xs font-semibold text-sky-400 transition-colors hover:border-sky-500/50 hover:bg-sky-500/15"
                >
                  Start {nextSection.title} →
                </Link>
              ) : (
                <p className="text-muted-foreground text-[11px]">Next: {nextSection.title}</p>
              )
            ) : (
              <p className="text-[11px] font-medium text-emerald-300">
                You&apos;ve completed all sections!
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
