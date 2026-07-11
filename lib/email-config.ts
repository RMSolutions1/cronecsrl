import { COMPANY_EMAIL } from "@/lib/company-email"
import { FEROZO_SMTP, PUBLIC_CONTACT_EMAIL } from "@/lib/email-defaults"
import {
  getDefaultEmailSettings,
  getSmtpPasswordFromRecord,
  readEmailSettingsFromDb,
  type EmailSettingsRecord,
} from "@/lib/email-settings-store"

export type EmailProvider = "smtp" | "resend" | null

export type EmailConfig = {
  provider: EmailProvider
  from: string
  replyTo: string
  adminTo: string[]
}

type ResolvedEmail = {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  smtpPass: string | null
  from: string
  replyTo: string
  adminTo: string[]
  source: "db" | "env" | "default"
}

let cache: { at: number; data: ResolvedEmail } | null = null
const CACHE_MS = 30_000

export function clearEmailConfigCache(): void {
  cache = null
}

function fromEnv(): Partial<ResolvedEmail> {
  const smtpUser = process.env.SMTP_USER?.trim()
  const smtpPass = process.env.SMTP_PASS?.trim() || null
  const smtpHost = process.env.SMTP_HOST?.trim()
  const port = process.env.SMTP_PORT?.trim()
  const adminTo = process.env.NOTIFY_TO_EMAIL?.trim()
  return {
    ...(smtpHost ? { smtpHost } : {}),
    ...(port ? { smtpPort: Number(port) } : {}),
    ...(process.env.SMTP_SECURE != null
      ? {
          smtpSecure: !["false", "0"].includes(process.env.SMTP_SECURE.trim().toLowerCase()),
        }
      : {}),
    ...(smtpUser ? { smtpUser } : {}),
    ...(smtpPass ? { smtpPass } : {}),
    ...(process.env.SMTP_FROM?.trim() || process.env.NOTIFY_FROM_EMAIL?.trim()
      ? { from: (process.env.SMTP_FROM || process.env.NOTIFY_FROM_EMAIL)!.trim() }
      : {}),
    ...(process.env.SMTP_REPLY_TO?.trim() ? { replyTo: process.env.SMTP_REPLY_TO.trim() } : {}),
    ...(adminTo
      ? {
          adminTo: adminTo
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean),
        }
      : {}),
  }
}

function fromDbRecord(record: EmailSettingsRecord): Partial<ResolvedEmail> {
  const pass = getSmtpPasswordFromRecord(record)
  return {
    smtpHost: record.smtpHost,
    smtpPort: record.smtpPort,
    smtpSecure: record.smtpSecure,
    smtpUser: record.smtpUser,
    ...(pass ? { smtpPass: pass } : {}),
    from: record.smtpFrom,
    replyTo: record.replyTo,
    adminTo: record.notifyTo
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean),
  }
}

function mergeResolved(db: Partial<ResolvedEmail> | null, env: Partial<ResolvedEmail>): ResolvedEmail {
  const defaults = getDefaultEmailSettings()
  const smtpUser = db?.smtpUser ?? env.smtpUser ?? defaults.smtpUser
  const smtpHost = db?.smtpHost ?? env.smtpHost ?? defaults.smtpHost
  const smtpPort = db?.smtpPort ?? env.smtpPort ?? defaults.smtpPort
  const smtpSecure = db?.smtpSecure ?? env.smtpSecure ?? defaults.smtpSecure
  const smtpPass = db?.smtpPass ?? env.smtpPass ?? null
  const from =
    db?.from ??
    env.from ??
    process.env.SMTP_FROM?.trim() ??
    process.env.NOTIFY_FROM_EMAIL?.trim() ??
    `CRONEC SRL <${smtpUser}>`
  const replyTo = db?.replyTo ?? env.replyTo ?? PUBLIC_CONTACT_EMAIL
  const adminTo =
    db?.adminTo ??
    env.adminTo ??
    (process.env.NOTIFY_TO_EMAIL?.trim() || smtpUser || COMPANY_EMAIL)
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean)

  return {
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser,
    smtpPass,
    from,
    replyTo,
    adminTo,
    source: db?.smtpPass ? "db" : env.smtpPass ? "env" : db ? "db" : env.smtpHost || env.smtpUser ? "env" : "default",
  }
}

async function resolveEmail(): Promise<ResolvedEmail> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.data

  const dbRecord = await readEmailSettingsFromDb()
  const dbPartial = dbRecord ? fromDbRecord(dbRecord) : null
  const envPartial = fromEnv()
  const data = mergeResolved(dbPartial, envPartial)
  cache = { at: Date.now(), data }
  return data
}

function isSmtpReady(resolved: ResolvedEmail): boolean {
  return !!(resolved.smtpHost && resolved.smtpUser && resolved.smtpPass)
}

export async function getEmailConfig(): Promise<EmailConfig> {
  const resolved = await resolveEmail()
  const from = resolved.from
  const replyTo = resolved.replyTo
  const adminTo = resolved.adminTo

  if (isSmtpReady(resolved)) {
    return { provider: "smtp", from, replyTo, adminTo }
  }
  if (process.env.RESEND_API_KEY?.trim()) {
    return { provider: "resend", from, replyTo, adminTo }
  }
  return { provider: null, from, replyTo, adminTo }
}

export async function isSmtpConfigured(): Promise<boolean> {
  const resolved = await resolveEmail()
  return isSmtpReady(resolved)
}

export async function isEmailConfigured(): Promise<boolean> {
  const cfg = await getEmailConfig()
  return cfg.provider !== null
}

export async function getSmtpSettings() {
  const resolved = await resolveEmail()
  if (!resolved.smtpPass) {
    throw new Error("SMTP sin contraseña configurada")
  }
  const secureEnv = resolved.smtpSecure
  const secure =
    secureEnv === false
      ? false
      : secureEnv === true || resolved.smtpPort === 465
  return {
    host: resolved.smtpHost,
    port: resolved.smtpPort,
    secure,
    auth: {
      user: resolved.smtpUser,
      pass: resolved.smtpPass,
    },
  }
}

/** Resumen seguro para diagnóstico (sin secretos). */
export async function getEmailConfigSummary(): Promise<{
  configured: boolean
  provider: EmailProvider
  from: string
  adminTo: string[]
  smtpHost: string
  smtpPort: number
  smtpUser: string
  hasPassword: boolean
  source: string
  storedInDb: boolean
}> {
  const cfg = await getEmailConfig()
  const resolved = await resolveEmail()
  const dbRecord = await readEmailSettingsFromDb()
  return {
    configured: cfg.provider !== null,
    provider: cfg.provider,
    from: cfg.from,
    adminTo: cfg.adminTo,
    smtpHost: resolved.smtpHost,
    smtpPort: resolved.smtpPort,
    smtpUser: resolved.smtpUser,
    hasPassword: !!resolved.smtpPass,
    source: resolved.source,
    storedInDb: !!dbRecord?.smtpPassEnc,
  }
}

/** Compatibilidad con código legacy sync (solo env). Evitar en código nuevo. */
export { FEROZO_SMTP }
