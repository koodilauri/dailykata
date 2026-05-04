'use client'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'

interface Kata {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface Props {
  kata: Kata
  katas: Array<{ id: string }>
  running: boolean
  onRun: () => void
}

const difficultyColor: Record<Kata['difficulty'], string> = {
  easy: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  medium: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  hard: 'border-red-500/30 text-red-400 bg-red-500/10'
}

export function KataBar({ kata, katas, running, onRun }: Props) {
  const currentIndex = katas.findIndex(k => k.id === kata.id)
  const prevKata = currentIndex > 0 ? katas[currentIndex - 1] : null
  const nextKata = currentIndex < katas.length - 1 ? katas[currentIndex + 1] : null

  return (
    <div className="border-border bg-card flex h-12 shrink-0 items-center gap-3 border-b px-5">
      <span className="font-bold tracking-tight">{kata.title}</span>
      <Badge variant="outline" className={difficultyColor[kata.difficulty]}>
        {kata.difficulty}
      </Badge>
      <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-400">
        +100 XP
      </Badge>
      <div className="ml-auto flex gap-2">
        {prevKata ? (
          <Link to="/kata/$kataId" params={{ kataId: prevKata.id }}>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:border-sky-500/70 hover:text-sky-400"
            >
              ← Prev
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled className="opacity-40">
            ← Prev
          </Button>
        )}
        {nextKata ? (
          <Link to="/kata/$kataId" params={{ kataId: nextKata.id }}>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:border-sky-500/70 hover:text-sky-400"
            >
              Next →
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled className="opacity-40">
            Next →
          </Button>
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
