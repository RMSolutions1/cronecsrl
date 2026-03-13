/**
 * Comprueba la conexión a MySQL y lista las tablas.
 * Uso: npm run db:ping
 * Lee .env.local, .env.production o .env (MYSQL_*).
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
  const user = process.env.MYSQL_USER
  const database = process.env.MYSQL_DATABASE

  if (!user || !database) {
    console.error("Configura MYSQL_USER y MYSQL_DATABASE en .env.local o .env.production")
    process.exit(1)
  }

  try {
    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password: process.env.MYSQL_PASSWORD || "",
      database,
      charset: "utf8mb4",
    })
    console.log("Conexión OK:", { host, port, database, user })

    const [rows] = await conn.query("SHOW TABLES")
    const tableKey = "Tables_in_" + database
    const tables = rows.map((r) => r[tableKey])
    console.log("Tablas:", tables.length)
    tables.forEach((t) => console.log("  -", t))

    const [company] = await conn.query("SELECT company_name FROM company_info LIMIT 1")
    if (company.length) {
      console.log("Datos iniciales: company_info tiene", company.length, "fila(s) (ej:", company[0].company_name + ")")
    }

    await conn.end()
    console.log("Listo. La base de datos está accesible desde este proyecto.")
  } catch (err) {
    console.error("Error de conexión:", err.message)
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("Revisa MYSQL_USER y MYSQL_PASSWORD en .env.local")
    }
    if (err.code === "ER_BAD_DB_ERROR") {
      console.error("La base de datos no existe o el usuario no tiene acceso. Revisa MYSQL_DATABASE.")
    }
    if (err.code === "ECONNREFUSED") {
      console.error("No se puede conectar al servidor. Revisa MYSQL_HOST y MYSQL_PORT (y firewall si es remoto).")
    }
    process.exit(1)
  }
}

main()
