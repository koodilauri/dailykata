import { createContext, useContext } from 'react'

interface SidebarContextValue {
  open: boolean
  toggle: () => void
  markCompleted: (kataId: string) => void
  completedIds: string[]
  nextSection: { title: string; firstKataId: string | null; firstKataSlug: string | null } | null
  isLoggedIn: boolean
}

export const SidebarContext = createContext<SidebarContextValue>({
  open: true,
  toggle: () => {},
  markCompleted: () => {},
  completedIds: [],
  nextSection: null,
  isLoggedIn: false
})

export function useSidebar() {
  return useContext(SidebarContext)
}
