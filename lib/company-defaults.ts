/**
 * Datos oficiales de CRONEC S.R.L. (constancia ARCA / domicilio fiscal).
 * Fuente: constancia de inscripción vigente 11-07-2026.
 */
export const CRONEC_OFFICIAL = {
  legalName: "CRONEC S.R.L.",
  displayName: "CRONEC SRL",
  cuit: "33-71090097-9",
  legalForm: "S.R.L.",
  /** Fecha contrato social (ARCA) */
  incorporationDate: "2009-02-04",
  incorporationDateDisplay: "04 de febrero de 2009",
  foundedYear: 2009,
  street: "Pasaje Soldado Salazar 196",
  neighborhood: "Barrio Santa Ana",
  city: "Salta Capital",
  province: "Salta",
  postalCode: "4400",
  country: "Argentina",
} as const

/** Dirección en una línea (configuración, footer, legal). */
export function getCompanyFullAddress(): string {
  const c = CRONEC_OFFICIAL
  return `${c.street}, ${c.neighborhood}, ${c.city} (${c.postalCode}), ${c.province}, ${c.country}`
}

/** Variante corta para tarjetas de contacto. */
export function getCompanyAddressLines(): [string, string] {
  const c = CRONEC_OFFICIAL
  return [c.street, `${c.neighborhood}, ${c.city}, ${c.country} (${c.postalCode})`]
}

/** Coordenadas exactas del domicilio fiscal (Pasaje Soldado Salazar 196). */
export const CRONEC_GEO = {
  latitude: -24.859937,
  longitude: -65.464272,
} as const

export type GeoCoords = { latitude: number; longitude: number }

export function resolveCompanyGeo(settings?: { latitude?: unknown; longitude?: unknown } | null): GeoCoords {
  const lat = Number(settings?.latitude)
  const lng = Number(settings?.longitude)
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { latitude: lat, longitude: lng }
  return { latitude: CRONEC_GEO.latitude, longitude: CRONEC_GEO.longitude }
}

export function getGoogleMapsSearchUrl(_address?: string, geo?: GeoCoords): string {
  const coords = geo ?? resolveCompanyGeo()
  return `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
}

/** Embed sin API key: usa coordenadas exactas para el pin. */
export function getGoogleMapsEmbedUrl(geo?: GeoCoords): string {
  const coords = geo ?? resolveCompanyGeo()
  return `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}&hl=es&z=18&output=embed`
}

export function getHowToArriveText(): string {
  const c = CRONEC_OFFICIAL
  return `Ubicados en ${c.street}, ${c.neighborhood}, ${c.city} (CP ${c.postalCode}). Zona noroeste de la ciudad, con acceso por Av. Perú y Av. Ricardo Balbín.`
}
