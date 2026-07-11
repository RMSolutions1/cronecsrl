"use server"

import { readData, writeData } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { assertDbWritable, formatAdminPersistError } from "@/lib/admin-persist"
import { revalidatePublicContent, REVALIDATE } from "@/lib/revalidate-public"

export type WhyCronecSection = {
  title: string
  subtitle: string
  stats: Array<{ value: number; suffix: string; label: string }>
  features: Array<{ title: string; description: string }>
  highlights: string[]
}

export type ProcessSection = {
  title: string
  subtitle: string
  steps: Array<{ number: string; title: string; description: string }>
}

export type SectionsData = {
  whyCronec?: WhyCronecSection
  process?: ProcessSection
}

async function readSectionsMerged(): Promise<SectionsData> {
  try {
    const data = await readData<SectionsData>("sections.json")
    return data && typeof data === "object" ? data : {}
  } catch {
    return {}
  }
}

export async function getSectionsPublic(): Promise<SectionsData> {
  return readSectionsMerged()
}

export async function getSectionsAdmin(): Promise<SectionsData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return {}
  return readSectionsMerged()
}

export async function saveSections(data: SectionsData): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    assertDbWritable()
    const current = await readSectionsMerged()
    await writeData("sections.json", { ...current, ...data })
    revalidatePublicContent([...REVALIDATE.home])
    return { ok: true }
  } catch (e) {
    console.error("saveSections:", e)
    return { ok: false, error: formatAdminPersistError(e, "guardar") }
  }
}
