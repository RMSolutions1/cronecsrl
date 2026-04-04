"use client"

import dynamic from "next/dynamic"
import "@uiw/react-markdown-preview/markdown.css"
import { SanitizedHtml } from "@/components/sanitized-html"

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview").then((m) => m.default), {
  ssr: false,
})

function looksLikeHtml(s: string) {
  const t = s.trimStart()
  return t.startsWith("<")
}

/**
 * Contenido histórico en HTML → SanitizedHtml. Nuevo contenido en Markdown → preview.
 */
export function BlogPostBody({ content, className }: { content: string; className?: string }) {
  if (!content) return null
  if (looksLikeHtml(content)) {
    return <SanitizedHtml html={content} className={className} />
  }
  return (
    <div className={className} data-color-mode="light">
      <MarkdownPreview source={content} />
    </div>
  )
}
