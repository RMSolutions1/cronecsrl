import { isPostgresConfigured, query as pgQuery } from "@/lib/db-pg"
import { isMySQLConfigured, query as mysqlQuery } from "@/lib/db-mysql"
import { FEROZO_MAIL, FEROZO_SMTP, PUBLIC_CONTACT_EMAIL } from "@/lib/email-defaults"
import { decryptSecret, encryptSecret } from "@/lib/secret-crypto"

export const EMAIL_SETTINGS_KEY = "cms_email_settings"

export type EmailSettingsRecord = {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  smtpPassEnc?: string
  smtpFrom: string
  replyTo: string
  notifyTo: string
  imapPort: number
  pop3Port: number
}

export type EmailSettingsPublic = Omit<EmailSettingsRecord, "smtpPassEnc"> & {
  hasPassword: boolean
}

export function getDefaultEmailSettings(): EmailSettingsRecord {
  const user = FEROZO_SMTP.user
  return {
    smtpHost: FEROZO_SMTP.host,
    smtpPort: FEROZO_SMTP.port,
    smtpSecure: FEROZO_SMTP.secure,
    smtpUser: user,
    smtpFrom: `CRONEC SRL <${user}>`,
    replyTo: PUBLIC_CONTACT_EMAIL,
    notifyTo: user,
    imapPort: FEROZO_MAIL.imapPort,
    pop3Port: FEROZO_MAIL.pop3Port,
  }
}

function parseRecord(raw: string | null | undefined): EmailSettingsRecord | null {
  if (!raw?.trim()) return null
  try {
    const data = JSON.parse(raw) as Partial<EmailSettingsRecord>
    if (!data || typeof data !== "object") return null
    const defaults = getDefaultEmailSettings()
    return {
      smtpHost: String(data.smtpHost ?? defaults.smtpHost),
      smtpPort: Number(data.smtpPort ?? defaults.smtpPort),
      smtpSecure: data.smtpSecure ?? defaults.smtpSecure,
      smtpUser: String(data.smtpUser ?? defaults.smtpUser),
      smtpPassEnc: data.smtpPassEnc ? String(data.smtpPassEnc) : undefined,
      smtpFrom: String(data.smtpFrom ?? defaults.smtpFrom),
      replyTo: String(data.replyTo ?? defaults.replyTo),
      notifyTo: String(data.notifyTo ?? defaults.notifyTo),
      imapPort: Number(data.imapPort ?? defaults.imapPort),
      pop3Port: Number(data.pop3Port ?? defaults.pop3Port),
    }
  } catch {
    return null
  }
}

async function readRawFromDb(): Promise<string | null> {
  if (isPostgresConfigured()) {
    const rows = await pgQuery<{ value: string | null }[]>(
      "SELECT value FROM site_config WHERE key = $1 LIMIT 1",
      [EMAIL_SETTINGS_KEY]
    )
    return rows[0]?.value ?? null
  }
  if (isMySQLConfigured()) {
    const rows = await mysqlQuery<{ value: string | null }[]>(
      "SELECT value FROM site_config WHERE `key` = ? LIMIT 1",
      [EMAIL_SETTINGS_KEY]
    )
    return rows[0]?.value != null ? String(rows[0].value) : null
  }
  return null
}

async function writeRawToDb(raw: string): Promise<void> {
  if (isPostgresConfigured()) {
    await pgQuery(
      `INSERT INTO site_config (key, value, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [EMAIL_SETTINGS_KEY, raw]
    )
    return
  }
  if (isMySQLConfigured()) {
    await mysqlQuery(
      `INSERT INTO site_config (\`key\`, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = CURRENT_TIMESTAMP`,
      [EMAIL_SETTINGS_KEY, raw]
    )
    return
  }
  throw new Error("Base de datos no configurada")
}

export function isEmailDbBackendAvailable(): boolean {
  return isPostgresConfigured() || isMySQLConfigured()
}

export async function readEmailSettingsFromDb(): Promise<EmailSettingsRecord | null> {
  if (!isEmailDbBackendAvailable()) return null
  return parseRecord(await readRawFromDb())
}

export function toPublicSettings(record: EmailSettingsRecord): EmailSettingsPublic {
  const { smtpPassEnc, ...rest } = record
  return { ...rest, hasPassword: !!smtpPassEnc?.trim() }
}

export async function readEmailSettingsPublic(): Promise<EmailSettingsPublic> {
  const stored = await readEmailSettingsFromDb()
  return toPublicSettings(stored ?? getDefaultEmailSettings())
}

export async function saveEmailSettings(input: {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  smtpPass?: string
  smtpFrom: string
  replyTo: string
  notifyTo: string
  imapPort: number
  pop3Port: number
}): Promise<void> {
  const current = (await readEmailSettingsFromDb()) ?? getDefaultEmailSettings()
  let smtpPassEnc = current.smtpPassEnc
  const newPass = input.smtpPass?.trim()
  if (newPass) {
    smtpPassEnc = encryptSecret(newPass)
  }

  const record: EmailSettingsRecord = {
    smtpHost: input.smtpHost.trim() || current.smtpHost,
    smtpPort: Number(input.smtpPort) || current.smtpPort,
    smtpSecure: input.smtpSecure,
    smtpUser: input.smtpUser.trim() || current.smtpUser,
    smtpPassEnc,
    smtpFrom: input.smtpFrom.trim() || current.smtpFrom,
    replyTo: input.replyTo.trim() || current.replyTo,
    notifyTo: input.notifyTo.trim() || current.notifyTo,
    imapPort: Number(input.imapPort) || current.imapPort,
    pop3Port: Number(input.pop3Port) || current.pop3Port,
  }

  await writeRawToDb(JSON.stringify(record))
}

export function getSmtpPasswordFromRecord(record: EmailSettingsRecord): string | null {
  if (!record.smtpPassEnc?.trim()) return null
  try {
    return decryptSecret(record.smtpPassEnc)
  } catch {
    return null
  }
}
