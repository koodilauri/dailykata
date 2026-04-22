'use client'

import { ScrollArea } from '#/components/ui/scroll-area'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
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
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500'
}

export function KataSidebar({ katas, completedIds, activeId }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r transition-all duration-200',
        open ? 'w-56' : 'w-10'
      )}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="text-muted-foreground hover:text-foreground hover:bg-accent flex h-10 w-full items-center justify-center border-b"
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {open && (
        <ScrollArea className="flex-1">
          <ul className="py-1">
            {katas.map(k => {
              const completed = completedIds.includes(k.id)
              const active = k.id === activeId
              return (
                <li key={k.id}>
                  <Link
                    to="/kata/$kataId"
                    params={{ kataId: k.id }}
                    className={cn(
                      'hover:bg-accent flex items-center gap-2 px-3 py-2 text-sm',
                      active && 'bg-accent font-medium'
                    )}
                  >
                    <span className="text-muted-foreground w-5 shrink-0 text-right text-xs">
                      {k.order}.
                    </span>
                    <span
                      className={cn(
                        'h-1.5 w-1.5 shrink-0 rounded-full',
                        difficultyDot[k.difficulty]
                      )}
                    />
                    <span className="flex-1 truncate">{k.title}</span>
                    {completed && <Check className="h-3.5 w-3.5 shrink-0 text-green-500" />}
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
