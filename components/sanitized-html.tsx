"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

/**
 * Renderiza HTML sanitizado solo en el cliente para evitar cargar
 * isomorphic-dompurify (y jsdom) en el servidor, que falla en Vercel/Node
 * por dependencias ESM-only (html-encoding-sniffer → @exodus/bytes).
 */
export function SanitizedHtml({
  html,
  className,
  as: Tag = "div",
}: {
  html: string
  className?: string
  as?: "div" | "article" | "section"
}) {
  const [sanitized, setSanitized] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    import("isomorphic-dompurify").then(({ default: DOMPurify }) => {
      if (!cancelled) setSanitized(DOMPurify.sanitize(html))
    })
    return () => { cancelled = true }
  }, [html])

  if (sanitized === null) {
    return (
      <div className={cn("animate-pulse rounded-lg bg-muted/50 min-h-[8rem]", className)} aria-hidden />
    )
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  )
}
