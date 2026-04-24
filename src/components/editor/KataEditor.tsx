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
import { cn } from '#/lib/utils'
import { submitKata } from '#/server/submission'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { Link } from '@tanstack/react-router'
import { basicSetup, EditorView } from 'codemirror'
import { Lightbulb, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

const difficultyColor: Record<Kata['difficulty'], string> = {
  easy: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  medium: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  hard: 'border-red-500/30 text-red-400 bg-red-500/10'
}

const PENDING_SUBMIT_KEY = 'dailykata_pending_submit'

export function KataEditor({ kata, katas }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [revealedHints, setRevealedHints] = useState(0)
  const [descTab, setDescTab] = useState<'description' | 'hints'>('description')
  const [showAchievement, setShowAchievement] = useState(false)
  const hints = kata.hints ?? []

  const currentIndex = katas.findIndex(k => k.id === kata.id)
  const prevKata = currentIndex > 0 ? katas[currentIndex - 1] : null
  const nextKata = currentIndex < katas.length - 1 ? katas[currentIndex + 1] : null

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
      setShowAchievement(true)
      setTimeout(() => setShowAchievement(false), 4000)
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
      {/* Kata bar */}
      <div className="border-border bg-card flex h-12 shrink-0 items-center gap-3 border-b px-5">
        <span className="font-bold tracking-tight">{kata.title}</span>
        <Badge variant="outline" className={difficultyColor[kata.difficulty]}>
          {kata.difficulty}
        </Badge>
        <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-400">
          +100 XP
        </Badge>
        <div className="ml-auto flex gap-2">
          {prevKata ? (
            <Link to="/kata/$kataId" params={{ kataId: prevKata.id }}>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:border-sky-500/70 hover:text-sky-400"
              >
                ← Prev
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled className="opacity-40">
              ← Prev
            </Button>
          )}
          {nextKata ? (
            <Link to="/kata/$kataId" params={{ kataId: nextKata.id }}>
              <Button
                variant="outline"
                size="sm"
                className="border-border text-muted-foreground hover:border-sky-500/70 hover:text-sky-400"
              >
                Next →
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled className="opacity-40">
              Next →
            </Button>
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

      <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
        {/* Description pane */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col">
            <div className="border-border bg-secondary flex h-10 shrink-0 items-center gap-1 border-b px-3">
              <button
                onClick={() => setDescTab('description')}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  descTab === 'description'
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Description
              </button>
              <button
                onClick={() => setDescTab('hints')}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  descTab === 'hints'
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Hints
                {hints.length > 0 && (
                  <span className="text-muted-foreground ml-1">({hints.length})</span>
                )}
              </button>
              <Link
                to="/kata/$kataId_/submissions"
                params={{ kataId: kata.id }}
                className="text-muted-foreground hover:text-foreground ml-1 rounded-md px-3 py-1 text-xs font-medium transition-colors"
              >
                History
              </Link>
            </div>
            <div className="flex-1 overflow-auto p-5 text-sm leading-relaxed">
              {descTab === 'description' ? (
                <pre className="text-foreground/80 font-sans whitespace-pre-wrap">
                  {kata.description}
                </pre>
              ) : (
                <div className="flex flex-col gap-2">
                  {hints.slice(0, revealedHints).map((hint, i) => (
                    <div
                      key={i}
                      className="animate-fade-up border-primary/20 bg-primary/5 rounded-lg border p-2.5 text-xs leading-relaxed"
                    >
                      <span className="font-semibold text-sky-400">Hint {i + 1}:</span> {hint}
                    </div>
                  ))}
                  {revealedHints < hints.length && (
                    <button
                      onClick={() => setRevealedHints(c => c + 1)}
                      className="text-primary/70 hover:text-primary mt-1 flex items-center gap-1 text-xs transition-colors"
                    >
                      <Lightbulb className="h-3 w-3" />
                      Show hint {revealedHints + 1}
                    </button>
                  )}
                  {hints.length === 0 && (
                    <p className="text-muted-foreground text-xs">No hints for this kata.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Editor pane */}
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="flex h-full flex-col">
            <div className="border-border bg-secondary flex h-10 shrink-0 items-center border-b px-4">
              <span className="bg-accent rounded-md px-3 py-1 text-xs font-medium">
                solution.ts
              </span>
            </div>
            <div
              ref={editorRef}
              className="flex-1 overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:h-full"
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Results pane */}
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

      {/* Achievement card */}
      {showAchievement && (
        <div className="animate-slide-in-right bg-card fixed top-[68px] right-5 z-50 flex max-w-[280px] items-center gap-3.5 rounded-xl border border-sky-500/40 p-4 shadow-[0_4px_30px_rgba(2,132,199,0.3)]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-sky-600 to-violet-500 text-xl">
            ⚔
          </div>
          <div>
            <div className="text-sm font-bold">Kata Complete!</div>
            <div className="text-muted-foreground mt-0.5 text-[11px]">{kata.title} — solved</div>
            <div className="mt-1 text-xl font-bold text-sky-400">+100 XP</div>
          </div>
        </div>
      )}

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
