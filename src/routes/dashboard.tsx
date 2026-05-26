import { ActivityCalendar } from '#/components/dashboard/ActivityCalendar'
import { cn } from '#/lib/utils'
import { getSession } from '#/server/auth'
import { getKatas } from '#/server/kata'
import { getUserProgress, getUserStats } from '#/server/progress'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/' })
    return { session }
  },
  loader: async () => {
    const [stats, progress, katas] = await Promise.all([
      getUserStats(),
      getUserProgress(),
      getKatas()
    ])
    return { stats, progress, katas }
  },
  component: Home
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

function Home() {
  const { stats, progress, katas } = Route.useLoaderData()
  const { session } = Route.useRouteContext()

  const totalXp = stats?.totalXp ?? 0
  const currentStreak = stats?.currentStreak ?? 0
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpIntoLevel = totalXp % XP_PER_LEVEL
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)
  const title = levelTitles[Math.min(level, 7)] ?? 'Legend'

  const completedIds = new Set(progress.map(p => p.kataId))
  const nextKata = katas.find(k => !completedIds.has(k.id))
  const recentProgress = [...progress].reverse().slice(0, 5)

  const name = session.user.name ?? session.user.email.split('@')[0]
  const initial = name[0].toUpperCase()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="mx-auto max-w-lg">
      {/* Hero banner */}
      <div
        className="relative overflow-hidden px-5 pt-6 pb-5"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in oklch, var(--color-background) 60%, oklch(0.25 0.08 250)) 0%, color-mix(in oklch, var(--color-background) 80%, oklch(0.2 0.06 280)) 100%)'
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 80% 0%, rgba(56,189,248,.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 100%, rgba(167,139,250,.08) 0%, transparent 60%)'
          }}
        />

        <div className="relative mb-5 flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{greeting},</p>
            <p className="text-xl font-bold tracking-tight">{name}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-600 to-violet-500 text-lg font-bold text-white shadow-lg">
            {initial}
          </div>
        </div>

        {/* XP bar */}
        <div className="relative">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-semibold tracking-widest uppercase">
              XP to next level
            </span>
            <span className="text-xs font-bold text-sky-400">
              {xpIntoLevel} / {XP_PER_LEVEL}
            </span>
          </div>
          <div className="bg-secondary/60 h-2.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-linear-to-r from-sky-500 to-violet-500 transition-all duration-700"
              style={{ width: `${xpPct}%`, boxShadow: '0 0 8px rgba(56,189,248,.5)' }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-sky-400 uppercase">
              Lv {level} · {title}
            </span>
            <span className="text-muted-foreground text-[11px]">
              {XP_PER_LEVEL - xpIntoLevel} XP to Lv {level + 1}
            </span>
          </div>
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex gap-3 px-5 py-4">
        <StatPill emoji="🔥" value={currentStreak} label="Streak" valueClass="text-amber-400" />
        <StatPill emoji="⚡" value={totalXp} label="Total XP" valueClass="text-sky-400" />
        <StatPill emoji="✓" value={completedIds.size} label="Done" valueClass="text-emerald-400" />
      </div>

      {/* Continue banner */}
      {nextKata && (
        <div className="px-5 pb-4">
          <Link
            to="/kata/$slug"
            params={{ slug: nextKata.slug }}
            className="flex items-center gap-3.5 rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4 transition-all hover:border-sky-500/40 hover:bg-sky-500/10"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-2xl">
              {difficultyIcon[nextKata.difficulty]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[11px] font-bold tracking-wide text-sky-400 uppercase">
                ▶ Continue
              </p>
              <p className="truncate text-sm font-semibold">{nextKata.title}</p>
            </div>
            <span className="shrink-0 text-xs font-bold text-sky-400">+100 XP</span>
          </Link>
        </div>
      )}

      <ActivityCalendar progress={progress} streak={currentStreak} />

      {/* Recent katas */}
      {recentProgress.length > 0 && (
        <div className="px-5 pb-6">
          <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
            <span>📜 Recent</span>
            <div className="bg-border/50 h-px flex-1" />
          </div>
          <ul className="flex flex-col gap-2">
            {recentProgress.map(p => (
              <li key={p.kataId}>
                <Link
                  to="/kata/$slug"
                  params={{ slug: p.kataSlug }}
                  className="border-border bg-card group flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
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
        </div>
      )}

      {recentProgress.length === 0 && (
        <div className="px-5 pb-6 text-center">
          <p className="text-muted-foreground text-sm">No katas completed yet.</p>
          <Link
            to="/"
            className="mt-1 inline-block text-sm font-semibold text-sky-400 hover:underline"
          >
            Start your first quest →
          </Link>
        </div>
      )}
    </div>
  )
}

function StatPill({
  emoji,
  value,
  label,
  valueClass
}: {
  emoji: string
  value: number
  label: string
  valueClass: string
}) {
  return (
    <div className="border-border bg-card flex flex-1 flex-col items-center gap-0.5 rounded-2xl border py-3">
      <span className={cn('text-lg font-black tabular-nums', valueClass)}>
        {emoji}
        {value}
      </span>
      <span className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
        {label}
      </span>
    </div>
  )
}
