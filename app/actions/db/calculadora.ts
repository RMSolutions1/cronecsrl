"use server"

import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"
import { isPostgresConfigured, query, getPool } from "@/lib/db-pg"

const DATA_DIR = path.join(process.cwd(), "data")
const CALC_PATH = path.join(DATA_DIR, "calculadora.json")

export type ProjectTypeItem = { id: string; label: string; description: string; pricePerM2: number }
export type QualityLevelItem = { id: string; label: string; multiplier: number; description: string }
export type UrgencyLevelItem = { id: string; label: string; multiplier: number; days: string }

export type CalculadoraData = {
  projectTypes?: ProjectTypeItem[]
  qualityLevels?: QualityLevelItem[]
  urgencyLevels?: UrgencyLevelItem[]
}

const defaults: CalculadoraData = {
  projectTypes: [
    { id: "civil", label: "Obras Civiles", description: "Edificios, viviendas, locales", pricePerM2: 850 },
    { id: "electrica", label: "Obra Electrica", description: "Instalaciones eléctricas", pricePerM2: 450 },
    { id: "industrial", label: "Industrial", description: "Naves, galpones, plantas", pricePerM2: 650 },
    { id: "reforma", label: "Reforma/Refaccion", description: "Remodelaciones y mejoras", pricePerM2: 550 },
  ],
  qualityLevels: [
    { id: "standard", label: "Estandar", multiplier: 1, description: "Materiales de buena calidad, terminaciones basicas" },
    { id: "premium", label: "Premium", multiplier: 1.35, description: "Materiales superiores, terminaciones de alta gama" },
    { id: "luxury", label: "Lujo", multiplier: 1.8, description: "Materiales exclusivos, diseño personalizado" },
  ],
  urgencyLevels: [
    { id: "normal", label: "Normal", multiplier: 1, days: "90-120 dias" },
    { id: "rapido", label: "Rapido", multiplier: 1.15, days: "60-90 dias" },
    { id: "urgente", label: "Urgente", multiplier: 1.3, days: "30-60 dias" },
  ],
}

async function readCalculadoraFromDb(): Promise<CalculadoraData | null> {
  if (!isPostgresConfigured()) return null
  try {
    type Row = { category: string; item_name: string; description: string | null; price_per_unit: number | string; unit: string | null }
    const rows = await query<Row[]>("SELECT * FROM calculator_pricing WHERE is_active = true ORDER BY category, item_name")
    if (!rows || rows.length === 0) return null
    
    const projectTypes: ProjectTypeItem[] = []
    const qualityLevels: QualityLevelItem[] = []
    const urgencyLevels: UrgencyLevelItem[] = []

    for (const r of rows) {
      const price = typeof r.price_per_unit === "string" ? parseFloat(r.price_per_unit) : r.price_per_unit
      if (r.category === "project_type") {
        projectTypes.push({ id: r.item_name, label: r.item_name, description: r.description || "", pricePerM2: price })
      } else if (r.category === "quality_level") {
        qualityLevels.push({ id: r.item_name, label: r.item_name, multiplier: price, description: r.description || "" })
      } else if (r.category === "urgency_level") {
        urgencyLevels.push({ id: r.item_name, label: r.item_name, multiplier: price, days: r.unit || "" })
      }
    }

    return {
      projectTypes: projectTypes.length > 0 ? projectTypes : undefined,
      qualityLevels: qualityLevels.length > 0 ? qualityLevels : undefined,
      urgencyLevels: urgencyLevels.length > 0 ? urgencyLevels : undefined,
    }
  } catch (e) {
    console.error("[Calculadora] Error reading from DB:", e)
    return null
  }
}

async function readCalculadoraFromFile(): Promise<CalculadoraData> {
  try {
    await mkdir(DATA_DIR, { recursive: true })
    const raw = await readFile(CALC_PATH, "utf-8")
    const data = JSON.parse(raw)
    if (data && typeof data === "object") return { ...defaults, ...data }
    return defaults
  } catch {
    return defaults
  }
}

async function readCalculadoraRaw(): Promise<CalculadoraData> {
  // Try database first
  const dbData = await readCalculadoraFromDb()
  if (dbData && (dbData.projectTypes || dbData.qualityLevels || dbData.urgencyLevels)) {
    return { ...defaults, ...dbData }
  }
  // Fallback to file
  return readCalculadoraFromFile()
}

export async function getCalculadoraPublic(): Promise<CalculadoraData> {
  return readCalculadoraRaw()
}

export async function getCalculadoraAdmin(): Promise<CalculadoraData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return defaults
  return readCalculadoraRaw()
}

export async function saveCalculadora(data: CalculadoraData) {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) throw new Error("No autorizado")
  
  // Try to save to database first
  if (isPostgresConfigured()) {
    try {
      const pool = getPool()
      // Clear existing items and insert new ones
      await pool.query("DELETE FROM calculator_pricing")
      
      for (const pt of data.projectTypes || []) {
        await pool.query(
          `INSERT INTO calculator_pricing (id, category, item_name, description, price_per_unit, unit, is_active, created_at, updated_at)
           VALUES (gen_random_uuid(), 'project_type', $1, $2, $3, 'm2', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [pt.label, pt.description, pt.pricePerM2]
        )
      }
      for (const ql of data.qualityLevels || []) {
        await pool.query(
          `INSERT INTO calculator_pricing (id, category, item_name, description, price_per_unit, unit, is_active, created_at, updated_at)
           VALUES (gen_random_uuid(), 'quality_level', $1, $2, $3, 'multiplier', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [ql.label, ql.description, ql.multiplier]
        )
      }
      for (const ul of data.urgencyLevels || []) {
        await pool.query(
          `INSERT INTO calculator_pricing (id, category, item_name, description, price_per_unit, unit, is_active, created_at, updated_at)
           VALUES (gen_random_uuid(), 'urgency_level', $1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [ul.label, "", ul.multiplier, ul.days]
        )
      }
      return
    } catch (e) {
      console.error("[Calculadora] Error saving to DB:", e)
      // Fall through to file-based save
    }
  }
  
  // Fallback to file
  const current = await readCalculadoraFromFile()
  await writeFile(CALC_PATH, JSON.stringify({ ...current, ...data }, null, 2), "utf-8")
}
