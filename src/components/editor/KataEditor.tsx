'use client'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '#/components/ui/resizable'
import { runTests, type TestResult } from '#/lib/runner'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup, EditorView } from 'codemirror'
import { Play } from 'lucide-react'
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

const difficultyColor: Record<Kata['difficulty'], string> = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export function KataEditor({ kata }: { kata: Kata }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  async function handleRun() {
    if (!viewRef.current) return
    const code = viewRef.current.state.doc.toString()
    setRunning(true)
    setResults(null)
    setError(null)
    try {
      const res = await runTests(code, kata.tests)
      setResults(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
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
        {/* Description */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full overflow-auto p-4 text-sm leading-relaxed">
            <pre className="font-sans whitespace-pre-wrap">{kata.description}</pre>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Editor */}
        <ResizablePanel defaultSize={40} minSize={25}>
          <div
            ref={editorRef}
            className="h-full overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:h-full"
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Test results */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col overflow-hidden">
            <TestResults results={results} running={running} error={error} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
