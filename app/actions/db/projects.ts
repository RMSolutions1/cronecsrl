"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

type Project = {
  id: string
  title: string
  description: string
  category: string
  location?: string | null
  year?: number | null
  area?: string | number | null
  budget?: string | null
  duration?: string | null
  client?: string | null
  image_url: string
  status: string
  featured: boolean
  created_at?: string
  updated_at?: string
  created_by?: string
}

export async function getProjectsPublic() {
  try {
    const list = await readData<Project[]>("projects.json")
    return (list || [])
      .filter((p) => p.status === "published")
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.year ?? 0) - (a.year ?? 0))
  } catch {
    return []
  }
}

export async function getProjectsAdmin() {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return []
  const list = await readData<Project[]>("projects.json")
  return (list || []).sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
}

export async function getProjectById(id: string) {
  try {
    const list = await readData<Project[]>("projects.json")
    return list.find((p) => p.id === id) ?? null
  } catch {
    return null
  }
}

export async function createOrUpdateProject(data: {
  id?: string
  title: string
  description: string
  category: string
  location?: string
  year?: number
  area?: string | number
  budget?: string
  duration?: string
  client?: string
  image_url: string
  status?: string
  featured?: boolean
}) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const list = await readData<Project[]>("projects.json")
  const id = data.id ?? generateId()
  const now = new Date().toISOString()
  const record: Project = {
    id,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location ?? null,
    year: data.year ?? null,
    area: data.area ?? null,
    budget: data.budget ?? null,
    duration: data.duration ?? null,
    client: data.client ?? null,
    image_url: data.image_url,
    status: data.status ?? "draft",
    featured: !!data.featured,
    updated_at: now,
  }
  const idx = list.findIndex((p) => p.id === id)
  if (idx >= 0) {
    record.created_at = list[idx].created_at
    record.created_by = list[idx].created_by
    list[idx] = record
  } else {
    record.created_at = now
    record.created_by = user.id
    list.unshift(record)
  }
  await writeData("projects.json", list)
  return id
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const list = await readData<Project[]>("projects.json")
  const next = list.filter((p) => p.id !== id)
  await writeData("projects.json", next)
}
