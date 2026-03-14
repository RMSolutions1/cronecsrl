import { NextResponse } from "next/server"
import { readData, writeData, generateId } from "@/lib/data"
import { validateContactInput } from "@/lib/contact-validation"
import { checkContactRateLimit } from "@/lib/rate-limit"

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

    const list = await readData<{ id: string; name: string; email: string; phone?: string; company?: string; service: string; message: string; is_read: boolean; created_at: string }[]>("messages.json")
    list.unshift({
      id: generateId(),
      name,
      email,
      phone: phone || undefined,
      company,
      service,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    await writeData("messages.json", list)
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
