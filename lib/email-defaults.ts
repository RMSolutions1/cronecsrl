/**
 * SMTP Ferozo / Hostmar (panel DonWeb) — CRONEC SRL.
 * Servidor saliente: c2751446.ferozo.com:465 SSL
 * Casillero operativo: admin@cronecsrl.com.ar
 */
export const FEROZO_SMTP = {
  host: "c2751446.ferozo.com",
  port: 465,
  secure: true,
  user: "admin@cronecsrl.com.ar",
} as const

/** Correo público del sitio (footer, contacto). Distinto del casillero SMTP. */
export const PUBLIC_CONTACT_EMAIL = "cronec@cronecsrl.com.ar"
