/** Actualiza domicilio y datos legales en company_info (Neon) desde data/settings.json */
const path = require("path")
const fs = require("fs")
const { normalizePostgresConnectionString, postgresPoolSsl } = require("./pg-ssl")

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

const settings = JSON.parse(fs.readFileSync(path.join(projectRoot, "data", "settings.json"), "utf-8"))
const known = ["company_name", "tagline", "description", "mission", "vision", "values", "address", "phone", "email", "whatsapp", "facebook_url", "instagram_url", "linkedin_url", "twitter_url", "youtube_url", "founded_year", "cuit", "logo_url"]
const extra = {}
for (const [k, v] of Object.entries(settings)) {
  if (!known.includes(k)) extra[k] = v
}

const { Pool } = require("pg")
const pool = new Pool({ connectionString: normalizePostgresConnectionString(raw), ssl: postgresPoolSsl(raw) })

async function main() {
  const c = await pool.connect()
  try {
    await c.query(
      `UPDATE company_info SET
         company_name = $2,
         tagline = $3,
         description = $4,
         address = $5,
         phone = $6,
         email = $7,
         whatsapp = $8,
         founded_year = $9,
         cuit = $10,
         extra = COALESCE(extra, '{}'::jsonb) || $11::jsonb,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [
        "00000000-0000-0000-0000-000000000001",
        settings.company_name,
        settings.tagline,
        settings.description,
        settings.address,
        settings.phone,
        settings.email,
        settings.whatsapp,
        settings.founded_year,
        settings.cuit,
        JSON.stringify(extra),
      ]
    )
    console.log("OK company_info actualizado:", settings.address)
  } finally {
    c.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
