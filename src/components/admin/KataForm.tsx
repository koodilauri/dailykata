import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useState } from 'react'

export interface KataFormData {
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

export function KataForm({ initial, onSubmit, submitLabel }: KataFormProps) {
  const [form, setForm] = useState<KataFormData>({
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Title">
        <Input value={form.title} onChange={e => set('title', e.target.value)} required />
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
        <textarea
          className="border-input bg-background focus-visible:ring-ring min-h-24 w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-1 focus-visible:outline-none"
          value={form.starterCode}
          onChange={e => set('starterCode', e.target.value)}
          required
        />
      </Field>

      <Field label="Tests (hidden from user — use test() / expect() format)">
        <textarea
          className="border-input bg-background focus-visible:ring-ring min-h-32 w-full rounded-md border px-3 py-2 font-mono text-sm focus-visible:ring-1 focus-visible:outline-none"
          value={form.tests}
          onChange={e => set('tests', e.target.value)}
          required
        />
      </Field>

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
