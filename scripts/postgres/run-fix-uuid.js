/**
 * Ejecuta fix-uuid-to-varchar.sql en la base Neon usando .env.local.
 * Uso: npm run db:fix-uuid
 */
const path = require("path")
const fs = require("fs")
const { Pool } = require("pg")

const projectRoot = process.cwd() || path.resolve(__dirname, "../..")
const envPaths = [
  path.join(projectRoot, ".env.local"),
  path.resolve(__dirname, "../..", ".env.local"),
]
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8")
    content.split("\n").forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("#") || !trimmed) return
      const eq = trimmed.indexOf("=")
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim()
        let val = trimmed.slice(eq + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
          val = val.slice(1, -1)
        process.env[key] = val
      }
    })
    break
  }
}

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) {
  console.error("Faltan DATABASE_URL o POSTGRES_URL en .env.local")
  process.exit(1)
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("sslmode=require") ? { rejectUnauthorized: true } : undefined,
})

const sqlPath = path.join(__dirname, "fix-uuid-to-varchar.sql")
const fullSql = fs.readFileSync(sqlPath, "utf-8")
// Extraer cada bloque DO $$ ... END $$;
const statements = []
const regex = /DO\s*\$\$\s*BEGIN[\s\S]*?END\s*\$\$\s*;/gi
let m
while ((m = regex.exec(fullSql)) !== null) {
  statements.push(m[0].trim())
}
if (statements.length === 0) {
  console.error("No se encontraron sentencias DO en el SQL. Revisá fix-uuid-to-varchar.sql")
  process.exit(1)
}
console.log("Sentencias a ejecutar:", statements.length)

async function main() {
  const client = await pool.connect()
  try {
    console.log("Ejecutando migración UUID → VARCHAR(36) en Neon...\n")
    let ok = 0
    let err = 0
    for (let i = 0; i < statements.length; i++) {
      try {
        await client.query(statements[i])
        ok++
        process.stdout.write(".")
      } catch (e) {
        err++
        console.log("\n", statements[i].slice(0, 60) + "...", "→", e.message)
      }
    }
    console.log("\n\nListo.", ok, "sentencias OK,", err, "errores (pueden ser tablas/columnas inexistentes).")
    if (ok > 0) console.log("Base de datos actualizada. Podés agregar proyectos e imágenes desde el dashboard.")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
