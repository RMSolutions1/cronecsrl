/**
 * Normaliza la URL de Postgres para pg v8 / pg-connection-string v3.
 * Neon suele traer sslmode=require; el driver avisa hasta usar verify-full explícito.
 */
export function normalizePostgresConnectionString(raw: string): string {
  try {
    const u = new URL(raw)
    const mode = u.searchParams.get("sslmode")?.toLowerCase()
    if (!mode || mode === "require" || mode === "prefer" || mode === "verify-ca") {
      u.searchParams.set("sslmode", "verify-full")
    }
    return u.toString()
  } catch {
    return raw.replace(/\bsslmode=(require|prefer|verify-ca)\b/gi, "sslmode=verify-full")
  }
}

export function postgresPoolSsl(raw: string): { rejectUnauthorized: true } | undefined {
  const normalized = normalizePostgresConnectionString(raw).toLowerCase()
  if (
    normalized.includes("sslmode=verify-full") ||
    normalized.includes("sslmode=require") ||
    normalized.includes("neon.tech")
  ) {
    return { rejectUnauthorized: true }
  }
  return undefined
}
