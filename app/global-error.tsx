"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Error global:", error)
  }, [error])

  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Algo salió mal</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Ocurrió un error al cargar el sitio. Probá de nuevo.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1e3a5f",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
        <p style={{ marginTop: "1.5rem" }}>
          <Link href="/" style={{ color: "#1e3a5f" }}>
            Volver al inicio
          </Link>
        </p>
      </body>
    </html>
  )
}
