/**
 * Pool PostgreSQL (Neon u otro) para CRONEC.
 * Usa DATABASE_URL o POSTGRES_URL en .env.local (nunca subas la URL al repositorio).
 */
import { Pool } from "pg"

let pool: Pool | null = null

export function isPostgresConfigured(): boolean {
  return !!(process.env.DATABASE_URL || process.env.POSTGRES_URL)
}

function getConnectionString(): string {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) throw new Error("Postgres no configurado: definid DATABASE_URL o POSTGRES_URL en .env.local")
  return url
}

export function getPool(): Pool {
  if (!pool) {
    if (!isPostgresConfigured()) {
      throw new Error("Postgres no configurado: definid DATABASE_URL o POSTGRES_URL en .env")
    }
    pool = new Pool({
      connectionString: getConnectionString(),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: /sslmode=(require|verify-full)/.test(process.env.DATABASE_URL || process.env.POSTGRES_URL || "") ? { rejectUnauthorized: true } : undefined,
    })
  }
  return pool
}

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
  const p = getPool()
  const result = await p.query(sql, params ?? [])
  return result.rows as T
}
