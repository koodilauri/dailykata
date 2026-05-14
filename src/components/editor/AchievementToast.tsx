'use client'

import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { cn } from '#/lib/utils'

const XP_PER_LEVEL = 500

const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice',
  2: 'Apprentice',
  3: 'Journeyman',
  4: 'Adept',
  5: 'Expert',
  6: 'Master',
  7: 'Grandmaster'
}

function formatSection(slug: string | null) {
  if (!slug) return 'Section'
  return slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

interface XpBarProps {
  prevXp: number
  xpEarned: number
}

function XpBar({ prevXp, xpEarned }: XpBarProps) {
  const newXp = prevXp + xpEarned
  const prevPct = ((prevXp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100
  const newPct = ((newXp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100
  const leveledUp = Math.floor(newXp / XP_PER_LEVEL) > Math.floor(prevXp / XP_PER_LEVEL)
  const xpIntoLevel = prevXp % XP_PER_LEVEL

  const [width, setWidth] = useState(prevPct)
  const [transition, setTransition] = useState(true)

  useEffect(() => {
    if (leveledUp) {
      const t1 = setTimeout(() => setWidth(100), 50)
      const t2 = setTimeout(() => {
        setTransition(false)
        setWidth(0)
      }, 1100)
      const t3 = setTimeout(() => {
        setTransition(true)
        setWidth(newPct)
      }, 1200)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    } else {
      const t = setTimeout(() => setWidth(newPct), 50)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <div className="w-full">
      <div className="text-muted-foreground mb-1.5 flex justify-between text-[10px]">
        <span>Level {Math.floor(prevXp / XP_PER_LEVEL) + 1}</span>
        <span>
          {xpIntoLevel + xpEarned} / {XP_PER_LEVEL} XP
        </span>
      </div>
      <div className="bg-secondary/60 h-2.5 overflow-hidden rounded-full">
        <div
          className="h-full rounded-full bg-linear-to-r from-sky-500 to-violet-500"
          style={{
            width: `${width}%`,
            boxShadow: '0 0 8px rgba(56,189,248,.6)',
            transition: transition ? 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
          }}
        />
      </div>
    </div>
  )
}

interface Props {
  show: boolean
  kataTitle: string
  sectionId: string | null
  xpEarned: number
  prevXp: number
  nextKataId: string | null
  sectionComplete: boolean
  nextSectionTitle: string | null
  onDismiss: () => void
}

export function AchievementToast({
  show,
  kataTitle,
  sectionId,
  xpEarned,
  prevXp,
  nextKataId,
  sectionComplete,
  nextSectionTitle,
  onDismiss
}: Props) {
  if (!show) return null

  const newXp = prevXp + xpEarned
  const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1
  const leveledUp = newLevel > Math.floor(prevXp / XP_PER_LEVEL) + 1
  const levelTitle = LEVEL_TITLES[Math.min(newLevel, 7)] ?? 'Legend'
  const sectionLabel = sectionComplete
    ? (nextSectionTitle ?? formatSection(sectionId))
    : formatSection(sectionId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onDismiss}>
      <div className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="animate-pop-in bg-card relative flex w-full max-w-xs flex-col items-center gap-5 rounded-2xl border border-sky-500/30 px-8 py-8 text-center"
        style={{ boxShadow: '0 0 80px rgba(56,189,248,0.2), 0 24px 64px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Section complete banner */}
        {sectionComplete && (
          <div className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold whitespace-nowrap text-emerald-400">
            🏆 {formatSection(sectionId)} Complete!
          </div>
        )}

        <span className="pointer-events-none absolute -top-3 -right-3 text-2xl select-none">
          ✨
        </span>
        <span className="pointer-events-none absolute -bottom-3 -left-3 text-xl select-none">
          ⭐
        </span>

        {/* Icon */}
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-sky-600 to-violet-500 text-4xl"
          style={{ boxShadow: '0 0 40px rgba(56,189,248,0.5)' }}
        >
          ⚔
        </div>

        <div>
          <p className="text-2xl font-black tracking-tight">Kata Complete!</p>
          <p className="text-muted-foreground mt-1 text-sm">{kataTitle}</p>
        </div>

        {/* XP reward */}
        <p
          className="text-5xl font-black text-sky-400"
          style={{ textShadow: '0 0 24px rgba(56,189,248,0.9), 0 0 60px rgba(56,189,248,0.4)' }}
        >
          +{xpEarned} XP
        </p>

        <XpBar prevXp={prevXp} xpEarned={xpEarned} />

        {/* Level-up badge — delayed so it appears after the bar fills */}
        {leveledUp && (
          <div
            className={cn(
              'animate-scale-in flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-4 py-2 text-sm font-bold text-amber-400'
            )}
            style={{
              animationDelay: '0.8s',
              animationFillMode: 'both',
              boxShadow: '0 0 20px rgba(245,158,11,0.25)'
            }}
          >
            ⬆ Level {newLevel} — {levelTitle}!
          </div>
        )}

        {/* Next action */}
        {nextKataId ? (
          <Link
            to="/kata/$kataId"
            params={{ kataId: nextKataId }}
            onClick={onDismiss}
            className="w-full rounded-xl border border-sky-500/30 bg-sky-500/15 px-4 py-3 text-sm font-bold text-sky-400 transition hover:bg-sky-500/25"
          >
            {sectionComplete ? `Start ${sectionLabel} →` : 'Next Kata →'}
          </Link>
        ) : (
          <p className="text-sm font-semibold text-emerald-400">🎉 You've completed all katas!</p>
        )}
      </div>
    </div>
  )
}
