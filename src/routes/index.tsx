import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import { getKatas } from '#/server/kata'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Code2, Flame, Trophy, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: () => getKatas(),
  pendingComponent: KataListSkeleton,
  component: KataList
})

const difficultyConfig = {
  easy: {
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    dot: 'bg-emerald-500'
  },
  medium: {
    badge: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    dot: 'bg-amber-500'
  },
  hard: {
    badge: 'border-red-500/30 text-red-400 bg-red-500/10',
    dot: 'bg-red-500'
  }
}

const features = [
  { icon: Code2, label: '15 exercises', sub: 'easy → hard' },
  { icon: Zap, label: 'Earn XP', sub: '100 per kata' },
  { icon: Flame, label: 'Build streaks', sub: 'daily practice' },
  { icon: Trophy, label: 'Level up', sub: '500 XP per level' }
]

function KataList() {
  const katas = Route.useLoaderData()

  return (
    <div className="relative min-h-[calc(100vh-3rem)]">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-primary/12 absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-primary/6 absolute top-1/2 -right-48 h-[400px] w-[400px] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4">
        {/* Hero */}
        <div className="animate-fade-up pt-20 pb-12 text-center" style={{ animationDelay: '0ms' }}>
          <div className="border-primary/30 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
            TypeScript kata curriculum
          </div>

          <h1 className="mb-4 text-5xl leading-[1.1] font-bold tracking-tight">
            <span className="from-foreground via-foreground to-primary/70 bg-linear-to-br bg-clip-text text-transparent">
              Master TypeScript,
            </span>
            <br />
            <span className="from-primary to-primary/60 bg-linear-to-br bg-clip-text text-transparent">
              one kata at a time.
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto max-w-md text-lg">
            15 progressively challenging exercises. Write code in your browser, earn XP, and build
            daily streaks.
          </p>
        </div>

        {/* Feature pills */}
        <div
          className="animate-fade-up mb-12 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: '80ms' }}
        >
          {features.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="border-border bg-card flex items-center gap-2 rounded-xl border px-4 py-2.5 backdrop-blur-sm"
            >
              <Icon className="text-primary h-4 w-4" />
              <div className="text-left">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-muted-foreground text-xs">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Kata list */}
        <div className="animate-fade-up pb-20" style={{ animationDelay: '140ms' }}>
          <div className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
            <span>Curriculum</span>
            <div className="bg-border/50 h-px flex-1" />
            <span>{katas.length} katas</span>
          </div>

          <ul className="flex flex-col gap-2">
            {katas.map((kata, i) => {
              const cfg = difficultyConfig[kata.difficulty]
              return (
                <li
                  key={kata.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${200 + i * 35}ms` }}
                >
                  <Link
                    to="/kata/$kataId"
                    params={{ kataId: kata.id }}
                    className={cn(
                      'group border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm',
                      'backdrop-blur-sm transition-all duration-200',
                      'hover:border-primary/60 hover:bg-secondary hover:shadow-primary/10 hover:-translate-y-0.5 hover:shadow-lg'
                    )}
                  >
                    <span className="text-muted-foreground w-6 shrink-0 text-right text-xs tabular-nums">
                      {kata.order}.
                    </span>
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', cfg.dot)} />
                    <span className="flex-1 font-medium">{kata.title}</span>
                    <Badge variant="outline" className={cn('border text-xs', cfg.badge)}>
                      {kata.difficulty}
                    </Badge>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

function KataListSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-20 pb-20">
      <div className="mb-4 flex justify-center">
        <Skeleton className="h-7 w-44 rounded-full" />
      </div>
      <Skeleton className="mx-auto mb-4 h-14 w-3/4 rounded-xl" />
      <Skeleton className="mx-auto mb-12 h-6 w-1/2 rounded-lg" />
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {[0, 1, 2, 3].map(i => (
          <Skeleton key={i} className="h-14 w-36 rounded-xl" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
