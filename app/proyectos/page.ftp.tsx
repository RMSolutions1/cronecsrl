import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProyectosClient } from "./proyectos-client"
import { staticProjects } from "@/lib/static-data"

export const metadata = {
  title: "Proyectos | CRONEC SRL - Portfolio de Obras Realizadas",
  description:
    "Explore nuestro portfolio de proyectos de construcción civil, instalaciones eléctricas e infraestructura industrial en Salta y el NOA.",
}

export default function ProyectosPageFtp() {
  return (
    <>
      <Header />
      <main>
        <ProyectosClient initialProjects={staticProjects} />
      </main>
      <Footer />
    </>
  )
}
