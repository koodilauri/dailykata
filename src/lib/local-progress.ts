const COMPLETED_KEY = 'dailykata_local_completed'
const PENDING_KEY = 'dailykata_pending_submissions'
const LEGACY_KEY = 'dailykata_pending_submit'
const DEMO_XP_KEY = 'dailykata_demo_xp'
const DEMO_STREAK_KEY = 'dailykata_demo_streak'
const DEMO_DATE_KEY = 'dailykata_demo_last_date'

export interface PendingSubmission {
  kataId: string
  code: string
}

export function getLocalCompleted(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function addLocalCompleted(kataId: string): void {
  const existing = getLocalCompleted()
  if (!existing.includes(kataId)) {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...existing, kataId]))
  }
}

export function clearLocalCompleted(): void {
  localStorage.removeItem(COMPLETED_KEY)
}

export function clearAllLocal(): void {
  localStorage.removeItem(COMPLETED_KEY)
  localStorage.removeItem(PENDING_KEY)
  localStorage.removeItem(LEGACY_KEY)
  localStorage.removeItem(DEMO_XP_KEY)
  localStorage.removeItem(DEMO_STREAK_KEY)
  localStorage.removeItem(DEMO_DATE_KEY)
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('kata_draft_')) localStorage.removeItem(key)
  }
}

export function getPendingSubmissions(): PendingSubmission[] {
  try {
    const arr: PendingSubmission[] = JSON.parse(localStorage.getItem(PENDING_KEY) ?? '[]')
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as PendingSubmission
      if (parsed.kataId && !arr.find(s => s.kataId === parsed.kataId)) {
        arr.push(parsed)
      }
      localStorage.removeItem(LEGACY_KEY)
      localStorage.setItem(PENDING_KEY, JSON.stringify(arr))
    }
    return arr
  } catch {
    return []
  }
}

export function addPendingSubmission(sub: PendingSubmission): void {
  const existing = getPendingSubmissions().filter(s => s.kataId !== sub.kataId)
  localStorage.setItem(PENDING_KEY, JSON.stringify([...existing, sub]))
}

export function removePendingSubmission(kataId: string): void {
  const existing = getPendingSubmissions().filter(s => s.kataId !== kataId)
  localStorage.setItem(PENDING_KEY, JSON.stringify(existing))
}

// --- Demo mode XP & streak (localStorage only, no server) ---

export function getLocalXp(): number {
  return parseInt(localStorage.getItem(DEMO_XP_KEY) ?? '0', 10)
}

export function addLocalXp(amount: number): void {
  localStorage.setItem(DEMO_XP_KEY, String(getLocalXp() + amount))
}

export function getLocalStreak(): { current: number; longest: number } {
  try {
    return JSON.parse(localStorage.getItem(DEMO_STREAK_KEY) ?? '{"current":0,"longest":0}')
  } catch {
    return { current: 0, longest: 0 }
  }
}

export function bumpLocalStreak(): void {
  const today = new Date().toISOString().slice(0, 10)
  const lastDate = localStorage.getItem(DEMO_DATE_KEY)
  const streak = getLocalStreak()

  let next = streak.current
  if (lastDate === today) {
    // already bumped today — no change
  } else if (lastDate === yesterday()) {
    next = streak.current + 1
  } else {
    next = 1
  }

  const longest = Math.max(next, streak.longest)
  localStorage.setItem(DEMO_STREAK_KEY, JSON.stringify({ current: next, longest }))
  localStorage.setItem(DEMO_DATE_KEY, today)
}

function yesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}
