"use server"

import { readData, writeData } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { assertDbWritable, formatAdminPersistError } from "@/lib/admin-persist"
import { revalidatePublicContent, REVALIDATE } from "@/lib/revalidate-public"

export type NosotrosHero = { badge?: string; title?: string; subtitle?: string }
export type NosotrosStatsItem = { value: string; label: string }
export type NosotrosTimelineItem = { year: string; title: string; description: string }
export type NosotrosValueItem = { title: string; description: string }
export type NosotrosTeamItem = { name: string; position: string; description: string }
export type NosotrosCertItem = { title: string; description: string }
export type NosotrosSectionTitle = { title?: string; subtitle?: string }

export type NosotrosData = {
  hero?: NosotrosHero
  stats?: NosotrosStatsItem[]
  historySection?: NosotrosSectionTitle
  timeline?: NosotrosTimelineItem[]
  valuesSection?: NosotrosSectionTitle
  values?: NosotrosValueItem[]
  teamSection?: NosotrosSectionTitle
  team?: NosotrosTeamItem[]
  certSection?: NosotrosSectionTitle
  certifications?: NosotrosCertItem[]
  cta?: { title?: string; paragraph?: string }
}

async function readNosotrosMerged(): Promise<NosotrosData> {
  try {
    const data = await readData<NosotrosData>("nosotros.json")
    return data && typeof data === "object" ? data : {}
  } catch {
    return {}
  }
}

export async function getNosotrosPublic(): Promise<NosotrosData> {
  return readNosotrosMerged()
}

export async function getNosotrosAdmin(): Promise<NosotrosData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return {}
  return readNosotrosMerged()
}

export async function saveNosotros(data: NosotrosData): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    assertDbWritable()
    const current = await readNosotrosMerged()
    await writeData("nosotros.json", { ...current, ...data })
    revalidatePublicContent([...REVALIDATE.nosotros])
    return { ok: true }
  } catch (e) {
    console.error("saveNosotros:", e)
    return { ok: false, error: formatAdminPersistError(e, "guardar") }
  }
}
