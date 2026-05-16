import { cn } from '#/lib/utils'
import { getLocalCompleted } from '#/lib/local-progress'
import { getSections } from '#/server/kata'
import { getUserProgress } from '#/server/progress'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [sections, progress] = await Promise.all([getSections(), getUserProgress()])
    return { sections, progress }
  },
  component: KataList
})

const difficultyIcon: Record<string, string> = {
  easy: '🌿',
  medium: '⚡',
  hard: '🔥'
}

const difficultyIconBg: Record<string, string> = {
  easy: 'bg-emerald-500/12',
  medium: 'bg-amber-500/10',
  hard: 'bg-red-500/10'
}

function KataList() {
  const { sections, progress } = Route.useLoaderData()
  const [localCompleted, setLocalCompleted] = useState<Set<string>>(new Set())
  useEffect(() => {
    setLocalCompleted(new Set(getLocalCompleted()))
  }, [])

  const serverCompleted = new Set(progress.map(p => p.kataId))
  const completedIds = localCompleted.size
    ? new Set([...serverCompleted, ...localCompleted])
    : serverCompleted
  const nextKataId = sections.flatMap(s => s.katas).find(k => !completedIds.has(k.id))?.id ?? null

  const nextKataRef = useRef<HTMLLIElement>(null)
  const [showBackButton, setShowBackButton] = useState(false)

  useEffect(() => {
    if (!nextKataRef.current) return
    nextKataRef.current.scrollIntoView({ block: 'center' })
    const el = nextKataRef.current
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setShowBackButton(!entry.isIntersecting),
        { threshold: 0.5 }
      )
      observer.observe(el)
      return () => observer.disconnect()
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="flex flex-col gap-10">
        {sections.map(sec => {
          const sectionDone = sec.katas.filter(k => completedIds.has(k.id)).length
          const sectionPct =
            sec.katas.length > 0 ? Math.round((sectionDone / sec.katas.length) * 100) : 0
          const allDone = sectionDone === sec.katas.length && sec.katas.length > 0

          return (
            <section key={sec.id}>
              {/* Section header — sticky on mobile */}
              <div className="bg-background/95 border-border/50 sticky top-12 z-10 -mx-4 mb-4 border-b px-4 py-2 backdrop-blur-sm md:static md:top-auto md:mx-0 md:mb-2 md:border-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold tracking-tight">{sec.title}</h2>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {sectionDone}/{sec.katas.length}
                  </span>
                </div>
                {/* Progress bar — shown in sticky header on mobile */}
                <div className="bg-secondary mt-2 h-1 overflow-hidden rounded-full md:hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-700',
                      allDone ? 'bg-emerald-500' : 'bg-sky-500'
                    )}
                    style={{ width: `${sectionPct}%` }}
                  />
                </div>
              </div>

              {/* Section progress bar — desktop only */}
              <div className="bg-secondary mb-4 hidden h-1.5 overflow-hidden rounded-full md:block">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700',
                    allDone ? 'bg-emerald-500' : 'bg-sky-500'
                  )}
                  style={{ width: `${sectionPct}%` }}
                />
              </div>

              <ul className="flex flex-col gap-3">
                {sec.katas.map((kata, i) => {
                  const done = completedIds.has(kata.id)
                  const isNext = kata.id === nextKataId
                  return (
                    <li
                      key={kata.id}
                      ref={isNext ? nextKataRef : undefined}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <Link
                        to="/kata/$slug"
                        params={{ slug: kata.slug }}
                        className={cn(
                          'group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border p-4 transition-all duration-200',
                          done
                            ? 'border-emerald-500/20 bg-emerald-500/5 opacity-75'
                            : isNext
                              ? 'border-sky-500/50 bg-sky-500/8 hover:-translate-y-px hover:border-sky-500/70 hover:bg-sky-500/12'
                              : 'border-border bg-card hover:-translate-y-px hover:border-sky-500/40 hover:bg-sky-500/5'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl',
                            difficultyIconBg[kata.difficulty]
                          )}
                        >
                          {difficultyIcon[kata.difficulty]}
                        </div>

                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                            #{kata.order}
                          </span>
                          <span
                            className={cn(
                              'truncate text-base leading-tight font-semibold',
                              done && 'text-muted-foreground line-through'
                            )}
                          >
                            {kata.title}
                          </span>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          {done ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-black">
                              ✓
                            </div>
                          ) : isNext ? (
                            <span className="text-[10px] font-bold tracking-wide text-sky-400 uppercase">
                              ▶ Continue
                            </span>
                          ) : (
                            <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-400" />
                          )}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      {showBackButton && nextKataId && (
        <button
          onClick={() =>
            nextKataRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-400 shadow-lg backdrop-blur-sm transition hover:bg-sky-500/20 md:bottom-8"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
