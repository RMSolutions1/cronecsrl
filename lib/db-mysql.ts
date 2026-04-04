/**
 * Pool MySQL para CRONEC. Usa las variables MYSQL_* de entorno.
 * Si no están configuradas, la app usa solo archivos JSON (lib/data.ts).
 */
import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

export function isMySQLConfigured(): boolean {
  return !!(process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)
}

export function getPool(): mysql.Pool {
  if (!pool) {
    if (!isMySQLConfigured()) {
      throw new Error("MySQL no configurado: definid MYSQL_HOST, MYSQL_USER y MYSQL_DATABASE en .env")
    }
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: "utf8mb4",
    })
  }
  return pool
}

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
  const p = getPool()
  const [rows] = await p.query(sql, params)
  return rows as T
}
