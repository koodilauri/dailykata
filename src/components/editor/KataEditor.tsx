'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#/components/ui/resizable'
import { useIsMobile } from '#/hooks/use-mobile'
import { runTests, type TestResult } from '#/lib/runner'
import { cn } from '#/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useSidebar } from '#/components/editor/sidebar-context'
import { AchievementToast } from './AchievementToast'
import { CodeEditor, type CodeEditorHandle } from './CodeEditor'
import { DescriptionPanel } from './DescriptionPanel'
import { KataBar } from './KataBar'
import { LoginDialog } from './LoginDialog'
import { ScrollArea } from '#/components/ui/scroll-area'
import { TestResults } from './TestResults'
import { ChevronDown, ChevronUp } from 'lucide-react'

const draftKey = (kataId: string) => `kata_draft_${kataId}`

interface Kata {
  id: string
  title: string
  description: string
  starterCode: string
  tests: string
  hints: string[] | null
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedMinutes: number | null
  order: number
}

interface Props {
  kata: Kata
  katas: Array<{ id: string }>
}

const PENDING_SUBMIT_KEY = 'dailykata_pending_submit'

type MobileTab = 'description' | 'code'

export function KataEditor({ kata, katas }: Props) {
  const router = useRouter()
  const { markCompleted } = useSidebar()
  const isMobile = useIsMobile()
  const editorRef = useRef<CodeEditorHandle>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('description')
  const [resultsCollapsed, setResultsCollapsed] = useState(false)
  const [initialCode] = useState(() => localStorage.getItem(draftKey(kata.id)) ?? kata.starterCode)

  const hasResults = results !== null || running || error !== null

  function handleCodeChange(code: string) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => localStorage.setItem(draftKey(kata.id), code), 500)
  }

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    },
    []
  )

  useEffect(() => {
    const pending = localStorage.getItem(PENDING_SUBMIT_KEY)
    if (!pending) return
    const parsed = JSON.parse(pending) as { kataId: string; code: string }
    if (parsed.kataId !== kata.id) return
    localStorage.removeItem(PENDING_SUBMIT_KEY)
    void handleSave(parsed.code, true)
  }, [kata.id])

  async function handleSave(code: string, passed: boolean) {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kataId: kata.id, code, passed })
    })

    if (res.status === 401) {
      localStorage.setItem(PENDING_SUBMIT_KEY, JSON.stringify({ kataId: kata.id, code }))
      setLoginOpen(true)
      return
    }

    if (res.ok) {
      const data = (await res.json()) as { requiresAuth: boolean; xpEarned?: number }
      if (!data.requiresAuth) {
        markCompleted(kata.id)
        void router.invalidate()
        if (data.xpEarned && data.xpEarned > 0) {
          setShowAchievement(true)
          setTimeout(() => setShowAchievement(false), 4000)
        }
      }
    }
  }

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
      if (res.every(r => r.passed)) void handleSave(code, true)
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

  return (
    <div className="flex h-full flex-1 flex-col">
      <KataBar kata={kata} katas={katas} running={running} onRun={handleRun} />

      {isMobile ? (
        /* ── Mobile ── */
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
            {mobileTab === 'description' && <DescriptionPanel key={kata.id} kata={kata} />}
            {mobileTab === 'code' && (
              <div className="flex h-full flex-col">
                <div className="border-border bg-secondary flex h-9 shrink-0 items-center border-b px-3">
                  <span className="bg-accent rounded px-2.5 py-0.5 text-xs font-medium">
                    solution.ts
                  </span>
                </div>
                <CodeEditor ref={editorRef} initialCode={initialCode} onChange={handleCodeChange} />
              </div>
            )}
          </div>

          {resultsPanel}
        </>
      ) : (
        /* ── Desktop ── */
        <>
          <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
            <ResizablePanel defaultSize={40} minSize={20}>
              <DescriptionPanel key={kata.id} kata={kata} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="flex h-full flex-col">
                <div className="border-border bg-secondary flex h-10 shrink-0 items-center border-b px-4">
                  <span className="bg-accent rounded-md px-3 py-1 text-xs font-medium">
                    solution.ts
                  </span>
                </div>
                <CodeEditor ref={editorRef} initialCode={initialCode} onChange={handleCodeChange} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {resultsPanel}
        </>
      )}

      <AchievementToast show={showAchievement} kataTitle={kata.title} />
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} kataId={kata.id} />
    </div>
  )
}
