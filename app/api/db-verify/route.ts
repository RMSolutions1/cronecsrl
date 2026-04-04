/**
 * Verificación de conexión y tablas para diagnóstico.
 * GET /api/db-verify → { backend, tables, ok }
 * En producción: requiere header X-Admin-Key con valor DB_VERIFY_KEY o solo en desarrollo.
 */
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured, getPool as getPoolMysql } from "@/lib/db-mysql"
import { getPool as getPoolPg, query as queryPg } from "@/lib/db-pg"

/** Tablas core (MySQL y Postgres tras schema estándar). */
const DB_TABLES = [
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

/** Solo Postgres: migraciones aditivas CMS (ver lib/cms-migrations.ts). */
const POSTGRES_EXTRA_TABLES = ["site_config", "team_members"] as const

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type TableStatus = Record<string, number | "missing" | "error">

async function getPostgresTableCounts(): Promise<TableStatus> {
  const result: TableStatus = {}
  const p = getPoolPg()
  const tables = [...DB_TABLES, ...POSTGRES_EXTRA_TABLES] as const
  for (const table of tables) {
    try {
      const rows = await queryPg<{ count: string }[]>(`SELECT COUNT(*) AS count FROM ${table}`)
      result[table] = parseInt(rows?.[0]?.count ?? "0", 10)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      result[table] = msg.includes("does not exist") ? "missing" : "error"
    }
  }
  return result
}

async function getMySQLTableCounts(): Promise<TableStatus> {
  const result: TableStatus = {}
  const p = getPoolMysql()
  for (const table of DB_TABLES) {
    try {
      const [rows] = await p.query(`SELECT COUNT(*) AS count FROM \`${table}\``)
      const row = Array.isArray(rows) ? rows[0] : null
      const count = row && typeof row === "object" && "count" in row ? Number((row as { count: number }).count) : 0
      result[table] = count
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      result[table] = msg.includes("doesn't exist") || msg.includes("Unknown table") ? "missing" : "error"
    }
  }
  return result
}

export async function GET(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === "production"
    if (isProduction) {
      const user = await getCurrentUser()
      const allowedBySession = user && ["admin", "superadmin"].includes(user.role)
      const expectedKey = process.env.DB_VERIFY_KEY
      const providedKey = request.headers.get("x-admin-key")
      const allowedByKey = expectedKey && providedKey === expectedKey
      if (!allowedBySession && !allowedByKey) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
      }
    }

    const backend = isPostgresConfigured() ? "postgres" : isMySQLConfigured() ? "mysql" : "json"
    let tables: TableStatus = {}

    if (backend === "postgres") {
      tables = await getPostgresTableCounts()
    } else if (backend === "mysql") {
      tables = await getMySQLTableCounts()
    }

    const missing = Object.entries(tables).filter(([, v]) => v === "missing")
    const ok = missing.length === 0

    return NextResponse.json({
      backend,
      tables,
      ok,
      message: ok
        ? "Conexión y tablas OK. Los cambios del dashboard se persisten en la BD."
        : `Faltan tablas: ${missing.map(([t]) => t).join(", ")}. ${
            backend === "mysql"
              ? "Ejecutá scripts/mysql/schema.sql."
              : "En Neon: scripts/postgres/schema.sql (completo) o scripts/postgres/add-cms-tables.sql (solo site_config y team_members si el resto ya existe)."
          }`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { backend: "error", tables: {}, ok: false, message: `Error: ${message}` },
      { status: 500 }
    )
  }
}
