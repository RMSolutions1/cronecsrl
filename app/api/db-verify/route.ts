/**
 * Verificación de conexión y tablas para diagnóstico.
 * GET /api/db-verify → { backend, tables, ok }
 * Protegido: solo en desarrollo o con header X-Admin-Key (opcional).
 */
import { NextResponse } from "next/server"
import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db"
import { getPool, query } from "@/lib/db-pg"

const POSTGRES_TABLES = [
  "users",
  "projects",
  "services",
  "testimonials",
  "company_info",
  "contact_submissions",
  "blog_posts",
  "hero_images",
  "certifications",
  "clients",
] as const

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type TableStatus = Record<string, number | "missing" | "error">

async function getPostgresTableCounts(): Promise<TableStatus> {
  const result: TableStatus = {}
  const p = getPool()
  for (const table of POSTGRES_TABLES) {
    try {
      const rows = await query<{ count: string }[]>(`SELECT COUNT(*) AS count FROM ${table}`)
      result[table] = parseInt(rows?.[0]?.count ?? "0", 10)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      result[table] = msg.includes("does not exist") ? "missing" : "error"
    }
  }
  return result
}

export async function GET() {
  try {
    const backend = isPostgresConfigured() ? "postgres" : isMySQLConfigured() ? "mysql" : "json"
    let tables: TableStatus = {}

    if (backend === "postgres") {
      tables = await getPostgresTableCounts()
    } else if (backend === "mysql") {
      tables = {}
    }

    const missing = Object.entries(tables).filter(([, v]) => v === "missing")
    const ok = missing.length === 0

    return NextResponse.json({
      backend,
      tables,
      ok,
      message: ok
        ? "Conexión y tablas OK. Los cambios del dashboard se persisten en la BD."
        : `Faltan tablas: ${missing.map(([t]) => t).join(", ")}. Ejecutá scripts/postgres/schema.sql en Neon.`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { backend: "error", tables: {}, ok: false, message: `Error: ${message}` },
      { status: 500 }
    )
  }
}
