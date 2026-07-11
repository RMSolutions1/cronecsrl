export type ContactFormPayload = {
  nombre: string
  email: string
  telefono?: string
  empresa?: string
  servicio: string
  mensaje: string
}

export type ContactSubmitResult = {
  success: boolean
  message: string
}

async function submitViaFormspree(formspreeId: string, payload: ContactFormPayload): Promise<ContactSubmitResult> {
  try {
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && !(data as { error?: string }).error) {
      return { success: true, message: "Gracias por contactarnos. Responderemos a la brevedad." }
    }
    return {
      success: false,
      message: (data as { error?: string }).error ?? "Error al enviar. Intente nuevamente.",
    }
  } catch {
    return { success: false, message: "Error de conexión. Intente más tarde." }
  }
}

/**
 * Envío unificado: API en Vercel/Node; Formspree en sitio estático (FTP).
 */
export async function submitContactForm(payload: ContactFormPayload): Promise<ContactSubmitResult> {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() ?? ""
  const staticOnly = process.env.NEXT_PUBLIC_HIDE_ADMIN_LINK === "1"

  if (staticOnly) {
    if (!formspreeId) {
      return { success: false, message: "Formulario no configurado. Configure NEXT_PUBLIC_FORMSPREE_ID." }
    }
    return submitViaFormspree(formspreeId, payload)
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const result = await res.json().catch(() => ({}))
    if (res.ok && result.success) {
      return { success: true, message: result.message ?? "Gracias por contactarnos." }
    }
    if (formspreeId) {
      return submitViaFormspree(formspreeId, payload)
    }
    return { success: false, message: result.message ?? "Error al enviar. Intente nuevamente." }
  } catch {
    if (formspreeId) {
      return submitViaFormspree(formspreeId, payload)
    }
    return { success: false, message: "Error de conexión. Intente más tarde o contáctenos por teléfono." }
  }
}
