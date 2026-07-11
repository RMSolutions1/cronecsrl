/** URL canónica de producción (dominio principal del sitio). */
export const SITE_URL_DEFAULT = "https://www.cronecsrl.online"

/**
 * URL pública del sitio para sitemap, OG, JSON-LD y metadatos.
 * Prioridad: NEXT_PUBLIC_SITE_URL → VERCEL_PROJECT_PRODUCTION_URL → default.
 * No usa VERCEL_URL (URL de deploy preview) para evitar sitemaps incorrectos.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (production) {
    const host = production.replace(/^https?:\/\//, "").replace(/\/$/, "")
    return `https://${host}`
  }

  return SITE_URL_DEFAULT
}
