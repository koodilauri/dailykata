'use client'

import { signIn } from '#/lib/auth-client'
import { Link } from '@tanstack/react-router'

interface Props {
  show: boolean
  kataTitle: string
  nextKataSlug: string | null
  onDismiss: () => void
}

export function SignInToast({ show, kataTitle, nextKataSlug, onDismiss }: Props) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onDismiss}>
      <div className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="animate-pop-in bg-card relative flex w-full max-w-xs flex-col items-center gap-5 rounded-2xl border border-emerald-500/40 px-8 py-8 text-center"
        style={{ boxShadow: '0 0 80px rgba(52,211,153,0.2), 0 24px 64px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        <span className="pointer-events-none absolute -top-3 -right-3 text-2xl select-none">
          ✨
        </span>
        <span className="pointer-events-none absolute -bottom-3 -left-3 text-xl select-none">
          ⭐
        </span>

        <div>
          <p className="text-2xl font-black tracking-tight">You solved it!</p>
          <p className="text-muted-foreground mt-1 text-sm">{kataTitle}</p>
        </div>

        <div className="flex w-full flex-col gap-2">
          <p className="text-muted-foreground text-xs">Sign in to save your XP and streak.</p>
          <button
            onClick={() =>
              signIn.social({ provider: 'github', callbackURL: window.location.pathname })
            }
            className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/25"
          >
            Sign in with GitHub →
          </button>
          {nextKataSlug && (
            <Link
              to="/kata/$slug"
              params={{ slug: nextKataSlug }}
              onClick={onDismiss}
              className="w-full rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm font-bold text-sky-400 transition hover:bg-sky-500/20"
            >
              Next Kata →
            </Link>
          )}
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
