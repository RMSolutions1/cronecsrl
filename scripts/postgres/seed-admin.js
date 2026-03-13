/**
 * Crea un usuario administrador en la tabla users (PostgreSQL / Neon).
 * Uso: npm run db:seed-admin-pg
 *      o: node scripts/postgres/seed-admin.js [connection_url]
 * Variables opcionales en .env.local: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
const path = require("path")
const fs = require("fs")
const { Pool } = require("pg")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

const projectRoot = path.resolve(__dirname, "../..")
const envPath = path.join(projectRoot, ".env.local")
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8")
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (m) {
      let val = m[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
        val = val.slice(1, -1).replace(/\\n/g, "\n")
      process.env[m[1]] = val
    }
  })
}

const connectionString = process.argv[2] || process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) {
  console.error("Falta DATABASE_URL o POSTGRES_URL. Definila en .env.local o pasala como argumento.")
  process.exit(1)
}

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@cronecsrl.com.ar"
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const fullName = process.env.ADMIN_NAME || "Administrador"

  const passwordHash = await bcrypt.hash(password, 12)
  const id = generateId()

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: true } : undefined,
  })

  const client = await pool.connect()
  try {
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      await client.query(
        "UPDATE users SET password_hash = $1, full_name = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE email = $4",
        [passwordHash, fullName, "admin", email]
      )
      console.log("Usuario admin ya existía. Contraseña y nombre actualizados.")
    } else {
      await client.query(
        'INSERT INTO users (id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5)',
        [id, email, passwordHash, fullName, "admin"]
      )
      console.log("Usuario administrador creado correctamente en la base de datos.")
    }
    console.log("  Email:", email)
    console.log("  Nombre:", fullName)
    console.log("  Contraseña: (la definida en ADMIN_PASSWORD o admin123 por defecto)")
    console.log("  IMPORTANTE: Cambie la contraseña después del primer acceso.")
  } catch (err) {
    console.error("Error:", err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
