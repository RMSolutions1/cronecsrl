"use client"

import dynamic from "next/dynamic"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((m) => m.default), { ssr: false })

type Props = {
  value: string
  onChange: (markdown: string) => void
  label?: string
}

export function MarkdownBlogContentField({ value, onChange, label = "Contenido (Markdown)" }: Props) {
  return (
    <div className="space-y-2 w-full">
      <span className="text-sm font-medium leading-none">{label}</span>
      <div className="rounded-md border border-input overflow-hidden bg-background" data-color-mode="light">
        <MDEditor value={value} onChange={(v) => onChange(typeof v === "string" ? v : "")} height={380} />
      </div>
      <p className="text-xs text-muted-foreground">Podés usar Markdown (títulos, listas, enlaces). Se guarda en la base tal cual.</p>
    </div>
  )
}
