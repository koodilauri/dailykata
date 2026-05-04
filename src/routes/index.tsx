import { cn } from '#/lib/utils'
import { getKatas } from '#/server/kata'
import { getUserProgress } from '#/server/progress'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    const session = (context as { session?: unknown }).session
    const [katas, progress] = await Promise.all([
      getKatas(),
      session ? getUserProgress() : Promise.resolve([])
    ])
    return { katas, progress }
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
  const { katas, progress } = Route.useLoaderData()
  const completedIds = new Set(progress.map(p => p.kataId))

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Katas</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {completedIds.size} / {katas.length} completed
          </p>
        </div>
        {completedIds.size > 0 && (
          <div className="text-right">
            <div className="text-xs font-bold text-sky-400">
              {Math.round((completedIds.size / katas.length) * 100)}%
            </div>
            <div className="bg-secondary mt-1 h-1.5 w-20 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-700"
                style={{ width: `${Math.round((completedIds.size / katas.length) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {katas.map((kata, i) => {
          const done = completedIds.has(kata.id)
          return (
            <li key={kata.id} className="animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
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
                {/* left accent on active/next kata */}
                {!done && i === [...completedIds].length && (
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
    </div>
  )
}
