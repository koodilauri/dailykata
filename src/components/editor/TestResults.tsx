import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Skeleton } from '#/components/ui/skeleton'
import type { TestResult } from '#/lib/runner'
import { CheckCircle, XCircle } from 'lucide-react'

interface TestResultsProps {
  results: TestResult[] | null
  running: boolean
  error: string | null
}

export function TestResults({ results, running, error }: TestResultsProps) {
  if (running) {
    return (
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-3/4 rounded-md" />
        <Skeleton className="h-8 w-4/5 rounded-md" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="font-mono text-xs whitespace-pre-wrap">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Run your code to see test results
      </div>
    )
  }

  const passed = results.filter(r => r.passed).length
  const total = results.length
  const allPassed = passed === total

  return (
    <div className="flex flex-col gap-3 p-4">
      <Alert variant={allPassed ? 'default' : 'destructive'}>
        {allPassed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        <AlertTitle>
          {allPassed ? 'All tests passed!' : `${passed} / ${total} tests passed`}
        </AlertTitle>
      </Alert>
      <ScrollArea className="flex-1">
        <ul className="flex flex-col gap-2">
          {results.map((result, i) => (
            <li key={i} className="flex flex-col gap-1 rounded-md border px-3 py-2 text-sm">
              <div className="flex items-center gap-2">
                {result.passed ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="text-destructive h-4 w-4 shrink-0" />
                )}
                <span
                  className={
                    result.passed ? 'text-green-700 dark:text-green-400' : 'text-destructive'
                  }
                >
                  {result.name}
                </span>
              </div>
              {result.error && (
                <p className="text-muted-foreground ml-6 font-mono text-xs">{result.error}</p>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
