/**
 * Migraciones aditivas para CMS (no reemplazan tablas existentes: projects, services, blog_posts, etc.).
 * Solo crea tablas nuevas si no existen.
 */
import { getPool, isPostgresConfigured } from "@/lib/db-pg"

export async function runCmsAdditiveMigrations(): Promise<{ ok: boolean; steps: string[]; error?: string }> {
  const steps: string[] = []
  if (!isPostgresConfigured()) {
    return { ok: false, steps, error: "Postgres no configurado (DATABASE_URL o POSTGRES_URL)" }
  }
  try {
    const p = getPool()
    await p.query(`
CREATE TABLE IF NOT EXISTS site_config (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
`)
    steps.push("site_config")
    await p.query(`
CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200) DEFAULT '',
  role VARCHAR(200) DEFAULT '',
  bio TEXT,
  image_url TEXT,
  linkedin_url VARCHAR(300),
  order_index INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);
`)
    steps.push("team_members")
    return { ok: true, steps }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, steps, error: msg }
  }
}
