import { KataSidebar } from '#/components/editor/KataSidebar'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

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

  if (!isKataRoute) {
    return <Outlet />
  }

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {sidebarData && (
        <div className="hidden md:flex">
          <KataSidebar
            katas={sidebarData.sectionKatas}
            completedIds={sidebarData.completedIds}
            activeId={sidebarData.kata.id}
            sectionTitle={sidebarData.sectionId ?? undefined}
            sectionComplete={sidebarData.sectionComplete}
            nextSection={sidebarData.nextSection}
          />
        </div>
      )}
      <Outlet />
    </div>
  )
}

export const Route = createFileRoute('/kata')({
  component: KataLayout
})
