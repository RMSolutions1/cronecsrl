"use server"

import { readData, writeData, generateId } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { isPostgresConfigured } from "@/lib/db-pg"
import { isMySQLConfigured } from "@/lib/db-mysql"
import * as pgData from "@/lib/data-pg"
import * as mysqlData from "@/lib/data-mysql"
import { assertDbWritable, formatAdminPersistError } from "@/lib/admin-persist"

export type Certification = {
  id: string
  name: string
  logo_url?: string | null
  order_index: number
  updated_at?: string
}

async function readCertificationsList(): Promise<Certification[]> {
  if (isPostgresConfigured()) {
    return (await pgData.readCertifications()) as Certification[]
  }
  if (isMySQLConfigured()) {
    return (await mysqlData.readCertifications()) as Certification[]
  }
  return await readData<Certification[]>("certifications.json")
}

export async function getCertificationsPublic() {
  try {
    const list = await readCertificationsList()
    return (list || []).sort((a, b) => a.order_index - b.order_index)
  } catch {
    return []
  }
}

export async function getCertificationsAdmin() {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return []
    const list = await readCertificationsList()
    return (list || []).sort((a, b) => a.order_index - b.order_index)
  } catch {
    return []
  }
}

export async function saveCertification(data: Record<string, unknown>): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    assertDbWritable()

    const id = (data.id as string) ?? generateId()
    const record: Certification = {
      id,
      name: (data.name as string) ?? "",
      logo_url: (data.logo_url as string) ?? null,
      order_index: Number(data.order_index ?? data.order ?? 0),
      updated_at: new Date().toISOString(),
    }

    if (isPostgresConfigured()) {
      await pgData.upsertCertification(record as unknown as Record<string, unknown>)
      return { ok: true, id }
    }
    if (isMySQLConfigured()) {
      await mysqlData.upsertCertification(record as unknown as Record<string, unknown>)
      return { ok: true, id }
    }

    const list = await readData<Certification[]>("certifications.json")
    const idx = list.findIndex((c) => c.id === id)
    if (idx >= 0) list[idx] = { ...list[idx], ...record }
    else list.push(record)
    list.sort((a, b) => a.order_index - b.order_index)
    await writeData("certifications.json", list)
    return { ok: true, id }
  } catch (e) {
    console.error("saveCertification:", e)
    return { ok: false, error: formatAdminPersistError(e, "guardar") }
  }
}

export async function deleteCertification(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    assertDbWritable()

    if (isPostgresConfigured()) {
      await pgData.deleteCertificationById(id)
      return { ok: true }
    }
    if (isMySQLConfigured()) {
      await mysqlData.deleteCertificationById(id)
      return { ok: true }
    }

    const list = await readData<Certification[]>("certifications.json")
    await writeData("certifications.json", list.filter((c) => c.id !== id))
    return { ok: true }
  } catch (e) {
    console.error("deleteCertification:", e)
    return { ok: false, error: formatAdminPersistError(e, "eliminar") }
  }
}
