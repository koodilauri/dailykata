import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { getKatas } from '#/server/kata'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: () => getKatas(),
  pendingComponent: KataListSkeleton,
  component: KataList
})

function KataList() {
  const katas = Route.useLoaderData()

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">dailykata</h1>
      <p className="text-muted-foreground mb-8">
        A daily TypeScript kata curriculum. Pick up where you left off.
      </p>
      <ul className="flex flex-col gap-2">
        {katas.map(kata => (
          <li key={kata.id}>
            <Link
              to="/kata/$kataId"
              params={{ kataId: kata.id }}
              className="hover:bg-accent flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors"
            >
              <span className="text-muted-foreground w-6 text-right">{kata.order}.</span>
              <span className="flex-1 font-medium">{kata.title}</span>
              <Badge
                variant="outline"
                className={
                  kata.difficulty === 'easy'
                    ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400'
                    : kata.difficulty === 'medium'
                      ? 'border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-400'
                      : 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400'
                }
              >
                {kata.difficulty}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function KataListSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Skeleton className="mb-2 h-9 w-48" />
      <Skeleton className="mb-8 h-5 w-80" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}
