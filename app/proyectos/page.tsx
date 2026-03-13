import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProyectosClient } from "./proyectos-client"
import { getProjectsPublic } from "@/app/actions/db/projects"
import { staticProjects } from "@/lib/static-data"

export const metadata = {
  title: "Proyectos | CRONEC SRL - Portfolio de Obras Realizadas",
  description:
    "Explore nuestro portfolio de proyectos de construcción civil, instalaciones eléctricas e infraestructura industrial en Salta y el NOA.",
}

export default async function ProyectosPage() {
  let projects: Awaited<ReturnType<typeof getProjectsPublic>> = []
  try {
    projects = await getProjectsPublic()
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
        <ProyectosClient initialProjects={projects} />
      </main>
      <Footer />
    </>
  )
}
