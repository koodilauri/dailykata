const COMPLETED_KEY = 'dailykata_local_completed'
const PENDING_KEY = 'dailykata_pending_submissions'
const LEGACY_KEY = 'dailykata_pending_submit'

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
}

export function getPendingSubmissions(): PendingSubmission[] {
  try {
    const arr: PendingSubmission[] = JSON.parse(localStorage.getItem(PENDING_KEY) ?? '[]')
    // migrate legacy single-submission key
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
