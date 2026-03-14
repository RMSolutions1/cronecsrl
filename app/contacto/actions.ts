"use server"

import { createContactSubmission } from "@/app/actions/db/contact"
import { validateContactInput } from "@/lib/contact-validation"

export async function submitContactForm(formData: FormData) {
  const validation = validateContactInput({
    nombre: (formData.get("nombre") as string) ?? "",
    email: (formData.get("email") as string) ?? "",
    telefono: (formData.get("telefono") as string) ?? "",
    servicio: (formData.get("servicio") as string) ?? "",
    mensaje: (formData.get("mensaje") as string) ?? "",
    empresa: (formData.get("empresa") as string) ?? undefined,
  })

  if (!validation.ok || !validation.data) {
    return { success: false, message: validation.message ?? "Datos inválidos." }
  }

  const { name, email, phone, service, message, company } = validation.data

  try {
    await createContactSubmission({
      name,
      email,
      phone,
      company,
      service,
      message,
    })
    return { success: true, message: "Gracias por contactarnos. Responderemos a la brevedad." }
  } catch (error) {
    console.error("[CONTACT FORM] Error:", error)
    return { success: false, message: "Ocurrió un error al enviar el formulario. Por favor intente nuevamente." }
  }
}
