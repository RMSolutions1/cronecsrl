/**
 * Crea el primer administrador en data/admins.json (sin MySQL).
 * Uso: node scripts/seed-admin-json.js
 * Opcional: ADMIN_EMAIL=admin@cronecsrl.com.ar ADMIN_PASSWORD=admin123 node scripts/seed-admin-json.js
 */
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcryptjs")

const dataDir = path.join(process.cwd(), "data")
const adminsPath = path.join(dataDir, "admins.json")

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@cronecsrl.com.ar"
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const fullName = process.env.ADMIN_NAME || "Administrador"

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  let admins = []
  if (fs.existsSync(adminsPath)) {
    admins = JSON.parse(fs.readFileSync(adminsPath, "utf-8"))
  }
  if (admins.some((a) => a.email === email)) {
    console.log("Ya existe un admin con ese email. Cambie la contraseña desde el panel o use otro ADMIN_EMAIL.")
    return
  }
  const hash = await bcrypt.hash(password, 12)
  admins.push({
    id: generateId(),
    email,
    full_name: fullName,
    role: "superadmin",
    password_hash: hash,
    created_at: new Date().toISOString(),
  })
  fs.writeFileSync(adminsPath, JSON.stringify(admins, null, 2), "utf-8")
  console.log("Admin creado:", email, "| Contraseña:", password)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
