"use server"

import { getCurrentUser } from "@/lib/auth"
import { query, isPostgresConfigured } from "@/lib/db-pg"
import { readData, writeData, generateId } from "@/lib/data"

type Message = {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  service?: string | null
  message: string
  is_read?: boolean
  status?: string
  notes?: string | null
  admin_reply?: string | null
  replied_at?: string | null
  replied_by?: string | null
  created_at: string
  updated_at?: string
}

type Row = Record<string, unknown>

// Obtener todos los mensajes de contacto
export async function getContactSubmissions() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return []

  if (isPostgresConfigured()) {
    try {
      const rows = await query<Row[]>("SELECT * FROM contact_submissions ORDER BY created_at DESC")
      return rows.map((r) => ({
        id: r.id != null ? String(r.id) : "",
        full_name: r.name != null ? String(r.name) : "",
        email: r.email != null ? String(r.email) : "",
        phone: r.phone != null ? String(r.phone) : null,
        company: r.company != null ? String(r.company) : null,
        service_interest: r.service != null ? String(r.service) : null,
        message: r.message != null ? String(r.message) : "",
        is_read: !!r.is_read,
        status: r.status != null ? String(r.status) : "new",
        notes: r.notes != null ? String(r.notes) : null,
        admin_reply: r.admin_reply != null ? String(r.admin_reply) : null,
        replied_at: r.replied_at ? new Date(r.replied_at as string).toISOString() : null,
        replied_by: r.replied_by != null ? String(r.replied_by) : null,
        created_at: r.created_at ? new Date(r.created_at as string).toISOString() : "",
        updated_at: r.updated_at ? new Date(r.updated_at as string).toISOString() : null,
      }))
    } catch (error) {
      console.error("[getContactSubmissions] DB error:", error)
    }
  }

  // Fallback a JSON
  const list = await readData<Message[]>("messages.json")
  return (list || []).map((r) => ({ ...r, full_name: r.name, service_interest: r.service }))
}

// Marcar mensaje como leido
export async function markContactAsRead(id: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return

  if (isPostgresConfigured()) {
    try {
      await query("UPDATE contact_submissions SET is_read = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id])
      return
    } catch (error) {
      console.error("[markContactAsRead] DB error:", error)
    }
  }

  // Fallback a JSON
  const list = await readData<Message[]>("messages.json")
  const item = list.find((m) => m.id === id)
  if (item) item.is_read = true
  await writeData("messages.json", list)
}

// Eliminar mensaje
export async function deleteContactSubmission(id: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")

  if (isPostgresConfigured()) {
    try {
      await query("DELETE FROM contact_submissions WHERE id = $1", [id])
      return
    } catch (error) {
      console.error("[deleteContactSubmission] DB error:", error)
    }
  }

  // Fallback a JSON
  const list = await readData<Message[]>("messages.json")
  await writeData("messages.json", list.filter((m) => m.id !== id))
}

// Crear nueva submission de contacto (desde el formulario publico)
export async function createContactSubmission(data: {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}) {
  const id = generateId()
  const now = new Date().toISOString()

  if (isPostgresConfigured()) {
    try {
      await query(
        `INSERT INTO contact_submissions (id, name, email, phone, company, service, message, status, is_read, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', false, $8, $8)`,
        [id, data.name, data.email, data.phone ?? null, data.company ?? null, data.service ?? null, data.message, now]
      )
      return id
    } catch (error) {
      console.error("[createContactSubmission] DB error:", error)
      throw error
    }
  }

  // Fallback a JSON
  const list = await readData<Message[]>("messages.json")
  list.unshift({
    id, name: data.name, email: data.email, phone: data.phone ?? null, company: data.company ?? null,
    service: data.service ?? null, message: data.message, is_read: false, created_at: now,
  })
  await writeData("messages.json", list)
  return id
}

// Actualizar notas internas de un mensaje
export async function updateContactNotes(id: string, notes: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")

  if (isPostgresConfigured()) {
    try {
      await query(
        "UPDATE contact_submissions SET notes = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [notes, id]
      )
      return { success: true }
    } catch (error) {
      console.error("[updateContactNotes] DB error:", error)
      throw error
    }
  }

  // Fallback a JSON
  const list = await readData<Message[]>("messages.json")
  const item = list.find((m) => m.id === id)
  if (item) {
    item.notes = notes
    item.updated_at = new Date().toISOString()
  }
  await writeData("messages.json", list)
  return { success: true }
}

// Actualizar estado del mensaje
export async function updateContactStatus(id: string, status: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")

  if (isPostgresConfigured()) {
    try {
      await query(
        "UPDATE contact_submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [status, id]
      )
      return { success: true }
    } catch (error) {
      console.error("[updateContactStatus] DB error:", error)
      throw error
    }
  }

  // Fallback a JSON
  const list = await readData<Message[]>("messages.json")
  const item = list.find((m) => m.id === id)
  if (item) {
    item.status = status
    item.updated_at = new Date().toISOString()
  }
  await writeData("messages.json", list)
  return { success: true }
}

// Guardar respuesta del admin (para registro interno)
export async function saveAdminReply(id: string, reply: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")

  const now = new Date().toISOString()

  if (isPostgresConfigured()) {
    try {
      await query(
        `UPDATE contact_submissions 
         SET admin_reply = $1, replied_at = $2, replied_by = $3, status = 'replied', is_read = true, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $4`,
        [reply, now, user.id, id]
      )
      return { success: true }
    } catch (error) {
      console.error("[saveAdminReply] DB error:", error)
      throw error
    }
  }

  // Fallback a JSON
  const list = await readData<Message[]>("messages.json")
  const item = list.find((m) => m.id === id)
  if (item) {
    item.admin_reply = reply
    item.replied_at = now
    item.replied_by = user.id
    item.status = "replied"
    item.is_read = true
    item.updated_at = now
  }
  await writeData("messages.json", list)
  return { success: true }
}
