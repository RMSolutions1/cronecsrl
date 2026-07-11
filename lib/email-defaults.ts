/**
 * SMTP Ferozo / Hostmar (panel DonWeb) — CRONEC SRL.
 * Servidor saliente: c2751446.ferozo.com:465 SSL
 * Casillero operativo: info@cronecsrl.com.ar
 */
export const FEROZO_SMTP = {
  host: "c2751446.ferozo.com",
  port: 465,
  secure: true,
  user: "info@cronecsrl.com.ar",
} as const

/** Datos del panel Ferozo / DonWeb (correo entrante). */
export const FEROZO_MAIL = {
  host: FEROZO_SMTP.host,
  ssl: true,
  imapPort: 993,
  pop3Port: 995,
} as const

/** Correo público del sitio (footer, contacto). Distinto del casillero SMTP. */
export const PUBLIC_CONTACT_EMAIL = "cronec@cronecsrl.com.ar"
