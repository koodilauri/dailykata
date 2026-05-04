'use client'

interface Props {
  show: boolean
  kataTitle: string
}

export function AchievementToast({ show, kataTitle }: Props) {
  if (!show) return null

  return (
    <div className="animate-slide-in-right bg-card fixed top-[68px] right-5 z-50 flex max-w-[280px] items-center gap-3.5 rounded-xl border border-sky-500/40 p-4 shadow-[0_4px_30px_rgba(2,132,199,0.3)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-sky-600 to-violet-500 text-xl">
        ⚔
      </div>
      <div>
        <div className="text-sm font-bold">Kata Complete!</div>
        <div className="text-muted-foreground mt-0.5 text-[11px]">{kataTitle} — solved</div>
        <div className="mt-1 text-xl font-bold text-sky-400">+100 XP</div>
      </div>
    </div>
  )
}
