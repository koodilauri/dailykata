import { Skeleton } from '#/components/ui/skeleton'

function PanelSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <Skeleton className="h-5 w-1/3 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-5/6 rounded" />
      <Skeleton className="h-4 w-4/5 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
    </div>
  )
}

export function KataPageSkeleton() {
  return (
    <div className="flex h-full flex-1 flex-col">
      {/* KataBar */}
      <div className="border-border flex h-12 shrink-0 items-center gap-3 border-b px-4">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="ml-auto h-8 w-24 rounded" />
      </div>

      {/* Desktop: three panels */}
      <div className="hidden flex-1 md:flex">
        <PanelSkeleton />
        <div className="border-border border-l" />
        <PanelSkeleton />
        <div className="border-border border-l" />
        <PanelSkeleton />
      </div>

      {/* Mobile: tab bar + content */}
      <div className="flex flex-1 flex-col md:hidden">
        <div className="border-border flex h-10 items-center gap-2 border-b px-3">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
        <PanelSkeleton />
      </div>
    </div>
  )
}
