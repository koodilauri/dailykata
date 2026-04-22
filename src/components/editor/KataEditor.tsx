'use client'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '#/components/ui/dialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#/components/ui/resizable'
import { signIn } from '#/lib/auth-client'
import { runTests, type TestResult } from '#/lib/runner'
import { submitKata } from '#/server/submission'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup, EditorView } from 'codemirror'
import { Flame, Lightbulb, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
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

const difficultyColor: Record<Kata['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const PENDING_SUBMIT_KEY = 'dailykata_pending_submit'

export function KataEditor({ kata }: { kata: Kata }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)
  const hints = kata.hints ?? []

  useEffect(() => {
    if (!editorRef.current) return
    const view = new EditorView({
      doc: kata.starterCode,
      extensions: [basicSetup, javascript({ typescript: true }), oneDark],
      parent: editorRef.current
    })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [kata.starterCode])

  // Auto-submit if returning from OAuth with a pending submission
  useEffect(() => {
    const pending = localStorage.getItem(PENDING_SUBMIT_KEY)
    if (!pending) return
    const parsed = JSON.parse(pending) as { kataId: string; code: string }
    if (parsed.kataId !== kata.id) return
    localStorage.removeItem(PENDING_SUBMIT_KEY)
    void handleSave(parsed.code, true)
  }, [kata.id])

  async function handleSave(code: string, passed: boolean) {
    const result = await submitKata({ data: { kataId: kata.id, code, passed } })
    if (result.requiresAuth) {
      localStorage.setItem(PENDING_SUBMIT_KEY, JSON.stringify({ kataId: kata.id, code }))
      setLoginOpen(true)
      return
    }
    if (result.xpEarned > 0) {
      toast.success(`+${result.xpEarned} XP earned!`, {
        description: 'Progress saved.',
        icon: <Flame className="h-4 w-4 text-orange-500" />
      })
    } else if (passed) {
      toast('Already completed', { description: 'Submission saved, no new XP.' })
    }
  }

  async function handleRun() {
    if (!viewRef.current) return
    const code = viewRef.current.state.doc.toString()
    setRunning(true)
    setResults(null)
    setError(null)
    try {
      const res = await runTests(code, kata.tests)
      setResults(res)
      const passed = res.every(r => r.passed)
      if (passed) void handleSave(code, true)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <span className="font-semibold">{kata.title}</span>
        <Badge className={difficultyColor[kata.difficulty]}>{kata.difficulty}</Badge>
        <div className="ml-auto">
          <Button onClick={handleRun} disabled={running} size="sm">
            <Play className="mr-1 h-4 w-4" />
            {running ? 'Running…' : 'Run Tests'}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full overflow-auto p-4 text-sm leading-relaxed">
            <pre className="font-sans whitespace-pre-wrap">{kata.description}</pre>

            {hints.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Hints
                </div>
                <div className="flex flex-col gap-2">
                  {hints.slice(0, revealedHints).map((hint, i) => (
                    <div key={i} className="bg-muted rounded p-2.5 text-xs">
                      <span className="font-semibold">Hint {i + 1}:</span> {hint}
                    </div>
                  ))}
                </div>
                {revealedHints < hints.length && (
                  <button
                    onClick={() => setRevealedHints(c => c + 1)}
                    className="text-muted-foreground hover:text-foreground mt-2 text-xs underline underline-offset-2"
                  >
                    Show hint {revealedHints + 1}
                  </button>
                )}
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={25}>
          <div
            ref={editorRef}
            className="h-full overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:h-full"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col overflow-hidden">
            <TestResults results={results} running={running} error={error} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to save progress</DialogTitle>
            <DialogDescription>
              You solved it! Sign in with GitHub to save your XP and streak. Your solution will be
              submitted automatically after signing in.
            </DialogDescription>
          </DialogHeader>
          <Button
            className="w-full"
            onClick={() =>
              signIn.social({
                provider: 'github',
                callbackURL: `/kata/${kata.id}`
              })
            }
          >
            Sign in with GitHub
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
