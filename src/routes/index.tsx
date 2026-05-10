import { cn } from '#/lib/utils'
import { getSections } from '#/server/kata'
import { getUserProgress } from '#/server/progress'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

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

const difficultyTag: Record<string, string> = {
  easy: 'text-emerald-400 bg-emerald-500/12 border-emerald-500/25',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20'
}

function KataList() {
  const { sections, progress } = Route.useLoaderData()
  const completedIds = new Set(progress.map(p => p.kataId))

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
              {/* Section header */}
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-base font-bold tracking-tight">{sec.title}</h2>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {sectionDone}/{sec.katas.length}
                </span>
              </div>

              {/* Section progress bar */}
              <div className="bg-secondary mb-4 h-1.5 overflow-hidden rounded-full">
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
                  const isNext = !done && sec.katas.slice(0, i).every(k => completedIds.has(k.id))
                  return (
                    <li
                      key={kata.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <Link
                        to="/kata/$kataId"
                        params={{ kataId: kata.id }}
                        className={cn(
                          'group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border p-4 transition-all duration-200',
                          done
                            ? 'border-emerald-500/20 bg-emerald-500/5 opacity-75'
                            : 'border-border bg-card hover:-translate-y-px hover:border-sky-500/40 hover:bg-sky-500/5'
                        )}
                      >
                        {isNext && (
                          <div className="absolute top-0 bottom-0 left-0 w-0.5 rounded-r-full bg-sky-500" />
                        )}

                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl',
                            difficultyIconBg[kata.difficulty]
                          )}
                        >
                          {difficultyIcon[kata.difficulty]}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-muted-foreground text-xs tabular-nums">
                              #{kata.order}
                            </span>
                            <span
                              className={cn(
                                'rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                                difficultyTag[kata.difficulty]
                              )}
                            >
                              {kata.difficulty}
                            </span>
                          </div>
                          <div
                            className={cn(
                              'text-sm leading-tight font-semibold',
                              done && 'text-muted-foreground line-through'
                            )}
                          >
                            {kata.title}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                          <span className="text-xs font-bold text-sky-400">+100 XP</span>
                          {done ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-black">
                              ✓
                            </div>
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
    </div>
  )
}
