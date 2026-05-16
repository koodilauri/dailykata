'use client'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { CodeEditor, type CodeEditorHandle } from '#/components/editor/CodeEditor'
import { TestResults } from '#/components/editor/TestResults'
import { runTests, type TestResult } from '#/lib/runner'
import { Play } from 'lucide-react'
import { useRef, useState } from 'react'

export interface KataFormData {
  slug: string
  title: string
  description: string
  starterCode: string
  tests: string
  hints: string
  difficulty: 'easy' | 'medium' | 'hard'
  order: number
  published: boolean
}

interface KataFormProps {
  initial?: Partial<KataFormData>
  onSubmit: (data: KataFormData) => Promise<void>
  submitLabel: string
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function KataForm({ initial, onSubmit, submitLabel }: KataFormProps) {
  const [form, setForm] = useState<KataFormData>({
    slug: initial?.slug ?? '',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    starterCode: initial?.starterCode ?? '',
    tests: initial?.tests ?? '',
    hints: initial?.hints ?? '',
    difficulty: initial?.difficulty ?? 'easy',
    order: initial?.order ?? 1,
    published: initial?.published ?? false
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const solutionRef = useRef<CodeEditorHandle>(null)
  const [testResults, setTestResults] = useState<TestResult[] | null>(null)
  const [testRunning, setTestRunning] = useState(false)
  const [testError, setTestError] = useState<string | null>(null)

  function set<K extends keyof KataFormData>(key: K, value: KataFormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function handleRunTests() {
    const code = solutionRef.current?.getValue() ?? ''
    setTestRunning(true)
    setTestResults(null)
    setTestError(null)
    try {
      const results = await runTests(code, form.tests)
      setTestResults(results)
    } catch (e) {
      setTestError(e instanceof Error ? e.message : String(e))
    } finally {
      setTestRunning(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Title">
        <Input
          value={form.title}
          onChange={e => {
            set('title', e.target.value)
            if (!initial?.slug) set('slug', slugify(e.target.value))
          }}
          required
        />
      </Field>

      <Field label="Slug (URL identifier)">
        <div className="flex gap-2">
          <Input
            value={form.slug}
            onChange={e => set('slug', e.target.value)}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Lowercase letters, numbers and hyphens only"
            required
            className="font-mono text-sm"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => set('slug', slugify(form.title))}
            className="shrink-0"
          >
            Auto
          </Button>
        </div>
        <p className="text-muted-foreground text-[11px]">URL: /kata/{form.slug || '…'}</p>
      </Field>

      <Field label="Description (shown to user)">
        <textarea
          className="border-input bg-background focus-visible:ring-ring min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          required
        />
      </Field>

      <Field label="Starter code (TypeScript)">
        <div className="border-input h-40 overflow-hidden rounded-md border">
          <CodeEditor initialCode={form.starterCode} onChange={v => set('starterCode', v)} />
        </div>
      </Field>

      <Field label="Tests (hidden from user — use test() / expect() format)">
        <div className="border-input h-48 overflow-hidden rounded-md border">
          <CodeEditor initialCode={form.tests} onChange={v => set('tests', v)} />
        </div>
      </Field>

      {/* Test runner */}
      <div className="flex flex-col gap-3 rounded-xl border border-dashed p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Test your kata</span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleRunTests}
            disabled={testRunning}
            className="gap-1.5"
          >
            <Play className="h-3.5 w-3.5" />
            {testRunning ? 'Running…' : 'Run Tests'}
          </Button>
        </div>
        <p className="text-muted-foreground -mt-1 text-xs">
          Write a reference solution below to verify your tests pass.
        </p>
        <div className="border-input h-40 overflow-hidden rounded-md border">
          <CodeEditor
            ref={solutionRef}
            initialCode={initial?.starterCode ?? '// Write a reference solution here\n'}
          />
        </div>
        {(testResults !== null || testError !== null) && (
          <div className="max-h-64 overflow-auto rounded-md border">
            <TestResults results={testResults} running={testRunning} error={testError} />
          </div>
        )}
      </div>

      <Field label="Hints (one per line)">
        <textarea
          className="border-input bg-background focus-visible:ring-ring min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-none"
          value={form.hints}
          onChange={e => set('hints', e.target.value)}
          placeholder="First hint&#10;Second hint&#10;Third hint"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Difficulty">
          <select
            className="border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 text-sm focus-visible:ring-1 focus-visible:outline-none"
            value={form.difficulty}
            onChange={e => set('difficulty', e.target.value as KataFormData['difficulty'])}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </Field>

        <Field label="Order">
          <Input
            type="number"
            min={1}
            value={form.order}
            onChange={e => set('order', Number(e.target.value))}
            required
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={e => set('published', e.target.checked)}
          className="h-4 w-4 rounded border"
        />
        Publish immediately
      </label>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={saving} className="self-start">
        {saving ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  )
}
