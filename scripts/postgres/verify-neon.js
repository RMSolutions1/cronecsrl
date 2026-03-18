/**
 * Verifica conexión a Neon y que el esquema sea correcto (id VARCHAR, no UUID).
 * Uso: npm run db:verify-neon (o node scripts/postgres/verify-neon.js desde la raíz del proyecto).
 * Requiere .env.local con DATABASE_URL o POSTGRES_URL.
 */
const path = require("path")
const fs = require("fs")
const { Pool } = require("pg")

// Cargar .env.local: desde raíz del proyecto (cwd al ejecutar vía npm) o desde __dirname
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

async function main() {
  const client = await pool.connect()
  try {
    console.log("=== Verificación Neon ===\n")

    // 1. Conexión
    const ping = await client.query("SELECT 1 AS ok, current_database() AS db")
    console.log("Conexión OK. Base:", ping.rows[0].db)

    // 2. Tipo de columna id en tablas críticas
    const tables = ["projects", "services", "blog_posts", "contact_submissions", "testimonials", "hero_images", "certifications", "clients", "users"]
    console.log("\n--- Tipo de columna 'id' por tabla ---")
    const problems = []
    for (const t of tables) {
      try {
        const r = await client.query(
          `SELECT data_type, udt_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = 'id'`,
          [t]
        )
        if (r.rows[0]) {
          const { data_type, udt_name } = r.rows[0]
          const ok = data_type === "character varying" || udt_name === "varchar"
          console.log(`  ${t}: ${data_type} (udt: ${udt_name}) ${ok ? "OK" : ">>> EJECUTAR fix-uuid-to-varchar.sql <<<"}`)
          if (!ok) problems.push(t)
        } else {
          console.log(`  ${t}: (tabla no existe)`)
        }
      } catch (e) {
        console.log(`  ${t}: error - ${e.message}`)
      }
    }

    // 3. Conteo por tabla
    console.log("\n--- Conteo por tabla ---")
    const counts = {}
    for (const t of tables) {
      try {
        const r = await client.query(`SELECT COUNT(*) AS c FROM public.${t}`)
        counts[t] = r.rows[0].c
      } catch (e) {
        counts[t] = e.message.includes("does not exist") ? "—" : "error"
      }
    }
    console.table(counts)

    // 4. company_info
    try {
      const r = await client.query("SELECT id, company_name, phone, email FROM company_info LIMIT 1")
      console.log("--- company_info (1 fila) ---")
      console.log(r.rows[0] || "(vacío)")
    } catch (e) {
      console.log("company_info:", e.message)
    }

    // 5. Prueba de escritura en projects (INSERT luego ROLLBACK)
    console.log("\n--- Prueba de escritura (rollback) ---")
    try {
      await client.query("BEGIN")
      await client.query(
        `INSERT INTO public.projects (id, title, description, category, image_url, status, featured) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        ["test-verify-id-1", "Test verificación", "Desc", "Construcción Civil", "", "draft", false]
      )
      await client.query("ROLLBACK")
      console.log("  INSERT de prueba (con id tipo 'test-verify-id-1') OK → rollback aplicado.")
    } catch (e) {
      await client.query("ROLLBACK").catch(() => {})
      if (e.message && e.message.includes("uuid")) {
        console.log("  ERROR: la tabla projects espera UUID. Ejecutá scripts/postgres/fix-uuid-to-varchar.sql en Neon.")
      } else {
        console.log("  Error:", e.message)
      }
    }

    if (problems.length) {
      console.log("\n>>> Acción: ejecutá en Neon SQL Editor el archivo scripts/postgres/fix-uuid-to-varchar.sql")
    } else {
      console.log("\n>>> Esquema correcto para la app (ids VARCHAR).")
    }
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
