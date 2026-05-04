'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#/components/ui/resizable'
import { runTests, type TestResult } from '#/lib/runner'
import { useEffect, useRef, useState } from 'react'
import { AchievementToast } from './AchievementToast'
import { CodeEditor, type CodeEditorHandle } from './CodeEditor'
import { DescriptionPanel } from './DescriptionPanel'
import { KataBar } from './KataBar'
import { LoginDialog } from './LoginDialog'
import { TestResults } from './TestResults'

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

export function KataEditor({ kata, katas }: Props) {
  const editorRef = useRef<CodeEditorHandle>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)

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
      if (!data.requiresAuth && data.xpEarned && data.xpEarned > 0) {
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), 4000)
      }
    }
  }

  async function handleRun() {
    const code = editorRef.current?.getValue()
    if (!code) return
    setRunning(true)
    setResults(null)
    setError(null)
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

  return (
    <div className="flex h-full flex-1 flex-col">
      <KataBar kata={kata} katas={katas} running={running} onRun={handleRun} />

      <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
        <ResizablePanel defaultSize={30} minSize={20}>
          <DescriptionPanel kata={kata} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="flex h-full flex-col">
            <div className="border-border bg-secondary flex h-10 shrink-0 items-center border-b px-4">
              <span className="bg-accent rounded-md px-3 py-1 text-xs font-medium">
                solution.ts
              </span>
            </div>
            <CodeEditor ref={editorRef} initialCode={kata.starterCode} />
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

      <AchievementToast show={showAchievement} kataTitle={kata.title} />

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} kataId={kata.id} />
    </div>
  )
}
