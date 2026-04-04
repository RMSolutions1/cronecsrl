import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getPool, isPostgresConfigured } from "@/lib/db-pg"

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return null
  }
  return user
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  if (!isPostgresConfigured()) {
    return NextResponse.json({ error: "Postgres no configurado" }, { status: 503 })
  }
  try {
    const p = getPool()
    const r = await p.query("SELECT key, value FROM site_config ORDER BY key")
    const obj: Record<string, string> = {}
    for (const row of r.rows as { key: string; value: string | null }[]) {
      obj[row.key] = row.value ?? ""
    }
    return NextResponse.json(obj)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  if (!isPostgresConfigured()) {
    return NextResponse.json({ error: "Postgres no configurado" }, { status: 503 })
  }
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  try {
    const p = getPool()
    for (const [key, val] of Object.entries(body)) {
      if (key === "cms_setup_completed") continue
      if (typeof key !== "string" || key.length > 100) continue
      const value = val == null ? "" : String(val)
      await p.query(
        `INSERT INTO site_config (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      )
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
