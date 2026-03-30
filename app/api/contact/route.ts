import { NextResponse } from "next/server"
import { validateContactInput } from "@/lib/contact-validation"
import { checkContactRateLimit } from "@/lib/rate-limit"
import { createContactSubmission } from "@/app/actions/db/contact"

export async function POST(request: Request) {
  try {
    const rate = checkContactRateLimit(request)
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, message: "Demasiados envíos. Intente más tarde." },
        { status: 429, headers: rate.retryAfter ? { "Retry-After": String(rate.retryAfter) } : undefined }
      )
    }

    const body = await request.json()
    const validation = validateContactInput({
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono,
      servicio: body.servicio,
      mensaje: body.mensaje,
      empresa: body.empresa,
    })

    if (!validation.ok || !validation.data) {
      return NextResponse.json(
        { success: false, message: validation.message ?? "Datos inválidos." },
        { status: 400 }
      )
    }

    const { name, email, phone, service, message, company } = validation.data

    // Guardar en la base de datos
    await createContactSubmission({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      service: service || undefined,
      message,
    })

    return NextResponse.json({
      success: true,
      message: "Gracias por contactarnos. Responderemos a la brevedad.",
    })
  } catch (e) {
    console.error("[API contact]", e)
    return NextResponse.json(
      { success: false, message: "Error al enviar. Intente nuevamente." },
      { status: 500 }
    )
  }
}
