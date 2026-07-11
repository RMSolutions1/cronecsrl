import { getSiteUrl } from "@/lib/site-url"
import { resolveCompanyName } from "@/lib/company-email"
import { escapeHtml } from "@/lib/email-templates-base"

export function buildContactAdminHtml(data: {
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  message: string
}): string {
  return emailLayout(`
    <h2 style="margin:0 0 16px;color:#1e3a5f">Nuevo contacto web</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;color:#64748b;width:120px">Nombre</td><td><strong>${escapeHtml(data.name)}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#64748b">Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      ${data.phone ? `<tr><td style="padding:8px 0;color:#64748b">Teléfono</td><td>${escapeHtml(data.phone)}</td></tr>` : ""}
      ${data.company ? `<tr><td style="padding:8px 0;color:#64748b">Empresa</td><td>${escapeHtml(data.company)}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#64748b">Servicio</td><td>${escapeHtml(data.service)}</td></tr>
    </table>
    <p style="margin:16px 0 8px;color:#64748b">Mensaje</p>
    <div style="background:#f8fafc;border-radius:8px;padding:16px;white-space:pre-wrap">${escapeHtml(data.message)}</div>
    <p style="margin-top:24px;font-size:13px;color:#94a3b8">Respondé directamente a este correo para contactar al cliente.</p>
  `)
}

export function buildContactConfirmationHtml(name: string): string {
  const company = resolveCompanyName()
  return emailLayout(`
    <h2 style="margin:0 0 16px;color:#1e3a5f">Recibimos su consulta</h2>
    <p>Hola <strong>${escapeHtml(name)}</strong>,</p>
    <p>Gracias por contactar a <strong>${escapeHtml(company)}</strong>. Recibimos su mensaje y un profesional de nuestro equipo le responderá a la brevedad, generalmente dentro de las próximas 24 horas hábiles.</p>
    <p style="margin-top:24px">Saludos cordiales,<br><strong>Equipo ${escapeHtml(company)}</strong></p>
    <p style="font-size:13px;color:#94a3b8;margin-top:24px">Este es un correo automático. Por favor no responda a esta dirección si necesita una respuesta urgente; utilice nuestro teléfono +54 9 387 536-1210.</p>
  `)
}

export function buildNewsletterAdminHtml(email: string): string {
  return emailLayout(`
    <h2 style="margin:0 0 16px;color:#1e3a5f">Nueva suscripción al boletín</h2>
    <p>Se registró un nuevo suscriptor:</p>
    <p style="font-size:18px"><strong>${escapeHtml(email)}</strong></p>
  `)
}

export function buildNewsletterWelcomeHtml(): string {
  const company = resolveCompanyName()
  const siteUrl = getSiteUrl()
  return emailLayout(`
    <h2 style="margin:0 0 16px;color:#1e3a5f">¡Bienvenido a nuestro boletín!</h2>
    <p>Gracias por suscribirse a las novedades de <strong>${escapeHtml(company)}</strong>.</p>
    <p>Recibirá noticias sobre proyectos, certificaciones y actualizaciones del sector de la construcción en Salta y el NOA.</p>
    <p style="margin-top:24px"><a href="${siteUrl}/blog" style="display:inline-block;background:#1e3a5f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Ver noticias</a></p>
  `)
}

export function buildPasswordResetHtml(resetUrl: string, expiresMinutes: number): string {
  const company = resolveCompanyName()
  return emailLayout(`
    <h2 style="margin:0 0 16px;color:#1e3a5f">Restablecer contraseña</h2>
    <p>Recibimos una solicitud para restablecer la contraseña de su cuenta de administración en <strong>${escapeHtml(company)}</strong>.</p>
    <p style="margin:24px 0"><a href="${resetUrl}" style="display:inline-block;background:#1e3a5f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Restablecer contraseña</a></p>
    <p style="font-size:13px;color:#64748b">El enlace expira en ${expiresMinutes} minutos. Si no solicitó este cambio, ignore este correo.</p>
    <p style="font-size:12px;color:#94a3b8;word-break:break-all">${resetUrl}</p>
  `)
}

function emailLayout(content: string): string {
  const company = resolveCompanyName()
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)">
    <div style="background:#1e3a5f;padding:20px 24px;color:#fff;font-weight:600">${escapeHtml(company)}</div>
    <div style="padding:24px;color:#334155;line-height:1.6;font-size:15px">${content}</div>
    <div style="padding:16px 24px;background:#f8fafc;font-size:12px;color:#94a3b8;text-align:center">
      © ${new Date().getFullYear()} ${escapeHtml(company)} · Salta, Argentina
    </div>
  </div>
</body>
</html>`
}
