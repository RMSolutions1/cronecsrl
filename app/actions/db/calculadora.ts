"use server"

import { readData, writeData } from "@/lib/data"
import { getCurrentUser } from "@/lib/auth"
import { assertDbWritable, formatAdminPersistError } from "@/lib/admin-persist"
import { revalidatePublicContent, REVALIDATE } from "@/lib/revalidate-public"

export type ProjectTypeItem = { id: string; label: string; description: string; pricePerM2: number }
export type QualityLevelItem = { id: string; label: string; multiplier: number; description: string }
export type UrgencyLevelItem = { id: string; label: string; multiplier: number; days: string }

export type CalculadoraData = {
  projectTypes?: ProjectTypeItem[]
  qualityLevels?: QualityLevelItem[]
  urgencyLevels?: UrgencyLevelItem[]
}

export const calculadoraDefaults: CalculadoraData = {
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

async function readCalculadoraMerged(): Promise<CalculadoraData> {
  try {
    const raw = await readData<CalculadoraData>("calculadora.json")
    if (raw && typeof raw === "object") return { ...calculadoraDefaults, ...raw }
  } catch {
    // fallback
  }
  return calculadoraDefaults
}

export async function getCalculadoraPublic(): Promise<CalculadoraData> {
  return readCalculadoraMerged()
}

export async function getCalculadoraAdmin(): Promise<CalculadoraData> {
  const user = await getCurrentUser()
  if (!user || !["admin", "superadmin"].includes(user.role)) return calculadoraDefaults
  return readCalculadoraMerged()
}

export async function saveCalculadora(data: CalculadoraData): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || !["admin", "superadmin"].includes(user.role)) return { ok: false, error: "No autorizado" }
    assertDbWritable()
    const current = await readCalculadoraMerged()
    await writeData("calculadora.json", { ...current, ...data })
    revalidatePublicContent([...REVALIDATE.calculadora])
    return { ok: true }
  } catch (e) {
    console.error("saveCalculadora:", e)
    return { ok: false, error: formatAdminPersistError(e, "guardar") }
  }
}
