"use server"

import { readFile, writeFile, mkdir } from "fs/promises"
import path from "path"
import { getCurrentUser } from "@/lib/auth"

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

async function readCalculadoraRaw(): Promise<CalculadoraData> {
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
  const current = await readCalculadoraRaw()
  await writeFile(CALC_PATH, JSON.stringify({ ...current, ...data }, null, 2), "utf-8")
}
