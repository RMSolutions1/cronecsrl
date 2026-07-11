import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"

export function isDbBackendConfigured(): boolean {
  return isPostgresConfigured() || isMySQLConfigured()
}

/** En Vercel el filesystem es de solo lectura: hace falta Neon/Postgres o MySQL. */
export function assertDbWritable(): void {
  if (process.env.VERCEL && !isDbBackendConfigured()) {
    throw new Error("VERCEL_DB_MISSING")
  }
}

export function formatAdminPersistError(e: unknown, action: "guardar" | "eliminar" = "guardar"): string {
  const msg = e instanceof Error ? e.message : String(e)
  if (msg === "VERCEL_DB_MISSING" || (process.env.VERCEL && !isDbBackendConfigured())) {
    return (
      "En producción (Vercel) falta DATABASE_URL o POSTGRES_URL. " +
      "Configuralas en el proyecto Vercel → Settings → Environment Variables (Production) " +
      "con la connection string de Neon, guardá y redeployá."
    )
  }
  if (process.env.VERCEL) {
    return `No se pudo ${action} en la base de datos. ${msg}`
  }
  return msg
}
