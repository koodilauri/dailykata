'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#/components/ui/resizable'
import { useIsMobile } from '#/hooks/use-mobile'
import { runTests, type TestResult } from '#/lib/runner'
import { cn } from '#/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { AchievementToast } from './AchievementToast'
import { CodeEditor, type CodeEditorHandle } from './CodeEditor'
import { DescriptionPanel } from './DescriptionPanel'
import { KataBar } from './KataBar'
import { LoginDialog } from './LoginDialog'
import { TestResults } from './TestResults'

const draftKey = (kataId: string) => `kata_draft_${kataId}`

interface Kata {
  id: string
  title: string
  description: string
  starterCode: string
  tests: string
  hints: string[] | null
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
}

interface Props {
  kata: Kata
  katas: Array<{ id: string }>
}

const PENDING_SUBMIT_KEY = 'dailykata_pending_submit'

type MobileTab = 'description' | 'code' | 'results'

export function KataEditor({ kata, katas }: Props) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const editorRef = useRef<CodeEditorHandle>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('description')
  const [initialCode] = useState(() => localStorage.getItem(draftKey(kata.id)) ?? kata.starterCode)

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
    if (isMobile) setMobileTab('results')
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

  const mobileTabs: { id: MobileTab; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'code', label: 'Code' },
    {
      id: 'results',
      label: results
        ? `Results ${results.filter(r => r.passed).length}/${results.length}`
        : 'Results'
    }
  ]

  return (
    <div className="flex h-full flex-1 flex-col">
      <KataBar kata={kata} katas={katas} running={running} onRun={handleRun} />

      {isMobile ? (
        /* ── Mobile: tab-based layout ── */
        <>
          <div className="border-border bg-secondary flex shrink-0 border-b">
            {mobileTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id)}
                className={cn(
                  'flex-1 border-b-2 py-2.5 text-xs font-semibold transition-colors',
                  mobileTab === tab.id
                    ? 'border-sky-500 text-sky-400'
                    : 'text-muted-foreground border-transparent'
                )}
              >
                {tab.label}
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
            {mobileTab === 'results' && (
              <div className="flex h-full flex-col overflow-hidden">
                <TestResults results={results} running={running} error={error} />
              </div>
            )}
          </div>
        </>
      ) : (
        /* ── Desktop: resizable 3-panel layout ── */
        <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
          <ResizablePanel defaultSize={30} minSize={20}>
            <DescriptionPanel key={kata.id} kata={kata} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={25}>
            <div className="flex h-full flex-col">
              <div className="border-border bg-secondary flex h-10 shrink-0 items-center border-b px-4">
                <span className="bg-accent rounded-md px-3 py-1 text-xs font-medium">
                  solution.ts
                </span>
              </div>
              <CodeEditor ref={editorRef} initialCode={initialCode} onChange={handleCodeChange} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="flex h-full flex-col">
              <div className="border-border bg-secondary flex h-10 shrink-0 items-center border-b px-4">
                <span className="bg-accent rounded-md px-3 py-1 text-xs font-medium">Results</span>
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <TestResults results={results} running={running} error={error} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <AchievementToast show={showAchievement} kataTitle={kata.title} />
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} kataId={kata.id} />
    </div>
  )
}
