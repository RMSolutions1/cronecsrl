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
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center", background: "#f8fafc" }}>
        <div style={{ maxWidth: "28rem", margin: "4rem auto" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e3a5f", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
            CRONEC SRL
          </p>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#0f172a" }}>Algo salió mal</h1>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Ocurrió un error al cargar el sitio. Puede reintentar o volver al inicio.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.625rem 1.25rem",
              backgroundColor: "#1e3a5f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "0.75rem",
            }}
          >
            Reintentar
          </button>
          <Link href="/" style={{ color: "#1e3a5f", fontWeight: 500 }}>
            Volver al inicio
          </Link>
          <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#64748b" }}>
            ¿Necesita ayuda?{" "}
            <a href="tel:+5493875361210" style={{ color: "#1e3a5f" }}>
              +54 9 387 536-1210
            </a>
          </p>
        </div>
      </body>
    </html>
  )
}
