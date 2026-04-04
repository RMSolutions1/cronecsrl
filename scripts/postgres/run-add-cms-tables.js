/**
 * Ejecuta scripts/postgres/add-cms-tables.sql contra Neon/Postgres.
 * Uso: npm run db:add-cms-tables (requiere DATABASE_URL o POSTGRES_URL en .env.local)
 */
const path = require("path")
const fs = require("fs")
const { Pool } = require("pg")

const projectRoot = process.cwd() || path.resolve(__dirname, "../..")
const envPaths = [path.join(projectRoot, ".env.local"), path.resolve(__dirname, "../..", ".env.local")]
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8")
    content.split("\n").forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("#") || !trimmed) return
      const eq = trimmed.indexOf("=")
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim()
        let val = trimmed.slice(eq + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1)
        process.env[key] = val
      }
    })
    break
  }
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) {
  console.error("Faltan DATABASE_URL o POSTGRES_URL en .env.local")
  process.exit(1)
}

const sqlPath = path.join(__dirname, "add-cms-tables.sql")
let sql = fs.readFileSync(sqlPath, "utf-8")
sql = sql
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")

const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0)

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: true } : undefined,
})

async function main() {
  const client = await pool.connect()
  try {
    console.log("Ejecutando add-cms-tables.sql (" + statements.length + " sentencias)...")
    for (let i = 0; i < statements.length; i++) {
      await client.query(statements[i] + ";")
    }
    console.log("OK: site_config y team_members creadas o ya existían.")

    const check = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('site_config','team_members') ORDER BY table_name`
    )
    console.log("Tablas presentes:", check.rows.map((r) => r.table_name).join(", "))
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
