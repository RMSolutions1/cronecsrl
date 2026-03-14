/**
 * Ejecuta una consulta a la base Neon y muestra resultados.
 * Uso: node scripts/postgres/query-now.js [connection_url]
 */
const path = require("path")
const fs = require("fs")
const { Pool } = require("pg")

const projectRoot = path.resolve(__dirname, "../..")
const envPath = path.join(projectRoot, ".env.local")
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8")
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (m) {
      let val = m[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1)
      process.env[m[1]] = val
    }
  })
}

const connectionString = process.argv[2] || process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) {
  console.error("Indicá DATABASE_URL en .env.local o pasá la URL como argumento.")
  process.exit(1)
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: true } : undefined,
})

async function main() {
  const client = await pool.connect()
  try {
    console.log("=== Conexión OK ===\n")

    const company = await client.query("SELECT id, company_name, tagline, phone, email FROM company_info LIMIT 1")
    const tables = ["users", "projects", "services", "blog_posts", "contact_submissions", "testimonials", "hero_images", "certifications", "clients"]
    const counts = {}
    for (const t of tables) {
      try {
        const r = await client.query(`SELECT COUNT(*) AS c FROM ${t}`)
        counts[t] = r.rows[0]?.c ?? 0
      } catch (e) {
        counts[t] = e.message?.includes("does not exist") ? "FALTA TABLA" : "error"
      }
    }
    const services = await client.query("SELECT id, title, slug, status FROM services ORDER BY display_order, order_index LIMIT 10")

    console.log("--- company_info ---")
    if (company.rows[0]) {
      console.log(JSON.stringify(company.rows[0], null, 2))
    } else {
      console.log("(sin filas)")
    }

    console.log("\n--- Conteo por tabla ---")
    console.log(counts)

    console.log("\n--- services (primeros 10) ---")
    console.table(services.rows)

    console.log("Consulta finalizada.")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
