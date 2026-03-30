import { images } from "@/lib/images"

export type CertificationFromDb = { id: string; name: string; logo_url?: string | null; order_index?: number }
export type ClientFromDb = { id: string; name: string; logo_url?: string | null; order_index?: number }
export type ClientsSectionData = {
  certificationsTitle?: string
  certificationsSubtitle?: string
  clientsTitle?: string
  clientsSubtitle?: string
}

const defaultCertifications = [
  { name: "ISO 9001", logo: images.certifications[0] },
  { name: "ISO 14001", logo: images.certifications[1] },
  { name: "ISO 45001", logo: images.certifications[2] },
]
const defaultClients = [
  { name: "Gobierno de Salta", logo: images.clients[0] },
  { name: "YPF", logo: images.clients[1] },
  { name: "Techint", logo: images.clients[2] },
  { name: "Pan American Energy", logo: images.clients[3] },
  { name: "Minera Lindero", logo: images.clients[4] },
  { name: "Arcor", logo: images.clients[5] },
]

export function ClientsSection({
  certificationsFromDb = [],
  clientsFromDb = [],
  data,
}: {
  certificationsFromDb?: CertificationFromDb[]
  clientsFromDb?: ClientFromDb[]
  data?: ClientsSectionData | null
}) {
  const certificationsTitle = data?.certificationsTitle ?? "Certificaciones y Cumplimiento"
  const certificationsSubtitle = data?.certificationsSubtitle ?? "Comprometidos con los más altos estándares de calidad, seguridad y medio ambiente"
  const clientsTitle = data?.clientsTitle ?? "Clientes que Confían en Nosotros"
  const clientsSubtitle = data?.clientsSubtitle ?? "Colaboramos con las principales organizaciones de la región"
  const certifications =
    certificationsFromDb.length > 0
      ? certificationsFromDb.map((c) => ({ name: c.name, logo: c.logo_url || "/placeholder.svg" }))
      : defaultCertifications
  const clients =
    clientsFromDb.length > 0
      ? clientsFromDb.map((c) => ({ name: c.name, logo: c.logo_url || "/placeholder.svg" }))
      : defaultClients

  return (
    <section className="py-24 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Certificaciones */}
        <div className="mb-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">{certificationsTitle}</h2>
            <p className="text-muted-foreground">
              {certificationsSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                <img src={cert.logo || "/placeholder.svg"} alt={cert.name} className="h-24 w-24 object-contain" />
              </div>
            ))}
          </div>
        </div>

        {/* Clientes */}
        <div>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">{clientsTitle}</h2>
            <p className="text-muted-foreground">{clientsSubtitle}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {clients.map((client, index) => (
              <div
                key={index}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100"
              >
                <img
                  src={client.logo || "/placeholder.svg"}
                  alt={client.name}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
