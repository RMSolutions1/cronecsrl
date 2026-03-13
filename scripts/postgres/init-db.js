/**
 * Crea todas las tablas en PostgreSQL (Neon) leyendo DATABASE_URL o POSTGRES_URL de .env.local
 * Uso: node scripts/postgres/init-db.js
 *      o: npm run db:init-pg
 */
const path = require("path")
const fs = require("fs")
const { Pool } = require("pg")

// Cargar .env.local desde la raíz del proyecto
const projectRoot = path.resolve(__dirname, "../..")
const envPath = path.join(projectRoot, ".env.local")
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8")
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (m) {
      const key = m[1]
      let val = m[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).replace(/\\n/g, "\n")
      }
      process.env[key] = val
    }
  })
}

// Permitir URL por argumento: node scripts/postgres/init-db.js "postgresql://..."
const connectionString =
  process.argv[2] ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL
if (!connectionString) {
  console.error("Falta DATABASE_URL o POSTGRES_URL.")
  console.error("  Opción 1: Definila en .env.local y ejecutá: npm run db:init-pg")
  console.error('  Opción 2: node scripts/postgres/init-db.js "postgresql://USER:PASS@HOST/neondb?sslmode=require"')
  process.exit(1)
}

const schemaPath = path.join(__dirname, "schema.sql")
if (!fs.existsSync(schemaPath)) {
  console.error("No se encuentra schema.sql en", __dirname)
  process.exit(1)
}

const sql = fs.readFileSync(schemaPath, "utf-8")

// Dividir en sentencias (cada una termina en ; seguido de newline)
const statements = sql
  .split(/(?<=;)\s*\n/)
  .map((s) => s.replace(/^\s*--[\s\S]*?$/gm, "").trim()) // quitar comentarios de línea
  .filter((s) => s.length > 0 && !/^\s*--/.test(s))

async function main() {
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: true } : undefined,
  })
  const client = await pool.connect()
  try {
    console.log("Conectado a la base de datos. Creando tablas e índices...")
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      const preview = stmt.slice(0, 60).replace(/\s+/g, " ") + (stmt.length > 60 ? "..." : "")
      try {
        await client.query(stmt)
        console.log("  OK:", preview)
      } catch (err) {
        if (err.code === "42P07") {
          console.log("  (ya existe):", preview)
        } else {
          console.error("  ERROR en:", preview)
          console.error(err.message)
          throw err
        }
      }
    }
    // Verificar tablas creadas
    const res = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)
    console.log("\nTablas en la base de datos:", res.rows.map((r) => r.table_name).join(", "))
    console.log("\nListo. Conexión y tablas verificadas.")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
