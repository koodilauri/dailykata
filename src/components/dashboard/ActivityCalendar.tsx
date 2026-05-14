import { cn } from '#/lib/utils'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props {
  progress: Array<{ lastAttemptAt: string | Date }>
  streak: number
}

export function ActivityCalendar({ progress, streak }: Props) {
  const activeDays = new Set(progress.map(p => toDateKey(new Date(p.lastAttemptAt))))

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayKey = toDateKey(today)

  const year = today.getFullYear()
  const month = today.getMonth()

  // All days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Day-of-week for the 1st (0=Sun..6=Sat → convert to Mon-based: 0=Mon..6=Sun)
  const firstDow = new Date(year, month, 1).getDay()
  const offsetMonday = firstDow === 0 ? 6 : firstDow - 1

  // Build flat array: nulls for leading blanks, then Date objects
  const cells: (Date | null)[] = [
    ...Array(offsetMonday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
  ]

  // Pad to complete the last row
  while (cells.length % 7 !== 0) cells.push(null)

  // Split into weeks
  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="px-5 pb-6">
      <div className="text-muted-foreground mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
        <span>📅 Activity</span>
        <div className="bg-border/50 h-px flex-1" />
        {streak > 0 && <span className="text-amber-400">🔥 {streak}d streak</span>}
      </div>

      {/* Month + year header */}
      <p className="mb-3 text-sm font-semibold">
        {MONTH_NAMES[month]} {year}
      </p>

      {/* Day-of-week headers */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-muted-foreground text-center text-[10px] font-semibold">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => {
              if (!day) return <div key={di} />

              const key = toDateKey(day)
              const done = activeDays.has(key)
              const isFuture = key > todayKey
              const isToday = key === todayKey

              return (
                <div
                  key={key}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-lg text-sm font-semibold transition-colors',
                    isFuture
                      ? 'text-muted-foreground/30'
                      : done
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'text-muted-foreground/50',
                    isToday && done && 'bg-sky-500/30 ring-1 ring-sky-400',
                    isToday && !done && 'ring-muted-foreground/30 ring-1'
                  )}
                >
                  {day.getDate()}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
