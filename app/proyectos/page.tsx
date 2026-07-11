import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProyectosClient } from "./proyectos-client"
import { getProjectsPublic, getHeroImagesPublic } from "@/lib/data-read"
import { resolveHeroSlides } from "@/lib/hero-images"
import { images } from "@/lib/images"
import { staticProjects } from "@/lib/static-data"

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

export const dynamic = "force-dynamic"

export default async function ProyectosPage() {
  let projects: Awaited<ReturnType<typeof getProjectsPublic>> = []
  let heroSlides = resolveHeroSlides([], heroFallbacks)
  try {
    const [fromDb, heroes] = await Promise.all([getProjectsPublic(), getHeroImagesPublic("proyectos")])
    projects = fromDb
    heroSlides = resolveHeroSlides(heroes, heroFallbacks)
  } catch {
    // Sin BD (ej. build estático/FTP): usar datos estáticos
  }
  if (projects.length === 0) {
    projects = staticProjects as Awaited<ReturnType<typeof getProjectsPublic>>
  }

  return (
    <>
      <Header />
      <main>
        <ProyectosClient initialProjects={projects} heroSlides={heroSlides} />
      </main>
      <Footer />
    </>
  )
}
