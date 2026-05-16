'use client'

import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import { Lightbulb } from 'lucide-react'
import { useState } from 'react'

interface Kata {
  slug: string
  description: string
  hints: string[] | null
}

interface Props {
  kata: Kata
}

export function DescriptionPanel({ kata }: Props) {
  const [tab, setTab] = useState<'description' | 'hints'>('description')
  const [revealedHints, setRevealedHints] = useState(0)
  const hints = kata.hints ?? []

  return (
    <div className="flex h-full flex-col">
      <div className="border-border bg-secondary flex h-10 shrink-0 items-center gap-1 border-b px-3">
        <button
          onClick={() => setTab('description')}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            tab === 'description'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Description
        </button>
        <button
          onClick={() => setTab('hints')}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium transition-colors',
            tab === 'hints'
              ? 'bg-accent text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Hints
          {hints.length > 0 && <span className="text-muted-foreground ml-1">({hints.length})</span>}
        </button>
        <Link
          to="/kata/$slug/submissions"
          params={{ slug: kata.slug }}
          className="text-muted-foreground hover:text-foreground ml-1 rounded-md px-3 py-1 text-xs font-medium transition-colors"
        >
          History
        </Link>
      </div>
      <div className="flex-1 overflow-auto p-5 text-sm leading-relaxed">
        {tab === 'description' ? (
          <pre className="text-foreground/80 font-sans whitespace-pre-wrap">{kata.description}</pre>
        ) : (
          <div className="flex flex-col gap-2">
            {hints.slice(0, revealedHints).map((hint, i) => (
              <div
                key={i}
                className="animate-fade-up border-primary/20 bg-primary/5 rounded-lg border p-2.5 text-xs leading-relaxed"
              >
                <span className="font-semibold text-sky-400">Hint {i + 1}:</span> {hint}
              </div>
            ))}
            {revealedHints < hints.length && (
              <button
                onClick={() => setRevealedHints(c => c + 1)}
                className="text-primary/70 hover:text-primary mt-1 flex items-center gap-1 text-xs transition-colors"
              >
                <Lightbulb className="h-3 w-3" />
                Show hint {revealedHints + 1}
              </button>
            )}
            {hints.length === 0 && (
              <p className="text-muted-foreground text-xs">No hints for this kata.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
