"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

type Message = {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  service?: string | null
  message: string
  is_read?: boolean
  created_at: string
}

export async function getContactSubmissions() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return []
  const list = await readData<Message[]>("messages.json")
  return (list || []).map((r) => ({ ...r, full_name: r.name, service_interest: r.service }))
}

export async function markContactAsRead(id: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return
  const list = await readData<Message[]>("messages.json")
  const item = list.find((m) => m.id === id)
  if (item) item.is_read = true
  await writeData("messages.json", list)
}

export async function deleteContactSubmission(id: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const list = await readData<Message[]>("messages.json")
  await writeData("messages.json", list.filter((m) => m.id !== id))
}

export async function createContactSubmission(data: {
  name: string
  email: string
  phone?: string
  company?: string
  service?: string
  message: string
}) {
  const list = await readData<Message[]>("messages.json")
  const id = generateId()
  list.unshift({
    id, name: data.name, email: data.email, phone: data.phone ?? null, company: data.company ?? null,
    service: data.service ?? null, message: data.message, is_read: false, created_at: new Date().toISOString(),
  })
  await writeData("messages.json", list)
  return id
}
