import { NextResponse } from "next/server"
import { readData, writeData, generateId } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.nombre ?? "").trim()
    const email = String(body.email ?? "").trim()
    const phone = String(body.telefono ?? "").trim()
    const service = String(body.servicio ?? "").trim()
    const message = String(body.mensaje ?? "").trim()
    const company = body.empresa ? String(body.empresa).trim() : undefined

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { success: false, message: "Por favor complete todos los campos requeridos." },
        { status: 400 }
      )
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Por favor ingrese un email válido." },
        { status: 400 }
      )
    }

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
