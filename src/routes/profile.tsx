import { cn } from '#/lib/utils'
import { getSession } from '#/server/auth'
import { signOut } from '#/lib/auth-client'
import { getUserProgress, getUserStats } from '#/server/progress'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/' })
    return { session }
  },
  loader: async () => {
    const [stats, progress] = await Promise.all([getUserStats(), getUserProgress()])
    return { stats, progress }
  },
  component: Profile
})

const XP_PER_LEVEL = 500

const levelTitles: Record<number, string> = {
  1: 'Novice',
  2: 'Apprentice',
  3: 'Journeyman',
  4: 'Adept',
  5: 'Expert',
  6: 'Master',
  7: 'Grandmaster'
}

const difficultyIcon: Record<string, string> = { easy: '🌿', medium: '⚡', hard: '🔥' }
const difficultyTag: Record<string, string> = {
  easy: 'text-emerald-400 bg-emerald-500/12',
  medium: 'text-amber-400 bg-amber-500/10',
  hard: 'text-red-400 bg-red-500/10'
}

function Profile() {
  const { stats, progress } = Route.useLoaderData()
  const { session } = Route.useRouteContext()

  const totalXp = stats?.totalXp ?? 0
  const currentStreak = stats?.currentStreak ?? 0
  const longestStreak = stats?.longestStreak ?? 0
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpIntoLevel = totalXp % XP_PER_LEVEL
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)
  const title = levelTitles[Math.min(level, 7)] ?? 'Legend'

  const name = session.user.name ?? session.user.email.split('@')[0]
  const initial = name[0].toUpperCase()

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Profile header */}
      <div className="border-border bg-card mb-4 flex items-center gap-4 rounded-2xl border p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-600 to-violet-500 text-2xl font-bold text-white shadow-lg">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="text-muted-foreground truncate text-sm">{session.user.email}</p>
          <span className="mt-1 inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-sky-400 uppercase">
            Lv {level} · {title}
          </span>
        </div>
        <button
          onClick={() =>
            signOut({ fetchOptions: { onSuccess: () => window.location.assign('/') } })
          }
          className="text-muted-foreground hover:text-foreground shrink-0 text-xs font-semibold transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* XP bar */}
      <div className="border-border bg-card mb-4 rounded-2xl border p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
            Level progress
          </span>
          <span className="text-xs font-bold text-sky-400">
            {xpIntoLevel} / {XP_PER_LEVEL} XP
          </span>
        </div>
        <div className="bg-secondary h-2 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-linear-to-r from-sky-500 to-violet-500 transition-all duration-700"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-1.5 text-[11px]">
          {XP_PER_LEVEL - xpIntoLevel} XP to Level {level + 1}
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatCard value={totalXp.toLocaleString()} label="Total XP" valueClass="text-sky-400" />
        <StatCard value={`${currentStreak}🔥`} label="Streak" valueClass="text-amber-400" />
        <StatCard value={String(longestStreak)} label="Best streak" valueClass="text-violet-400" />
      </div>

      {/* Completed katas */}
      <div>
        <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
          <span>Completed ({progress.length})</span>
          <div className="bg-border/50 h-px flex-1" />
        </div>

        {progress.length === 0 ? (
          <div className="border-border bg-card rounded-2xl border p-6 text-center">
            <p className="text-muted-foreground text-sm">No katas completed yet.</p>
            <Link
              to="/"
              className="mt-1 inline-block text-sm font-semibold text-sky-400 hover:underline"
            >
              Start your first quest →
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {progress.map((p, i) => (
              <li
                key={p.kataId}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <Link
                  to="/kata/$kataId"
                  params={{ kataId: p.kataId }}
                  className="border-border bg-card group flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all hover:border-emerald-500/30"
                >
                  <span className="text-lg">{difficultyIcon[p.kataDifficulty]}</span>
                  <span className="flex-1 truncate font-medium">{p.kataTitle}</span>
                  <span
                    className={cn(
                      'rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                      difficultyTag[p.kataDifficulty]
                    )}
                  >
                    {p.kataDifficulty}
                  </span>
                  <span className="shrink-0 text-xs font-bold text-emerald-400">+{p.xpEarned}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function StatCard({
  value,
  label,
  valueClass
}: {
  value: string
  label: string
  valueClass: string
}) {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-1 rounded-2xl border py-3 text-center">
      <span className={cn('text-lg font-black tabular-nums', valueClass)}>{value}</span>
      <span className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
        {label}
      </span>
    </div>
  )
}
