"use server"

import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"

const DATA_DIR = path.join(process.cwd(), "data")
const NOSOTROS_PATH = path.join(DATA_DIR, "nosotros.json")

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

async function readNosotrosRaw(): Promise<NosotrosData> {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    const raw = await readFile(NOSOTROS_PATH, "utf-8")
    const data = JSON.parse(raw)
    return data && typeof data === "object" ? data : {}
  } catch {
    return {}
  }
}

export async function getNosotrosPublic(): Promise<NosotrosData> {
  return readNosotrosRaw()
}

export async function getNosotrosAdmin(): Promise<NosotrosData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return {}
  return readNosotrosRaw()
}

export async function saveNosotros(data: NosotrosData) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const current = await readNosotrosRaw()
  await writeFile(NOSOTROS_PATH, JSON.stringify({ ...current, ...data }, null, 2), "utf-8")
}
