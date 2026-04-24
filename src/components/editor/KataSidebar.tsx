'use client'

import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'

interface SidebarKata {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
}

interface Props {
  katas: SidebarKata[]
  completedIds: string[]
  activeId: string
  stats: { totalXp: number; currentStreak: number } | null
}

const difficultyDot: Record<SidebarKata['difficulty'], string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-red-500'
}

export function KataSidebar({ katas, completedIds, activeId, stats }: Props) {
  const totalXp = stats?.totalXp ?? 0
  const streak = stats?.currentStreak ?? 0
  const pct = katas.length > 0 ? Math.round((completedIds.length / katas.length) * 100) : 0

  return (
    <div className="border-border bg-card flex h-full w-[260px] min-w-[260px] flex-col border-r">
      {/* Stats section */}
      <div className="border-border border-b p-4">
        <p className="text-muted-foreground mb-2.5 text-[10px] font-bold tracking-widest uppercase">
          Your Progress
        </p>
        <div className="grid grid-cols-2 gap-2">
          <StatMini value={totalXp} label="⚡ Total XP" valueClass="text-amber-400" />
          <StatMini value={streak} label="🔥 Day Streak" valueClass="text-red-400" />
          <StatMini value={completedIds.length} label="✓ Completed" valueClass="text-emerald-400" />
          <StatMini
            value={katas.length - completedIds.length}
            label="→ Remaining"
            valueClass="text-sky-400"
          />
        </div>
      </div>

      {/* Curriculum section */}
      <div className="border-border border-b px-4 py-3">
        <p className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
          Curriculum
        </p>
        <div className="text-muted-foreground mb-1.5 flex justify-between text-[11px]">
          <span>TypeScript Mastery</span>
          <span>
            {completedIds.length}/{katas.length}
          </span>
        </div>
        <div className="bg-muted h-1.5 overflow-hidden rounded-full">
          <div
            className="h-1.5 rounded-full bg-linear-to-r from-sky-600 to-sky-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Kata list */}
      <ScrollArea className="flex-1">
        <p className="text-muted-foreground px-4 pt-3 pb-1 text-[10px] font-bold tracking-widest uppercase">
          Exercises
        </p>
        <ul className="px-2 pb-2">
          {katas.map(k => {
            const completed = completedIds.includes(k.id)
            const active = k.id === activeId
            return (
              <li key={k.id}>
                <Link
                  to="/kata/$kataId"
                  params={{ kataId: k.id }}
                  className={cn(
                    'hover:bg-accent flex items-center gap-2 rounded-lg px-2 py-2 text-xs transition-colors',
                    active && 'border-border bg-accent border'
                  )}
                >
                  <span className="text-muted-foreground w-4 shrink-0 text-right text-[11px]">
                    {k.order}
                  </span>
                  <span
                    className={cn('h-1.5 w-1.5 shrink-0 rounded-full', difficultyDot[k.difficulty])}
                  />
                  <span className={cn('flex-1 truncate font-medium', active && 'text-sky-400')}>
                    {k.title}
                  </span>
                  {completed ? (
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black">
                      ✓
                    </span>
                  ) : (
                    <span className="border-border h-4 w-4 shrink-0 rounded-full border-2" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </div>
  )
}

function StatMini({
  value,
  label,
  valueClass
}: {
  value: number
  label: string
  valueClass: string
}) {
  return (
    <div className="border-border bg-secondary rounded-lg border px-2.5 py-2">
      <div className={cn('text-lg font-bold tabular-nums', valueClass)}>{value}</div>
      <div className="text-muted-foreground mt-0.5 text-[10px]">{label}</div>
    </div>
  )
}
