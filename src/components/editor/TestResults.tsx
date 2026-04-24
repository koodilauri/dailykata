import { ScrollArea } from '#/components/ui/scroll-area'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'
import type { TestResult } from '#/lib/runner'
import { CheckCircle2, XCircle, Terminal } from 'lucide-react'

interface TestResultsProps {
  results: TestResult[] | null
  running: boolean
  error: string | null
}

export function TestResults({ results, running, error }: TestResultsProps) {
  if (running) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-14 w-full rounded-xl" />
        {[0.75, 1, 0.85, 0.9].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-lg" style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="border-destructive/30 bg-destructive/10 rounded-xl border p-4">
          <div className="text-destructive mb-2 flex items-center gap-2 text-sm font-semibold">
            <XCircle className="h-4 w-4" />
            Runtime error
          </div>
          <pre className="text-muted-foreground overflow-auto font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {error}
          </pre>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="border-border bg-secondary flex h-12 w-12 items-center justify-center rounded-full border">
          <Terminal className="text-muted-foreground h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium">No results yet</p>
          <p className="text-muted-foreground mt-0.5 text-xs">Run your code to see test output</p>
        </div>
      </div>
    )
  }

  const passed = results.filter(r => r.passed).length
  const total = results.length
  const allPassed = passed === total

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Summary banner */}
      <div
        className={cn(
          'animate-scale-in flex items-center gap-3 rounded-xl border p-3',
          allPassed ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'
        )}
      >
        {allPassed ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        ) : (
          <XCircle className="h-5 w-5 shrink-0 text-red-400" />
        )}
        <div>
          <p
            className={cn('text-sm font-semibold', allPassed ? 'text-emerald-400' : 'text-red-400')}
          >
            {allPassed ? 'All tests passed!' : `${passed} / ${total} passed`}
          </p>
          {!allPassed && <p className="text-muted-foreground text-xs">{total - passed} failing</p>}
        </div>
      </div>

      {/* Test list */}
      <ScrollArea className="flex-1">
        <ul className="flex flex-col gap-1.5">
          {results.map((result, i) => (
            <li
              key={i}
              className={cn(
                'animate-fade-up rounded-lg border px-3 py-2 text-xs',
                result.passed
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-red-500/20 bg-red-500/5'
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                )}
                <span
                  className={cn('font-medium', result.passed ? 'text-emerald-300' : 'text-red-300')}
                >
                  {result.name}
                </span>
              </div>
              {result.error && (
                <p className="text-muted-foreground mt-1 ml-5.5 font-mono text-xs leading-relaxed">
                  {result.error}
                </p>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
