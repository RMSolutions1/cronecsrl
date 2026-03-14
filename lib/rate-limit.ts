/**
 * Rate limit simple en memoria por IP (para API de contacto).
 * En serverless cada instancia tiene su propio mapa; para producción con múltiples instancias considerar Redis.
 */

const map = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60 * 1000 // 1 minuto
const MAX_REQUESTS = 10 // máx. 10 envíos por minuto por IP

function getClientId(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip") ?? "unknown"
}

export function checkContactRateLimit(request: Request): { allowed: boolean; retryAfter?: number } {
  const id = getClientId(request)
  const now = Date.now()
  let entry = map.get(id)

  if (!entry) {
    map.set(id, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (now > entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS }
    map.set(id, entry)
    return { allowed: true }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true }
}
