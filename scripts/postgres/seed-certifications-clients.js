/**
 * Importa data/certifications.json y data/clients.json a Neon (upsert).
 * Uso: npm run db:seed-certs-clients
 */
const path = require("path")
const fs = require("fs")
const { normalizePostgresConnectionString, postgresPoolSsl } = require("./pg-ssl")

const projectRoot = process.cwd()
const envPath = path.join(projectRoot, ".env.local")
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
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
const pool = new Pool({
  connectionString: normalizePostgresConnectionString(raw),
  ssl: postgresPoolSsl(raw),
})

async function upsertCert(client, row) {
  await client.query(
    `INSERT INTO certifications (id, name, logo_url, order_index, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, logo_url = EXCLUDED.logo_url, order_index = EXCLUDED.order_index, updated_at = NOW()`,
    [row.id, row.name, row.logo_url ?? null, row.order_index ?? 0]
  )
}

async function upsertCli(client, row) {
  await client.query(
    `INSERT INTO clients (id, name, logo_url, order_index, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, logo_url = EXCLUDED.logo_url, order_index = EXCLUDED.order_index, updated_at = NOW()`,
    [row.id, row.name, row.logo_url ?? null, row.order_index ?? 0]
  )
}

async function main() {
  const certs = JSON.parse(fs.readFileSync(path.join(projectRoot, "data", "certifications.json"), "utf-8"))
  const clients = JSON.parse(fs.readFileSync(path.join(projectRoot, "data", "clients.json"), "utf-8"))
  const c = await pool.connect()
  try {
    for (const row of certs) await upsertCert(c, row)
    for (const row of clients) await upsertCli(c, row)
    console.log("OK:", certs.length, "certificaciones,", clients.length, "clientes importados a Neon.")
  } finally {
    c.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
