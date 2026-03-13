/**
 * Ejecuta consultas de ejemplo contra la base MySQL y muestra los resultados.
 * Uso: npm run db:query
 *      node scripts/mysql/run-query.js "SELECT * FROM company_info"
 */
const path = require("path")
const fs = require("fs")

function loadEnv() {
  const candidates = [".env.local", ".env.production", ".env"]
  for (const p of candidates) {
    const full = path.resolve(process.cwd(), p)
    if (fs.existsSync(full)) {
      require("dotenv").config({ path: full })
      return
    }
  }
}
loadEnv()

const mysql = require("mysql2/promise")

function formatTable(rows) {
  if (!rows.length) return "(0 filas)"
  const keys = Object.keys(rows[0])
  const colWidth = (key) => Math.max(String(key).length, ...rows.map((r) => String(r[key] ?? "").slice(0, 40)).map((s) => s.length))
  const widths = keys.map(colWidth)
  const line = (r) => keys.map((k, i) => String(r[k] ?? "").slice(0, 40).padEnd(widths[i])).join(" | ")
  return [keys.map((k, i) => k.padEnd(widths[i])).join(" | "), ...rows.map(line)].join("\n")
}

async function main() {
  const user = process.env.MYSQL_USER
  const database = process.env.MYSQL_DATABASE
  if (!user || !database) {
    console.error("Configura MYSQL_* en .env.local")
    process.exit(1)
  }

  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user,
    password: process.env.MYSQL_PASSWORD || "",
    database,
    charset: "utf8mb4",
  })

  const customSql = process.argv[2]
  if (customSql) {
    console.log("Consulta:", customSql)
    const [rows] = await conn.query(customSql)
    console.log(formatTable(Array.isArray(rows) ? rows : [rows]))
    await conn.end()
    return
  }

  // Consultas de ejemplo
  const queries = [
    { name: "Resumen (cantidad por tabla)", sql: null },
    { name: "company_info", sql: "SELECT id, company_name, tagline, email, phone FROM company_info LIMIT 5" },
    { name: "users (admins)", sql: "SELECT id, email, full_name, role, created_at FROM users LIMIT 10" },
    { name: "projects", sql: "SELECT id, title, category, status, created_at FROM projects ORDER BY created_at DESC LIMIT 5" },
    { name: "contact_submissions", sql: "SELECT id, name, email, LEFT(message, 50) AS message_preview, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5" },
  ]

  const [countRows] = await conn.query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM projects) AS projects,
      (SELECT COUNT(*) FROM services) AS services,
      (SELECT COUNT(*) FROM blog_posts) AS blog_posts,
      (SELECT COUNT(*) FROM testimonials) AS testimonials,
      (SELECT COUNT(*) FROM contact_submissions) AS contact_submissions,
      (SELECT COUNT(*) FROM company_info) AS company_info,
      (SELECT COUNT(*) FROM hero_images) AS hero_images
  `)
  console.log("--- Resumen (cantidad por tabla) ---")
  console.log(countRows[0])
  console.log("")

  for (const q of queries.slice(1)) {
    console.log("---", q.name, "---")
    const [rows] = await conn.query(q.sql)
    console.log(formatTable(rows))
    console.log("")
  }

  await conn.end()
  console.log("Listo.")
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
