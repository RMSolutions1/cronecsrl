"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { requireAdmin } from "@/lib/admin-auth"
import { assertDbWritable } from "@/lib/admin-persist"
import { revalidatePublicContent, REVALIDATE } from "@/lib/revalidate-public"

type Service = {
  id: string
  title: string
  slug: string
  description?: string | null
  short_description?: string | null
  icon?: string | null
  image_url?: string | null
  features?: string[] | null
  benefits?: string[] | null
  projects?: string | null
  display_order?: number
  order_index?: number
  status: string
  is_active?: boolean
  updated_at?: string
  created_by?: string
}

export async function getServicesPublic() {
  try {
    const list = await readData<Service[]>("services.json")
    return (list || []).filter((s) => s.status === "active" || s.is_active === true)
      .sort((a, b) => (a.display_order ?? a.order_index ?? 0) - (b.display_order ?? b.order_index ?? 0))
  } catch {
    return []
  }
}

export async function getServicesAdmin() {
  const user = await requireAdmin().catch(() => null)
  if (!user) return []
  const list = await readData<Service[]>("services.json")
  return (list || []).sort((a, b) => (a.display_order ?? a.order_index ?? 0) - (b.display_order ?? b.order_index ?? 0))
}

export async function getServiceBySlug(slug: string) {
  const list = await readData<Service[]>("services.json")
  const s = (list || []).find((x) => (x.slug ?? "").toLowerCase() === slug.toLowerCase())
  return s && (s.status === "active" || s.is_active === true) ? s : null
}

export async function saveService(data: Record<string, unknown>) {
  const user = await requireAdmin()
  assertDbWritable()
  const list = await readData<Service[]>("services.json")
  const id = (data.id as string) ?? generateId()
  const slug = (data.slug as string) ?? String(data.title ?? "").toLowerCase().replace(/\s+/g, "-")
  const prev = list.find((s) => s.id === id)
  const features = Array.isArray(data.features) ? data.features : data.features != null ? JSON.parse(JSON.stringify(data.features)) : null
  const benefits = Array.isArray(data.benefits) ? data.benefits : data.benefits != null ? JSON.parse(JSON.stringify(data.benefits)) : null
  const now = new Date().toISOString()
  const record: Service = {
    id, title: (data.title as string) ?? "", slug,
    description: (data.description as string) ?? null, short_description: (data.short_description as string) ?? null,
    icon: (data.icon as string) ?? "Building2", image_url: (data.image_url as string) ?? null,
    features, benefits, projects: (data.projects as string) ?? null,
    display_order: Number(data.display_order ?? data.order_index ?? 0),
    order_index: Number(data.order_index ?? data.display_order ?? 0),
    status: (data.status as string) ?? "active", is_active: data.is_active !== false, updated_at: now,
  }
  const idx = list.findIndex((s) => s.id === id)
  if (idx >= 0) list[idx] = { ...list[idx], ...record }
  else { record.created_by = user.id; list.push(record) }
  await writeData("services.json", list)
  const paths: string[] = [...REVALIDATE.servicios]
  if (slug) paths.push(`/servicios/${slug}`)
  if (prev?.slug && prev.slug !== slug) paths.push(`/servicios/${prev.slug}`)
  revalidatePublicContent(paths)
  return id
}

export async function deleteService(id: string) {
  await requireAdmin()
  assertDbWritable()
  const list = await readData<Service[]>("services.json")
  const target = list.find((s) => s.id === id)
  await writeData("services.json", list.filter((s) => s.id !== id))
  const paths: string[] = [...REVALIDATE.servicios]
  if (target?.slug) paths.push(`/servicios/${target.slug}`)
  revalidatePublicContent(paths)
}
