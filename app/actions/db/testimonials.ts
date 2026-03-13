"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

type Testimonial = {
  id: string
  client_name: string
  client_company?: string | null
  client_position?: string | null
  content: string
  rating?: number
  avatar_url?: string | null
  status: string
  featured: boolean
  created_at?: string
  updated_at?: string
  created_by?: string
}

export async function getTestimonialsPublic() {
  try {
    const list = await readData<Testimonial[]>("testimonials.json")
    return (list || []).filter((t) => t.status === "published")
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
  } catch {
    return []
  }
}

export async function getTestimonialsAdmin() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return []
  const list = await readData<Testimonial[]>("testimonials.json")
  return (list || []).sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
}

export async function saveTestimonial(data: Record<string, unknown>) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const list = await readData<Testimonial[]>("testimonials.json")
  const id = (data.id as string) ?? generateId()
  const now = new Date().toISOString()
  const record: Testimonial = {
    id,
    client_name: (data.client_name as string) ?? "",
    client_company: (data.client_company as string) ?? null,
    client_position: (data.client_position as string) ?? null,
    content: (data.content as string) ?? (data.testimonial_text as string) ?? "",
    rating: Number(data.rating ?? 5),
    avatar_url: (data.avatar_url as string) ?? (data.image_url as string) ?? null,
    status: (data.status as string) ?? "published",
    featured: !!data.featured,
    updated_at: now,
  }
  const idx = list.findIndex((t) => t.id === id)
  if (idx >= 0) {
    record.created_at = list[idx].created_at
    record.created_by = list[idx].created_by
    list[idx] = record
  } else {
    record.created_at = now
    record.created_by = user.id
    list.push(record)
  }
  await writeData("testimonials.json", list)
  return id
}

export async function deleteTestimonial(id: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const list = await readData<Testimonial[]>("testimonials.json")
  await writeData("testimonials.json", list.filter((t) => t.id !== id))
}
