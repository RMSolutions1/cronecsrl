"use server"

import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"

const DATA_DIR = path.join(process.cwd(), "data")
const SECTIONS_PATH = path.join(DATA_DIR, "sections.json")

export type WhyCronecSection = {
  title: string
  subtitle: string
  image_url?: string
  stats: Array<{ value: number; suffix: string; label: string }>
  features: Array<{ title: string; description: string }>
  highlights: string[]
}

export type ProcessSection = {
  title: string
  subtitle: string
  steps: Array<{ number: string; title: string; description: string }>
}

export type ClientsSection = {
  certificationsTitle?: string
  certificationsSubtitle?: string
  clientsTitle?: string
  clientsSubtitle?: string
}

export type CTASection = {
  badge?: string
  title?: string
  paragraph?: string
  formTitle?: string
  formSubtitle?: string
}

export type SectionsData = {
  whyCronec?: WhyCronecSection
  process?: ProcessSection
  clients?: ClientsSection
  cta?: CTASection
}

async function readSectionsRaw(): Promise<SectionsData> {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    const raw = await readFile(SECTIONS_PATH, "utf-8")
    const data = JSON.parse(raw)
    return data && typeof data === "object" ? data : {}
  } catch {
    return {}
  }
}

export async function getSectionsPublic(): Promise<SectionsData> {
  return readSectionsRaw()
}

export async function getSectionsAdmin(): Promise<SectionsData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return {}
  return readSectionsRaw()
}

export async function saveSections(data: SectionsData) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  const current = await readSectionsRaw()
  const next = { ...current, ...data }
  await writeFile(SECTIONS_PATH, JSON.stringify(next, null, 2), "utf-8")
}
