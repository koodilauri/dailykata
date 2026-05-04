'use client'

import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

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
}

const difficultyDot: Record<SidebarKata['difficulty'], string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-red-500'
}

export function KataSidebar({ katas, completedIds, activeId }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div
      className={cn(
        'border-border bg-card flex h-full shrink-0 flex-col border-r transition-all duration-200',
        open ? 'w-[240px]' : 'w-10'
      )}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="border-border text-muted-foreground hover:text-foreground hover:bg-accent flex h-10 w-full shrink-0 items-center border-b px-2.5 transition-colors"
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {open && (
        <ScrollArea className="flex-1">
          <ul className="px-2 py-2">
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
                      className={cn(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        difficultyDot[k.difficulty]
                      )}
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
      )}
    </div>
  )
}
