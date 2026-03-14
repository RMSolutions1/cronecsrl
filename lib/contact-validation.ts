/**
 * Validación unificada del formulario de contacto.
 * Usar en app/api/contact/route.ts y app/contacto/actions.ts.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIMITS = {
  name: 200,
  email: 254,
  phone: 50,
  company: 200,
  service: 200,
  message: 5000,
} as const

export interface ContactInput {
  nombre: string
  email: string
  telefono: string
  servicio: string
  mensaje: string
  empresa?: string
}

export interface ContactValidationResult {
  ok: boolean
  message?: string
  data?: {
    name: string
    email: string
    phone: string
    service: string
    message: string
    company?: string
  }
}

function trim(str: string): string {
  return String(str ?? "").trim()
}

export function validateContactInput(input: ContactInput): ContactValidationResult {
  const name = trim(input.nombre)
  const email = trim(input.email)
  const phone = trim(input.telefono)
  const service = trim(input.servicio)
  const message = trim(input.mensaje)
  const company = input.empresa !== undefined && input.empresa !== null ? trim(String(input.empresa)) : undefined

  if (!name || !email || !phone || !service || !message) {
    return { ok: false, message: "Por favor complete todos los campos requeridos." }
  }

  if (name.length > LIMITS.name) {
    return { ok: false, message: `El nombre no puede superar ${LIMITS.name} caracteres.` }
  }
  if (email.length > LIMITS.email) {
    return { ok: false, message: "El email es demasiado largo." }
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Por favor ingrese un email válido." }
  }
  if (phone.length > LIMITS.phone) {
    return { ok: false, message: "El teléfono no puede superar 50 caracteres." }
  }
  if (service.length > LIMITS.service) {
    return { ok: false, message: "El servicio no puede superar 200 caracteres." }
  }
  if (message.length > LIMITS.message) {
    return { ok: false, message: "El mensaje no puede superar 5000 caracteres." }
  }
  if (company !== undefined && company.length > LIMITS.company) {
    return { ok: false, message: "La empresa no puede superar 200 caracteres." }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone,
      service,
      message,
      company: company || undefined,
    },
  }
}
