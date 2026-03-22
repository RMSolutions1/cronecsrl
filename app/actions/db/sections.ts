"use server"

import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"
import { isPostgresConfigured, query, getPool } from "@/lib/db-pg"

const DATA_DIR = path.join(process.cwd(), "data")
const SECTIONS_PATH = path.join(DATA_DIR, "sections.json")

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

async function readSectionsFromDb(): Promise<SectionsData | null> {
  if (!isPostgresConfigured()) return null
  try {
    type Row = { section_key: string; title: string | null; subtitle: string | null; content: string | null; extra: Record<string, unknown> | null }
    const rows = await query<Row[]>("SELECT section_key, title, subtitle, content, extra FROM sections WHERE page = 'home' AND is_active = true ORDER BY order_index")
    if (!rows || rows.length === 0) return null
    
    const result: SectionsData = {}
    for (const r of rows) {
      if (r.section_key === "why_cronec" && r.extra) {
        result.whyCronec = {
          title: r.title || "",
          subtitle: r.subtitle || "",
          stats: (r.extra.stats as Array<{ value: number; suffix: string; label: string }>) || [],
          features: (r.extra.features as Array<{ title: string; description: string }>) || [],
          highlights: (r.extra.highlights as string[]) || [],
        }
      } else if (r.section_key === "process" && r.extra) {
        result.process = {
          title: r.title || "",
          subtitle: r.subtitle || "",
          steps: (r.extra.steps as Array<{ number: string; title: string; description: string }>) || [],
        }
      }
    }
    return Object.keys(result).length > 0 ? result : null
  } catch (e) {
    console.error("[Sections] Error reading from DB:", e)
    return null
  }
}

async function readSectionsFromFile(): Promise<SectionsData> {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    const raw = await readFile(SECTIONS_PATH, "utf-8")
    const data = JSON.parse(raw)
    return data && typeof data === "object" ? data : {}
  } catch {
    return {}
  }
}

async function readSectionsRaw(): Promise<SectionsData> {
  const dbData = await readSectionsFromDb()
  if (dbData) return dbData
  return readSectionsFromFile()
}

export async function getSectionsPublic(): Promise<SectionsData> {
  return readSectionsRaw()
}

export async function getSectionsAdmin(): Promise<SectionsData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return {}
  return readSectionsRaw()
}

async function upsertSection(pool: ReturnType<typeof getPool>, key: string, title: string, subtitle: string, extra: Record<string, unknown>, order: number) {
  // Delete existing and insert new (works without UNIQUE constraint)
  await pool.query("DELETE FROM sections WHERE page = 'home' AND section_key = $1", [key])
  await pool.query(
    `INSERT INTO sections (id, page, section_key, title, subtitle, extra, is_active, order_index, created_at, updated_at)
     VALUES (gen_random_uuid(), 'home', $1, $2, $3, $4, true, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [key, title, subtitle, JSON.stringify(extra), order]
  )
}

export async function saveSections(data: SectionsData) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  
  if (isPostgresConfigured()) {
    try {
      const pool = getPool()
      if (data.whyCronec) {
        await upsertSection(pool, "why_cronec", data.whyCronec.title, data.whyCronec.subtitle, 
          { stats: data.whyCronec.stats, features: data.whyCronec.features, highlights: data.whyCronec.highlights }, 1)
      }
      if (data.process) {
        await upsertSection(pool, "process", data.process.title, data.process.subtitle, { steps: data.process.steps }, 2)
      }
      return
    } catch (e) {
      console.error("[Sections] Error saving to DB:", e)
    }
  }
  
  // Fallback to file
  const current = await readSectionsFromFile()
  const next = { ...current, ...data }
  await writeFile(SECTIONS_PATH, JSON.stringify(next, null, 2), "utf-8")
}
