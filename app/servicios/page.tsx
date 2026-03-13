import { ServiciosPageContent, type ServiceFromDb } from "@/components/servicios-page-content"
import { getServicesPublic } from "@/lib/data-read"

export const metadata = {
  title: "Servicios | CRONEC SRL - Obras Civiles, Electricas e Industriales",
  description: "Servicios integrales de construcción civil, obras eléctricas, arquitectura e ingeniería, instalaciones industriales y más. Salta, Argentina.",
}

export default async function ServiciosPage() {
  let servicesFromDb: ServiceFromDb[] = []
  try {
    servicesFromDb = (await getServicesPublic()) as unknown as ServiceFromDb[]
  } catch {
    // fallback: el componente usa datos por defecto
  }
  return <ServiciosPageContent servicesFromDb={servicesFromDb} />
}
