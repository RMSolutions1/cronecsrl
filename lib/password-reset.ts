import { randomBytes } from "crypto"
import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { isPostgresConfigured, getPool } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"
import { readData } from "@/lib/data"

const TOKEN_BYTES = 32
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hora

export type PasswordResetRecord = {
  token: string
  email: string
  expires_at: string
  used: boolean
}

const JSON_FILE = path.join(process.cwd(), "data", "password-reset-tokens.json")
let tableEnsured = false

async function ensurePostgresTable(): Promise<void> {
  if (tableEnsured || !isPostgresConfigured()) return
  const pool = getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_reset_email ON password_reset_tokens(email)`)
  tableEnsured = true
}

async function ensureMysqlTable(): Promise<void> {
  if (tableEnsured || !isMySQLConfigured()) return
  const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
  const pool = getMysqlPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  tableEnsured = true
}

async function readJsonTokens(): Promise<PasswordResetRecord[]> {
  try {
    await mkdir(path.dirname(JSON_FILE), { recursive: true })
    const raw = await readFile(JSON_FILE, "utf-8")
    return JSON.parse(raw) as PasswordResetRecord[]
  } catch {
    return []
  }
}

async function writeJsonTokens(list: PasswordResetRecord[]): Promise<void> {
  await mkdir(path.dirname(JSON_FILE), { recursive: true })
  await writeFile(JSON_FILE, JSON.stringify(list, null, 2), "utf-8")
}

export async function adminEmailExists(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase()
  const admins = await readData<{ email: string }[]>("admins.json")
  return admins.some((a) => a.email?.trim().toLowerCase() === normalized)
}

export async function createPasswordResetToken(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase()
  const exists = await adminEmailExists(normalized)
  if (!exists) return null

  const token = randomBytes(TOKEN_BYTES).toString("hex")
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  if (isPostgresConfigured()) {
    await ensurePostgresTable()
    const pool = getPool()
    await pool.query("DELETE FROM password_reset_tokens WHERE email = $1 OR expires_at < NOW()", [normalized])
    await pool.query(
      "INSERT INTO password_reset_tokens (token, email, expires_at, used) VALUES ($1, $2, $3, false)",
      [token, normalized, expiresAt.toISOString()]
    )
    return token
  }

  if (isMySQLConfigured()) {
    await ensureMysqlTable()
    const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
    const pool = getMysqlPool()
    await pool.query("DELETE FROM password_reset_tokens WHERE email = ? OR expires_at < NOW()", [normalized])
    await pool.query(
      "INSERT INTO password_reset_tokens (token, email, expires_at, used) VALUES (?, ?, ?, 0)",
      [token, normalized, expiresAt]
    )
    return token
  }

  const list = (await readJsonTokens()).filter(
    (t) => t.email !== normalized && new Date(t.expires_at) > new Date() && !t.used
  )
  list.push({ token, email: normalized, expires_at: expiresAt.toISOString(), used: false })
  await writeJsonTokens(list)
  return token
}

export async function validatePasswordResetToken(token: string): Promise<{ ok: boolean; email?: string }> {
  const trimmed = token.trim()
  if (!/^[a-f0-9]{64}$/.test(trimmed)) return { ok: false }

  if (isPostgresConfigured()) {
    await ensurePostgresTable()
    const pool = getPool()
    const r = await pool.query(
      "SELECT email FROM password_reset_tokens WHERE token = $1 AND used = false AND expires_at > NOW() LIMIT 1",
      [trimmed]
    )
    if (!r.rowCount) return { ok: false }
    return { ok: true, email: String(r.rows[0].email) }
  }

  if (isMySQLConfigured()) {
    await ensureMysqlTable()
    const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
    const pool = getMysqlPool()
    const [rows] = await pool.query(
      "SELECT email FROM password_reset_tokens WHERE token = ? AND used = 0 AND expires_at > NOW() LIMIT 1",
      [trimmed]
    )
    const list = rows as { email: string }[]
    if (!list.length) return { ok: false }
    return { ok: true, email: String(list[0].email) }
  }

  const record = (await readJsonTokens()).find(
    (t) => t.token === trimmed && !t.used && new Date(t.expires_at) > new Date()
  )
  if (!record) return { ok: false }
  return { ok: true, email: record.email }
}

export async function consumePasswordResetToken(token: string): Promise<void> {
  const trimmed = token.trim()
  if (isPostgresConfigured()) {
    await poolMarkUsedPg(trimmed)
    return
  }
  if (isMySQLConfigured()) {
    const { getPool: getMysqlPool } = await import("@/lib/db-mysql")
    await getMysqlPool().query("UPDATE password_reset_tokens SET used = 1 WHERE token = ?", [trimmed])
    return
  }
  const list = await readJsonTokens()
  await writeJsonTokens(list.map((t) => (t.token === trimmed ? { ...t, used: true } : t)))
}

async function poolMarkUsedPg(token: string): Promise<void> {
  const pool = getPool()
  await pool.query("UPDATE password_reset_tokens SET used = true WHERE token = $1", [token])
}
