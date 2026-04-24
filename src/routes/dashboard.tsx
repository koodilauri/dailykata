import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import { getSession } from '#/server/auth'
import { getUserProgress, getUserStats } from '#/server/progress'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ArrowRight, Flame, Trophy, Zap } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/' })
    return { session }
  },
  loader: async () => {
    const [stats, progress] = await Promise.all([getUserStats(), getUserProgress()])
    return { stats, progress }
  },
  pendingComponent: DashboardSkeleton,
  component: Dashboard
})

const XP_PER_LEVEL = 500

const difficultyConfig = {
  easy: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  medium: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  hard: 'border-red-500/30 text-red-400 bg-red-500/10'
}

function Dashboard() {
  const { stats, progress } = Route.useLoaderData()
  const { session } = Route.useRouteContext()

  const totalXp = stats?.totalXp ?? 0
  const currentStreak = stats?.currentStreak ?? 0
  const longestStreak = stats?.longestStreak ?? 0
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpIntoLevel = totalXp % XP_PER_LEVEL
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)

  return (
    <div className="relative min-h-[calc(100vh-3rem)]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-10">
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <h1 className="mb-1 text-2xl font-bold tracking-tight">
            {session.user.name ?? 'Your'} progress
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">{session.user.email}</p>
        </div>

        {/* Stats row */}
        <div
          className="animate-fade-up mb-6 grid grid-cols-3 gap-3"
          style={{ animationDelay: '60ms' }}
        >
          <StatCard
            icon={<Zap className="h-5 w-5" />}
            iconBg="bg-yellow-500/15 text-yellow-400"
            label="Total XP"
            value={totalXp.toLocaleString()}
          />
          <StatCard
            icon={<Flame className="h-5 w-5" />}
            iconBg="bg-orange-500/15 text-orange-400"
            label="Current streak"
            value={`${currentStreak}d`}
          />
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            iconBg="bg-sky-500/15 text-sky-400"
            label="Longest streak"
            value={`${longestStreak}d`}
          />
        </div>

        {/* XP / level card */}
        <div
          className="animate-fade-up border-border bg-card mb-8 rounded-xl border p-5 backdrop-blur-sm"
          style={{ animationDelay: '120ms' }}
        >
          <div className="mb-3 flex items-end justify-between">
            <div>
              <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Level
              </div>
              <div className="text-3xl font-bold tabular-nums">{level}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground text-xs">
                {xpIntoLevel.toLocaleString()} / {XP_PER_LEVEL} XP
              </div>
              <div className="text-muted-foreground text-xs">
                {(XP_PER_LEVEL - xpIntoLevel).toLocaleString()} to level {level + 1}
              </div>
            </div>
          </div>
          <div className="bg-secondary relative h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>

        {/* Completed katas */}
        <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-medium tracking-widest uppercase">
            <span>Completed katas</span>
            <div className="bg-border/50 h-px flex-1" />
            <span>{progress.length}</span>
          </div>

          {progress.length === 0 ? (
            <div className="border-border bg-card rounded-xl border px-4 py-8 text-center backdrop-blur-sm">
              <p className="text-muted-foreground text-sm">No katas completed yet.</p>
              <Link
                to="/"
                className="text-primary mt-2 inline-flex items-center gap-1 text-sm hover:underline"
              >
                Start one now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {progress.map((p, i) => (
                <li
                  key={p.kataId}
                  className="animate-fade-up"
                  style={{ animationDelay: `${220 + i * 30}ms` }}
                >
                  <Link
                    to="/kata/$kataId"
                    params={{ kataId: p.kataId }}
                    className={cn(
                      'group border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3 text-sm backdrop-blur-sm',
                      'hover:border-primary/60 hover:bg-secondary hover:shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg'
                    )}
                  >
                    <span className="text-muted-foreground w-6 shrink-0 text-right text-xs tabular-nums">
                      {p.kataOrder}.
                    </span>
                    <span className="flex-1 font-medium">{p.kataTitle}</span>
                    <Badge
                      variant="outline"
                      className={cn('border text-xs', difficultyConfig[p.kataDifficulty])}
                    >
                      {p.kataDifficulty}
                    </Badge>
                    <span className="text-primary text-xs font-medium">+{p.xpEarned} XP</span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  iconBg,
  label,
  value
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string | number
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-xl border p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium">{label}</span>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', iconBg)}>
          {icon}
        </div>
      </div>
      <span className="text-3xl font-bold tabular-nums">{value}</span>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Skeleton className="mb-1 h-8 w-48" />
      <Skeleton className="mb-8 h-4 w-40" />
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mb-8 h-24 rounded-xl" />
      <Skeleton className="mb-4 h-5 w-40" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
