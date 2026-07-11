import { COMPANY_EMAIL } from "@/lib/company-email"

export type EmailProvider = "smtp" | "resend" | null

export type EmailConfig = {
  provider: EmailProvider
  from: string
  replyTo: string
  adminTo: string[]
}

export function getEmailConfig(): EmailConfig {
  const adminTo = (process.env.NOTIFY_TO_EMAIL?.trim() || COMPANY_EMAIL)
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)

  const from =
    process.env.SMTP_FROM?.trim() ||
    process.env.NOTIFY_FROM_EMAIL?.trim() ||
    `CRONEC SRL <${COMPANY_EMAIL}>`

  const replyTo = process.env.SMTP_REPLY_TO?.trim() || COMPANY_EMAIL

  if (isSmtpConfigured()) {
    return { provider: "smtp", from, replyTo, adminTo }
  }
  if (process.env.RESEND_API_KEY?.trim()) {
    return { provider: "resend", from, replyTo, adminTo }
  }
  return { provider: null, from, replyTo, adminTo }
}

export function isSmtpConfigured(): boolean {
  return !!(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim())
}

export function isEmailConfigured(): boolean {
  return getEmailConfig().provider !== null
}

export function getSmtpSettings() {
  const port = Number(process.env.SMTP_PORT || 465)
  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase()
  const secure = secureEnv === "true" || secureEnv === "1" || port === 465
  return {
    host: process.env.SMTP_HOST!.trim(),
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER!.trim(),
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
  smtpHost: string | null
  smtpPort: number | null
  smtpUser: string | null
} {
  const cfg = getEmailConfig()
  return {
    configured: cfg.provider !== null,
    provider: cfg.provider,
    from: cfg.from,
    adminTo: cfg.adminTo,
    smtpHost: isSmtpConfigured() ? process.env.SMTP_HOST!.trim() : null,
    smtpPort: isSmtpConfigured() ? Number(process.env.SMTP_PORT || 465) : null,
    smtpUser: isSmtpConfigured() ? process.env.SMTP_USER!.trim() : null,
  }
}
