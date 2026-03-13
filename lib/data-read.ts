/**
 * Lectura de datos para páginas públicas. Sin "use server" para permitir static export (FTP).
 * Las páginas públicas importan desde aquí; el admin sigue usando app/actions/db.
 */
import { readData } from "@/lib/data"

export async function getProjectsPublic() {
  try {
    const list = await readData<{ id: string; title: string; description: string; category: string; location?: string | null; year?: number | null; area?: string | number | null; budget?: string | null; duration?: string | null; client?: string | null; image_url: string; status: string; featured: boolean; created_at?: string; updated_at?: string; created_by?: string }[]>("projects.json")
    return (list || []).filter((p) => p.status === "published").sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.year ?? 0) - (a.year ?? 0))
  } catch {
    return []
  }
}

export async function getProjectById(id: string) {
  try {
    const list = await readData<{ id: string }[]>("projects.json")
    const arr = list || []
    return arr.find((p: { id: string }) => p.id === id) ?? null
  } catch {
    return null
  }
}

export async function getServicesPublic() {
  try {
    const list = await readData<{ slug?: string; status?: string; is_active?: boolean; display_order?: number; order_index?: number; [k: string]: unknown }[]>("services.json")
    return (list || []).filter((s) => s.status === "active" || s.is_active === true).sort((a, b) => (a.display_order ?? a.order_index ?? 0) - (b.display_order ?? b.order_index ?? 0))
  } catch {
    return []
  }
}

export async function getServiceBySlug(slug: string) {
  const list = await readData<{ slug?: string; status?: string; is_active?: boolean; [k: string]: unknown }[]>("services.json")
  const s = (list || []).find((x) => (x.slug ?? "").toLowerCase() === slug.toLowerCase())
  return s && (s.status === "active" || s.is_active === true) ? s : null
}

export async function getBlogPostsPublic() {
  try {
    const list = await readData<{ slug?: string; id?: string; status?: string; published_at?: string; created_at?: string; [k: string]: unknown }[]>("blog.json")
    return (list || []).filter((p) => p.status === "published").sort((a, b) => (b.published_at ?? b.created_at ?? "").localeCompare(a.published_at ?? a.created_at ?? ""))
  } catch {
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  const list = await readData<{ slug?: string; id?: string; status?: string; [k: string]: unknown }[]>("blog.json")
  return (list || []).find((p) => (p.slug ?? p.id) === slug && p.status === "published") ?? null
}

export async function getCompanyInfo(): Promise<Record<string, unknown> | null> {
  try {
    const data = await readData<unknown>("settings.json")
    if (data && typeof data === "object" && !Array.isArray(data)) return data as Record<string, unknown>
    return null
  } catch {
    return null
  }
}

export async function getTestimonialsPublic() {
  try {
    const list = await readData<{ status?: string; created_at?: string; [k: string]: unknown }[]>("testimonials.json")
    return (list || []).filter((t) => t.status === "published").sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
  } catch {
    return []
  }
}

export async function getCertificationsPublic() {
  try {
    const list = await readData<{ [k: string]: unknown }[]>("certifications.json")
    return list || []
  } catch {
    return []
  }
}

export async function getClientsPublic() {
  try {
    const list = await readData<{ [k: string]: unknown }[]>("clients.json")
    return list || []
  } catch {
    return []
  }
}

export async function getNosotrosPublic(): Promise<Record<string, unknown>> {
  try {
    const data = await readData<unknown>("nosotros.json")
    if (data && typeof data === "object" && !Array.isArray(data)) return data as Record<string, unknown>
    return {}
  } catch {
    return {}
  }
}

export type WhyCronecSection = { title?: string; subtitle?: string; stats?: unknown[]; features?: unknown[]; highlights?: string[] }
export type ProcessSection = { title?: string; subtitle?: string; steps?: unknown[] }
export type SectionsData = { whyCronec?: WhyCronecSection; process?: ProcessSection }

export async function getSectionsPublic(): Promise<SectionsData> {
  try {
    const data = await readData<unknown>("sections.json")
    if (data && typeof data === "object" && !Array.isArray(data)) return data as SectionsData
    return {}
  } catch {
    return {}
  }
}

export type CalculadoraData = {
  projectTypes?: { id: string; label: string; description: string; pricePerM2: number }[]
  qualityLevels?: { id: string; label: string; multiplier: number; description: string }[]
  urgencyLevels?: { id: string; label: string; multiplier: number; days: string }[]
}

const calculadoraDefaults: CalculadoraData = {
  projectTypes: [
    { id: "civil", label: "Obras Civiles", description: "Edificios, viviendas, locales", pricePerM2: 850 },
    { id: "electrica", label: "Obra Electrica", description: "Instalaciones eléctricas", pricePerM2: 450 },
    { id: "industrial", label: "Industrial", description: "Naves, galpones, plantas", pricePerM2: 650 },
    { id: "reforma", label: "Reforma/Refaccion", description: "Remodelaciones y mejoras", pricePerM2: 550 },
  ],
  qualityLevels: [
    { id: "standard", label: "Estandar", multiplier: 1, description: "Materiales de buena calidad" },
    { id: "premium", label: "Premium", multiplier: 1.35, description: "Materiales superiores" },
    { id: "luxury", label: "Lujo", multiplier: 1.8, description: "Materiales exclusivos" },
  ],
  urgencyLevels: [
    { id: "normal", label: "Normal", multiplier: 1, days: "90-120 dias" },
    { id: "rapido", label: "Rapido", multiplier: 1.15, days: "60-90 dias" },
    { id: "urgente", label: "Urgente", multiplier: 1.3, days: "30-60 dias" },
  ],
}

export async function getCalculadoraPublic(): Promise<CalculadoraData> {
  try {
    const data = await readData<unknown>("calculadora.json")
    if (data && typeof data === "object" && !Array.isArray(data)) return { ...calculadoraDefaults, ...data } as CalculadoraData
  } catch {
    // fallback
  }
  return calculadoraDefaults
}
