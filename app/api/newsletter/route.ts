import { NextResponse } from "next/server"
import { checkContactRateLimit } from "@/lib/rate-limit"
import { subscribeNewsletter } from "@/lib/newsletter-store"
import { notifyAdminEmail } from "@/lib/notify-email"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const rate = checkContactRateLimit(request)
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: "Demasiados intentos. Intente más tarde." },
        { status: 429, headers: rate.retryAfter ? { "Retry-After": String(rate.retryAfter) } : undefined }
      )
    }

    const body = await request.json().catch(() => ({}))
    const email = typeof body.email === "string" ? body.email : ""
    const result = await subscribeNewsletter(email)

    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    if (!result.duplicate) {
      void notifyAdminEmail({
        subject: "Nueva suscripción al boletín — CRONEC SRL",
        html: `<p>Nuevo suscriptor: <strong>${email.trim().toLowerCase()}</strong></p>`,
        replyTo: email.trim().toLowerCase(),
      })
    }

    return NextResponse.json({ success: true, message: result.message, duplicate: result.duplicate ?? false })
  } catch (e) {
    console.error("[API newsletter]", e)
    return NextResponse.json(
      { success: false, message: "Error al suscribirse. Intente nuevamente." },
      { status: 500 }
    )
  }
}
