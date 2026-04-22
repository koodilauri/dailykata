import { Badge } from '#/components/ui/badge'
import { Progress } from '#/components/ui/progress'
import { Skeleton } from '#/components/ui/skeleton'
import { getSession } from '#/server/auth'
import { getUserProgress, getUserStats } from '#/server/progress'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Flame, Trophy, Zap } from 'lucide-react'

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

function Dashboard() {
  const { stats, progress } = Route.useLoaderData()
  const { session } = Route.useRouteContext()

  const totalXp = stats?.totalXp ?? 0
  const currentStreak = stats?.currentStreak ?? 0
  const longestStreak = stats?.longestStreak ?? 0
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpIntoLevel = totalXp % XP_PER_LEVEL
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)

  const difficultyColor = {
    easy: 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400',
    medium: 'border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-400',
    hard: 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400'
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        {session.user.name ?? 'Your'} progress
      </h1>
      <p className="text-muted-foreground mb-8 text-sm">{session.user.email}</p>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard
          icon={<Zap className="h-5 w-5 text-yellow-500" />}
          label="Total XP"
          value={totalXp}
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          label="Current streak"
          value={`${currentStreak}d`}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-purple-500" />}
          label="Longest streak"
          value={`${longestStreak}d`}
        />
      </div>

      {/* XP progress */}
      <div className="mb-8 rounded-lg border p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">Level {level}</span>
          <span className="text-muted-foreground">
            {xpIntoLevel} / {XP_PER_LEVEL} XP
          </span>
        </div>
        <Progress value={xpPct} className="h-2" />
        <p className="text-muted-foreground mt-1 text-xs">
          {XP_PER_LEVEL - xpIntoLevel} XP to level {level + 1}
        </p>
      </div>

      {/* Completed katas */}
      <h2 className="mb-3 font-semibold">Completed katas ({progress.length})</h2>
      {progress.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No katas completed yet.{' '}
          <Link to="/" className="underline underline-offset-2">
            Start one now →
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {progress.map(p => (
            <li
              key={p.kataId}
              className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm"
            >
              <span className="text-muted-foreground w-6 text-right">{p.kataOrder}.</span>
              <Link
                to="/kata/$kataId"
                params={{ kataId: p.kataId }}
                className="hover:text-foreground flex-1 font-medium transition-colors"
              >
                {p.kataTitle}
              </Link>
              <Badge variant="outline" className={difficultyColor[p.kataDifficulty]}>
                {p.kataDifficulty}
              </Badge>
              <span className="text-muted-foreground text-xs">+{p.xpEarned} XP</span>
              <Link
                to="/kata/$kataId/submissions"
                params={{ kataId: p.kataId }}
                className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2 transition-colors"
              >
                submissions
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-muted-foreground text-xs">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Skeleton className="mb-1 h-8 w-48" />
      <Skeleton className="mb-8 h-4 w-40" />
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="mb-8 h-16 rounded-lg" />
      <Skeleton className="mb-3 h-5 w-40" />
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
