/**
 * Crea la tabla newsletter_subscribers en Neon/Postgres.
 * Uso: node scripts/postgres/run-add-newsletter-table.js
 */
require("dotenv").config({ path: ".env.local" })
const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) {
    console.error("Falta DATABASE_URL o POSTGRES_URL en .env.local")
    process.exit(1)
  }
  const sql = fs.readFileSync(path.join(__dirname, "add-newsletter-table.sql"), "utf-8")
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } })
  try {
    await pool.query(sql)
    console.log("Tabla newsletter_subscribers OK")
  } finally {
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
