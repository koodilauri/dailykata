import { createContext, useContext } from 'react'

interface SidebarContextValue {
  open: boolean
  toggle: () => void
  markCompleted: (kataId: string) => void
  completedIds: string[]
  nextSection: { title: string; firstKataId: string | null } | null
}

export const SidebarContext = createContext<SidebarContextValue>({
  open: true,
  toggle: () => {},
  markCompleted: () => {},
  completedIds: [],
  nextSection: null
})

export function useSidebar() {
  return useContext(SidebarContext)
}
