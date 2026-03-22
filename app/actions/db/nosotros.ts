"use server"

import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"
import { isPostgresConfigured, query, getPool } from "@/lib/db-pg"

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

async function readNosotrosFromDb(): Promise<NosotrosData | null> {
  if (!isPostgresConfigured()) return null
  try {
    type Row = { section_key: string; title: string | null; subtitle: string | null; content: string | null; extra: Record<string, unknown> | null }
    const rows = await query<Row[]>("SELECT section_key, title, subtitle, content, extra FROM sections WHERE page = 'nosotros' AND is_active = true ORDER BY order_index")
    if (!rows || rows.length === 0) return null
    
    const result: NosotrosData = {}
    for (const r of rows) {
      const extra = r.extra || {}
      switch (r.section_key) {
        case "hero":
          result.hero = { badge: extra.badge as string, title: r.title || "", subtitle: r.subtitle || "" }
          break
        case "stats":
          result.stats = (extra.items as NosotrosStatsItem[]) || []
          break
        case "history":
          result.historySection = { title: r.title || "", subtitle: r.subtitle || "" }
          result.timeline = (extra.timeline as NosotrosTimelineItem[]) || []
          break
        case "values":
          result.valuesSection = { title: r.title || "", subtitle: r.subtitle || "" }
          result.values = (extra.values as NosotrosValueItem[]) || []
          break
        case "team":
          result.teamSection = { title: r.title || "", subtitle: r.subtitle || "" }
          result.team = (extra.team as NosotrosTeamItem[]) || []
          break
        case "certifications":
          result.certSection = { title: r.title || "", subtitle: r.subtitle || "" }
          result.certifications = (extra.certifications as NosotrosCertItem[]) || []
          break
        case "cta":
          result.cta = { title: r.title || "", paragraph: r.content || "" }
          break
      }
    }
    return Object.keys(result).length > 0 ? result : null
  } catch (e) {
    console.error("[Nosotros] Error reading from DB:", e)
    return null
  }
}

async function readNosotrosFromFile(): Promise<NosotrosData> {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    const raw = await readFile(NOSOTROS_PATH, "utf-8")
    const data = JSON.parse(raw)
    return data && typeof data === "object" ? data : {}
  } catch {
    return {}
  }
}

async function readNosotrosRaw(): Promise<NosotrosData> {
  const dbData = await readNosotrosFromDb()
  if (dbData) return dbData
  return readNosotrosFromFile()
}

export async function getNosotrosPublic(): Promise<NosotrosData> {
  return readNosotrosRaw()
}

export async function getNosotrosAdmin(): Promise<NosotrosData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return {}
  return readNosotrosRaw()
}

async function upsertSection(pool: ReturnType<typeof getPool>, key: string, title: string, subtitle: string, content: string | null, extra: Record<string, unknown>, order: number) {
  // Delete existing and insert new (works without UNIQUE constraint)
  await pool.query("DELETE FROM sections WHERE page = 'nosotros' AND section_key = $1", [key])
  await pool.query(
    `INSERT INTO sections (id, page, section_key, title, subtitle, content, extra, is_active, order_index, created_at, updated_at)
     VALUES (gen_random_uuid(), 'nosotros', $1, $2, $3, $4, $5, true, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [key, title, subtitle, content, JSON.stringify(extra), order]
  )
}

export async function saveNosotros(data: NosotrosData) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  
  if (isPostgresConfigured()) {
    try {
      const pool = getPool()
      let order = 1
      if (data.hero) {
        await upsertSection(pool, "hero", data.hero.title || "", data.hero.subtitle || "", null, { badge: data.hero.badge }, order++)
      }
      if (data.stats) {
        await upsertSection(pool, "stats", "", "", null, { items: data.stats }, order++)
      }
      if (data.historySection || data.timeline) {
        await upsertSection(pool, "history", data.historySection?.title || "", data.historySection?.subtitle || "", null, { timeline: data.timeline }, order++)
      }
      if (data.valuesSection || data.values) {
        await upsertSection(pool, "values", data.valuesSection?.title || "", data.valuesSection?.subtitle || "", null, { values: data.values }, order++)
      }
      if (data.teamSection || data.team) {
        await upsertSection(pool, "team", data.teamSection?.title || "", data.teamSection?.subtitle || "", null, { team: data.team }, order++)
      }
      if (data.certSection || data.certifications) {
        await upsertSection(pool, "certifications", data.certSection?.title || "", data.certSection?.subtitle || "", null, { certifications: data.certifications }, order++)
      }
      if (data.cta) {
        await upsertSection(pool, "cta", data.cta.title || "", "", data.cta.paragraph || "", {}, order++)
      }
      return
    } catch (e) {
      console.error("[Nosotros] Error saving to DB:", e)
    }
  }
  
  // Fallback to file
  const current = await readNosotrosFromFile()
  await writeFile(NOSOTROS_PATH, JSON.stringify({ ...current, ...data }, null, 2), "utf-8")
}
