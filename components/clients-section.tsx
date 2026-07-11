import Image from "next/image"

export type CertificationFromDb = { id: string; name: string; logo_url?: string | null; order_index?: number }
export type ClientFromDb = { id: string; name: string; logo_url?: string | null; order_index?: number }

export function ClientsSection({
  certificationsFromDb = [],
  clientsFromDb = [],
}: {
  certificationsFromDb?: CertificationFromDb[]
  clientsFromDb?: ClientFromDb[]
}) {
  const certifications = certificationsFromDb.map((c) => ({
    id: c.id,
    name: c.name,
    logo: c.logo_url || "/placeholder.svg",
  }))
  const clients = clientsFromDb.map((c) => ({
    id: c.id,
    name: c.name,
    logo: c.logo_url || "/placeholder.svg",
  }))

  if (certifications.length === 0 && clients.length === 0) {
    return null
  }

  return (
    <section className="py-24 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {certifications.length > 0 && (
          <div className={clients.length > 0 ? "mb-20" : ""}>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Certificaciones y Cumplimiento</h2>
              <p className="text-muted-foreground">
                Comprometidos con los más altos estándares de calidad, seguridad y medio ambiente
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                >
                  <Image
                    src={cert.logo || "/placeholder.svg"}
                    alt={cert.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {clients.length > 0 && (
          <div>
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl md:text-3xl font-bold">Clientes que Confían en Nosotros</h2>
              <p className="text-muted-foreground">Colaboramos con las principales organizaciones de la región</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="grayscale hover:grayscale-0 transition-all duration-300 opacity-50 hover:opacity-100"
                >
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    width={200}
                    height={64}
                    className="h-12 md:h-16 w-auto max-w-[12rem] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
