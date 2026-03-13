import { getNosotrosPublic, getCompanyInfo } from "@/lib/data-read"
import { NosotrosPageContent } from "@/components/nosotros-page-content"

export const metadata = {
  title: "Nosotros | CRONEC SRL - Sobre Nosotros",
  description: "Conozca la historia, valores, equipo directivo y certificaciones de CRONEC SRL.",
}

export const dynamic = "force-dynamic"

export default async function NosotrosPage() {
  let data = {}
  let mission: string | null = null
  let vision: string | null = null
  try {
    const [nosotros, company] = await Promise.all([getNosotrosPublic(), getCompanyInfo()])
    data = nosotros ?? {}
    if (company && typeof company === "object") {
      mission = (company.mission as string) ?? null
      vision = (company.vision as string) ?? null
    }
  } catch {
    // fallback a valores por defecto en el componente
  }

  return <NosotrosPageContent data={data} mission={mission} vision={vision} />
}
