import { ServiciosPageContent } from "@/components/servicios-page-content"
import { getServicesPublic } from "@/app/actions/db/services"

export const metadata = {
  title: "Servicios | CRONEC SRL - Obras Civiles, Electricas e Industriales",
  description: "Servicios integrales de construcción civil, obras eléctricas, arquitectura e ingeniería, instalaciones industriales y más. Salta, Argentina.",
}

export default async function ServiciosPage() {
  let servicesFromDb: Awaited<ReturnType<typeof getServicesPublic>> = []
  try {
    servicesFromDb = await getServicesPublic()
  } catch {
    // fallback: el componente usa datos por defecto
  }
  return <ServiciosPageContent servicesFromDb={servicesFromDb} />
}
