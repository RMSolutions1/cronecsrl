import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { generateId } from "@/lib/data"
import { isPostgresConfigured, getPool } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"

export type NewsletterSubscriber = {
  id: string
  email: string
  subscribed_at: string
  active: boolean
}

const DATA_FILE = path.join(process.cwd(), "data", "newsletter-subscribers.json")

let tableEnsured = false

async function ensurePostgresTable(): Promise<void> {
  if (tableEnsured || !isPostgresConfigured()) return
  const pool = getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      active BOOLEAN DEFAULT TRUE,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  tableEnsured = true
}

async function ensureMysqlTable(): Promise<void> {
  if (tableEnsured || !isMySQLConfigured()) return
  const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
  const pool = getMysqlPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      active TINYINT(1) DEFAULT 1,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  tableEnsured = true
}

async function readFromJson(): Promise<NewsletterSubscriber[]> {
  try {
    await mkdir(path.dirname(DATA_FILE), { recursive: true })
    const raw = await readFile(DATA_FILE, "utf-8")
    return JSON.parse(raw) as NewsletterSubscriber[]
  } catch {
    return []
  }
}

async function writeToJson(list: NewsletterSubscriber[]): Promise<void> {
  if (process.env.VERCEL && !isPostgresConfigured() && !isMySQLConfigured()) {
    throw new Error("VERCEL_DB_MISSING")
  }
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8")
}

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean; message: string; duplicate?: boolean }> {
  const normalized = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, message: "Ingrese un correo electrónico válido." }
  }

  if (isPostgresConfigured()) {
    await ensurePostgresTable()
    const pool = getPool()
    const existing = await pool.query("SELECT id FROM newsletter_subscribers WHERE email = $1 LIMIT 1", [normalized])
    if (existing.rowCount && existing.rowCount > 0) {
      return { ok: true, message: "Ya está suscrito a nuestro boletín.", duplicate: true }
    }
    await pool.query(
      "INSERT INTO newsletter_subscribers (id, email, active, subscribed_at) VALUES ($1, $2, true, $3)",
      [generateId(), normalized, new Date().toISOString()]
    )
    return { ok: true, message: "¡Gracias! Se suscribió correctamente a nuestro boletín." }
  }

  if (isMySQLConfigured()) {
    await ensureMysqlTable()
    const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
    const pool = getMysqlPool()
    const [rows] = await pool.query("SELECT id FROM newsletter_subscribers WHERE email = ? LIMIT 1", [normalized])
    if (Array.isArray(rows) && rows.length > 0) {
      return { ok: true, message: "Ya está suscrito a nuestro boletín.", duplicate: true }
    }
    await pool.query(
      "INSERT INTO newsletter_subscribers (id, email, active, subscribed_at) VALUES (?, ?, 1, ?)",
      [generateId(), normalized, new Date()]
    )
    return { ok: true, message: "¡Gracias! Se suscribió correctamente a nuestro boletín." }
  }

  const list = await readFromJson()
  if (list.some((s) => s.email === normalized)) {
    return { ok: true, message: "Ya está suscrito a nuestro boletín.", duplicate: true }
  }
  list.unshift({ id: generateId(), email: normalized, subscribed_at: new Date().toISOString(), active: true })
  await writeToJson(list)
  return { ok: true, message: "¡Gracias! Se suscribió correctamente a nuestro boletín." }
}

export async function listNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  if (isPostgresConfigured()) {
    await ensurePostgresTable()
    const pool = getPool()
    const result = await pool.query(
      "SELECT id, email, active, subscribed_at FROM newsletter_subscribers WHERE active = true ORDER BY subscribed_at DESC"
    )
    return result.rows.map((r) => ({
      id: String(r.id),
      email: String(r.email),
      active: !!r.active,
      subscribed_at: r.subscribed_at ? new Date(r.subscribed_at as string).toISOString() : "",
    }))
  }

  if (isMySQLConfigured()) {
    await ensureMysqlTable()
    const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
    const pool = getMysqlPool()
    const [rows] = await pool.query(
      "SELECT id, email, active, subscribed_at FROM newsletter_subscribers WHERE active = 1 ORDER BY subscribed_at DESC"
    )
    return (rows as Record<string, unknown>[]).map((r) => ({
      id: String(r.id),
      email: String(r.email),
      active: !!r.active,
      subscribed_at: r.subscribed_at ? new Date(r.subscribed_at as string).toISOString() : "",
    }))
  }

  return (await readFromJson()).filter((s) => s.active)
}
