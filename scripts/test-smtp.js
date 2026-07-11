/**
 * Prueba de conexión SMTP Ferozo. Uso: node scripts/test-smtp.js
 * Requiere SMTP_PASS en .env.local
 */
require("dotenv").config({ path: ".env.local" })
const nodemailer = require("nodemailer")

async function main() {
  const host = process.env.SMTP_HOST || "c2751446.ferozo.com"
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER || "info@cronecsrl.com.ar"
  const pass = process.env.SMTP_PASS?.trim()

  if (!pass) {
    console.error("Falta SMTP_PASS en .env.local")
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  console.log(`Verificando SMTP ${user} @ ${host}:${port}...`)
  await transporter.verify()
  console.log("Conexión SMTP OK")

  const to = process.env.NOTIFY_TO_EMAIL || user
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || `CRONEC SRL <${user}>`,
    to,
    subject: "Prueba SMTP CRONEC SRL",
    text: "Correo de prueba desde scripts/test-smtp.js — configuración Ferozo correcta.",
    html: "<p>Correo de prueba — <strong>SMTP Ferozo configurado correctamente</strong>.</p>",
  })
  console.log("Enviado:", info.messageId, "→", to)
}

main().catch((e) => {
  console.error("Error SMTP:", e.message)
  process.exit(1)
})
