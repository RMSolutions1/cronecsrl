"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"

export type Certification = {
  id: string
  name: string
  logo_url?: string | null
  order_index: number
  updated_at?: string
}

export async function getCertificationsPublic() {
  try {
    const list = await readData<Certification[]>("certifications.json")
    return (list || []).sort((a, b) => a.order_index - b.order_index)
  } catch {
    return []
  }
}

export async function getCertificationsAdmin() {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return []
    const list = await readData<Certification[]>("certifications.json")
    return (list || []).sort((a, b) => a.order_index - b.order_index)
  } catch {
    return []
  }
}

export async function saveCertification(data: Record<string, unknown>): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    const list = await readData<Certification[]>("certifications.json")
    const id = (data.id as string) ?? generateId()
    const order = Number(data.order_index ?? data.order ?? list.length)
    const record: Certification = {
      id,
      name: (data.name as string) ?? "",
      logo_url: (data.logo_url as string) ?? null,
      order_index: order,
      updated_at: new Date().toISOString(),
    }
    const idx = list.findIndex((c) => c.id === id)
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...record }
    } else {
      list.push(record)
    }
    list.sort((a, b) => a.order_index - b.order_index)
    await writeData("certifications.json", list)
    return { ok: true, id }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[Certifications] Error al guardar:", msg)
    return { ok: false, error: msg || "Error al guardar la certificación" }
  }
}

export async function deleteCertification(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    const list = await readData<Certification[]>("certifications.json")
    await writeData("certifications.json", list.filter((c) => c.id !== id))
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[Certifications] Error al eliminar:", msg)
    return { ok: false, error: msg || "Error al eliminar la certificación" }
  }
}
