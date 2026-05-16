import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { DEMO_KATAS } from '#/lib/demo-katas'
import { getLocalCompleted } from '#/lib/local-progress'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/demo/')({
  component: DemoKataList
})

const DIFFICULTY_COLOR = {
  easy: 'text-emerald-400',
  medium: 'text-amber-400',
  hard: 'text-red-400'
}

function DemoKataList() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCompleted(new Set(getLocalCompleted()))
  }, [])

  const completedCount = DEMO_KATAS.filter(k => completed.has(k.id)).length

  return (
    <div className="flex min-h-screen flex-col">
      {/* Demo banner */}
      <div className="border-b border-sky-500/20 bg-sky-500/10 px-4 py-2.5 text-center text-sm">
        <span className="text-muted-foreground">Demo mode — progress saved locally. </span>
        <Link
          to="/gate"
          className="font-semibold text-sky-400 transition-colors hover:text-sky-300"
        >
          Get beta access →
        </Link>
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="from-foreground to-primary bg-linear-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            dailykata
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {completedCount}/{DEMO_KATAS.length} completed
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {DEMO_KATAS.map(kata => {
            const done = completed.has(kata.id)
            return (
              <Link
                key={kata.id}
                to="/demo/$slug"
                params={{ slug: kata.slug }}
                className={cn(
                  'border-border bg-card group hover:bg-accent/50 flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors',
                  done && 'border-emerald-500/30'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
                    done
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                      : 'border-border text-muted-foreground'
                  )}
                >
                  {done ? '✓' : kata.order}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="leading-tight font-semibold">{kata.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    ~{kata.estimatedMinutes} min
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 text-xs font-semibold capitalize',
                    DIFFICULTY_COLOR[kata.difficulty]
                  )}
                >
                  {kata.difficulty}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
