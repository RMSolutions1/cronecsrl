/**
 * Crea un usuario administrador en la tabla users (MySQL).
 * Uso: npm run db:seed-admin
 * Lee .env.local (desarrollo) o .env.production (servidor); opcional: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
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
const bcrypt = require("bcryptjs")
const crypto = require("crypto")

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@cronecsrl.com"
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const fullName = process.env.ADMIN_NAME || "Administrador"

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "cronec",
    charset: "utf8mb4",
  })

  const passwordHash = await bcrypt.hash(password, 12)
  const id = generateId()

  try {
    const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [email])
    if (existing.length > 0) {
      console.log("Ya existe un usuario con ese email. Para cambiar la contraseña, actualice en la BD.")
      process.exit(0)
      return
    }
    await pool.execute(
      "INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
      [id, email, passwordHash, fullName, "admin"]
    )
    console.log("Usuario admin creado correctamente.")
    console.log("  Email:", email)
    console.log("  Contraseña: (la que definió en ADMIN_PASSWORD o admin123 por defecto)")
    console.log("  IMPORTANTE: Cambie la contraseña después del primer acceso.")
  } catch (err) {
    console.error("Error:", err.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
