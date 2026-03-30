"use client"

import { cn } from "@/lib/utils"

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed top-4 left-4 z-[9999]",
        "bg-primary text-primary-foreground",
        "px-4 py-2 rounded-md font-medium",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        "transition-all duration-200"
      )}
    >
      Saltar al contenido principal
    </a>
  )
}
