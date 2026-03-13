"use server"

import { createContactSubmission } from "@/app/actions/db/contact"

export async function submitContactForm(formData: FormData) {
  const data = {
    nombre: (formData.get("nombre") as string)?.trim(),
    empresa: (formData.get("empresa") as string)?.trim(),
    email: (formData.get("email") as string)?.trim(),
    telefono: (formData.get("telefono") as string)?.trim(),
    servicio: (formData.get("servicio") as string)?.trim(),
    mensaje: (formData.get("mensaje") as string)?.trim(),
  }

  if (!data.nombre || !data.email || !data.telefono || !data.servicio || !data.mensaje) {
    return { success: false, message: "Por favor complete todos los campos requeridos." }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { success: false, message: "Por favor ingrese un email válido." }
  }

  try {
    await createContactSubmission({
      name: data.nombre,
      email: data.email,
      phone: data.telefono,
      company: data.empresa || undefined,
      service: data.servicio,
      message: data.mensaje,
    })
    return { success: true, message: "Gracias por contactarnos. Responderemos a la brevedad." }
  } catch (error) {
    console.error("[CONTACT FORM] Error:", error)
    return { success: false, message: "Ocurrió un error al enviar el formulario. Por favor intente nuevamente." }
  }
}
