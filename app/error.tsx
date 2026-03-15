"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error en la aplicación:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-xl font-semibold text-foreground">Algo salió mal</h1>
      <p className="max-w-md text-center text-muted-foreground">
        Ocurrió un error al cargar esta página. Probá de nuevo o volvé al inicio.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="default">
          Reintentar
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
