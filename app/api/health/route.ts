/**
 * Health check para monitoreo externo (Uptime Robot, Vercel, etc.).
 * GET /api/health → { ok, timestamp, db }
 */
import { isPostgresConfigured, getPool } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function checkDatabase(): Promise<{ ok: boolean; backend: string | null }> {
  try {
    if (isPostgresConfigured()) {
      const pool = getPool()
      await pool.query("SELECT 1")
      return { ok: true, backend: "postgres" }
    }
    if (isMySQLConfigured()) {
      const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
      const pool = getMysqlPool()
      await pool.query("SELECT 1")
      return { ok: true, backend: "mysql" }
    }
    return { ok: true, backend: "json" }
  } catch {
    return { ok: false, backend: isPostgresConfigured() ? "postgres" : isMySQLConfigured() ? "mysql" : "json" }
  }
}

export async function GET() {
  const db = await checkDatabase()
  const ok = db.ok
  const status = ok ? 200 : 503
  return Response.json(
    {
      ok,
      timestamp: new Date().toISOString(),
      db: db.backend,
      dbOk: db.ok,
    },
    { status }
  )
}
