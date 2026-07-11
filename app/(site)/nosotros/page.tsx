import { getNosotrosPublic, getCompanyInfo, getHeroImagesPublic } from "@/lib/data-read"
import { NosotrosPageContent } from "@/components/nosotros-page-content"
import { resolveHeroSlides } from "@/lib/hero-images"
import { images } from "@/lib/images"

export const metadata = {
  title: "Nosotros | CRONEC SRL - Sobre Nosotros",
  description: "Conozca la historia, valores, equipo directivo y certificaciones de CRONEC SRL.",
}


export default async function NosotrosPage() {
  let data = {}
  let mission: string | null = null
  let vision: string | null = null
  let heroSlides = resolveHeroSlides([], [
    { src: images.heroNosotros[0], alt: "Equipo CRONEC" },
    { src: images.heroNosotros[1], alt: "Nosotros CRONEC" },
    { src: images.heroNosotros[2], alt: "Trabajo en equipo CRONEC" },
  ])
  try {
    const [nosotros, company, heroes] = await Promise.all([getNosotrosPublic(), getCompanyInfo(), getHeroImagesPublic("nosotros")])
    data = nosotros ?? {}
    heroSlides = resolveHeroSlides(heroes, [
      { src: images.heroNosotros[0], alt: "Equipo CRONEC" },
      { src: images.heroNosotros[1], alt: "Nosotros CRONEC" },
      { src: images.heroNosotros[2], alt: "Trabajo en equipo CRONEC" },
    ])
    if (company && typeof company === "object") {
      mission = (company.mission as string) ?? null
      vision = (company.vision as string) ?? null
    }
  } catch {
    // fallback a valores por defecto en el componente
  }

  return <NosotrosPageContent data={data} mission={mission} vision={vision} heroSlides={heroSlides} />
}
