"use server"

import { getCurrentUser } from "@/lib/auth"
import { getEmailConfigSummary, isEmailConfigured } from "@/lib/email-config"
import { sendEmail } from "@/lib/send-email"
import { buildContactConfirmationHtml } from "@/lib/email-templates"

export type TestEmailResult = { ok: boolean; message: string; provider?: string }

export async function sendTestEmailAction(formData: FormData): Promise<TestEmailResult> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) {
    return { ok: false, message: "No autorizado." }
  }

  if (!(await isEmailConfigured())) {
    return {
      ok: false,
      message: "Correo no configurado. Configúrelo en Admin → Correo (email, contraseña y servidor SMTP).",
    }
  }

  const to = String(formData.get("to") ?? user.email).trim()
  if (!to) return { ok: false, message: "Indique un destinatario." }

  const summary = await getEmailConfigSummary()
  const result = await sendEmail({
    to,
    subject: "Prueba de correo — CRONEC SRL Admin",
    html: buildContactConfirmationHtml(user.full_name ?? "Administrador"),
  })

  if (!result.ok) {
    return { ok: false, message: result.error ?? "Error al enviar.", provider: summary.provider ?? undefined }
  }

  return {
    ok: true,
    message: `Correo de prueba enviado a ${to} vía ${result.provider ?? summary.provider}.`,
    provider: result.provider,
  }
}
