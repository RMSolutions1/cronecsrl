/** Importa calculadora.json, sections.json y nosotros.json a site_config (Neon). */
const path = require("path")
const fs = require("fs")
const { normalizePostgresConnectionString, postgresPoolSsl } = require("./pg-ssl")

const BLOB_KEYS = {
  "calculadora.json": "cms_calculadora",
  "sections.json": "cms_sections",
  "nosotros.json": "cms_nosotros",
}

const projectRoot = process.cwd()
const envPath = path.join(projectRoot, ".env.local")
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8").split("\n").forEach((line) => {
    const t = line.trim()
    if (!t || t.startsWith("#")) return
    const i = t.indexOf("=")
    if (i > 0) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  })
}

const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!raw) {
  console.error("Faltan DATABASE_URL o POSTGRES_URL")
  process.exit(1)
}

const { Pool } = require("pg")
const pool = new Pool({ connectionString: normalizePostgresConnectionString(raw), ssl: postgresPoolSsl(raw) })

async function main() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_config (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    for (const [filename, key] of Object.entries(BLOB_KEYS)) {
      const filePath = path.join(projectRoot, "data", filename)
      if (!fs.existsSync(filePath)) {
        console.log("skip (no file):", filename)
        continue
      }
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
      await client.query(
        `INSERT INTO site_config (key, value, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(data)]
      )
      console.log("OK:", filename)
    }
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
