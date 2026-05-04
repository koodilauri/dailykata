'use client'

import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup, EditorView } from 'codemirror'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface CodeEditorHandle {
  getValue: () => string
}

interface Props {
  initialCode: string
  onChange?: (value: string) => void
}

export const CodeEditor = forwardRef<CodeEditorHandle, Props>(function CodeEditor(
  { initialCode, onChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useImperativeHandle(ref, () => ({
    getValue: () => viewRef.current?.state.doc.toString() ?? ''
  }))

  useEffect(() => {
    if (!containerRef.current) return
    const view = new EditorView({
      doc: initialCode,
      extensions: [
        basicSetup,
        javascript({ typescript: true }),
        oneDark,
        EditorView.updateListener.of(update => {
          if (update.docChanged) onChangeRef.current?.(update.state.doc.toString())
        })
      ],
      parent: containerRef.current
    })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [initialCode])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:h-full"
    />
  )
})
