import nodemailer from "nodemailer"
import { getEmailConfig, getSmtpSettings, isEmailConfigured } from "@/lib/email-config"

export type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export type SendEmailResult = {
  ok: boolean
  provider?: "smtp" | "resend"
  error?: string
}

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

async function sendViaSmtp(options: SendEmailOptions, from: string): Promise<SendEmailResult> {
  const transporter = nodemailer.createTransport(await getSmtpSettings())
  try {
    await transporter.sendMail({
      from,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text ?? htmlToText(options.html),
      replyTo: options.replyTo,
    })
    return { ok: true, provider: "smtp" }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[email/smtp]", msg)
    return { ok: false, provider: "smtp", error: msg }
  }
}

async function sendViaResend(options: SendEmailOptions, from: string): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY!.trim()
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text ?? htmlToText(options.html),
        reply_to: options.replyTo,
      }),
    })
    const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string }
    if (!res.ok) {
      const err = data.message ?? data.error ?? `HTTP ${res.status}`
      console.error("[email/resend]", err)
      return { ok: false, provider: "resend", error: err }
    }
    return { ok: true, provider: "resend" }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[email/resend]", msg)
    return { ok: false, provider: "resend", error: msg }
  }
}

/** Envía correo vía SMTP (prioridad) o Resend. */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  if (!(await isEmailConfigured())) {
    return {
      ok: false,
      error: "Correo no configurado: configurá SMTP en Admin → Correo o definí SMTP_* / RESEND_API_KEY.",
    }
  }

  const cfg = await getEmailConfig()
  const replyTo = options.replyTo ?? cfg.replyTo

  if (cfg.provider === "smtp") {
    return sendViaSmtp({ ...options, replyTo }, cfg.from)
  }
  return sendViaResend({ ...options, replyTo }, cfg.from)
}

/** Notifica al equipo admin (contacto, boletín, etc.). */
export async function sendAdminNotification(options: Omit<SendEmailOptions, "to">): Promise<SendEmailResult> {
  const cfg = await getEmailConfig()
  return sendEmail({ ...options, to: cfg.adminTo })
}
