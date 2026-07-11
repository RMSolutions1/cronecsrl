/** Normalización SSL para scripts Node (misma lógica que lib/postgres-connection.ts). */
function normalizePostgresConnectionString(raw) {
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

function postgresPoolSsl(raw) {
  const n = normalizePostgresConnectionString(raw).toLowerCase()
  if (n.includes("sslmode=verify-full") || n.includes("neon.tech")) {
    return { rejectUnauthorized: true }
  }
  return undefined
}

module.exports = { normalizePostgresConnectionString, postgresPoolSsl }
