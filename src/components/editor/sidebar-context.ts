import { createContext, useContext } from 'react'

interface SidebarContextValue {
  open: boolean
  toggle: () => void
  markCompleted: (kataId: string) => void
  completedIds: string[]
}

export const SidebarContext = createContext<SidebarContextValue>({
  open: true,
  toggle: () => {},
  markCompleted: () => {},
  completedIds: []
})

export function useSidebar() {
  return useContext(SidebarContext)
}
