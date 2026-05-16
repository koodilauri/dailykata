import { useState } from 'react'
import { cn } from '#/lib/utils'
import { clearAllLocal } from '#/lib/local-progress'
import { getSession } from '#/server/auth'
import { getUserStats } from '#/server/progress'
import {
  scheduleAccountDeletion,
  cancelAccountDeletion,
  getScheduledDeletion
} from '#/server/account'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '#/components/ui/dialog'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) throw redirect({ to: '/' })
    return { session }
  },
  loader: async () => {
    const [stats, scheduledDeletionAt] = await Promise.all([getUserStats(), getScheduledDeletion()])
    return { stats, scheduledDeletionAt }
  },
  component: Account
})

const XP_PER_LEVEL = 500

const levelTitles: Record<number, string> = {
  1: 'Novice',
  2: 'Apprentice',
  3: 'Journeyman',
  4: 'Adept',
  5: 'Expert',
  6: 'Master',
  7: 'Grandmaster'
}

function Account() {
  const { stats, scheduledDeletionAt } = Route.useLoaderData()
  const { session } = Route.useRouteContext()
  const router = useRouter()
  const [scheduling, setScheduling] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const totalXp = stats?.totalXp ?? 0
  const currentStreak = stats?.currentStreak ?? 0
  const longestStreak = stats?.longestStreak ?? 0
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpIntoLevel = totalXp % XP_PER_LEVEL
  const xpPct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100)
  const title = levelTitles[Math.min(level, 7)] ?? 'Legend'

  const name = session.user.name ?? session.user.email.split('@')[0]
  const initial = name[0].toUpperCase()

  const deletionDate = scheduledDeletionAt
    ? new Date(scheduledDeletionAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Profile header */}
      <div className="border-border bg-card mb-4 flex items-center gap-4 rounded-2xl border p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-600 to-violet-500 text-2xl font-bold text-white shadow-lg">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold">{name}</p>
          <p className="text-muted-foreground truncate text-sm">{session.user.email}</p>
          <span className="mt-1 inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-sky-400 uppercase">
            Lv {level} · {title}
          </span>
        </div>
      </div>

      {/* XP bar */}
      <div className="border-border bg-card mb-4 rounded-2xl border p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
            Level progress
          </span>
          <span className="text-xs font-bold text-sky-400">
            {xpIntoLevel} / {XP_PER_LEVEL} XP
          </span>
        </div>
        <div className="bg-secondary h-2 overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-linear-to-r from-sky-500 to-violet-500 transition-all duration-700"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <p className="text-muted-foreground mt-1.5 text-[11px]">
          {XP_PER_LEVEL - xpIntoLevel} XP to Level {level + 1}
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard value={totalXp.toLocaleString()} label="Total XP" valueClass="text-sky-400" />
        <StatCard value={`${currentStreak}🔥`} label="Streak" valueClass="text-amber-400" />
        <StatCard value={String(longestStreak)} label="Best streak" valueClass="text-violet-400" />
      </div>

      {/* Danger zone */}
      <div className="border-destructive/30 bg-card rounded-2xl border p-4">
        <h2 className="text-destructive text-sm font-semibold">Danger zone</h2>

        {scheduledDeletionAt ? (
          /* State B — deletion pending */
          <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/8 p-3">
            <p className="text-sm font-semibold text-amber-400">Account marked for deletion</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Your account and all data will be permanently deleted on {deletionDate}. Sign in
              before then to cancel.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:text-amber-400"
              disabled={cancelling}
              onClick={async () => {
                setCancelling(true)
                await cancelAccountDeletion()
                await router.invalidate()
                setCancelling(false)
              }}
            >
              {cancelling ? 'Cancelling…' : 'Cancel deletion'}
            </Button>
          </div>
        ) : (
          /* State A — no pending deletion */
          <>
            <p className="text-muted-foreground mt-1 text-xs">
              Schedule your account for deletion. You have 14 days to cancel before all data is
              permanently removed.
            </p>
            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="destructive" size="sm" className="mt-3">
                    Delete account
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule account deletion?</DialogTitle>
                  <DialogDescription>
                    Your account will be permanently deleted on{' '}
                    <strong>
                      {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(
                        undefined,
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </strong>
                    . You can cancel at any time before then by signing back in.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button
                    variant="destructive"
                    disabled={scheduling}
                    onClick={async () => {
                      setScheduling(true)
                      await scheduleAccountDeletion()
                      clearAllLocal()
                      await router.invalidate()
                      setScheduling(false)
                    }}
                  >
                    {scheduling ? 'Scheduling…' : 'Schedule deletion'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}

function StatCard({
  value,
  label,
  valueClass
}: {
  value: string
  label: string
  valueClass: string
}) {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-1 rounded-2xl border py-3 text-center">
      <span className={cn('text-lg font-black tabular-nums', valueClass)}>{value}</span>
      <span className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
        {label}
      </span>
    </div>
  )
}
