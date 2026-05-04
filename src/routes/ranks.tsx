import { cn } from '#/lib/utils'
import { getSession } from '#/server/auth'
import { getRanks } from '#/server/progress'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ranks')({
  loader: async () => {
    const [ranks, session] = await Promise.all([getRanks(), getSession()])
    return { ranks, session }
  },
  component: Ranks
})

const XP_PER_LEVEL = 500

const rankMedal: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function Ranks() {
  const { ranks, session } = Route.useLoaderData()
  const currentUserId = session?.user.id

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Ranks</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Top adventurers by XP</p>
      </div>

      {ranks.length === 0 ? (
        <div className="border-border bg-card rounded-2xl border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No rankings yet. Complete a kata to appear here!
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {ranks.map((entry, i) => {
            const rank = i + 1
            const level = Math.floor(entry.totalXp / XP_PER_LEVEL) + 1
            const isMe = entry.userId === currentUserId
            const initial = (entry.name ?? '?')[0].toUpperCase()

            return (
              <li
                key={entry.userId}
                className={cn(
                  'animate-fade-up flex items-center gap-3.5 rounded-2xl border px-4 py-3 transition-all',
                  isMe ? 'border-sky-500/40 bg-sky-500/8' : 'border-border bg-card'
                )}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Rank */}
                <div className="w-7 shrink-0 text-center">
                  {rank <= 3 ? (
                    <span className="text-xl">{rankMedal[rank]}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm font-bold tabular-nums">
                      {rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
                    isMe
                      ? 'bg-linear-to-br from-sky-500 to-violet-500'
                      : 'bg-linear-to-br from-sky-700 to-sky-500'
                  )}
                >
                  {initial}
                </div>

                {/* Name + level */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('truncate text-sm font-semibold', isMe && 'text-sky-400')}>
                      {entry.name ?? 'Anonymous'}
                    </span>
                    {isMe && <span className="text-[10px] font-bold text-sky-400">(you)</span>}
                  </div>
                  <span className="text-muted-foreground text-[11px]">Lv {level}</span>
                </div>

                {/* Stats */}
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-sm font-black text-sky-400 tabular-nums">
                    {entry.totalXp.toLocaleString()} XP
                  </span>
                  {(entry.currentStreak ?? 0) > 0 && (
                    <span className="text-[11px] font-bold text-amber-400">
                      🔥 {entry.currentStreak}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
