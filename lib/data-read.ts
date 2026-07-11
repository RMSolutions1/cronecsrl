/**
 * Lectura de datos para páginas públicas. Sin "use server" para permitir static export (FTP).
 * Caché ISR 60s vía unstable_cache; invalidación on-demand con revalidateTag al guardar en admin.
 */
import { unstable_cache } from "next/cache"
import { readData } from "@/lib/data"
import { PUBLIC_PAGE_REVALIDATE } from "@/lib/cache-config"
import { CMS_CACHE_TAGS } from "@/lib/cms-cache"

const cacheOpts = (tag: string) => ({
  revalidate: PUBLIC_PAGE_REVALIDATE,
  tags: [tag, CMS_CACHE_TAGS.all],
})

export type HeroImagePublic = { id: string; page: string; image_url: string; alt_text?: string | null; order_index: number }

export async function getHeroImagesPublic(page: string): Promise<HeroImagePublic[]> {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<HeroImagePublic[]>("hero-images.json")
        return (list || []).filter((h) => h.page === page).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      } catch {
        return []
      }
    },
    ["hero-images", page],
    cacheOpts(CMS_CACHE_TAGS.heroImages)
  )()
}

export async function getProjectsPublic() {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<{ id: string; title: string; description: string; category: string; location?: string | null; year?: number | null; area?: string | number | null; budget?: string | null; duration?: string | null; client?: string | null; image_url: string; status: string; featured: boolean; created_at?: string; updated_at?: string; created_by?: string }[]>("projects.json")
        return (list || []).filter((p) => p.status === "published").sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.year ?? 0) - (a.year ?? 0))
      } catch {
        return []
      }
    },
    ["projects-public"],
    cacheOpts(CMS_CACHE_TAGS.projects)
  )()
}

export async function getProjectById(id: string) {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<{ id: string }[]>("projects.json")
        const arr = list || []
        return arr.find((p: { id: string }) => p.id === id) ?? null
      } catch {
        return null
      }
    },
    ["project-by-id", id],
    cacheOpts(CMS_CACHE_TAGS.projects)
  )()
}

export async function getServicesPublic() {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<{ slug?: string; status?: string; is_active?: boolean; display_order?: number; order_index?: number; [k: string]: unknown }[]>("services.json")
        return (list || []).filter((s) => s.status === "active" || s.is_active === true).sort((a, b) => (a.display_order ?? a.order_index ?? 0) - (b.display_order ?? b.order_index ?? 0))
      } catch {
        return []
      }
    },
    ["services-public"],
    cacheOpts(CMS_CACHE_TAGS.services)
  )()
}

export async function getServiceBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const list = await readData<{ slug?: string; status?: string; is_active?: boolean; [k: string]: unknown }[]>("services.json")
      const s = (list || []).find((x) => (x.slug ?? "").toLowerCase() === slug.toLowerCase())
      return s && (s.status === "active" || s.is_active === true) ? s : null
    },
    ["service-by-slug", slug],
    cacheOpts(CMS_CACHE_TAGS.services)
  )()
}

export async function getBlogPostsPublic() {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<{ slug?: string; id?: string; status?: string; published_at?: string; created_at?: string; [k: string]: unknown }[]>("blog.json")
        return (list || []).filter((p) => p.status === "published").sort((a, b) => (b.published_at ?? b.created_at ?? "").localeCompare(a.published_at ?? a.created_at ?? ""))
      } catch {
        return []
      }
    },
    ["blog-public"],
    cacheOpts(CMS_CACHE_TAGS.blog)
  )()
}

export async function getBlogPostBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const list = await readData<{ slug?: string; id?: string | number; status?: string; [k: string]: unknown }[]>("blog.json")
      return (list || []).find((p) => String(p.slug ?? p.id ?? "") === slug && p.status === "published") ?? null
    },
    ["blog-by-slug", slug],
    cacheOpts(CMS_CACHE_TAGS.blog)
  )()
}

export async function getCompanyInfo(): Promise<Record<string, unknown> | null> {
  return unstable_cache(
    async () => {
      try {
        const data = await readData<unknown>("settings.json")
        if (data && typeof data === "object" && !Array.isArray(data)) return data as Record<string, unknown>
        return null
      } catch {
        return null
      }
    },
    ["company-info"],
    cacheOpts(CMS_CACHE_TAGS.settings)
  )()
}

export async function getTestimonialsPublic() {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<{ status?: string; created_at?: string; [k: string]: unknown }[]>("testimonials.json")
        return (list || []).filter((t) => t.status === "published").sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
      } catch {
        return []
      }
    },
    ["testimonials-public"],
    cacheOpts(CMS_CACHE_TAGS.testimonials)
  )()
}

export async function getCertificationsPublic() {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<{ [k: string]: unknown }[]>("certifications.json")
        return list || []
      } catch {
        return []
      }
    },
    ["certifications-public"],
    cacheOpts(CMS_CACHE_TAGS.certifications)
  )()
}

export async function getClientsPublic() {
  return unstable_cache(
    async () => {
      try {
        const list = await readData<{ [k: string]: unknown }[]>("clients.json")
        return list || []
      } catch {
        return []
      }
    },
    ["clients-public"],
    cacheOpts(CMS_CACHE_TAGS.clients)
  )()
}

export async function getNosotrosPublic(): Promise<Record<string, unknown>> {
  return unstable_cache(
    async () => {
      try {
        const data = await readData<unknown>("nosotros.json")
        if (data && typeof data === "object" && !Array.isArray(data)) return data as Record<string, unknown>
        return {}
      } catch {
        return {}
      }
    },
    ["nosotros-public"],
    cacheOpts(CMS_CACHE_TAGS.nosotros)
  )()
}

export type WhyCronecSection = { title?: string; subtitle?: string; stats?: unknown[]; features?: unknown[]; highlights?: string[] }
export type ProcessSection = { title?: string; subtitle?: string; steps?: unknown[] }
export type SectionsData = { whyCronec?: WhyCronecSection; process?: ProcessSection }

export async function getSectionsPublic(): Promise<SectionsData> {
  return unstable_cache(
    async () => {
      try {
        const data = await readData<unknown>("sections.json")
        if (data && typeof data === "object" && !Array.isArray(data)) return data as SectionsData
        return {}
      } catch {
        return {}
      }
    },
    ["sections-public"],
    cacheOpts(CMS_CACHE_TAGS.sections)
  )()
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
  return unstable_cache(
    async () => {
      try {
        const data = await readData<unknown>("calculadora.json")
        if (data && typeof data === "object" && !Array.isArray(data)) return { ...calculadoraDefaults, ...data } as CalculadoraData
      } catch {
        // fallback
      }
      return calculadoraDefaults
    },
    ["calculadora-public"],
    cacheOpts(CMS_CACHE_TAGS.calculadora)
  )()
}
