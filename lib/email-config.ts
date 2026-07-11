import { COMPANY_EMAIL } from "@/lib/company-email"
import { FEROZO_SMTP, PUBLIC_CONTACT_EMAIL } from "@/lib/email-defaults"

export type EmailProvider = "smtp" | "resend" | null

export type EmailConfig = {
  provider: EmailProvider
  from: string
  replyTo: string
  adminTo: string[]
}

function resolveSmtpUser(): string {
  return process.env.SMTP_USER?.trim() || FEROZO_SMTP.user
}

function resolveSmtpHost(): string {
  return process.env.SMTP_HOST?.trim() || FEROZO_SMTP.host
}

export function getEmailConfig(): EmailConfig {
  const smtpUser = resolveSmtpUser()
  const adminTo = (process.env.NOTIFY_TO_EMAIL?.trim() || smtpUser || COMPANY_EMAIL)
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  const from =
    process.env.SMTP_FROM?.trim() ||
    process.env.NOTIFY_FROM_EMAIL?.trim() ||
    `CRONEC SRL <${smtpUser}>`

  const replyTo = process.env.SMTP_REPLY_TO?.trim() || PUBLIC_CONTACT_EMAIL

  if (isSmtpConfigured()) {
    return { provider: "smtp", from, replyTo, adminTo }
  }
  if (process.env.RESEND_API_KEY?.trim()) {
    return { provider: "resend", from, replyTo, adminTo }
  }
  return { provider: null, from, replyTo, adminTo }
}

export function isSmtpConfigured(): boolean {
  const pass = process.env.SMTP_PASS?.trim()
  if (!pass) return false
  const user = resolveSmtpUser()
  const host = resolveSmtpHost()
  return !!(host && user && pass)
}

export function isEmailConfigured(): boolean {
  return getEmailConfig().provider !== null
}

export function getSmtpSettings() {
  const port = Number(process.env.SMTP_PORT || FEROZO_SMTP.port)
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase()
  const secure = secureEnv === "false" || secureEnv === "0" ? false : secureEnv === "true" || secureEnv === "1" || port === 465
  return {
    host: resolveSmtpHost(),
    port,
    secure,
    auth: {
      user: resolveSmtpUser(),
      pass: process.env.SMTP_PASS!.trim(),
    },
  }
}

/** Resumen seguro para diagnóstico (sin secretos). */
export function getEmailConfigSummary(): {
  configured: boolean
  provider: EmailProvider
  from: string
  adminTo: string[]
  smtpHost: string
  smtpPort: number
  smtpUser: string
  hasPassword: boolean
} {
  const cfg = getEmailConfig()
  const hasPassword = !!process.env.SMTP_PASS?.trim()
  return {
    configured: cfg.provider !== null,
    provider: cfg.provider,
    from: cfg.from,
    adminTo: cfg.adminTo,
    smtpHost: resolveSmtpHost(),
    smtpPort: Number(process.env.SMTP_PORT || FEROZO_SMTP.port),
    smtpUser: resolveSmtpUser(),
    hasPassword,
  }
}
