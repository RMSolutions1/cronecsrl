import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProyectosClient } from "./proyectos-client"
import { staticProjects } from "@/lib/static-data"
import { images } from "@/lib/images"

const heroFallbacks = [
  { src: images.heroProyectos[0], alt: "Edificio comercial moderno CRONEC" },
  { src: images.heroProyectos[1], alt: "Complejo industrial CRONEC" },
  { src: images.heroProyectos[2], alt: "Centro de salud CRONEC" },
]

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
        <ProyectosClient initialProjects={staticProjects} heroSlides={heroFallbacks} />
      </main>
      <Footer />
    </>
  )
}
