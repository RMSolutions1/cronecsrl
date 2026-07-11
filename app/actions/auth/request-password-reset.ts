"use server"

import { getSiteUrl } from "@/lib/site-url"
import { isEmailConfigured } from "@/lib/email-config"
import { sendEmail } from "@/lib/send-email"
import { buildPasswordResetHtml } from "@/lib/email-templates"
import { RESET_TOKEN_TTL_MS, createPasswordResetToken } from "@/lib/password-reset"
import { checkContactRateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export type RequestPasswordResetResult = { ok: boolean; message: string }

export async function requestPasswordResetAction(formData: FormData): Promise<RequestPasswordResetResult> {
  const hdrs = await headers()
  const fakeRequest = new Request("http://local", {
    headers: { "x-forwarded-for": hdrs.get("x-forwarded-for") ?? "" },
  })
  const rate = checkContactRateLimit(fakeRequest)
  if (!rate.allowed) {
    return { ok: false, message: "Demasiados intentos. Espere unos minutos e intente de nuevo." }
  }

  if (!isEmailConfigured()) {
    return {
      ok: false,
      message: "El correo no está configurado en el servidor. Contacte al soporte técnico.",
    }
  }

  const email = String(formData.get("email") ?? "").trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Ingrese un correo electrónico válido." }
  }

  const token = await createPasswordResetToken(email)
  // Respuesta genérica aunque el email no exista (seguridad)
  const genericOk =
    "Si el correo está registrado como administrador, recibirá un enlace para restablecer su contraseña en los próximos minutos."

  if (!token) {
    return { ok: true, message: genericOk }
  }

  const siteUrl = getSiteUrl()
  const resetUrl = `${siteUrl}/admin/restablecer/${token}`
  const expiresMinutes = Math.round(RESET_TOKEN_TTL_MS / 60000)

  const sent = await sendEmail({
    to: email.trim().toLowerCase(),
    subject: "Restablecer contraseña — CRONEC SRL Admin",
    html: buildPasswordResetHtml(resetUrl, expiresMinutes),
  })

  if (!sent.ok) {
    console.error("[password-reset]", sent.error)
    return { ok: false, message: "No se pudo enviar el correo. Verifique la configuración SMTP en Vercel." }
  }

  return { ok: true, message: genericOk }
}
