import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { runMigrations } from "@/lib/migrations"
import { getPool, isPostgresConfigured } from "@/lib/db-pg"
import { generateId } from "@/lib/data"

const COMPANY_INFO_ID = "00000000-0000-0000-0000-000000000001"

/**
 * POST /api/admin/setup
 * Ejecutar UNA vez: migraciones aditivas + seed mínimo + usuario admin opcional.
 * Cabecera obligatoria: x-cms-setup-secret (igual a CMS_SETUP_SECRET en .env)
 */
export async function POST(request: Request) {
  const secret = process.env.CMS_SETUP_SECRET
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Definí CMS_SETUP_SECRET en el entorno" }, { status: 503 })
  }
  const sent = request.headers.get("x-cms-setup-secret")
  if (sent !== secret) {
    return NextResponse.json({ ok: false, error: "Secret inválido" }, { status: 401 })
  }

  if (!isPostgresConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL o POSTGRES_URL requerido" }, { status: 400 })
  }

  const mig = await runMigrations()
  if (!mig.ok) {
    return NextResponse.json({ ok: false, error: mig.error, steps: mig.steps }, { status: 500 })
  }

  const p = getPool()
  try {
    const done = await p.query("SELECT 1 FROM site_config WHERE key = $1 AND value = $2", [
      "cms_setup_completed",
      "true",
    ])
    if (done.rows.length > 0) {
      return NextResponse.json({
        ok: true,
        alreadyRan: true,
        message: "El setup ya se ejecutó antes. No se duplicaron datos.",
        migrations: mig.steps,
      })
    }

    const info = await p.query(
      `SELECT company_name, tagline, description, phone, email, address, cuit FROM company_info WHERE id = $1 LIMIT 1`,
      [COMPANY_INFO_ID]
    )
    const row = info.rows[0] as Record<string, unknown> | undefined
    const upserts: [string, string][] = []
    if (row) {
      if (row.company_name) upserts.push(["site_company_name", String(row.company_name)])
      if (row.tagline) upserts.push(["site_tagline", String(row.tagline)])
      if (row.description) upserts.push(["site_description", String(row.description)])
      if (row.phone) upserts.push(["site_phone", String(row.phone)])
      if (row.email) upserts.push(["site_email", String(row.email)])
      if (row.address) upserts.push(["site_address", String(row.address)])
      if (row.cuit) upserts.push(["site_cuit", String(row.cuit)])
    }
    for (const [k, v] of upserts) {
      await p.query(
        `INSERT INTO site_config (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [k, v]
      )
    }

    const adminEmail = "admin@cronecsrl.com.ar"
    const existing = await p.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [adminEmail])
    let adminCreated = false
    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash("Cronec2024!", 10)
      const id = generateId()
      await p.query(
        `INSERT INTO users (id, email, password_hash, full_name, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [id, adminEmail, hash, "Administrador CRONEC", "superadmin"]
      )
      adminCreated = true
    }

    await p.query(
      `INSERT INTO site_config (key, value, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      ["cms_setup_completed", "true"]
    )

    return NextResponse.json({
      ok: true,
      alreadyRan: false,
      migrations: mig.steps,
      siteConfigKeysSeeded: upserts.length,
      adminUserCreated: adminCreated,
      adminEmail,
      warning: adminCreated
        ? "Cambiá la contraseña del usuario admin tras el primer login."
        : "El usuario admin ya existía; no se creó uno nuevo.",
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
