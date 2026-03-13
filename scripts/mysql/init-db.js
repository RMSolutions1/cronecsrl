/**
 * Inicializa la base de datos MySQL: ejecuta schema.sql (crea tablas) y opcionalmente la migración extra.
 * Uso: npm run db:init
 * Lee .env.local, .env.production o .env (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE).
 * La base de datos debe existir ya (créala en CyberPanel o en tu hosting).
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

async function main() {
  const host = process.env.MYSQL_HOST || "localhost"
  const port = Number(process.env.MYSQL_PORT || 3306)
  const user = process.env.MYSQL_USER || "root"
  const password = process.env.MYSQL_PASSWORD || ""
  const database = process.env.MYSQL_DATABASE || "cronec"

  if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_DATABASE) {
    console.error("Faltan variables de entorno. Configura MYSQL_HOST, MYSQL_USER y MYSQL_DATABASE en .env.local o .env.production")
    process.exit(1)
  }

  const schemaPath = path.join(__dirname, "schema.sql")
  const migratePath = path.join(__dirname, "migrate-company-info-extra.sql")

  if (!fs.existsSync(schemaPath)) {
    console.error("No se encuentra schema.sql en scripts/mysql/")
    process.exit(1)
  }

  const schemaSql = fs.readFileSync(schemaPath, "utf-8")

  const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    charset: "utf8mb4",
    multipleStatements: true,
  })

  try {
    console.log("Conectando a MySQL...", { host, port, database, user: user })
    const conn = await pool.getConnection()
    try {
      console.log("Ejecutando schema.sql (creación de tablas)...")
      await conn.query(schemaSql)
      console.log("Schema aplicado correctamente.")

      if (fs.existsSync(migratePath)) {
        const migrateSql = fs.readFileSync(migratePath, "utf-8")
        const statements = migrateSql
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith("--"))
        for (const stmt of statements) {
          try {
            await conn.query(stmt + ";")
            console.log("Migración extra aplicada.")
          } catch (err) {
            if (err.code === "ER_DUP_FIELDNAME") {
              console.log("Columna 'extra' ya existe en company_info, se omite.")
            } else {
              throw err
            }
          }
        }
      }
    } finally {
      conn.release()
    }
    console.log("Base de datos lista. Ejecuta: npm run db:seed-admin (para crear el usuario admin).")
  } catch (err) {
    console.error("Error:", err.message)
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Revisa MYSQL_USER y MYSQL_PASSWORD.")
    }
    if (err.code === "ER_BAD_DB_ERROR") {
      console.error("La base de datos no existe. Créala antes en CyberPanel (ej: cronec_srl o cronec).")
    }
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
