/**
 * Punto de entrada Postgres (Neon / Vercel vía DATABASE_URL o POSTGRES_URL).
 * MySQL vive en `lib/db-mysql.ts` (MYSQL_*); el código de datos importa `db-pg` o `db-mysql` según el backend.
 */
export { getPool, query, isPostgresConfigured } from "@/lib/db-pg"
