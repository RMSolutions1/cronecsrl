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

/** Coordenadas del Pasaje Soldado (Ramón) Salazar, barrio Santa Ana — Salta Capital. */
export const CRONEC_GEO = {
  latitude: -24.8576,
  longitude: -65.4644,
} as const

export function getGoogleMapsSearchUrl(address?: string): string {
  const q = encodeURIComponent(address?.trim() || getCompanyFullAddress())
  return `https://maps.google.com/?q=${q}`
}

/** Embed sin API key: Google geocodifica la dirección fiscal. */
export function getGoogleMapsEmbedUrl(address?: string): string {
  const q = encodeURIComponent(address?.trim() || getCompanyFullAddress())
  return `https://www.google.com/maps?q=${q}&hl=es&z=17&output=embed`
}

export function getHowToArriveText(): string {
  const c = CRONEC_OFFICIAL
  return `Ubicados en ${c.street}, ${c.neighborhood}, ${c.city} (CP ${c.postalCode}). Zona noroeste de la ciudad, con acceso por Av. Perú y Av. Ricardo Balbín.`
}
