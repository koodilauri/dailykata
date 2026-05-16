'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#/components/ui/resizable'
import { useIsMobile } from '#/hooks/use-mobile'
import { runTests, type TestResult } from '#/lib/runner'
import { cn } from '#/lib/utils'
import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  addLocalCompleted,
  addLocalXp,
  bumpLocalStreak,
  getLocalCompleted
} from '#/lib/local-progress'
import { CodeEditor, type CodeEditorHandle } from './CodeEditor'
import { DescriptionPanel } from './DescriptionPanel'
import { TestResults } from './TestResults'
import { ScrollArea } from '#/components/ui/scroll-area'
import { Button } from '#/components/ui/button'
import { ChevronDown, ChevronUp, Play } from 'lucide-react'
import type { DemoKata } from '#/lib/demo-katas'

const XP_PER_KATA = 100

type MobileTab = 'description' | 'code'

interface Props {
  kata: DemoKata
  katas: DemoKata[]
}

export function DemoKataEditor({ kata, katas }: Props) {
  const isMobile = useIsMobile()
  const editorRef = useRef<CodeEditorHandle>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<MobileTab>('description')
  const [resultsCollapsed, setResultsCollapsed] = useState(false)
  const [completed, setCompleted] = useState(
    () => typeof window !== 'undefined' && getLocalCompleted().includes(kata.id)
  )
  const [showToast, setShowToast] = useState(false)

  const currentIndex = katas.findIndex(k => k.id === kata.id)
  const nextKata =
    currentIndex >= 0 && currentIndex < katas.length - 1 ? katas[currentIndex + 1] : null

  async function handleRun() {
    const code = editorRef.current?.getValue()
    if (!code) return
    setRunning(true)
    setResults(null)
    setError(null)
    setResultsCollapsed(false)
    try {
      const res = await runTests(code, kata.tests)
      setResults(res)
      if (res.every(r => r.passed) && !completed) {
        addLocalCompleted(kata.id)
        addLocalXp(XP_PER_KATA)
        bumpLocalStreak()
        setCompleted(true)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 7000)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }

  const resultsSummary = running
    ? 'Running…'
    : error
      ? 'Error'
      : results
        ? `${results.filter(r => r.passed).length}/${results.length} passed`
        : ''

  const hasResults = results !== null || running || error !== null

  const resultsPanel = hasResults && (
    <div className="border-border shrink-0 border-t">
      <button
        onClick={() => setResultsCollapsed(c => !c)}
        className="border-border text-muted-foreground hover:bg-accent flex h-9 w-full items-center gap-2 border-b px-4 text-xs font-semibold transition-colors"
      >
        {resultsCollapsed ? (
          <ChevronUp className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        )}
        <span>Results</span>
        {resultsSummary && (
          <span
            className={cn(
              'ml-1 font-normal',
              results?.every(r => r.passed) ? 'text-emerald-400' : results ? 'text-red-400' : ''
            )}
          >
            — {resultsSummary}
          </span>
        )}
      </button>
      {!resultsCollapsed && (
        <ScrollArea autoHeight className="max-h-[50vh]">
          <TestResults results={results} running={running} error={error} />
        </ScrollArea>
      )}
    </div>
  )

  const topBar = (
    <div className="border-border bg-card flex h-12 shrink-0 items-center gap-3 border-b px-5">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate font-bold tracking-tight">{kata.title}</span>
        {kata.estimatedMinutes && (
          <span className="text-muted-foreground shrink-0 text-xs">
            ~{kata.estimatedMinutes} min
          </span>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        {completed && nextKata && (
          <Link to="/demo/$slug" params={{ slug: nextKata.slug }}>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:border-sky-500/70 hover:text-sky-400"
            >
              Next →
            </Button>
          </Link>
        )}
        <Button
          onClick={handleRun}
          disabled={running}
          size="sm"
          className="bg-linear-to-r from-sky-700 to-sky-500 text-white shadow-md shadow-sky-500/30 hover:-translate-y-px hover:shadow-sky-500/50"
        >
          <Play className="h-3.5 w-3.5" />
          {running ? 'Running…' : 'Run Tests'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-1 flex-col">
      {/* Demo banner */}
      <div className="border-b border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-center text-xs">
        <span className="text-muted-foreground">Demo mode — </span>
        <Link
          to="/gate"
          className="font-semibold text-sky-400 transition-colors hover:text-sky-300"
        >
          get beta access →
        </Link>
      </div>

      {topBar}

      {isMobile ? (
        <>
          <div className="border-border bg-secondary flex shrink-0 border-b">
            {(['description', 'code'] as MobileTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={cn(
                  'flex-1 border-b-2 py-2.5 text-xs font-semibold capitalize transition-colors',
                  mobileTab === tab
                    ? 'border-sky-500 text-sky-400'
                    : 'text-muted-foreground border-transparent'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            {mobileTab === 'description' && (
              <DescriptionPanel key={kata.id} kata={kata} hideHistory />
            )}
            {mobileTab === 'code' && (
              <div className="flex h-full flex-col">
                <div className="border-border bg-secondary flex h-9 shrink-0 items-center border-b px-3">
                  <span className="bg-accent rounded px-2.5 py-0.5 text-xs font-medium">
                    solution.ts
                  </span>
                </div>
                <CodeEditor ref={editorRef} initialCode={kata.starterCode} />
              </div>
            )}
          </div>

          {resultsPanel}
        </>
      ) : (
        <>
          <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
            <ResizablePanel defaultSize={40} minSize={20}>
              <DescriptionPanel key={kata.id} kata={kata} hideHistory />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="flex h-full flex-col">
                <div className="border-border bg-secondary flex h-10 shrink-0 items-center border-b px-4">
                  <span className="bg-accent rounded-md px-3 py-1 text-xs font-medium">
                    solution.ts
                  </span>
                </div>
                <CodeEditor ref={editorRef} initialCode={kata.starterCode} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {resultsPanel}
        </>
      )}

      {/* Completion toast */}
      {showToast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setShowToast(false)}
        >
          <div className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="animate-pop-in bg-card relative flex w-full max-w-xs flex-col items-center gap-5 rounded-2xl border border-sky-500/30 px-8 py-8 text-center"
            style={{ boxShadow: '0 0 80px rgba(56,189,248,0.2), 0 24px 64px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            <span className="pointer-events-none absolute -top-3 -right-3 text-2xl select-none">
              ✨
            </span>
            <span className="pointer-events-none absolute -bottom-3 -left-3 text-xl select-none">
              ⭐
            </span>

            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-sky-600 to-violet-500 text-4xl"
              style={{ boxShadow: '0 0 40px rgba(56,189,248,0.5)' }}
            >
              ⚔
            </div>

            <div>
              <p className="text-2xl font-black tracking-tight">Kata Complete!</p>
              <p className="text-muted-foreground mt-1 text-sm">{kata.title}</p>
            </div>

            <p
              className="text-5xl font-black text-sky-400"
              style={{ textShadow: '0 0 24px rgba(56,189,248,0.9), 0 0 60px rgba(56,189,248,0.4)' }}
            >
              +{XP_PER_KATA} XP
            </p>

            <p className="text-muted-foreground text-xs">
              Progress saved locally.{' '}
              <Link
                to="/gate"
                className="text-sky-400 hover:text-sky-300"
                onClick={() => setShowToast(false)}
              >
                Sign up to keep it →
              </Link>
            </p>

            {nextKata ? (
              <Link
                to="/demo/$slug"
                params={{ slug: nextKata.slug }}
                onClick={() => setShowToast(false)}
                className="w-full rounded-xl border border-sky-500/30 bg-sky-500/15 px-4 py-3 text-sm font-bold text-sky-400 transition hover:bg-sky-500/25"
              >
                Next Kata →
              </Link>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <p className="text-sm font-semibold text-emerald-400">🎉 All demo katas done!</p>
                <Link
                  to="/gate"
                  onClick={() => setShowToast(false)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/25"
                >
                  Get beta access →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
