"use server"

import { requireAdmin } from "@/lib/admin-auth"
import { assertDbWritable, formatAdminPersistError } from "@/lib/admin-persist"
import { clearEmailConfigCache } from "@/lib/email-config"
import {
  isEmailDbBackendAvailable,
  readEmailSettingsPublic,
  saveEmailSettings,
  type EmailSettingsPublic,
} from "@/lib/email-settings-store"

export async function getEmailSettingsAction(): Promise<EmailSettingsPublic> {
  await requireAdmin()
  return readEmailSettingsPublic()
}

export type SaveEmailSettingsInput = {
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
}

export type SaveEmailSettingsResult = { ok: boolean; message: string }

export async function saveEmailSettingsAction(input: SaveEmailSettingsInput): Promise<SaveEmailSettingsResult> {
  await requireAdmin()
  try {
    assertDbWritable()
    if (!isEmailDbBackendAvailable()) {
      return {
        ok: false,
        message: "Se requiere base de datos (Neon/MySQL) para guardar la configuración de correo.",
      }
    }

    if (!input.smtpUser?.trim()) {
      return { ok: false, message: "Indique el email del casillero (usuario SMTP)." }
    }

    const current = await readEmailSettingsPublic()
    if (!input.smtpPass?.trim() && !current.hasPassword) {
      return { ok: false, message: "Indique la contraseña del casillero." }
    }

    await saveEmailSettings(input)
    clearEmailConfigCache()
    return { ok: true, message: "Configuración de correo guardada correctamente." }
  } catch (e) {
    return { ok: false, message: formatAdminPersistError(e) }
  }
}