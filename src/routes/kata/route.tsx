import { KataSidebar } from '#/components/editor/KataSidebar'
import { SidebarContext } from '#/components/editor/sidebar-context'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const NARROW_BREAKPOINT = 1000

type SidebarData = {
  kata: { id: string }
  sectionKatas: Array<{
    id: string
    title: string
    difficulty: 'easy' | 'medium' | 'hard'
    order: number
  }>
  sectionId: string | null
  completedIds: string[]
  sectionComplete: boolean
  nextSection: { id: string; title: string; firstKataId: string | null } | null
}

function KataLayout() {
  const routerState = useRouterState()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isNarrow, setIsNarrow] = useState(false)

  const isKataRoute =
    routerState.matches.some(m => m.routeId === '/kata/$kataId') ||
    (routerState.pendingMatches?.some(m => m.routeId === '/kata/$kataId') ?? false)

  const loaderData = routerState.matches.find(m => m.routeId === '/kata/$kataId')?.loaderData as
    | SidebarData
    | undefined

  const [sidebarData, setSidebarData] = useState<SidebarData | undefined>(loaderData)

  useEffect(() => {
    if (loaderData) setSidebarData(loaderData)
  }, [loaderData])

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${NARROW_BREAKPOINT - 1}px)`)
    const onChange = () => {
      if (window.innerWidth < NARROW_BREAKPOINT) {
        setIsNarrow(true)
        setSidebarOpen(false)
      } else {
        setIsNarrow(false)
      }
    }
    mql.addEventListener('change', onChange)
    onChange()
    return () => mql.removeEventListener('change', onChange)
  }, [])

  if (!isKataRoute) {
    return <Outlet />
  }

  function markCompleted(kataId: string) {
    setSidebarData(prev =>
      prev && !prev.completedIds.includes(kataId)
        ? { ...prev, completedIds: [...prev.completedIds, kataId] }
        : prev
    )
  }

  const sidebarProps = sidebarData
    ? {
        katas: sidebarData.sectionKatas,
        completedIds: sidebarData.completedIds,
        activeId: sidebarData.kata.id,
        sectionTitle: sidebarData.sectionId ?? undefined,
        sectionComplete: sidebarData.sectionComplete,
        nextSection: sidebarData.nextSection
      }
    : null

  return (
    <SidebarContext.Provider
      value={{
        open: sidebarOpen,
        toggle: () => setSidebarOpen(o => !o),
        markCompleted,
        completedIds: sidebarData?.completedIds ?? [],
        nextSection: sidebarData?.nextSection ?? null
      }}
    >
      <div className="relative flex h-[calc(100vh-3rem-4rem)] md:h-[calc(100vh-3rem)]">
        {sidebarProps &&
          (isNarrow ? (
            sidebarOpen && (
              <>
                <div
                  className="absolute inset-0 z-10 bg-black/40"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="absolute inset-y-0 left-0 z-20 shadow-xl">
                  <KataSidebar {...sidebarProps} />
                </div>
              </>
            )
          ) : (
            <KataSidebar {...sidebarProps} />
          ))}
        <Outlet />
      </div>
    </SidebarContext.Provider>
  )
}

export const Route = createFileRoute('/kata')({
  component: KataLayout
})
