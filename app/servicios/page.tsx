import { ServiciosPageContent, type ServiceFromDb } from "@/components/servicios-page-content"
import { getServicesPublic, getHeroImagesPublic } from "@/lib/data-read"
import { resolveHeroSlides } from "@/lib/hero-images"
import { images } from "@/lib/images"

export const metadata = {
  title: "Servicios | CRONEC SRL - Obras Civiles, Electricas e Industriales",
  description: "Servicios integrales de construcción civil, obras eléctricas, arquitectura e ingeniería, instalaciones industriales y más. Salta, Argentina.",
}

export const dynamic = "force-dynamic"

export default async function ServiciosPage() {
  let servicesFromDb: ServiceFromDb[] = []
  let heroSlides = resolveHeroSlides([], [
    { src: images.heroServicios[0], alt: "Equipo de ingenieros CRONEC" },
    { src: images.heroServicios[1], alt: "Construcción CRONEC" },
    { src: images.heroServicios[2], alt: "Obra civil CRONEC" },
  ])
  try {
    const [services, heroes] = await Promise.all([getServicesPublic(), getHeroImagesPublic("servicios")])
    servicesFromDb = (services || []) as unknown as ServiceFromDb[]
    heroSlides = resolveHeroSlides(heroes, [
      { src: images.heroServicios[0], alt: "Equipo de ingenieros CRONEC" },
      { src: images.heroServicios[1], alt: "Construcción CRONEC" },
      { src: images.heroServicios[2], alt: "Obra civil CRONEC" },
    ])
  } catch {
    // fallback: el componente usa datos por defecto
  }
  return <ServiciosPageContent servicesFromDb={servicesFromDb} heroSlides={heroSlides} />
}
