import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection, type ServiceFromDb } from "@/components/services-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { WhyCronecSection } from "@/components/why-cronec-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ClientsSection } from "@/components/clients-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { getServicesPublic, getProjectsPublic, getCompanyInfo, getTestimonialsPublic, getCertificationsPublic, getClientsPublic, getSectionsPublic } from "@/lib/data-read"

/** Sin caché: los cambios del dashboard se ven al recargar la página */
export const dynamic = "force-dynamic"

export default async function HomePage() {
  let servicesFromDb: ServiceFromDb[] = []
  let projectsFromDb: Awaited<ReturnType<typeof getProjectsPublic>> = []
  let heroSlidesFromSettings: { title: string; paragraph: string }[] | undefined
  let testimonialsFromDb: Awaited<ReturnType<typeof getTestimonialsPublic>> = []
  let certificationsFromDb: Awaited<ReturnType<typeof getCertificationsPublic>> = []
  let clientsFromDb: Awaited<ReturnType<typeof getClientsPublic>> = []
  let sectionsData: Awaited<ReturnType<typeof getSectionsPublic>> = {}
  try {
    const [services, projects, settings, testimonials, certs, clis, sections] = await Promise.all([
      getServicesPublic(),
      getProjectsPublic(),
      getCompanyInfo(),
      getTestimonialsPublic(),
      getCertificationsPublic(),
      getClientsPublic(),
      getSectionsPublic(),
    ])
    servicesFromDb = services
    projectsFromDb = projects
    testimonialsFromDb = testimonials
    certificationsFromDb = certs
    clientsFromDb = clis
    sectionsData = sections ?? {}
    if (settings?.heroSlides && Array.isArray(settings.heroSlides) && settings.heroSlides.length >= 3) {
      heroSlidesFromSettings = settings.heroSlides as { title: string; paragraph: string }[]
    }
  } catch {
    // Error leyendo data/*.json: se usan listas estáticas en las secciones
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection heroSlidesFromSettings={heroSlidesFromSettings} />
        <ServicesSection servicesFromDb={servicesFromDb} />
        <PortfolioSection projectsFromDb={projectsFromDb} />
        <WhyCronecSection data={sectionsData.whyCronec} />
        <ProcessSection data={sectionsData.process} />
        <TestimonialsSection testimonialsFromDb={testimonialsFromDb} />
        <ClientsSection certificationsFromDb={certificationsFromDb} clientsFromDb={clientsFromDb} />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
