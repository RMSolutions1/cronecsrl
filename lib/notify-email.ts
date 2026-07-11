import { COMPANY_EMAIL } from "@/lib/company-email"

type NotifyPayload = {
  subject: string
  html: string
  replyTo?: string
}

/**
 * Notificación opcional al admin vía Resend REST API (sin dependencia npm).
 * Requiere RESEND_API_KEY y opcionalmente NOTIFY_FROM_EMAIL / NOTIFY_TO_EMAIL.
 */
export async function notifyAdminEmail(payload: NotifyPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return

  const to = (process.env.NOTIFY_TO_EMAIL?.trim() || COMPANY_EMAIL).split(",").map((e) => e.trim())
  const from = process.env.NOTIFY_FROM_EMAIL?.trim() || "CRONEC SRL <notificaciones@cronecsrl.online>"

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo,
      }),
    })
  } catch (e) {
    console.error("[notify-email]", e)
  }
}

export function buildContactNotificationHtml(data: {
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  message: string
}): string {
  return `
    <h2>Nuevo contacto — CRONEC SRL</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    ${data.company ? `<p><strong>Empresa:</strong> ${escapeHtml(data.company)}</p>` : ""}
    <p><strong>Servicio:</strong> ${escapeHtml(data.service)}</p>
    <p><strong>Mensaje:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(data.message)}</pre>
  `
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
