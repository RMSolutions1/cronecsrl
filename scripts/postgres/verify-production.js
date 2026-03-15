/**
 * Verificación de la base de datos para producción.
 * Uso: node scripts/postgres/verify-production.js
 * Lee DATABASE_URL o POSTGRES_URL de .env.local
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

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) {
  console.error("Indicá DATABASE_URL o POSTGRES_URL en .env.local")
  process.exit(1)
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: true } : undefined,
})

const REQUIRED_TABLES = [
  "users",
  "projects",
  "services",
  "testimonials",
  "company_info",
  "contact_submissions",
  "blog_posts",
  "hero_images",
  "certifications",
  "clients",
]

async function main() {
  const client = await pool.connect()
  const report = { ok: true, errors: [], checks: [] }

  try {
    // 1. Conexión
    report.checks.push({ name: "Conexión", status: "OK" })

    // 2. Tablas existentes y conteos
    const counts = {}
    for (const table of REQUIRED_TABLES) {
      try {
        const r = await client.query(`SELECT COUNT(*) AS c FROM ${table}`)
        counts[table] = parseInt(r.rows[0]?.c ?? 0, 10)
      } catch (e) {
        counts[table] = "missing"
        report.ok = false
        report.errors.push(`Tabla ${table}: no existe`)
      }
    }
    report.checks.push({ name: "Tablas", status: Object.values(counts).some((v) => v === "missing") ? "FALTA" : "OK", counts })

    // 3. company_info con al menos una fila
    const company = await client.query("SELECT id, company_name, email FROM company_info LIMIT 1")
    if (!company.rows[0]) {
      report.ok = false
      report.errors.push("company_info está vacía. Ejecutá el INSERT del schema.sql en Neon.")
    }
    report.checks.push({
      name: "company_info",
      status: company.rows[0] ? "OK" : "VACÍA",
      row: company.rows[0] ? { id: company.rows[0].id, company_name: company.rows[0].company_name } : null,
    })

    // 4. Al menos un usuario admin
    const users = await client.query('SELECT id, email, role FROM users WHERE role IN (\'admin\', \'superadmin\') LIMIT 5')
    if (!users.rows.length) {
      report.ok = false
      report.errors.push("No hay ningún usuario con role admin o superadmin. Ejecutá db:seed-admin-pg.")
    }
    report.checks.push({
      name: "Usuario admin",
      status: users.rows.length ? "OK" : "FALTA",
      count: users.rows.length,
      emails: users.rows.map((r) => r.email),
    })

    // 5. Estructura mínima de company_info (columnas que usa la app)
    const cols = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'company_info' AND table_schema = 'public'
      ORDER BY ordinal_position
    `)
    const columnNames = cols.rows.map((r) => r.column_name)
    const needed = ["id", "company_name", "phone", "email", "extra"]
    const missingCols = needed.filter((c) => !columnNames.includes(c))
    if (missingCols.length) {
      report.ok = false
      report.errors.push("company_info le faltan columnas: " + missingCols.join(", "))
    }
    report.checks.push({ name: "Estructura company_info", status: missingCols.length ? "FALTA" : "OK" })

    // Salida
    console.log("=== Verificación BD para producción ===\n")
    report.checks.forEach((c) => {
      const s = c.status === "OK" ? "✅" : "❌"
      console.log(`${s} ${c.name}`)
      if (c.counts) console.log("   ", c.counts)
      if (c.row) console.log("   ", c.row)
      if (c.emails) console.log("   ", c.emails)
    })
    if (report.errors.length) {
      console.log("\nErrores:")
      report.errors.forEach((e) => console.log("  -", e))
    }
    console.log("\n" + (report.ok ? "Estado: LISTO para producción." : "Estado: corregir los puntos anteriores."))
  } finally {
    client.release()
    await pool.end()
  }
  process.exit(report.ok ? 0 : 1)
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
