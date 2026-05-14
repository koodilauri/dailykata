'use client'

import { Button } from '#/components/ui/button'
import { useSidebar } from '#/components/editor/sidebar-context'
import { Link } from '@tanstack/react-router'
import { PanelLeft, Play } from 'lucide-react'

interface Kata {
  id: string
  title: string
  estimatedMinutes: number | null
}

interface Props {
  kata: Kata
  katas: Array<{ id: string }>
  running: boolean
  onRun: () => void
}

export function KataBar({ kata, katas, running, onRun }: Props) {
  const currentIndex = katas.findIndex(k => k.id === kata.id)
  const nextKata = currentIndex < katas.length - 1 ? katas[currentIndex + 1] : null
  const { open, toggle, completedIds } = useSidebar()
  const isCompleted = completedIds.includes(kata.id)

  return (
    <div className="border-border bg-card flex h-12 shrink-0 items-center gap-3 border-b px-5">
      {!open && (
        <button
          onClick={toggle}
          className="text-muted-foreground hover:text-foreground hover:bg-accent -ml-2 hidden rounded-md p-1.5 transition-colors md:block"
          aria-label="Show section"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate font-bold tracking-tight">{kata.title}</span>
        {kata.estimatedMinutes && (
          <span className="text-muted-foreground shrink-0 text-xs">
            ~{kata.estimatedMinutes} min
          </span>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        {isCompleted && nextKata && (
          <Link to="/kata/$kataId" params={{ kataId: nextKata.id }}>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:border-sky-500/70 hover:text-sky-400"
            >
              Next →
            </Button>
          </Link>
        )}
        <Button
          onClick={onRun}
          disabled={running}
          size="sm"
          className="bg-linear-to-r from-sky-700 to-sky-500 text-white shadow-md shadow-sky-500/30 hover:-translate-y-px hover:shadow-sky-500/50"
        >
          <Play className="h-3.5 w-3.5" />
          {running ? 'Running…' : 'Run Tests'}
        </Button>
      </div>
    </div>
  )
}
